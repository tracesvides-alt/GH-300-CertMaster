import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const ledger=JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/additions-review.json','utf8'));

test('all remaining new Applied questions can be selected, answered and persisted',async({page})=>{
  test.setTimeout(60000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(async(ids:string[])=>{
    await new Promise<void>((resolve,reject)=>{
      const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
      request.onsuccess=()=>{const db=request.result,tx=db.transaction('bookmarks','readwrite');
        for(const id of ids)tx.objectStore('bookmarks').put({id});
        tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};};
    });
  },ledger.questions.map((q:{id:string})=>q.id));
  await page.reload();
  await page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:/Practice/}).click();
  await page.getByRole('button',{name:'20問',exact:true}).click();
  await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
  await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
  await page.getByRole('button',{name:'演習を開始する'}).click();
  const seen=new Set<string>();
  for(let i=0;i<ledger.questions.length;i++){
    const stem=await page.locator('.question h2').innerText();
    const row=ledger.questions.find((r:{after:{question:string}})=>r.after.question===stem);
    expect(row).toBeDefined();expect(seen.has(row.id)).toBe(false);seen.add(row.id);
    await expect(page.locator('.question-meta').getByText('応用',{exact:true})).toBeVisible();
    const choiceIndex=row.after.choices.findIndex((c:{id:string})=>row.after.answer.includes(c.id));
    await page.locator('.question fieldset input').nth(choiceIndex).check();
    await page.getByRole('button',{name:'回答を確認する'}).click();
    await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Official Source'})).toBeVisible();
    await page.getByRole('button',{name:i<ledger.questions.length-1?'次の問題へ':'演習を終了する'}).click();
  }
  expect(seen.size).toBe(ledger.questions.length);
  await expect(page.getByRole('heading',{name:'今回の学習結果'})).toBeVisible();
  await expect(page.locator('.result-score')).toContainText(`${ledger.questions.length} / ${ledger.questions.length}`);
  const attempts=await page.evaluate(()=>new Promise<Array<{questionId:string,correct:boolean}>>((resolve,reject)=>{
    const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction('attempts','readonly');
      const get=tx.objectStore('attempts').getAll();get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};
  }));
  expect(attempts).toHaveLength(ledger.questions.length);
  expect(attempts.every(a=>seen.has(a.questionId)&&a.correct)).toBe(true);
  expect(errors).toEqual([]);
});
