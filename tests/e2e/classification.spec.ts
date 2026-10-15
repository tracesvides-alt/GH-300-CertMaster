import {test,expect} from '@playwright/test';

test('historical mistakes use the corrected objective without rewriting the stored attempt',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'学習ダッシュボード'})).toBeVisible();
  await page.evaluate(async()=>{
    await new Promise<void>((resolve,reject)=>{
      const request=indexedDB.open('gh300-certmaster');
      request.onerror=()=>reject(request.error);
      request.onsuccess=()=>{
        const db=request.result,tx=db.transaction('attempts','readwrite');
        tx.objectStore('attempts').put({id:'historical-classification',questionId:'q-d6-a05',domainId:'d1',objectiveId:'d1o1',
          answer:[],correct:false,at:Date.now(),status:'verified'});
        tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};
      };
    });
  });
  await page.reload();
  const nav=page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション';
  await page.getByRole('navigation',{name:nav,exact:true}).getByRole('button',{name:/Review/}).click();
  await page.getByRole('tab',{name:/By Objective/}).click();
  await expect(page.getByRole('heading',{name:'Manage organization-wide settings and policies',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Understand responsible AI principles',exact:true})).toHaveCount(0);
  const stored=await page.evaluate(()=>new Promise<{objectiveId:string}>((resolve,reject)=>{
    const request=indexedDB.open('gh300-certmaster');request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction('attempts','readonly');
      const get=tx.objectStore('attempts').get('historical-classification');get.onsuccess=()=>resolve(get.result);
      get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};
  }));
  expect(stored.objectiveId).toBe('d1o1');
});
