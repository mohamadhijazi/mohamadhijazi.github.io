/**
 * sw.js - Service Worker for Offline PWA Support
 * Phase 5.2: Caches static assets for complete offline PWA execution
 */

const CACHE_NAME = 'pwa-workspace-v2.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/storage.js',
    '/templates.js',
    '/eventEngine.js',
    '/portability.js',
    '/routineWizard.js',
    '/contactWizard.js',
    '/routineView.js',
    '/spatialView.js',
    '/mapView.js',
    '/app.js'
];

// Third-party assets to cache (Leaflet)
const THIRD_PARTY_ASSETS = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cache) => cache !== CACHE_NAME && cache.startsWith('pwa-workspace-'))
                    .map((cache) => {
                        console.log('Service Worker: Deleting old cache:', cache);
                        return caches.delete(cache);
                    })
            );
        })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Clone the request because it can only be consumed once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        // Check for valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it can only be consumed once
                        const responseToCache = response.clone();

                        // Cache successful fetches
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Fetch failed, no cache available:', error);
                        // Return offline fallback for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        throw error;
                    });
            })
    );
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            event.source.postMessage({ type: 'CACHE_CLEARED' });
        });
    }
});

/**
 * Background sync - handle any pending operations
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-workspace') {
        event.waitUntil(
            // Sync logic here for future offline queue support
            Promise.resolve()
        );
    }
});

/**
 * Push notification handler (for future PWA notifications)
 */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: 'icon.png',
        badge: 'badge.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: 'icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: 'badge.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('PWA Workspace', options)
    );
});