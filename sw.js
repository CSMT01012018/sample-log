// Network first: always the latest version when online, cached copy only when offline.
const CACHE = "samplelog-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("dropbox")) return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" }).then(resp => {
      if (resp.ok) { const c = resp.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
      return resp;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
