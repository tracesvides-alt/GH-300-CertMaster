import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const record=JSON.parse(fs.readFileSync('reports/applied-six-deletion-review.json','utf8'));
const removed=record.questions.map((q:{before:unknown})=>q.before);
const bank=JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/seed.json','utf8'));
const active=bank.find((q:{id:string})=>q.id==='q-d3-a19-feature-20261016');
const nav=(page:import('@playwright/test').Page)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true});

test('deleted snapshots in bookmarks and generated storage never enter new practice',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await page.evaluate(async({removed,active})=>{
  await new Promise<void>((resolve,reject)=>{const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{const db=req.result,tx=db.transaction(['bookmarks','generated'],'readwrite');
    for(const q of [...removed,active])tx.objectStore('bookmarks').put({id:q.id});
    for(const q of removed)tx.objectStore('generated').put(q);
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};});
 },{removed,active});
 await page.reload();await nav(page).getByRole('button',{name:/Practice/}).click();
 await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
 await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
 await page.getByRole('button',{name:'演習を開始する'}).click();
 await expect(page.locator('.question h2')).toHaveText(active.question);
 const option=active.choices.findIndex((c:{text:string})=>/^Developer: Chat Diagnosticsを実行し、Reachabilityの結果を確認する$/.test(c.text));
 await page.locator('.question fieldset input').nth(option).check();await page.getByRole('button',{name:'回答を確認する'}).click();
 await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'演習を終了する'}).click();await expect(page.locator('.result-score')).toContainText('1 / 1');
 expect(errors).toEqual([]);
});

test('unfinished mocks skip deleted questions and all-deleted mocks cannot resume',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
 await page.evaluate(async({removed,active})=>{
  await new Promise<void>((resolve,reject)=>{const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{const db=req.result,tx=db.transaction('sessions','readwrite');
    const base={answers:{[removed[0].id]:['A']},deadline:Date.now()+900000,completed:false,requestedCount:7};
    tx.objectStore('sessions').put({...base,id:'deleted-mixed',questions:[removed[0],active,...removed.slice(1)],index:1});
    tx.objectStore('sessions').put({...base,id:'deleted-only',questions:removed,index:0});
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};});
 },{removed,active});
 await page.reload();await nav(page).getByRole('button',{name:/Mock/}).click();
 await expect(page.getByRole('button',{name:/中断した模試を再開/})).toHaveCount(1);
 await page.getByRole('button',{name:/中断した模試を再開/}).click();
 await expect(page.locator('.question h2')).toHaveText(active.question);
 await page.locator('.question fieldset input').first().check();await page.getByRole('button',{name:'模試を終了する'}).click();
 await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
 const saved=await page.evaluate(()=>new Promise<{ids:string[],answers:string[]}>((resolve,reject)=>{
  const req=indexedDB.open('gh300-certmaster');req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{const db=req.result,tx=db.transaction('sessions','readonly'),get=tx.objectStore('sessions').get('deleted-mixed');
   get.onsuccess=()=>resolve({ids:get.result.questions.map((q:{id:string})=>q.id),answers:Object.keys(get.result.answers)});get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};}));
 expect(saved).toEqual({ids:[active.id],answers:[active.id]});expect(errors).toEqual([]);
});
