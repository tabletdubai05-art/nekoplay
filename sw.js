const CACHE_NAME = 'anime-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html' // Adicione aqui seus arquivos de estilo CSS principais se quiser
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
