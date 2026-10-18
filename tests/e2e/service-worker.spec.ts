import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import fs from 'node:fs';

test('cold service worker installation drains large uncached downloads without starving connections', async ({ page }) => {
  const worker = fs.readFileSync('public/sw.js', 'utf8');
  const asset = `/*${'x'.repeat(512 * 1024)}*/`;
  const scripts = Array.from({ length: 8 }, (_, i) => `<script src="/_next/static/cold-${i}.js"></script>`).join('');
  const server = createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.url === '/') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(`<!doctype html><head>${scripts}</head><body><h1>Worker fixture</h1><script>navigator.serviceWorker.register('/sw.js')</script></body>`);
    } else if (request.url === '/sw.js') {
      response.setHeader('Content-Type', 'application/javascript');
      response.end(worker);
    } else if (request.url?.startsWith('/_next/static/')) {
      response.setHeader('Content-Type', 'application/javascript');
      response.end(asset);
    } else if (request.url === '/icon.svg') {
      response.setHeader('Content-Type', 'image/svg+xml');
      response.end('<svg xmlns="http://www.w3.org/2000/svg"/>');
    } else if (request.url === '/manifest.webmanifest') {
      response.setHeader('Content-Type', 'application/manifest+json');
      response.end('{}');
    } else {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Fixture failed to start');
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    await page.goto(origin);
    await page.evaluate(() => Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Large downloads stalled')), 15000)),
    ]));
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
    const count = await page.evaluate(async () => {
      const cache = await caches.open('certmaster-2026-10-18-security-v4');
      return (await cache.keys()).filter(request => request.url.includes('/_next/static/')).length;
    });
    expect(count).toBe(8);
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Worker fixture' })).toBeVisible();
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
