import {answerExplanation} from '../../lib/answer-explanation';
import {test,expect} from '@playwright/test';
import ledger from '../../content/gh300/2026-08-07/questions/foundation-priority-review.json';

test('original Foundation replacements start, score and persist while old bookmarks stay retired',async({page},info)=>{
 test.setTimeout(90000);
 const questions=ledger.questions.map(r=>r.after),ids=questions.map(q=>q.id);
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
 },[...ids,...ledger.questions.map(r=>r.oldId)]);
 await page.reload();
 const nav=page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true});
 await nav.getByRole('button',{name:/Practice/}).click();
 await page.getByRole('button',{name:'10問',exact:true}).click();
 await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
 await page.getByRole('button',{name:'演習を開始する'}).click();
 const seen=new Set<string>();
 for(let i=0;i<questions.length;i++){
  await expect(page.locator('.question h2')).toBeVisible();
  const stem=await page.locator('.question h2').innerText(),q=questions.find(q=>q.question===stem)!;
  expect(q).toBeDefined();expect(seen.has(q.id)).toBe(false);seen.add(q.id);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  if(i===0)await page.screenshot({path:`artifacts/foundation-priority-${info.project.name}.png`,fullPage:true});
  const answer=i===0?q.choices.find(c=>!q.answer.includes(c.id))!.id:q.answer[0];
  await page.locator('.question fieldset input').nth(q.choices.findIndex(c=>c.id===answer)).check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
  for(const paragraph of answerExplanation(q).split('\n\n')) await expect(page.locator('.explanation-body')).toContainText(paragraph);
  if(i>0)await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
  await page.getByRole('button',{name:i<questions.length-1?'次の問題へ':'演習を終了する'}).click();
 }
 await expect(page.getByRole('heading',{name:'今回の学習結果'})).toBeVisible();
 await expect(page.locator('.result-score')).toContainText('9 / 10');
 expect([...seen].sort()).toEqual([...ids].sort());
 await page.reload();
 const attempts=await page.evaluate(()=>new Promise<Array<{questionId:string,correct:boolean}>>((resolve,reject)=>{
  const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{const db=req.result,tx=db.transaction('attempts','readonly'),get=tx.objectStore('attempts').getAll();
   get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};
 }));
 expect(attempts).toHaveLength(10);expect(attempts.filter(a=>a.correct)).toHaveLength(9);
 expect(attempts.every(a=>ids.includes(a.questionId))).toBe(true);
 expect(errors).toEqual([]);
});
