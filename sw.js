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

  // Handler klik notifikasi
  sw.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          if (client.focus) client.focus();
          return client.navigate(targetUrl);
        }
        return clients.openWindow(targetUrl);
      })
    );
  });

  sw.addEventListener('fetch', function(event) {
    // Network-first: simple behavior (no offline cache by default)
    event.respondWith(fetch(event.request).catch(function() {
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }));
  });
})();
