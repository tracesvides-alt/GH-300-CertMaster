// Cache the HTML and its required bundles together: never save a broken app shell.
const CACHE = 'certmaster-2026-08-07-v3';
async function cacheShell(response) {
  if (!response.ok) throw new Error('App shell unavailable');
  const html = await response.clone().text();
  const urls = [
    ...new Set(
      [...html.matchAll(/(?:src|href)="([^\"]+)"/g)]
        .map((match) => match[1].replaceAll('&amp;', '&'))
        .filter((url) => url.startsWith('/_next/static/') && /\.(?:js|css)(?:\?|$)/.test(url)),
    ),
  ];
  if (!urls.length) throw new Error('App bundles missing');
  const responses = await Promise.all(
    urls.map(async (url) => {
      const asset = await fetch(url);
      if (!asset.ok) throw new Error('App bundle unavailable');
      return [url, asset];
    }),
  );
  const cache = await caches.open(CACHE);
  for (const [url, asset] of responses) await cache.put(url, asset);
  await cache.put('/', response.clone());
  return response;
}
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await cacheShell(await fetch('/', { cache: 'reload' }));
      await (await caches.open(CACHE)).addAll(['/icon.svg', '/manifest.webmanifest']);
    })(),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith('certmaster-') && name !== CACHE) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    event.request.headers.get('RSC')
  )
    return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await cacheShell(await fetch(event.request));
        } catch {
          return (
            (await (await caches.open(CACHE)).match('/')) ??
            new Response('オンラインでページを再読み込みしてください。', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
        }
      })(),
    );
    return;
  }
  if (
    url.pathname.startsWith('/_next/static/') ||
    ['/icon.svg', '/manifest.webmanifest'].includes(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE),
          cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      })(),
    );
  }
});
