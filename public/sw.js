// SourceVerify - No service worker needed (client-side only app)
// This empty file prevents 404 errors from browser auto-requests
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
