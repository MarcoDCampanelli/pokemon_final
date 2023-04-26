// This is used in order to make the app a PWA

// staticCacheName is given a version so that we can change the version should we ever change the site since the install event only happens once and won't include new changes
const staticCacheName = "site-static-v1";
const assets = [
  "./",
  "./assets/pokeball192.png",
  "./assets/pokeball512.png",
  "./assets/Banner.jpg",
  "./assets/crying pikachu.gif",
  "./assets/Pokeball.webp",
  "./assets/running pikahu.gif",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(staticCacheName)).then((cache) => {
    return cache.addAll(assets);
  });
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
