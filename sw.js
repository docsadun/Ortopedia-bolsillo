const CACHE = "odb-4d10dbed5b";
const FILES = ["./", "index.html", "manifest.webmanifest", "fonts/ibm-plex-sans-latin-400-normal.woff2", "fonts/ibm-plex-sans-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-600-normal.woff2", "fonts/ibm-plex-sans-latin-400-italic.woff2", "fonts/ibm-plex-sans-condensed-latin-400-normal.woff2", "fonts/ibm-plex-sans-condensed-latin-500-normal.woff2", "fonts/ibm-plex-sans-condensed-latin-600-normal.woff2", "fonts/spectral-latin-600-normal.woff2", "fonts/spectral-latin-700-normal.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});
self.addEventListener("message", e => { if (e.data === "activar") self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("odb-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const key = e.request.mode === "navigate" ? "index.html" : e.request;
  e.respondWith(caches.open(CACHE).then(c => c.match(key, {ignoreSearch: true}).then(hit => hit || fetch(e.request))));
});
