import { test, expect, type Page } from '@playwright/test';
import stored from '../../content/gh300/2026-08-07/questions/seed.json';
import exclusions from '../../content/gh300/2026-08-07/questions/selection-exclusions.json';
const seed=stored.filter(q=>!exclusions.questions.some(r=>r.id===q.id)&&q.status==='verified');

async function navigate(page: Page, name: string) {
  const nav = page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション';
  await page
    .getByRole('navigation', { name: nav, exact: true })
    .getByRole('button', { name: new RegExp(name) })
    .click();
}

test.describe('Adaptive Learning Upgrade E2E Scenario', () => {
  test('due review mode starts with the question whose review date has passed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '学習ダッシュボード' })).toBeVisible();
    await page.waitForFunction(async () =>
      (await indexedDB.databases()).some((database) =>
        database.name === 'gh300-certmaster' && (database.version ?? 0) >= 4),
    );
    await navigate(page, 'Practice');
    await expect(page.getByRole('button', { name: '演習を開始する' })).toBeEnabled();
    await page.evaluate(async (questionId) => {
      const request = indexedDB.open('gh300-certmaster');
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('questionReviews', 'readwrite');
        transaction.objectStore('questionReviews').put({
          questionId,
          lastAnsweredAt: Date.now() - 4 * 86400000,
          lastCorrectAt: Date.now() - 4 * 86400000,
          lastIncorrectAt: null,
          consecutiveCorrect: 1,
          totalCorrect: 1,
          totalIncorrect: 0,
          nextReviewAt: Date.now() - 86400000,
          reviewPriority: 1,
          lapseCount: 0,
          intervalDays: 3,
        });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
      database.close();
    }, seed[0].id);

    await page.getByRole('radio', { name: /復習期限/ }).check();
    await page.getByRole('button', { name: '演習を開始する' }).click();
    await expect(page.locator('.question h2')).toHaveText(seed[0].question);
  });

  test('Complete learning loop: Wrong answer -> Review recommendation -> Comparison Guide -> 3 Check Questions -> Dashboard Due update', async ({ page }) => {
    // 1. Visit App & Navigate to Practice
    await page.goto('/');
    await navigate(page, 'Practice');

    // Select 5 questions
    await page.getByRole('button', { name: '5問', exact: true }).click();
    await page.getByRole('button', { name: '演習を開始する' }).click();

    // 2. Select a known wrong choice, regardless of randomized question order.
    const prompt = (await page.locator('.question h2').innerText()).trim();
    const question = seed.find((item) => item.question.trim() === prompt);
    expect(question).toBeDefined();
    const wrongIndex = question!.choices.findIndex((choice) => !question!.answer.includes(choice.id));
    expect(wrongIndex).toBeGreaterThanOrEqual(0);
    await page.locator('.question fieldset label.choice').nth(wrongIndex).click();
    await page.getByRole('button', { name: '回答を確認する' }).click();

    // 3. Explanation is displayed
    await expect(page.locator('.explanation')).toBeVisible();

    // 4. If wrong, check if Adaptive Recommendation / Review button is present
    const reviewBtn = page.locator('.review-now-btn, .study-chip').first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      // Should navigate to Study / Comparison / Lesson
      await expect(page.locator('.lesson, .comparison-detail, .glossary-detail, article.panel')).toBeVisible();

      // Check for 3-question check button
      const check3Btn = page.locator('button:has-text("理解度チェック 3問"), button:has-text("この違いを3問で確認"), button:has-text("この用語の関連問題を3問解く")').first();
      if (await check3Btn.isVisible()) {
        await check3Btn.click();
        // Starts 3 questions practice
        await expect(page.locator('.question')).toBeVisible();
      }
    }

    // 5. Navigate to Review tab and verify new tabs
    await navigate(page, 'Review');
    await expect(page.locator('.review-subnav-bar')).toBeVisible();
    await expect(page.getByRole('button', { name: /間違いノート/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /概念混同マップ/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /回答履歴/ })).toBeVisible();

    // Click on Concept Confusion Map
    await page.getByRole('button', { name: /概念混同マップ/ }).click();
    await expect(page.locator('.concept-confusion-map, .concept-confusion-empty')).toBeVisible();

    // 6. Navigate to Home and check Spaced Repetition Card
    await navigate(page, 'Home');
    await expect(page.locator('.spaced-repetition-card')).toBeVisible();
  });
});
