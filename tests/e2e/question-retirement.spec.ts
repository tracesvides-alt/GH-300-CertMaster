import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const raw=JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/seed.json','utf8'));
const retired=raw.find((q:{id:string})=>q.id==='q-d3-a08');
const active=raw.find((q:{id:string})=>q.id==='q-d3-a14-feature-20261016');

test('archived history remains readable and bookmarks start only an active question',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(async({retired,active})=>{
    await new Promise<void>((resolve,reject)=>{
      const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
      request.onsuccess=()=>{
        const db=request.result,tx=db.transaction(['attempts','bookmarks','wrongAnswers','confusionPairs'],'readwrite');
        tx.objectStore('attempts').put({id:'retired-history',questionId:retired.id,domainId:retired.domainId,objectiveId:retired.objectiveId,
          answer:[],correct:false,at:Date.now(),status:'verified'});
        tx.objectStore('wrongAnswers').put({id:'retired-wrong',questionId:retired.id,objectiveId:retired.objectiveId,domainId:retired.domainId,answeredAt:Date.now(),confusionPairIds:['g-mcp__g-prompt-files']});
        tx.objectStore('confusionPairs').put({id:'g-mcp__g-prompt-files',conceptAId:'g-mcp',conceptBId:'g-prompt-files',conceptAName:'MCP',conceptBName:'Prompt Files',mistakeCount:5,recentMistakeCount:5,lastMistakeAt:Date.now(),severity:'High',status:'Active',recoveryCount:0,relatedQuestionIds:[retired.id],relatedObjectiveIds:[retired.objectiveId],relatedComparisonIds:[]});
        for(const q of [retired,active])tx.objectStore('bookmarks').put({id:q.id});
        tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};
      };
    });
  },{retired,active});
  await page.reload();
  const nav=page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true});
  await nav.getByRole('button',{name:/Review/}).click();
  await expect(page.getByRole('heading',{name:'まだ混同パターンはありません',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/回答履歴/}).click();
  await expect(page.getByText(retired.question,{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'回答と解説を見る'}).click();
  await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
  await expect(page.getByText(retired.question,{exact:true})).toBeVisible();
  await nav.getByRole('button',{name:/Review/}).click();
  await page.getByRole('button',{name:/回答履歴/}).click();
  await page.getByRole('button',{name:/ブックマークを解く/}).click();
  await expect(page.getByText(active.question,{exact:true})).toBeVisible();
  await expect(page.getByText(retired.question,{exact:true})).toHaveCount(0);
  await page.locator('.question fieldset input').first().check();
  await page.getByRole('button',{name:'回答を確認する'}).click();
  await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
  const stored=await page.evaluate(()=>new Promise<{attempt:boolean,bookmarkCount:number,wrongCount:number,pairCount:number}>((resolve,reject)=>{
    const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction(['attempts','bookmarks','wrongAnswers','confusionPairs'],'readonly');
      const attempt=tx.objectStore('attempts').get('retired-history'),marks=tx.objectStore('bookmarks').getAll();
      const wrong=tx.objectStore('wrongAnswers').get('retired-wrong'),pair=tx.objectStore('confusionPairs').get('g-mcp__g-prompt-files');
      tx.oncomplete=()=>{resolve({attempt:!!attempt.result,bookmarkCount:marks.result.length,wrongCount:wrong.result?1:0,pairCount:pair.result?1:0});db.close();};tx.onerror=()=>reject(tx.error);};
  }));
  expect(stored).toEqual({attempt:true,bookmarkCount:2,wrongCount:1,pairCount:1});
  expect(errors).toEqual([]);
});

test('a saved mock containing an archived snapshot can still resume and finish',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(async(question)=>{
    await new Promise<void>((resolve,reject)=>{
      const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
      request.onsuccess=()=>{const db=request.result,tx=db.transaction('sessions','readwrite');
        tx.objectStore('sessions').put({id:'retired-snapshot',questions:[question],answers:{},index:0,
          deadline:Date.now()+900000,completed:false,requestedCount:1});
        tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};};
    });
  },retired);
  await page.reload();
  await page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:/Mock/}).click();
  await page.getByRole('button',{name:/中断した模試を再開/}).click();
  await expect(page.getByText(retired.question,{exact:true})).toBeVisible();
  await page.locator('.question fieldset input').first().check();
  await page.getByRole('button',{name:'模試を終了する'}).click();
  await expect(page.getByRole('heading',{name:'模試、おつかれさまでした。'})).toBeVisible();
});
