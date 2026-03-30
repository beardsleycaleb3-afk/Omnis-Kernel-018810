const CACHE_NAME = 'Omnis-Kernel-018810-v13';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './3pm.mp3',
  './Omnis-Kernel.mp3',
  './data.js',
];

// Force immediate activation of the new kernel
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Clean out the old dead-Y-axis versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Purging legacy kernel cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ensure the new SW takes control of the page immediately
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
