import { test, expect } from '@playwright/test';
test('bundles load and starting practice scrolls the question into view', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (e) => failures.push(e.message));
  page.on('response', (r) => {
    if (r.url().includes('/_next/static/') && r.status() >= 400)
      failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.styleSheets.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    'dark',
  );
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: /Practice/ })
    .click();
  await page.getByRole('button', { name: '演習を開始する' }).click();
  await expect(page.locator('.question')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.locator('.question fieldset input').first().check();
  await page.getByRole('button', { name: '回答を確認する' }).click();
  await expect(page.getByRole('heading', { name: '選択肢ごとの詳細分析' })).toBeVisible();
  expect(failures).toEqual([]);
});
test('narrow screens retain all setup controls without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'モバイルナビゲーション', exact: true })
    .getByRole('button', { name: 'Practice', exact: true })
    .click();
  await expect(page.getByRole('button', { name: '演習を開始する' })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: 'test-results/practice-narrow.png', fullPage: true });
});
