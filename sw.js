const CACHE_NAME = 'Omnis-Kernel-018810-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Triggered when the code is updated
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Omnis-Kernel-018810: Caching V2 Assets');
      return cache.addAll(assets);
    })
  );
});

// Clean up old versions
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
