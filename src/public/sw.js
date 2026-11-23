/* DeskPRO service worker — App Shell + offline runtime caches. */

const VERSION = 'v1';
const CACHE_PREFIX = 'deskpro-';
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_PREFIX}${VERSION}-runtime`;
const EXTERNAL_CACHE = `${CACHE_PREFIX}${VERSION}-external`;

const SCOPE = self.registration.scope;
const SHELL_URL = new URL('./index.html', SCOPE);
const ROOT_URL = new URL('./', SCOPE);

const SHELL_EXTRAS = [
  SHELL_URL,
  ROOT_URL,
  new URL('./manifest.webmanifest', SCOPE),
  new URL('./icons/icon-192.png', SCOPE),
  new URL('./icons/icon-512.png', SCOPE),
  new URL('./icons/icon-512-maskable.png', SCOPE),
  new URL('./icons/apple-touch-icon.png', SCOPE),
];

/**
 * Reads the built index.html and precaches every local asset it references.
 * Parsing the HTML keeps hashed Vite filenames in sync without a build step.
 */
async function precacheShell() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(SHELL_URL, { cache: 'reload' });
  if (!response.ok) throw new Error(`No se pudo precargar el App Shell: ${response.status}`);

  const html = await response.text();
  const shellResponse = new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  await cache.put(SHELL_URL, shellResponse.clone());
  await cache.put(ROOT_URL, shellResponse.clone());

  const urls = new Set([...SHELL_EXTRAS.map((url) => url.href)]);
  const references = /(?:src|href)=["']([^"']+)["']/g;
  let match;

  while ((match = references.exec(html)) !== null) {
    const value = match[1].trim();
    if (!value || value.startsWith('#') || value.startsWith('data:') || /^[a-z][a-z0-9+.-]*:/i.test(value)) continue;

    try {
      const url = new URL(value, SHELL_URL);
      if (url.origin === self.location.origin) urls.add(url.href);
    } catch (error) {
      // Ignore malformed references; they are not part of the App Shell.
    }
  }

  await Promise.all(
    [...urls].map(async (href) => {
      try {
        if (!(await cache.match(href))) await cache.add(href);
      } catch (error) {
        // One missing optional asset must not block installation.
      }
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await precacheShell();
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith(CACHE_PREFIX) && !key.startsWith(`${CACHE_PREFIX}${VERSION}-`)).map(
          (key) => caches.delete(key)
        )
      );
      await self.clients.claim();
    })()
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await Promise.all([
        cache.put(request.url, response.clone()),
        cache.put(SHELL_URL, response.clone()),
      ]);
    }
    return response;
  } catch (error) {
    const cached = (await cache.match(request)) || (await cache.match(SHELL_URL));
    if (cached) return cached;

    return new Response(
      '<!doctype html><html lang="es"><meta charset="utf-8"><title>Sin conexión</title><p>Inicia DeskPRO al menos una vez con conexión para usarla offline.</p></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
      await cache.put(request, response.clone());
    } catch (error) {
      // Non-cacheable responses still work for this request.
    }
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(EXTERNAL_CACHE);
  const cached = await cache.match(request);

  const update = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  const fresh = await update;
  if (fresh) return fresh;

  throw new Error(`Recurso externo no disponible sin conexión: ${request.url}`);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (error) {
    return;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (url.origin !== self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
