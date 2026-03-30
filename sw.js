const CACHE_NAME = 'omnis-kernel-v5';
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './3pm.mp3',
    './Omnis-Kernel.mp3',
    './icon.png'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Omnis: Pre-caching 3pm.mp3 + Omnis-Kernel.mp3');
                return Promise.allSettled(
                    PRECACHE_URLS.map(url => cache.add(url))
                );
            })
    );
});

// Rest unchanged...
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => 
            Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('.mp3') || 
        PRECACHE_URLS.includes(event.request.url)) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => 
                cache.match(event.request).then(cached => {
                    if (cached) return cached;
                    return fetch(event.request).then(netResp => {
                        const clone = netResp.clone();
                        cache.put(event.request, clone);
                        return netResp;
                    }).catch(() => caches.match('./3pm.mp3'));
                })
            )
        );
    } else {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});
