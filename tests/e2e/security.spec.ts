import { test, expect } from '@playwright/test';

test('production responses protect pages and revalidate the service worker', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('microphone=()');
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['content-security-policy']).toContain("connect-src 'self'");
  expect(headers['content-security-policy']).not.toContain('unsafe-eval');
  const worker = await request.get('/sw.js');
  expect(worker.headers()['cache-control']).toContain('no-store');
  expect(worker.headers()['content-security-policy']).toContain("script-src 'self'");
  expect((await request.get('/.env')).status()).toBe(404);
});

test('CSP permits normal operations and offline practice', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => {
    if (/violates.*Content Security Policy|Refused to .*policy/i.test(message.text()))
      errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学習ダッシュボード', exact: true })).toBeVisible();
  const navigation = page.getByRole('navigation', {
    name: page.viewportSize()!.width < 640 ? 'モバイルナビゲーション' : 'メインナビゲーション',
    exact: true,
  });
  await navigation.getByRole('button', { name: /Study/ }).click();
  await page.getByPlaceholder('教材・用語・比較ガイドを検索…').fill('Copilot');
  await expect(page.locator('.search-result-item').first()).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
  await context.setOffline(true);
  await page.reload();
  await navigation.getByRole('button', { name: /Practice/ }).click();
  await page.getByRole('button', { name: '演習を開始する', exact: true }).click();
  const choices = page.locator('.question fieldset input');
  await choices.first().check();
  if (await choices.first().getAttribute('type') === 'checkbox') await choices.nth(1).check();
  await page.getByRole('button', { name: '回答を確認する', exact: true }).click();
  await expect(page.getByRole('heading', { name: '選択肢ごとの詳細分析', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('CSP blocks unapproved external scripts and connections', async ({ page }) => {
  await page.goto('/');
  const violations = await page.evaluate(async () => {
    const violations: Array<{ directive: string; blocked: string }> = [];
    const listener = (event: SecurityPolicyViolationEvent) => violations.push({
      directive: event.effectiveDirective, blocked: event.blockedURI,
    });
    document.addEventListener('securitypolicyviolation', listener);
    await fetch('https://security-probe.invalid/ping').catch(() => undefined);
    await new Promise<void>(resolve => {
      const script = document.createElement('script');
      script.src = 'https://security-probe.invalid/probe.js';
      script.onload = script.onerror = () => resolve();
      document.head.append(script);
    });
    // Violation events are queued separately from the failed resource events.
    await new Promise(resolve => setTimeout(resolve, 100));
    document.removeEventListener('securitypolicyviolation', listener);
    return violations;
  });
  expect(violations).toEqual(expect.arrayContaining([
    expect.objectContaining({ directive: 'connect-src', blocked: expect.stringContaining('https://security-probe.invalid') }),
    expect.objectContaining({ directive: 'script-src-elem', blocked: expect.stringContaining('https://security-probe.invalid') }),
  ]));
});

test('an unrelated website cannot embed the application', async ({ page, baseURL }) => {
  const errors: string[] = [];
  const failures: string[] = [];
  page.on('console', message => errors.push(message.text()));
  page.on('requestfailed', request => failures.push(request.failure()?.errorText ?? ''));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Log.enable');
  cdp.on('Log.entryAdded', ({ entry }) => errors.push(entry.text));
  // Both origins are loopback so Local Network Access does not preempt the
  // response's frame-ancestors/X-Frame-Options protections being tested.
  await page.route('http://localhost:32001/', route => route.fulfill({
    contentType: 'text/html', body: `<iframe src="${baseURL}/" width="1200" height="900"></iframe>`,
  }));
  await page.goto('http://localhost:32001/');
  await expect.poll(() => errors.some(message => /frame-ancestors|X-Frame-Options/i.test(message))
    || failures.some(message => message.includes('ERR_BLOCKED_BY_RESPONSE'))
    || page.frames().some(frame => frame.url().startsWith('chrome-error://'))).toBeTruthy();
  await expect(page.frameLocator('iframe').getByRole('heading', { name: '学習ダッシュボード', exact: true })).toHaveCount(0);
});
