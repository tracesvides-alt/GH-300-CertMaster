import {test,expect,type Page} from '@playwright/test';
import report from '../../reports/cli-admin-foundation-revision-2026-10-18.json';
import original from '../../content/gh300/2026-08-07/questions/seed.json';
const navigate=(page:Page,name:string)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:new RegExp(name)}).click();
async function put(page:Page,table:string,rows:unknown[]){
 await page.evaluate(({table,rows})=>new Promise<void>((resolve,reject)=>{
  const r=indexedDB.open('gh300-certmaster');r.onerror=()=>reject(r.error);r.onsuccess=()=>{
   const db=r.result,tx=db.transaction(table,'readwrite');for(const row of rows)tx.objectStore(table).put(row);
   tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
  };
 }),{table,rows});
}
async function read(page:Page,table:string){
 return page.evaluate(table=>new Promise<any[]>((resolve,reject)=>{
  const r=indexedDB.open('gh300-certmaster');r.onerror=()=>reject(r.error);r.onsuccess=()=>{
   const db=r.result,tx=db.transaction(table),req=tx.objectStore(table).getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();
  };
 }),table);
}
async function ready(page:Page){await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();}
async function startBookmarks(page:Page,ids:string[]){
 await ready(page);await put(page,'bookmarks',ids.map(id=>({id})));await page.reload();await navigate(page,'Practice');
 await page.getByRole('button',{name:'10問',exact:true}).click();await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');await page.getByRole('button',{name:'演習を開始する'}).click();
}
async function reveal(page:Page,id:string){
 const row=report.questions.find(r=>r.id===id)!;
 await page.locator('.question fieldset input').nth(row.after.choices.findIndex(c=>c.id===row.after.answer[0])).check();
 await page.getByRole('button',{name:'回答を確認する'}).click();
 await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
 await expect(page.locator('.answer-reason')).toHaveText(row.displayedExplanation.split('\n\n'));
}

test('all six Foundation questions render, score, explain and retain their edition after reload',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await startBookmarks(page,report.questions.map(r=>r.id));const seen=new Set<string>();
 for(let i=0;i<6;i++){
  await expect(page.locator('.question h2')).toBeVisible();const stem=await page.locator('.question h2').innerText();
  const row=report.questions.find(r=>r.after.question===stem)!;expect(row).toBeDefined();expect(seen.has(row.id)).toBe(false);seen.add(row.id);
  await expect(page.locator('.question fieldset input[type="radio"]')).toHaveCount(4);
  await reveal(page,row.id);
  for(const c of row.after.choices)await expect(page.locator('.choice-explanations')).toContainText(row.after.choiceExplanations[c.id as keyof typeof row.after.choiceExplanations]);
  await expect(page.getByText(/Key Clues|問題文中の判断材料/)).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  if(['q-d2-g08','q-d6-f05'].includes(row.id)){
   await page.addStyleTag({content:'html,*{scroll-behavior:auto!important}'});
   await page.locator('.question').screenshot({path:`artifacts/foundation-${row.id}-${info.project.name}.png`,animations:'disabled'});
  }
  await page.getByRole('button',{name:i===5?'演習を終了する':'次の問題へ'}).click();
 }
 await expect(page.locator('.result-score')).toContainText('6 / 6');await page.reload();
 const attempts=await read(page,'attempts');expect(attempts).toHaveLength(6);expect(attempts.every(a=>a.correct&&a.questionRevision===report.revision)).toBe(true);
 await navigate(page,'Review');await page.getByRole('button',{name:/回答履歴/}).click();
 await expect(page.locator('.review-list .review-row')).toHaveCount(6);
 const row=page.locator('.review-list .review-row').filter({hasText:report.questions[1].after.question});
 await row.getByRole('button',{name:'回答と解説を見る',exact:true}).click();
 await expect(page.locator('.question h2')).toHaveText(report.questions[1].after.question);
 expect(errors).toEqual([]);
});

test('legacy same-key history retains the old edition and retry starts the new edition',async({page})=>{
 const row=report.questions.find(r=>r.id==='q-d2-g08')!,old=original.find(q=>q.id===row.id)!;
 await ready(page);
 const historical={id:'same-key-old-response',questionId:old.id,domainId:old.domainId,objectiveId:old.objectiveId,status:old.status,answer:['A'],correctChoiceIds:old.answer,questionType:'single_select',correct:false,at:1};
 await put(page,'attempts',[historical]);await page.reload();await navigate(page,'Review');
 await page.getByRole('button',{name:/回答履歴/}).click();
 await expect(page.locator('.review-list .review-row')).toContainText(old.question);
 await page.getByRole('button',{name:'回答と解説を見る',exact:true}).click();
 await expect(page.locator('.question h2')).toHaveText(old.question);await expect(page.locator('.answer-reason')).toHaveText(row.previousDisplayedExplanation.split('\n\n'));
 await navigate(page,'Review');await page.getByRole('button',{name:/間違いノート/}).click();await page.getByRole('tab',{name:/By Question/}).click();
 await expect(page.locator('.review-row').filter({hasText:old.question})).toBeVisible();
 await page.getByRole('button',{name:'もう一度解く',exact:true}).click();await expect(page.locator('.question h2')).toHaveText(row.after.question);
 await reveal(page,row.id);const attempts=await read(page,'attempts');expect(attempts).toHaveLength(2);
 expect(attempts.find(a=>a.id===historical.id)).toEqual(historical);
 expect(attempts.find(a=>a.id!==historical.id).questionRevision).toBe(report.revision);
});

test('old unfinished mocks exclude changed editions and completed snapshots remain intact',async({page})=>{
 const old=original.find(q=>q.id==='q-d2-g09')!,other=original.find(q=>q.id==='q02')!;
 await ready(page);const base={answers:{[old.id]:old.answer},deadline:Date.now()+900000,requestedCount:2,index:0};
 await put(page,'sessions',[{...base,id:'foundation-mixed',questions:[old,other],completed:false},{...base,id:'foundation-done',questions:[old],completed:true}]);
 await page.reload();await navigate(page,'Mock');await page.getByRole('button',{name:/中断した模試を再開/}).click();
 await expect(page.locator('.question h2')).toHaveText(other.question);await page.getByRole('button',{name:'模試を終了する',exact:true}).click();
 await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
 const sessions=await read(page,'sessions');expect(sessions.find(s=>s.id==='foundation-mixed').questions.map((q:{id:string})=>q.id)).toEqual([other.id]);
 expect(sessions.find(s=>s.id==='foundation-done').questions[0]).toEqual(old);
});

test('updated supplements are searchable and a lesson starts the current comprehension exercise',async({page})=>{
 await ready(page);await navigate(page,'Study');await page.getByPlaceholder('教材・用語・比較ガイドを検索…').fill('copilot --add-dir=../shared');
 await page.locator('.search-result-item').filter({has:page.getByText('現行GitHub Copilot CLIの利用と安全確認',{exact:true})}).click();
 const article=page.locator('article.lesson');await expect(article).toContainText('write(docs/guide.md)');await expect(article).toContainText('.github/skills');
 await article.getByRole('button',{name:/理解度チェック 3問/}).click();await expect(page.locator('.question h2')).toBeVisible();
 const text=await page.locator('.question h2').innerText();
 expect(report.questions.every(r=>r.before.question!==text)).toBe(true);
});

for(const id of ['q-d2-g08','q-d6-f05'])test(`revised ${id} links to its own lesson and glossary`,async({page})=>{
 await startBookmarks(page,[id]);await reveal(page,id);
 const title=id==='q-d2-g08'?'現行GitHub Copilot CLIの利用と安全確認':'組織・エンタープライズポリシーとシート・監査ログ管理';
 const term=id==='q-d2-g08'?'CLI Execution Confirmation & Safeguards':'Copilot Metrics API / REST API';
 const related=page.locator('.related-study-chips');
 await expect(related.getByRole('button',{name:title,exact:true})).toBeVisible();
 await expect(related.getByRole('button',{name:term,exact:true})).toBeVisible();
 await expect(related).not.toContainText('Ghost Text');
 await page.getByRole('button',{name:'教材を読む',exact:true}).click();
 await expect(page.locator('article.lesson h2')).toHaveText(title);
});
