import {test,expect,type Page} from '@playwright/test';
import revisions from '../../content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import original from '../../content/gh300/2026-08-07/questions/seed.json';
const effortId='q-d5-e08-feature-20261016-ms-20261017';
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
      const db=r.result,tx=db.transaction(table),request=tx.objectStore(table).getAll();
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();
    };
  }),table);
}
async function startBookmarks(page:Page,ids:string[]){
  await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await put(page,'bookmarks',ids.map(id=>({id})));await page.reload();await navigate(page,'Practice');
  await page.getByRole('button',{name:'10問',exact:true}).click();
  await page.getByText('Domain・Objective・復習対象を絞る',{exact:true}).click();
  await page.getByRole('combobox',{name:'復習対象',exact:true}).selectOption('bookmarked');
  await page.getByRole('button',{name:'演習を開始する'}).click();
}

test('all ten revised questions render, grade, explain and persist correctly',async({page},info)=>{
  test.setTimeout(120000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await startBookmarks(page,revisions.questions.map(q=>q.id));
  const seen=new Set<string>();
  for(let i=0;i<10;i++){
    await expect(page.locator('.question h2')).toBeVisible();
    const stem=await page.locator('.question h2').innerText();
    const row=revisions.questions.find(row=>row.after.question===stem)!;
    expect(row).toBeDefined();expect(seen.has(row.id)).toBe(false);seen.add(row.id);
    const q=row.after;
    for(const id of q.answer)await page.locator('.question fieldset input').nth(q.choices.findIndex(c=>c.id===id)).check();
    await page.getByRole('button',{name:'回答を確認する'}).click();
    await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
    await expect(page.locator('.answer-reason')).toHaveText(row.displayedExplanation.split('\n\n'));
    for(const c of q.choices)await expect(page.locator('.choice-explanations')).toContainText(q.choiceExplanations[c.id as keyof typeof q.choiceExplanations]);
    await expect(page.getByText(/Key Clues|実務要件と制約から上記/)).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
    if(row.id===effortId){
      await expect(page.locator('.question')).not.toContainText('要レビュー');
      await expect(page.locator('.question')).not.toContainText('Deep');
      await page.locator('.explanation').screenshot({path:`artifacts/official-alignment-effort-${info.project.name}.png`});
    }
    if(row.findingId==='F03')await expect(page.locator('.explanation-body')).toContainText('2026年9月1日');
    if(row.findingId==='F04')await expect(page.locator('.explanation-body')).toContainText('2026年10月8日');
    await page.getByRole('button',{name:i===9?'演習を終了する':'次の問題へ'}).click();
  }
  await expect(page.locator('.result-score')).toContainText('10 / 10');
  await page.reload();
  const attempts=await read(page,'attempts');expect(attempts).toHaveLength(10);expect(attempts.every(a=>a.correct)).toBe(true);
  expect(attempts.find(a=>a.questionId===effortId).answer.sort()).toEqual(['C','D']);
  expect(errors).toEqual([]);
});

test('the obsolete A/B answer pair is rejected by the corrected question',async({page})=>{
  await startBookmarks(page,[effortId]);
  const q=revisions.questions.find(q=>q.id===effortId)!.after;
  await expect(page.locator('.question h2')).toHaveText(q.question);
  for(const id of ['A','B'])await page.locator('.question fieldset input').nth(q.choices.findIndex(c=>c.id===id)).check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toHaveCount(0);
  await expect(page.locator('.answer-reason')).toHaveText(revisions.questions.find(q=>q.id===effortId)!.displayedExplanation.split('\n\n'));
  const attempts=await read(page,'attempts');expect(attempts).toHaveLength(1);expect(attempts[0].correct).toBe(false);
  expect(attempts[0].correctChoiceIds.sort()).toEqual(['C','D']);
});

test('old unfinished effort snapshots cannot resume and completed history is preserved',async({page})=>{
  await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  const old=original.find(q=>q.id===effortId)!;
  const other=original.find(q=>q.id==='q02')!;
  const base={answers:{[effortId]:['A','B']},deadline:Date.now()+900000,completed:false,requestedCount:2,index:0};
  await put(page,'sessions',[
    {...base,id:'old-effort-only',questions:[old]},
    {...base,id:'old-effort-mixed',questions:[old,other],index:1},
    {...base,id:'old-effort-complete',questions:[old],completed:true},
  ]);
  await page.reload();await navigate(page,'Mock');
  await expect(page.getByRole('button',{name:/中断した模試を再開/})).toHaveCount(1);
  await page.getByRole('button',{name:/中断した模試を再開/}).click();
  await expect(page.locator('.question h2')).toHaveText(other.question);
  await page.locator('.question fieldset input').nth(other.choices.findIndex(c=>c.id===other.answer[0])).check();
  await page.getByRole('button',{name:'模試を終了する',exact:true}).click();
  await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
  const saved=await read(page,'sessions');
  const mixed=saved.find(s=>s.id==='old-effort-mixed');
  expect(mixed.questions.map((q:{id:string})=>q.id)).toEqual([other.id]);
  expect(mixed.answers).not.toHaveProperty(effortId);
  const done=saved.find(s=>s.id==='old-effort-complete');
  expect(done.questions[0]).toEqual(old);expect(done.answers[effortId]).toEqual(['A','B']);
});

test('notebook and answer history show the old edition while retry starts the corrected edition',async({page})=>{
  await page.goto('/');await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  const old=original.find(q=>q.id===effortId)!,current=revisions.questions.find(q=>q.id===effortId)!.after;
  await put(page,'attempts',[{id:'historical-effort-attempt',questionId:effortId,domainId:old.domainId,objectiveId:old.objectiveId,status:'verified',answer:['C','D'],correctChoiceIds:['A','B'],questionType:'multi_select',correct:false,at:Date.now()-10000}]);
  await page.reload();await navigate(page,'Review');
  await page.getByRole('button',{name:/間違いノート/}).click();
  await page.getByRole('tab',{name:/By Question/}).click();
  await expect(page.locator('.review-row').filter({hasText:old.question})).toBeVisible();
  await page.getByRole('button',{name:'回答と解説を見る',exact:true}).click();
  await expect(page.locator('.question h2')).toHaveText(old.question);
  await expect(page.locator('.answer-reason').first()).toContainText('要レビュー');
  await navigate(page,'Review');await page.getByRole('button',{name:/回答履歴/}).click();
  await expect(page.locator('.review-list .review-row')).toContainText(old.question);
  await page.getByRole('button',{name:'回答と解説を見る',exact:true}).click();
  await expect(page.locator('.question h2')).toHaveText(old.question);
  expect(await read(page,'attempts')).toHaveLength(1);
  await navigate(page,'Review');await page.getByRole('button',{name:/間違いノート/}).click();
  await page.getByRole('tab',{name:/By Question/}).click();
  await page.getByRole('button',{name:'もう一度解く',exact:true}).click();
  await expect(page.locator('.question h2')).toHaveText(current.question);
  for(const id of current.answer)await page.locator('.question fieldset input').nth(current.choices.findIndex(c=>c.id===id)).check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'正解です！',exact:true})).toBeVisible();
  const attempts=await read(page,'attempts');
  expect(attempts).toHaveLength(2);
  expect(attempts.find(a=>a.id==='historical-effort-attempt').correct).toBe(false);
  expect(attempts.find(a=>a.id!=='historical-effort-attempt').correctChoiceIds.sort()).toEqual(['C','D']);
});
