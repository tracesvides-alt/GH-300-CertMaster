import {test,expect,type Page} from '@playwright/test';
import report from '../../reports/cli-admin-reference-expansion-2026-10-18.json';
const navigate=(page:Page,name:string)=>page.getByRole('navigation',{name:page.viewportSize()!.width<640?'モバイルナビゲーション':'メインナビゲーション',exact:true}).getByRole('button',{name:new RegExp(name)}).click();
async function searchLesson(page:Page,keyword:string,title:string){
 await page.goto('/');await navigate(page,'Study');
 await page.getByPlaceholder('教材・用語・比較ガイドを検索…').fill(keyword);
 await page.locator('.search-result-item').filter({has:page.getByText(title,{exact:true})}).click();
 await expect(page.locator('article.lesson h2')).toHaveText(title);
 await page.addStyleTag({content:'html,*{scroll-behavior:auto!important}'});
}

test('searches table-only commands, renders all CLI rows with sources and starts a comprehension exercise',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await searchLesson(page,'--resume=SESSION-ID','現行GitHub Copilot CLIの利用と安全確認');
 const article=page.locator('article.lesson');await expect(article.getByRole('table')).toHaveCount(6);
 for(const row of report.coverage.filter(row=>row.lessonId==='lesson-d2-cli')){
  const rendered=article.locator(`[data-reference-row="${row.rowId}"]`);
  await expect(rendered).toBeVisible();await expect(rendered.getByRole('rowheader')).toHaveText(row.topic);
  await expect(rendered.getByRole('cell')).toHaveCount(3);
  for(const id of row.sourceIds){
   const source=report.changes.find(c=>c.kind==='sources'&&c.id===id)!.after as {url:string};
   await expect(rendered.locator(`a[href="${source.url}"]`)).toBeVisible();
  }
 }
 await expect(article.locator('#cli-resume')).toContainText('TTY');
 await expect(article.locator('#cli-tools')).toContainText('拒否が優先');
 if(info.project.name==='mobile')await expect(article.locator('.reference-cell-label').first()).toBeVisible();
 else await expect(article.getByRole('columnheader',{name:'入力する場所'}).first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 await article.locator('#cli-help-model').screenshot({path:`artifacts/reference-cli-${info.project.name}.png`,animations:'disabled'});
 await article.getByRole('button',{name:/理解度チェック 3問/}).click();
 await expect(page.locator('.question h2')).toBeVisible();
 const inputs=page.locator('.question fieldset input');await inputs.first().check();
 if(await inputs.first().getAttribute('type')==='checkbox')await inputs.nth(1).check();
 await page.getByRole('button',{name:'回答を確認する'}).click();
 await expect(page.getByRole('heading',{name:'選択肢ごとの詳細分析'})).toBeVisible();
 expect(errors).toEqual([]);
});

test('reads plan and operation tables, follows glossary and comparison links, and persists completion',async({page},info)=>{
 await searchLesson(page,'billing manager','組織・エンタープライズポリシーとシート・監査ログ管理');
 const article=page.locator('article.lesson');await expect(article.getByRole('table')).toHaveCount(2);
 await expect(article.locator('#copilot-plan-management [data-reference-row]')).toHaveCount(7);
 await expect(article.locator('#copilot-admin-operations [data-reference-row]')).toHaveCount(10);
 await expect(article.locator('[data-reference-row="admin-repo-exclusion"]')).toContainText('Maintainは閲覧のみ');
 await expect(article.locator('[data-reference-row="admin-enterprise-metrics"]')).toContainText('billing manager');
 await expect(article.locator('[data-reference-row="admin-audit-read"]')).toContainText('Read enterprise audit logs');
 await article.locator('[data-reference-row="admin-enterprise-metrics"]').screenshot({path:`artifacts/reference-admin-${info.project.name}.png`,animations:'disabled'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 await article.locator('.lesson-glossary-links').first().getByRole('button',{name:'Copilot Subscription Plans (Business vs Enterprise vs Pro)',exact:true}).click();
 await expect(page.locator('.glossary-detail')).toContainText('Copilot Free');
 await page.locator('.glossary-detail').getByRole('button',{name:'組織・エンタープライズポリシーとシート・監査ログ管理',exact:true}).click();
 await page.locator('#lesson-related-comparisons').getByRole('button',{name:'Organization Policies vs Enterprise Policies',exact:true}).click();
 await expect(page.locator('.comparison-detail h2')).toHaveText('Organization Policies vs Enterprise Policies');
 await page.locator('.comparison-detail').getByRole('button',{name:'組織・エンタープライズポリシーとシート・監査ログ管理',exact:true}).click();
 // Reaching the footer auto-completes the lesson. Wait for that state before
 // testing the manual toggle so a scroll-triggered update cannot reverse it.
 await page.locator('#lesson-footer-nav-container').scrollIntoViewIfNeeded();
 await expect(page.getByRole('button',{name:/読了済み/}).first()).toBeVisible();
 await page.getByRole('button',{name:/読了済み/}).first().click();
 await expect(page.getByRole('button',{name:'読了にする',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'読了にする',exact:true}).click();
 await expect(page.getByRole('button',{name:/読了済み/}).first()).toBeVisible();
 await page.reload();await navigate(page,'Study');
 await page.getByPlaceholder('教材・用語・比較ガイドを検索…').fill('billing manager');
 await page.locator('.search-result-item').filter({has:page.getByText('組織・エンタープライズポリシーとシート・監査ログ管理',{exact:true})}).click();
 await expect(page.getByRole('button',{name:/読了済み/}).first()).toBeVisible();
});

test('reference cards retain every field at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await searchLesson(page,'--excluded-tools=grep','現行GitHub Copilot CLIの利用と安全確認');
 const row=page.locator('[data-reference-row="cli-excluded"]');
 await expect(row.getByRole('cell')).toHaveCount(3);
 await expect(row.locator('.reference-cell-label')).toHaveText(['コマンド・指定','入力する場所','条件・注意']);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=320)).toBe(true);
});
