import {test,expect,type Page} from '@playwright/test';
import seed from '../../content/gh300/2026-08-07/questions/seed.json';
import exclusions from '../../content/gh300/2026-08-07/questions/selection-exclusions.json';
const fixed=seed.find(q=>q.status==='verified'&&!exclusions.questions.some(r=>r.id===q.id))!;
const legacy={...fixed,id:'legacy-ai-removal',question:'旧生成問題の履歴：'+fixed.question,status:'ai-generated',lastVerifiedAt:null};
const navigate=(page:Page,name:string)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:new RegExp(name)}).click();
async function populate(page:Page){
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await page.evaluate(({fixed,legacy})=>new Promise<void>((resolve,reject)=>{
  const r=indexedDB.open('gh300-certmaster');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['generated','attempts','bookmarks','settings','sessions'],'readwrite');
   tx.objectStore('generated').put(legacy);
   tx.objectStore('attempts').put({id:'legacy-attempt',questionId:legacy.id,objectiveId:legacy.objectiveId,domainId:legacy.domainId,answer:legacy.answer,correct:true,status:'ai-generated',at:Date.now()-10000});
   for(const q of [fixed,legacy])tx.objectStore('bookmarks').put({id:q.id});
   tx.objectStore('settings').put({id:'practice',value:{count:5,scope:'bookmarked',includeAI:true,verifiedOnly:false}});
   tx.objectStore('sessions').put({id:'mixed-legacy',questions:[legacy,fixed],answers:{[legacy.id]:legacy.answer},index:1,completed:false,deadline:Date.now()+600000});
   tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error);
  };
 }),{fixed,legacy});
 await page.reload();
}
test('AI controls and endpoint are gone; fixed practice and historical answers work without keys',async({page,request})=>{
 const aiRequests:string[]=[];page.on('request',r=>{if(r.url().includes('/api/tutor'))aiRequests.push(r.url())});
 await populate(page);await navigate(page,'Practice');
 await expect(page.getByRole('button',{name:/AIで|AIに/})).toHaveCount(0);
 await expect(page.getByRole('checkbox',{name:'AI問題を含める'})).toHaveCount(0);
 await expect(page.getByRole('checkbox',{name:'Verifiedのみ'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'5問',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'演習を開始する',exact:true}).click();await expect(page.locator('.question h2')).toHaveText(fixed.question);
 await expect(page.locator('.question .tag').first()).toContainText('1 / 1');
 for(const id of fixed.answer)await page.locator('.question fieldset input').nth(fixed.choices.findIndex(c=>c.id===id)).check();
 await page.getByRole('button',{name:'回答を確認する'}).click();await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'AIに質問'})).toHaveCount(0);
 await page.getByRole('button',{name:'演習を終了する'}).click();await expect(page.locator('.result-score')).toContainText('1 / 1');
 await navigate(page,'Review');await page.getByRole('button',{name:/回答履歴/}).click();
 await expect(page.getByRole('button',{name:/AIで/})).toHaveCount(0);
 const oldRow=page.locator('.review-row').filter({hasText:legacy.question});await oldRow.getByRole('button',{name:'回答と解説を見る'}).click();
 await expect(page.locator('.question h2')).toHaveText(legacy.question);await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
 expect(aiRequests).toEqual([]);
 expect((await request.post('/api/tutor',{data:{action:'generate',objectiveId:fixed.objectiveId}})).status()).toBe(404);
});
test('an old mixed mock resumes with fixed questions only',async({page})=>{
 await populate(page);await navigate(page,'Mock');await page.getByRole('button',{name:/中断した模試を再開/}).click();
 await expect(page.locator('.question h2')).toHaveText(fixed.question);await expect(page.locator('.question .tag').first()).toContainText('1 / 1');
 for(const id of fixed.answer)await page.locator('.question fieldset input').nth(fixed.choices.findIndex(c=>c.id===id)).check();
 await page.getByRole('button',{name:'模試を終了する',exact:true}).click();await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
 await expect(page.getByRole('button',{name:/AIに|AIで/})).toHaveCount(0);
});
