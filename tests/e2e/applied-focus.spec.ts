import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {focusDecisions as historicalFocusDecisions} from '../fixtures/applied-focus-decisions';
import exclusions from '../../content/gh300/2026-08-07/questions/selection-exclusions.json';
const focusDecisions=historicalFocusDecisions.filter(([id])=>!exclusions.questions.some(q=>q.id===id));
const bank=JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/seed.json','utf8'));

test('surviving historical Copilot focus actions score and persist in practice',async({page},testInfo)=>{
 expect(focusDecisions.length).toBeGreaterThan(0);
 test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await page.evaluate(async(ids:string[])=>{
  await new Promise<void>((resolve,reject)=>{
   const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{const db=req.result,tx=db.transaction('bookmarks','readwrite');
    for(const id of ids)tx.objectStore('bookmarks').put({id});
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};
  });
 },focusDecisions.map(([id])=>id));
 await page.reload();
 await page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:/Practice/}).click();
 await page.getByRole('button',{name:'50問',exact:true}).click();
 await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
 await page.getByRole('button',{name:'演習を開始する'}).click();
 const seen=new Set<string>();
 for(let i=0;i<focusDecisions.length;i++){
  const stem=await page.locator('.question h2').innerText();
  const q=bank.find((q:{question:string})=>q.question===stem);
  expect(q).toBeDefined();expect(seen.has(q.id)).toBe(false);seen.add(q.id);
  const action=focusDecisions.find(([id])=>id===q.id)![1];
  const options=q.choices.map((c:{text:string},index:number)=>({text:c.text,index})).filter((c:{text:string})=>action.test(c.text));
  expect(options).toHaveLength(1);
  await expect(page.locator('.question-meta').getByText('応用',{exact:true})).toBeVisible();
  if(q.id==='q-d3-a19'){
   await page.screenshot({path:`artifacts/applied-focus-${testInfo.project.name}-${q.id}.png`,fullPage:true});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  }
  await page.locator('.question fieldset input').nth(options[0].index).check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
  await expect(page.locator('.explanation-body')).toContainText(q.explanation);
  await page.getByRole('button',{name:i<focusDecisions.length-1?'次の問題へ':'演習を終了する'}).click();
 }
 await expect(page.getByRole('heading',{name:'今回の学習結果'})).toBeVisible();
 await expect(page.locator('.result-score')).toContainText(`${focusDecisions.length} / ${focusDecisions.length}`);
 const attempts=await page.evaluate(()=>new Promise<Array<{questionId:string,correct:boolean}>>((resolve,reject)=>{
  const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{const db=req.result,tx=db.transaction('attempts','readonly'),get=tx.objectStore('attempts').getAll();get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};
 }));
 expect(attempts).toHaveLength(focusDecisions.length);
 expect(attempts.every(a=>seen.has(a.questionId)&&a.correct)).toBe(true);
 expect(errors).toEqual([]);
});
