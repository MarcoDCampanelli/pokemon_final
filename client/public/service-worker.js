// This is used in order to make the app a PWA

// This will cache the information
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open("static")).then((cache) => {
    return cache.addAll([
      "./",
      "./assets/pokeball192.png",
      "./assets/pokeball512.png",
    ]);
  });
});

// This will fetch the info from the cache or online
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.map(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
