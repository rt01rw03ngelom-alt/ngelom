// Minimal service worker for PWA shell.
// Note: Apps Script deployments may not support full SW scope/caching.
// Ensure SW context is available
// Avoid referencing `self` directly at parse-time (some runtimes may not define it).
(function() {
  var sw = (typeof self !== 'undefined') ? self : undefined;
  if (!sw) {
    // Not running inside a Service Worker context.
    return;
  }

  sw.addEventListener('install', function(event) {
    sw.skipWaiting();
  });

  sw.addEventListener('activate', function(event) {
    event.waitUntil(sw.clients.claim());
  });

  sw.addEventListener('fetch', function(event) {
    // Network-first: simple behavior (no offline cache by default)
    event.respondWith(fetch(event.request).catch(function() {
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }));
  });
})();



