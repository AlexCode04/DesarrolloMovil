const CACHE_NAME = 'medicare-admin-cache-v1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.ico',
    '/medicare.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(APP_SHELL);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // ESTRATEGIA CACHE FIRST para imágenes:
    // Busca primero en caché, si existe lo devuelve inmediatamente (rápido).
    // Si no existe, obtiene de la red y lo guarda para futuras solicitudes.
    // Conviene para imágenes estáticas (logos, avatares) que no cambian frecuentemente.
    // NO conviene para datos médicos críticos que requieren estar siempre actualizados.
    if (event.request.destination === 'image' || /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    if (event.request.destination === 'script' || 
        event.request.destination === 'style' ||
        /\.(js|css)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            }).catch(() => caches.match(event.request))
    );
});
