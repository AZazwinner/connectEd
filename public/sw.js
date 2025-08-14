// A version for our main app UI, JS, CSS, etc.
const APP_SHELL_CACHE = 'connected-classroom-shell-v7'; // Bump version for update

// A new, separate cache for our static API data (the curriculum)
const API_METADATA_CACHE = 'connected-classroom-api-metadata-v1';

// The list of core files to pre-cache when the app first loads
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
];

// --- INSTALL: Cache the core App Shell ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(cache => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// --- ACTIVATE: Clean up old caches ---
self.addEventListener('activate', event => {
  // Add our new cache name to the whitelist
  const cacheWhitelist = [APP_SHELL_CACHE, API_METADATA_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          console.log('Service Worker: Deleting old cache', cacheName);
          return caches.delete(cacheName);
        }
      })
    ))
  );
  return self.clients.claim();
});

// --- FETCH: The main event handler to intercept network requests ---
self.addEventListener('fetch', event => {
  // We only care about GET requests that use the http/https protocol.
  // This safely ignores requests from browser extensions, etc.
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // --- STRATEGY 1: Stale-While-Revalidate for the Math Curriculum ---
  // This gives us instant UI rendering while keeping data fresh.
  if (event.request.url.endsWith('/api/math/curriculum')) {
    event.respondWith(
      caches.open(API_METADATA_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Fetch from the network in the background to update our cache
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          // Return the cached version immediately if it exists, otherwise wait for the network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return; // End execution for this request type
  }
  
  // --- STRATEGY 2: Ignore the Dynamic Lesson API ---
  // Let the browser handle this directly. The frontend will manage offline fallback.
  if (event.request.url.includes('/api/math/lesson/')) {
    return; // Do nothing. Let the request pass through to the network.
  }

  // --- STRATEGY 3: Cache, then Network (for all other assets: UI, images, etc.) ---
  // This ensures the app works offline and new images get cached dynamically.
  event.respondWith(
    caches.open(APP_SHELL_CACHE).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // If we have it in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise, fetch it from the network
        return fetch(event.request).then(networkResponse => {
          // And add the new response to the cache for next time
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});