const CACHE_NAME = "investai-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/investai_multiuser.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
  // add your CSS/JS files here if they're separate files
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          // cache new requests as they come in (optional, keeps offline cache fresh)
          if (event.request.method === "GET" && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
      );
    })
  );
});
