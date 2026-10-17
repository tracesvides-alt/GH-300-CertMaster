import { test, expect } from '@playwright/test';
import seed from '../../content/gh300/2026-08-07/questions/seed.json';
import details from '../../content/gh300/2026-08-07/questions/answer-explanations.json';
import { answerExplanation } from '../../lib/answer-explanation';

const ids = ['q02','q-d2-a17-ms-20261017','q-d3-a19-feature-20261016',
  'q-d3-a17-ms-20261017','q-d2-e02-feature-20261016','q-d2-e21-ms-20261017',
  'q-d1-a18-feature-20261016'];

test('detailed reasons render for all levels and formats while short analyses and scoring stay intact', async ({ page }, info) => {
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(ids=>new Promise<void>((resolve,reject)=>{
    const request=indexedDB.open('gh300-certmaster');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result,tx=db.transaction('bookmarks','readwrite');
      for(const id of ids)tx.objectStore('bookmarks').put({id});
      tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
    };
  }),ids);
  await page.reload();
  const navigation=page.getByRole('navigation',{name:info.project.name==='mobile'?'モバイルナビゲーション':'メインナビゲーション',exact:true});
  await navigation.getByRole('button',{name:/Practice/}).click();
  await page.getByRole('button',{name:'10問',exact:true}).click();
  await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
  await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
  await page.getByRole('button',{name:'演習を開始する'}).click();
  const seen=new Set<string>();
  for(let index=0;index<ids.length;index++){
    await expect(page.locator('.question h2')).toBeVisible();
    const stem=await page.locator('.question h2').innerText();
    const q=seed.find(q=>ids.includes(q.id)&&q.question===stem)!;
    expect(q).toBeDefined();expect(seen.has(q.id)).toBe(false);seen.add(q.id);
    await expect(page.locator('.answer-reason')).toHaveCount(0);
    for(const id of q.answer)await page.locator('.question fieldset input').nth(q.choices.findIndex(c=>c.id===id)).check();
    await page.getByRole('button',{name:'回答を確認する'}).click();
    await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
    const paragraphs=answerExplanation(q).split('\n\n');
    await expect(page.locator('.answer-reason')).toHaveText(paragraphs);
    expect(answerExplanation(q)).toBe(details.questions.find(row=>row.id===q.id)!.text);
    for(const choice of q.choices)await expect(page.locator('.choice-explanations')).toContainText(q.choiceExplanations[choice.id as keyof typeof q.choiceExplanations]);
    await expect(page.getByText(/Key Clues|実務要件と制約から上記/)).toHaveCount(0);
    await page.locator('.explanation-body').scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
    if(q.id==='q-d1-a18-feature-20261016'||q.id==='q-d2-e21-ms-20261017'){
      await page.locator('.explanation').screenshot({path:`artifacts/answer-explanation-${info.project.name}-${q.id}.png`});
    }
    await page.getByRole('button',{name:index===ids.length-1?'演習を終了する':'次の問題へ'}).click();
  }
  expect([...seen].sort()).toEqual([...ids].sort());
  await expect(page.locator('.result-score')).toContainText('7 / 7');
  expect(errors).toEqual([]);
});
