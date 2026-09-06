import { test, expect } from '@playwright/test';
test('dashboard → practice → answer → explanation persists', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学習ダッシュボード' })).toBeVisible();
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Practice/ })
    .click();
  await page.getByRole('button', { name: '演習を開始する' }).click();
  await page.locator('.question fieldset input').first().check();
  await page.getByRole('button', { name: '回答を確認する' }).click();
  await expect(page.getByRole('heading', { name: '選択肢ごとの詳細分析' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Official Source' })).toBeVisible();
  await page.getByRole('button', { name: 'ブックマーク', exact: true }).click();
  await page.reload();
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Review/ })
    .click();
  await expect(page.getByRole('button', { name: 'ブックマークを解く (1)' })).toBeVisible();
  await expect(page.getByRole('button', { name: '回答と解説を見る' })).toBeVisible();
});
test('mini mock resumes and shows results', async ({ page }) => {
  await page.goto('/');
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Mock/ })
    .click();
  await page.getByRole('button', { name: '5問のミニ模試' }).click();
  await page.locator('.question fieldset input').first().check();
  await page.getByRole('button', { name: '回答を保存して次へ' }).click();
  await page.reload();
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Mock/ })
    .click();
  await page.getByRole('button', { name: /中断した模試を再開/ }).click();
  for (let i = 1; i < 5; i++) {
    await page.locator('.question fieldset input').first().check();
    await page
      .getByRole('button', { name: i < 4 ? '回答を保存して次へ' : '模試を終了する' })
      .click();
  }
  await expect(page.getByRole('heading', { name: '模試、おつかれさまでした。' })).toBeVisible();
});
test('offline shell and bundled lessons remain usable', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: '学習ダッシュボード' })).toBeVisible();
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Study/ })
    .click();
  await expect(page.getByRole('heading', { name: '責任あるAIの利用', exact: true })).toBeVisible();
});
test('layout stays within viewport', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: `test-results/dashboard-${page.viewportSize()!.width}.png`,
    fullPage: true,
  });
});
