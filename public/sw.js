self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    return self.clients.claim();
});

self.addEventListener('fetch', () => {
    // Empty fetch listener to satisfy PWA requirements but do nothing
});
