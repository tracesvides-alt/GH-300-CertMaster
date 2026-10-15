import {test,expect} from '@playwright/test';
import ledger from '../../reports/copilot-feature-quality-repairs-2026-10-16.json';

for(const [batch,start,end] of [[1,0,46],[2,46,91]]){
 test(`quality repair batch ${batch}: every reviewed question scores and persists`,async({page},info)=>{
  test.setTimeout(180000);
  const questions=ledger.questions.slice(start,end).map(r=>r.after);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(async(ids)=>{
   await new Promise<void>((resolve,reject)=>{
    const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{const db=req.result,tx=db.transaction('bookmarks','readwrite');
     for(const id of ids)tx.objectStore('bookmarks').put({id});
     tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};
   });
  },questions.map(q=>q.id));
  await page.reload();
  const nav=page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true});
  await nav.getByRole('button',{name:/Practice/}).click();
  await page.getByRole('button',{name:'50問',exact:true}).click();
  await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
  await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
  await page.getByRole('button',{name:'演習を開始する'}).click();
  const seen=new Set<string>();
  for(let i=0;i<questions.length;i++){
   await expect(page.locator('.question h2')).toBeVisible();
   const stem=await page.locator('.question h2').innerText();
   const q=questions.find(q=>q.question===stem)!;
   expect(q).toBeDefined();expect(seen.has(q.id)).toBe(false);seen.add(q.id);
   for(const input of await page.locator('.question fieldset input').all())expect((await input.boundingBox())!.width).toBeGreaterThanOrEqual(16);
   // Mobile innerWidth can itself grow with overflow. Compare to the actual
   // viewport so long URLs cannot silently widen cards and break hit testing.
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
   if(i===0)await page.screenshot({path:`artifacts/feature-refresh-${info.project.name}-${batch}.png`,fullPage:true});
   const ids=i===0?[q.choices.find(c=>!q.answer.includes(c.id))!.id]:q.answer;
   for(const id of ids)await page.locator('.question fieldset input').nth(q.choices.findIndex(c=>c.id===id)).check();
   await page.getByRole('button',{name:'回答を確認する'}).click();
   await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
   await expect(page.locator('.explanation-body')).toContainText(q.explanation);
   if(i>0)await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
   await page.getByRole('button',{name:i<questions.length-1?'次の問題へ':'演習を終了する'}).click();
  }
  await expect(page.getByRole('heading',{name:'今回の学習結果'})).toBeVisible();
  await expect(page.locator('.result-score')).toContainText(`${questions.length-1} / ${questions.length}`);
  await page.reload();
  const stored=await page.evaluate(()=>new Promise<Array<{questionId:string,correct:boolean}>>((resolve,reject)=>{
   const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{const db=req.result,tx=db.transaction('attempts','readonly'),get=tx.objectStore('attempts').getAll();
    get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};
  }));
  expect(stored).toHaveLength(questions.length);
  expect(stored.every(a=>seen.has(a.questionId))).toBe(true);
  expect(stored.filter(a=>a.correct)).toHaveLength(questions.length-1);
  expect(errors).toEqual([]);
 });
}
