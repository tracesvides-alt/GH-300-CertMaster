import {test,expect,type Page} from '@playwright/test';
import report from '../../reports/admin-content-correction-2026-10-18.json';
const navigate=(page:Page,name:string)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:new RegExp(name)}).click();

test('corrected lessons, glossary and comparisons load through search with sources and no overflow',async({page},info)=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const row of report.changes.filter(c=>c.kind!=='sources')){
  await page.goto('/');await navigate(page,'Study');
  const item=row.after as {id:string;title?:string;term?:string;sourceIds:string[]};
  const title=item.title??item.term!;
  await page.getByPlaceholder('教材・用語・比較ガイドを検索…').fill(title);
  await page.locator('.search-result-item').filter({has:page.getByText(title,{exact:true})}).click();
  const article=page.locator(row.kind==='lessons'?'article.lesson':row.kind==='glossary'?'article.glossary-detail':'article.comparison-detail');
  await expect(article.getByRole('heading',{level:2,name:title,exact:true})).toBeVisible();
  await expect(article).not.toContainText('/copilot/usage');
  for(const id of item.sourceIds){
   const source=report.changes.find(c=>c.kind==='sources'&&c.id===id)!.after as {url:string};
   await expect(article.locator(`a[href="${source.url}"]`).first()).toBeAttached();
  }
  if(row.id==='lesson-d2-org-governance'){
   await expect(article).toContainText('download_links');
   await expect(article).toContainText('個人向けFree');
   await article.locator('#lesson-sec-6').screenshot({path:`artifacts/admin-content-api-${info.project.name}.png`});
   await article.locator('.lesson-glossary-links').first().getByRole('button',{name:'Seat Assignment and Management',exact:true}).click();
   await expect(page.locator('.glossary-detail')).toContainText('個人Free');
   await page.locator('.glossary-detail').getByRole('button',{name:'組織・エンタープライズポリシーとシート・監査ログ管理',exact:true}).click();
   await expect(page.locator('article.lesson h2')).toHaveText(title);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 }
 expect(errors).toEqual([]);
});

test('the four clarified basic questions retain their keys, display current explanations and persist',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await page.evaluate(ids=>new Promise<void>((resolve,reject)=>{
  const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);request.onsuccess=()=>{
   const db=request.result,tx=db.transaction('bookmarks','readwrite');for(const id of ids)tx.objectStore('bookmarks').put({id});
   tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
  };
 }),report.questions.map(q=>q.id));
 await page.reload();await navigate(page,'Practice');
 await page.getByRole('button',{name:'10問',exact:true}).click();
 await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
 await page.getByRole('button',{name:'演習を開始する'}).click();
 const seen=new Set<string>();
 for(let i=0;i<4;i++){
  const stem=await page.locator('.question h2').innerText();const row=report.questions.find(q=>q.after.question===stem)!;
  expect(row).toBeDefined();expect(seen.has(row.id)).toBe(false);seen.add(row.id);
  await page.locator('.question fieldset input').nth(row.after.choices.findIndex(c=>c.id===row.after.answer[0])).check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
  await expect(page.locator('.answer-reason')).toHaveText(row.displayedExplanation.split('\n\n'));
  await page.getByRole('button',{name:i===3?'演習を終了する':'次の問題へ'}).click();
 }
 await expect(page.locator('.result-score')).toContainText('4 / 4');await page.reload();await navigate(page,'Review');
 await page.getByRole('button',{name:/回答履歴/}).click();
 await expect(page.locator('.review-list .review-row')).toHaveCount(4);
});
