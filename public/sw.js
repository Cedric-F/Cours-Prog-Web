const CACHE_NAME = 'prog-web-v2';
const CONTENT_CACHE_NAME = 'prog-web-content-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/glossaire',
];

// Pre-cache content files on demand
async function cacheAllContent() {
  try {
    // Fetch the structure to know all content files
    const structureResponse = await fetch('/api/structure');
    if (!structureResponse.ok) return;
    
    const structure = await structureResponse.json();
    const contentUrls = [];
    
    // Extract all content file paths from structure
    structure.axes.forEach((axis) => {
      axis.chapters.forEach((chapter) => {
        chapter.sections.forEach((section) => {
          contentUrls.push(`/content/${section.file}`);
        });
      });
    });
    
    // Cache all content files
    const contentCache = await caches.open(CONTENT_CACHE_NAME);
    const cachePromises = contentUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await contentCache.put(url, response);
        }
      } catch (e) {
        console.log('Failed to cache:', url);
      }
    });
    
    await Promise.all(cachePromises);
    console.log('Service Worker: All content cached for offline use');
  } catch (error) {
    console.error('Error caching content:', error);
  }
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches and pre-cache content
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== CONTENT_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
      // Pre-cache all content
      cacheAllContent()
    ])
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests except structure
  if (event.request.url.includes('/api/') && !event.request.url.includes('/api/structure')) return;

  // For content files, use cache-first strategy
  if (event.request.url.includes('/content/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version and update in background
          fetch(event.request).then((response) => {
            if (response.ok) {
              caches.open(CONTENT_CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CONTENT_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // For other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If it's a navigation request, return the cached home page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          
          return new Response('Offline - Contenu non disponible', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
