import { test, expect, type Page } from '@playwright/test';
import seed from '../../content/gh300/2026-08-07/questions/seed.json';
async function navigate(page: Page, name: string) {
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: new RegExp(name) })
    .click();
}
async function solve(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    const title = await page.locator('.question h2').innerText();
    const q = seed.find((q) => q.question === title)!;
    const choice =
      i === 0
        ? q.choices.find((c) => !q.answer.includes(c.id))!
        : q.choices.find((c) => q.answer.includes(c.id))!;
    await page
      .getByRole('radio')
      .nth(q.choices.findIndex((c) => c.id === choice.id))
      .check();
    await page.getByRole('button', { name: '回答を確認する' }).click();
    await expect(page.getByRole('heading', { name: '選択肢ごとの解説' })).toBeVisible();
    await page.getByRole('button', { name: i === n - 1 ? '演習を終了する' : '次の問題へ' }).click();
  }
}
test('defaults, persistent options and mutually exclusive AI switches', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Practice');
  await expect(page.getByRole('button', { name: '演習を開始する' })).toBeEnabled();
  await expect(page.getByRole('button', { name: '10問', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('radio', { name: /ランダム/ })).toBeChecked();
  for (const label of ['未回答問題を優先', '最近解いた問題を避ける', 'Verifiedのみ'])
    await expect(page.getByRole('checkbox', { name: label, exact: true })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'AI問題を含める' })).not.toBeChecked();
  await page.getByRole('button', { name: '30問', exact: true }).click();
  await page.getByRole('radio', { name: /シラバス準拠/ }).check();
  await page.getByRole('checkbox', { name: 'AI問題を含める' }).check();
  await expect(page.getByRole('checkbox', { name: 'Verifiedのみ' })).not.toBeChecked();
  await page.reload();
  await navigate(page, 'Practice');
  await expect(page.getByRole('button', { name: '30問', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('radio', { name: /シラバス準拠/ })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'AI問題を含める' })).toBeChecked();
  await page.getByRole('checkbox', { name: 'Verifiedのみ' }).check();
  await expect(page.getByRole('checkbox', { name: 'AI問題を含める' })).not.toBeChecked();
});
test('five-question result and one-tap weak retry with recent fallback', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Practice');
  await page.getByRole('button', { name: '5問', exact: true }).click();
  await page.getByRole('button', { name: '演習を開始する' }).click();
  await solve(page, 5);
  await expect(page.getByRole('heading', { name: '今回の学習結果' })).toBeVisible();
  await expect(page.locator('.result-score')).toContainText('4 / 5');
  await expect(page.getByText('正答率 80%', { exact: true })).toBeVisible();
  for (const title of [
    'Domain別結果',
    '今回改善したObjective',
    '間違えたObjective',
    '復習推奨項目',
  ])
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.getByRole('button', { name: '苦手分野を5問', exact: true }).click();
  await expect(page.locator('.question .tag').first()).toContainText('1 / 5');
  await expect(page.getByRole('button', { name: '回答を確認する' })).toBeVisible();
  await page.reload();
  await navigate(page, 'Review');
  await expect(page.getByRole('heading', { name: 'Practiceの結果', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /4\/5 正解/ }).click();
  await expect(page.getByRole('heading', { name: '今回の学習結果' })).toBeVisible();
});
test('same settings retry and incorrect-only retry', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Practice');
  await page.getByRole('button', { name: '5問', exact: true }).click();
  await page.getByRole('radio', { name: /シラバス準拠/ }).check();
  await page.getByRole('button', { name: '演習を開始する' }).click();
  await solve(page, 5);
  await page.getByRole('button', { name: '同じ条件でもう一度' }).click();
  await expect(page.locator('.question .tag').first()).toContainText('1 / 5');
  await solve(page, 5);
  await page.getByRole('button', { name: '間違えた問題だけ復習' }).click();
  await expect(page.locator('.question .tag').first()).toContainText('1 / 1');
});
test('50-question practice remains immediate-feedback and small bank fallback is explicit', async ({
  page,
}) => {
  await page.goto('/');
  await navigate(page, 'Practice');
  await page.getByRole('button', { name: '50問', exact: true }).click();
  await expect(page.getByText(/公式試験の問題数が50問固定/)).toBeVisible();
  await page.getByRole('button', { name: '演習を開始する' }).click();
  await expect(page.getByRole('status')).toContainText('指定50問から12問');
  await expect(page.locator('.question .tag').first()).toContainText('1 / 12');
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: '回答を確認する' }).click();
  await expect(page.getByRole('heading', { name: '選択肢ごとの解説' })).toBeVisible();
});
test('default mock uses verified, defers explanation and adjusts actual timer', async ({
  page,
}) => {
  await page.goto('/');
  await navigate(page, 'Mock');
  await expect(page.getByRole('button', { name: '50問', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: '模試を開始する', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('指定50問から12問');
  await expect(page.locator('.timer')).toContainText('18 分');
  await expect(page.locator('.question-meta')).toContainText('Verified');
  await expect(page.getByRole('button', { name: '回答を確認する' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '選択肢ごとの解説' })).toHaveCount(0);
});
test('practice setup has no overflow and keyboard focus remains visible', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Practice');
  await page.getByRole('button', { name: '10問', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '20問', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: `test-results/practice-${page.viewportSize()!.width}.png`,
    fullPage: true,
  });
});
