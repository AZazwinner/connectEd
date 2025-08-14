// A version for our main app UI, JS, CSS, etc.
const APP_SHELL_CACHE = 'connected-classroom-shell-v8'; // Bump version for the update

// A separate cache for our static API data (the curriculum)
const API_METADATA_CACHE = 'connected-classroom-api-metadata-v1';

// The base URL of your live backend. This is the most important new variable.
const LIVE_API_BASE_URL = 'https://connected-backend-hssr.onrender.com/api';

// The list of core files to pre-cache when the app first loads
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  // Note: Add paths to any other critical static assets like landing page images
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
  // We only care about GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = event.request.url;

  // --- STRATEGY 1: Stale-While-Revalidate for the Math Curriculum ---
  // This gives us instant UI rendering while keeping data fresh.
  // FIX #1: We now check against the full, live URL.
  if (requestUrl === `${LIVE_API_BASE_URL}/math/curriculum`) {
    event.respondWith(
      caches.open(API_METADATA_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return; // End execution for this request type
  }
  
  // --- STRATEGY 2: Network Only for DYNAMIC API Calls ---
  // FIX #2: This is a new, crucial rule. We must explicitly ignore these endpoints.
  // If we cache them, the user will always get the same "random" questions.
  // We let them pass through to the network untouched so they are always fresh.
  if (requestUrl.startsWith(`${LIVE_API_BASE_URL}/math/lesson/`) || 
      requestUrl.startsWith(`${LIVE_API_BASE_URL}/math/bulk-lessons/`) || 
      requestUrl.startsWith(`${LIVE_API_BASE_URL}/math/placement-test/`)) {
    return; // Do nothing. Let the browser handle the network request directly.
  }

  // --- STRATEGY 3: Cache, then Network (for all other assets: UI, CSS, images, etc.) ---
  // This is the default behavior that makes the app shell work offline.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If we have it in the cache, return it immediately
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch it from the network
      return fetch(event.request).then(networkResponse => {
        // We only cache valid responses. This avoids caching errors.
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // IMPORTANT: We clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = networkResponse.clone();

        caches.open(APP_SHELL_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});