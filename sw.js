const CACHE_NAME = 'Omnis-Kernel-018810-v8';

const ASSETS = [
  './',
  './Omnis-Kernel.mp3',
  './icon.png',
  './index.html',
  './manifest.json',        // ← add this
  './3pm.mp3',              // ← add this (audio that powers the visuals)
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r137/three.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
