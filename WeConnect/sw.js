var cacheName = 'connect-pwa';
var filesToCache = [
  '/',
  '/WeConnect/Pages/index.html',
  './Innovation_files/bootstrap.min.css',
'./Innovation_files/bootstrap-vue.min.css',
'./Innovation_files/custom.css',
'./Innovation_files/polyfill.min.js',
'./Innovation_files/vue@3.js',
'./Innovation_files/bootstrap-vue.min.js',
'./Innovation_files/vuetify.min.css',
'./Innovation_files/vuetify.min.js',
'./Innovation_files/vue-demi.js',
'./Innovation_files/core.js',
'./Innovation_files/validators.js',
'./Innovation_files/qrcode.vue.browser.min.js',
'./Components/master.js',
'./Components/Header.js',
'./Components/BodyCompoenet.js',
'./Components/footer.js',
'./Components/mainEnd.js',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});