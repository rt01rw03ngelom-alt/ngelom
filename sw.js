// Minimal service worker for PWA shell.

const CACHE_NAME = 'portal-rt-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './clouds.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handler untuk menerima sinyal "Push" dari server (Bekerja saat aplikasi ditutup)
self.addEventListener('push', (event) => {
  let data = {
    title: 'Portal RT Ngelom',
    body: 'Ada informasi terbaru untuk warga.',
    targetPage: ''
  };

  if (event.data) {
    try {
      data = event.data.json();
      if (data.payload) data = data.payload;
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || 'Ketuk untuk melihat informasi terbaru.',
    icon: 'https://drive.google.com/thumbnail?id=11fh_T74_ljF_WPq7EJddDvAuFFMpiRXz&sz=w128',
    badge: 'https://drive.google.com/thumbnail?id=11fh_T74_ljF_WPq7EJddDvAuFFMpiRXz&sz=w128',
    vibrate: [200, 100, 200], // Vibrasi lebih terasa
    timestamp: Date.now(),
    data: {
      targetPage: data.targetPage || '',
      url: self.location.origin + (data.targetPage ? '#' + data.targetPage : '')
    },
    tag: 'portal-rt-push',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Portal RT Ngelom', options)
  );
});

// Handler klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    })
  );
});
