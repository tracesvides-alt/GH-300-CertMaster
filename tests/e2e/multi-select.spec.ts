import {test,expect,type Page} from '@playwright/test';
import {applyQuestionRevision} from '../../lib/question-revision';
import ledger from '../../content/gh300/2026-08-07/questions/multi-select-review.json';
const navigate=async(page:Page,name:string)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:new RegExp(name)}).click();
async function put(page:Page,table:string,rows:unknown[]){
 await page.evaluate(({table,rows})=>new Promise<void>((resolve,reject)=>{
  const r=indexedDB.open('gh300-certmaster');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(table,'readwrite');for(const row of rows)tx.objectStore(table).put(row);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)};
 }),{table,rows});
}
async function read(page:Page,table:string){return page.evaluate(table=>new Promise<any[]>((resolve,reject)=>{const r=indexedDB.open('gh300-certmaster');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(table),g=tx.objectStore(table).getAll();g.onsuccess=()=>resolve(g.result);g.onerror=()=>reject(g.error);tx.oncomplete=()=>db.close()}}),table)}
for(const batch of [0,1])test(`multi-select batch ${batch+1}: all choices, scoring, notebook and reload`,async({page},info)=>{
 test.setTimeout(180000);
 const qs=ledger.questions.slice(batch*27,(batch+1)*27).map(r=>applyQuestionRevision(r.after)),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await put(page,'bookmarks',qs.map(q=>({id:q.id})));await page.reload();await navigate(page,'Practice');
 await page.getByRole('button',{name:'30問',exact:true}).click();await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');await page.getByRole('button',{name:'演習を開始する'}).click();
 const seen=new Set<string>();
 for(let i=0;i<qs.length;i++){
  await expect(page.locator('.question h2')).toBeVisible();const stem=await page.locator('.question h2').innerText(),q=qs.find(q=>q.question===stem)!;expect(q).toBeDefined();expect(seen.has(q.id)).toBe(false);seen.add(q.id);
  const inputs=page.locator('.question fieldset input[type=checkbox]'),submit=page.getByRole('button',{name:'回答を確認する'});
  await expect(inputs).toHaveCount(4);await expect(submit).toBeDisabled();await expect(page.locator('#selection-counter')).toContainText('0 / 2');
  const index=(id:string)=>q.choices.findIndex(c=>c.id===id),wrong=q.choices.find(c=>!q.answer.includes(c.id))!.id;
  await inputs.nth(index(q.answer[0])).check();await expect(submit).toBeDisabled();await expect(page.locator('#selection-counter')).toContainText('1 / 2');
  await inputs.nth(index(q.answer[1])).check();await expect(inputs.nth(index(wrong))).toBeDisabled();await expect(submit).toBeEnabled();
  // Release the limit, then choose one correct + one wrong for the first item.
  await inputs.nth(index(q.answer[1])).uncheck();await expect(inputs.nth(index(wrong))).toBeEnabled();
  await inputs.nth(index(i===0?wrong:q.answer[1])).check();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  if(i===0){await page.locator('#selection-counter').scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/multi-select-${info.project.name}-${batch}.png`,fullPage:false});}
  await submit.click();await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
  for(const c of q.choices)await expect(page.locator('.question')).toContainText(q.choiceExplanations[c.id as keyof typeof q.choiceExplanations]);
  if(i>0)await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
  await page.getByRole('button',{name:i===qs.length-1?'演習を終了する':'次の問題へ'}).click();
 }
 await expect(page.locator('.result-score')).toContainText('26 / 27');await expect(page.getByRole('region',{name:'出題形式別の成績'})).toContainText('複数選択');
 await page.reload();const a=await read(page,'attempts');expect(a).toHaveLength(27);expect(a.filter(v=>v.correct)).toHaveLength(26);
 const wrong=a.find(v=>!v.correct);expect(wrong.partialMatch).toBe(.5);expect(wrong.missingCorrectChoiceIds).toHaveLength(1);expect(wrong.selectedWrongChoiceIds).toHaveLength(1);
 const notebook=await read(page,'wrongAnswers');expect(notebook).toHaveLength(1);expect(notebook[0].partialMatch).toBe(.5);
 const reviews=await read(page,'questionReviews');expect(reviews.find(v=>v.questionId===wrong.questionId)).toMatchObject({totalIncorrect:1,intervalDays:1});
 await navigate(page,'Review');await expect(page.getByRole('region',{name:'出題形式別の成績'})).toBeVisible();
 expect(errors).toEqual([]);
});
test('mock preserves two selections across reload and scores unanswered as incorrect',async({page})=>{
 const qs=ledger.questions.filter(r=>r.after.difficulty==='advanced').slice(0,2).map(r=>applyQuestionRevision(r.after));
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await put(page,'sessions',[{id:'multi-mock',questions:qs,answers:{},index:0,deadline:Date.now()+600000,completed:false}]);await page.reload();await navigate(page,'Mock');
 // Existing incomplete session resumes through the normal control.
 const resume=page.getByRole('button',{name:/再開/});if(await resume.count())await resume.first().click();
 await expect(page.locator('.question h2')).toHaveText(qs[0].question);
 const inputs=page.locator('.question fieldset input'),next=page.getByRole('button',{name:/回答を保存して次へ/});
 await inputs.nth(qs[0].choices.findIndex(c=>c.id===qs[0].answer[0])).check();await expect(next).toBeDisabled();
 await inputs.nth(qs[0].choices.findIndex(c=>c.id===qs[0].answer[1])).check();await next.click();await page.reload();await navigate(page,'Mock');
 if(await resume.count())await resume.first().click();await expect(page.locator('.question h2')).toHaveText(qs[1].question);
 await page.getByRole('button',{name:'前の問題',exact:true}).click();for(const id of qs[0].answer)await expect(page.locator('.question fieldset input').nth(qs[0].choices.findIndex(c=>c.id===id))).toBeChecked();
 await page.getByRole('button',{name:/回答を保存して次へ/}).click();await page.getByRole('button',{name:'模試を終了する',exact:true}).click();
 await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
 const attempts=await read(page,'attempts');expect(attempts).toHaveLength(2);expect(attempts.filter(a=>a.correct)).toHaveLength(1);expect(attempts.every(a=>a.questionType==='multi_select')).toBe(true);
});
test('mock timeout saves a partial selection as incorrect without granting partial points',async({page})=>{
 const q=applyQuestionRevision(ledger.questions.find(r=>r.after.difficulty==='advanced')!.after);
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await put(page,'sessions',[{id:'expired-multi',questions:[q],answers:{[q.id]:[q.answer[0]]},index:0,deadline:Date.now()-1000,completed:false}]);await page.reload();await navigate(page,'Mock');
 await page.getByRole('button',{name:/中断した模試を再開/}).click();await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
 const attempts=await read(page,'attempts');expect(attempts).toHaveLength(1);expect(attempts[0]).toMatchObject({correct:false,partialMatch:.5,selectedChoiceIds:[q.answer[0]],missingCorrectChoiceIds:[q.answer[1]]});
});
