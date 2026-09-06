// Version must change whenever the bundled content or shell changes.
const CACHE = 'certmaster-2026-08-07-v2';
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(['/', '/icon.svg', '/manifest.webmanifest']);
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
      fetch(event.request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put('/', response.clone());
          }
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }
  if (
    url.pathname.startsWith('/_next/static/') ||
    ['/icon.svg', '/manifest.webmanifest'].includes(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, response.clone());
        }
        return response;
      })(),
    );
  }
});

