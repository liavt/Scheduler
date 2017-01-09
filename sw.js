var CACHE_NAME = "v1";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        "index.html",
        "favicon.ico",
        "manifest.json",
        "src/client/styles/Reset.css",
        "src/client/styles/Stylesheet.css",
        "res/",
        "src/client/js/Initialization.js",
        "src/client/js/Scripts.js",
        "src/client/js/Themes.js",
        "src/client/js/ViewManager.js"
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key != CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});