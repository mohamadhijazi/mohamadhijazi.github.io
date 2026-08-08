/* Service Worker for Digital Twin Universal Workspace PWA */
const CACHE_NAME = 'orgstrata-v2.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/portfolio.css',
  './css/workspace.css',

  // Vendor CSS Libraries
  './vendor/css/fontawesome.all.min.css',
  './vendor/css/leaflet.css',
  './vendor/css/fullcalendar.min.css',
  './vendor/css/bpmn-js.css',
  './vendor/css/jquery.dataTables.min.css',

  // Vendor JS Libraries
  './vendor/js/jquery.min.js',
  './vendor/js/leaflet.js',
  './vendor/js/highcharts.js',
  './vendor/js/highcharts-more.js',
  './vendor/js/exporting.js',
  './vendor/js/fullcalendar.min.js',
  './vendor/js/bpmn-navigated-viewer.js',
  './vendor/js/jquery.dataTables.min.js',
  './vendor/js/three.min.js',

  // Application Logic
  './js/mock-data.js',
  './js/state.js',
  './js/signalr-mock.js',
  './js/hierarchy.js',
  './js/viewport-manager.js',
  './js/entity-tools.js',
  './js/component-studio.js',
  './js/portfolio.js',
  './js/app.js',

  // Component Modules
  './components/highcharts-component.js',
  './components/fullcalendar-component.js',
  './components/openmap-component.js',
  './components/bpmn-component.js',
  './components/jqtable-component.js',
  './components/kanban-gantt-component.js',
  './components/entity-tools-component.js',
  './components/spatial3d-component.js',

  // Assets
  './assets/mohammad-hijazi.png',
  './assets/Untitled.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('SW install: some assets failed to cache:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkResponse;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
