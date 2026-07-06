// Minimal service worker: exists to satisfy PWA installability, on purpose
// does NOT cache anything. The app is a live dashboard talking to a live
// API on the same host - a caching layer here would mean debugging stale
// JS/API responses during development for zero real offline value (the
// data is useless without the server anyway). If offline support is ever
// wanted, replace this with a real strategy (e.g. Workbox) deliberately.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A fetch handler must exist for some install criteria; passthrough only.
self.addEventListener('fetch', () => {});
