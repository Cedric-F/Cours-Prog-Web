# Service Worker Cache

Maîtrisez le **cache Service Worker** pour des applications offline-first performantes avec des stratégies avancées.

---

## Cache API

### Ouvrir un cache

```javascript
const cache = await caches.open('my-cache-v1');
```

### Ajouter des fichiers

```javascript
// Ajouter une URL
await cache.add('/app.js');

// Ajouter plusieurs URLs
await cache.addAll([
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/logo.png'
]);
```

### Récupérer depuis le cache

```javascript
const response = await cache.match('/app.js');

if (response) {
  console.log('✅ En cache');
} else {
  console.log('❌ Pas en cache');
}
```

### Mettre en cache une réponse

```javascript
const response = await fetch('/api/data');
await cache.put('/api/data', response.clone());
```

### Supprimer du cache

```javascript
await cache.delete('/old-file.js');
```

### Lister les entrées

```javascript
const requests = await cache.keys();
console.log('Fichiers en cache:', requests.length);
```

---

## Stratégies de cache

### 1. Cache First (Offline First)

Cache prioritaire, réseau en fallback.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open('dynamic-v1').then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```

**Cas d'usage** : Images, CSS, JS, fonts

### 2. Network First (Fresh Data)

Réseau prioritaire, cache en fallback.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open('dynamic-v1').then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

**Cas d'usage** : API, HTML, données dynamiques

### 3. Cache Only

Seulement le cache (pas de réseau).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
  );
});
```

**Cas d'usage** : Assets immutables précachés

### 4. Network Only

Seulement le réseau (pas de cache).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
  );
});
```

**Cas d'usage** : Analytics, POST requests

### 5. Stale While Revalidate

Cache immédiat, mise à jour en arrière-plan.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-v1').then(cache => {
      return cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        
        return cached || fetchPromise;
      });
    })
  );
});
```

**Cas d'usage** : News feeds, profils, données peu critiques

---

## Router avec stratégies

```javascript
// sw.js
const CACHE_NAME = 'app-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

// Installation : Précache assets statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activation : Nettoyer vieux caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch : Router avec stratégies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Navigation (HTML) : Network First
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  }
  
  // Images : Cache First
  else if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
  }
  
  // API : Network First avec timeout
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(request, 5000));
  }
  
  // Assets : Cache First
  else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirst(request));
  }
  
  // Par défaut : Stale While Revalidate
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Stratégies

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open(DYNAMIC_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function networkFirstWithTimeout(request, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  try {
    const response = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
}
```

---

## Workbox (Google)

### Installation

```bash
npm install workbox-webpack-plugin
```

### Webpack config

```javascript
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      
      // Précache
      include: [/\.html$/, /\.js$/, /\.css$/],
      
      // Runtime caching
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
            }
          }
        },
        {
          urlPattern: /^https:\/\/api\.example\.com/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 5 * 60 // 5 minutes
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        }
      ]
    })
  ]
};
```

### Service Worker avec Workbox

```javascript
// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// Précache
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Images : Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

// API : Network First
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 5 * 60
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// CSS/JS : Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'assets'
  })
);

// Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
        maxEntries: 30
      })
    ]
  })
);
```

---

## Gestion du cache

### Versionning

```javascript
const CACHE_VERSION = 'v2';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});
```

### Limitation de taille

```javascript
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-cache').then(async cache => {
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      
      await limitCacheSize('dynamic-cache', 50);
      
      return response;
    })
  );
});
```

### Expiration

```javascript
async function cleanExpiredCache(cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  for (const request of requests) {
    const response = await cache.match(request);
    const cachedDate = new Date(response.headers.get('date'));
    const now = new Date();
    
    if ((now - cachedDate) / 1000 > maxAge) {
      await cache.delete(request);
      console.log('Cache expiré:', request.url);
    }
  }
}

// Nettoyer toutes les heures
setInterval(() => {
  cleanExpiredCache('dynamic-cache', 7 * 24 * 60 * 60); // 7 jours
}, 60 * 60 * 1000);
```

---

## Background Sync

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const cache = await caches.open('pending-sync');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      await fetch(request);
      await cache.delete(request);
      console.log('✅ Sync réussi:', request.url);
    } catch (error) {
      console.error('❌ Sync échoué:', error);
    }
  }
}

// app.js
async function saveData(data) {
  if (navigator.onLine) {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } else {
    // Sauvegarder pour sync ultérieur
    const cache = await caches.open('pending-sync');
    const request = new Request('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    await cache.put(request, new Response());
    
    // Enregistrer sync
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-data');
  }
}
```

---

## Bonnes pratiques

1. ✅ **Versionner les caches** (app-cache-v1, v2...)
2. ✅ **Limiter la taille** (max 50-100 entrées)
3. ✅ **Expiration** des caches anciens
4. ✅ **Nettoyer** les vieux caches à l'activation
5. ✅ **Stratégies adaptées** selon le type de ressource
6. ✅ **Offline page** de qualité
7. ✅ **Background Sync** pour requêtes échouées

---

## Exercice pratique

Créez une PWA offline-first avec :
- Précache des assets statiques
- Cache First pour images
- Network First pour API avec timeout 5s
- Stale While Revalidate pour pages
- Limitation à 50 entrées par cache
- Background Sync pour formulaires

**Bonus** : Utilisez Workbox pour simplifier !

---

**Prochaine étape** : [CDN Strategies](./cdn-strategies.md) pour la distribution mondiale !
