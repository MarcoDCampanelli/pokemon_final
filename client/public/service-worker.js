// This is used in order to make the app a PWA

// staticCacheName is given a version so that we can change the version should we ever change the site since the install event only happens once and won't include new changes
const staticCacheName = "site-static-v0";
const assets = ["./", "./assets/pokeball192.png", "./assets/pokeball512.png"];
// this will hold the fetch requests dont after the initial cache
const dynamicCache = "site-dynamic-v1";

// This will cache the information
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(staticCacheName)).then((cache) => {
    return cache.addAll(assets);
  });
});

// This will fetch the info from the cache or online
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return (
        response ||
        fetch(e.request).then((fetchRes) => {
          return caches.open(dynamicCache).then((cache) => {
            cache.put(e.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
