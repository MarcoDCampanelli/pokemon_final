// This is used in order to make the app a PWA

// staticCacheName is given a version so that we can change the version should we ever change the site since the install event only happens once and won't include new changes
const staticCacheName = "site-static-v0";
const assets = [
  "./",
  "./assets/pokeball192.png",
  "./assets/pokeball512.png",
  "./assets/Banner.jpg",
  "./assets/cryingpikachu.gif",
  "./assets/Pokeball.webp",
  "./assets/runningpikachu.gif",
  "https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400&family=Poppins:ital,wght@0,400;0,700;1,400;1,600&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    (async function () {
      try {
        var res = await fetch(event.request);
        var cache = await caches.open("cache");
        cache.put(event.request.url, res.clone());
        return res;
      } catch (error) {
        return caches.match(event.request);
      }
    })()
  );
});
