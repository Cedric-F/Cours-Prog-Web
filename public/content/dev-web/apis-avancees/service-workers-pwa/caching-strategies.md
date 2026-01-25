# Stratégies de Cache

Maîtrisez les **stratégies de cache avancées** pour optimiser les performances et gérer le mode offline intelligemment.

---

## Stratégies principales

### 1. Cache Only

Utilisé pour les **assets statiques** qui ne changent jamais.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
  );
});
```

**Cas d'usage** : Assets avec hash dans le nom (`app.a3f2b1.js`)

### 2. Network Only

Jamais mis en cache (requêtes dynamiques).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
  );
});
```

**Cas d'usage** : Analytics, POST requests

### 3. Cache First (Offline First)

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

**Cas d'usage** : Images, fonts, CSS, JS

### 4. Network First

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

**Cas d'usage** : API calls, données fraîches

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

**Cas d'usage** : News feeds, profils utilisateurs

---

## Stratégies par type de ressource

```javascript
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Navigation (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  }
  
  // Images
  else if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
  }
  
  // Fonts
  else if (url.pathname.endsWith('.woff2')) {
    event.respondWith(cacheFirst(request));
  }
  
  // API
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  }
  
  // Par défaut
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open('static-v1');
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('dynamic-v1');
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open('dynamic-v1');
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
}
```

---

## Cache avec expiration

```javascript
const CACHE_NAME = 'app-cache-v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);
      
      if (cached) {
        const cachedDate = new Date(cached.headers.get('sw-cached-date'));
        const now = new Date();
        
        // Si cache trop ancien, fetch
        if (now - cachedDate > CACHE_DURATION) {
          console.log('Cache expiré, fetch...');
          return fetchAndCache(event.request, cache);
        }
        
        return cached;
      }
      
      return fetchAndCache(event.request, cache);
    })
  );
});

async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  const clonedResponse = response.clone();
  
  // Ajouter la date de mise en cache
  const headers = new Headers(clonedResponse.headers);
  headers.append('sw-cached-date', new Date().toISOString());
  
  const modifiedResponse = new Response(clonedResponse.body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers
  });
  
  cache.put(request, modifiedResponse);
  return response;
}
```

---

## Limitation de la taille du cache

```javascript
const MAX_CACHE_SIZE = 50; // Maximum 50 entrées

async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Supprimer les plus anciennes
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxSize);
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-cache').then(async cache => {
      const response = await fetch(event.request);
      
      cache.put(event.request, response.clone());
      
      // Limiter la taille
      await limitCacheSize('dynamic-cache', MAX_CACHE_SIZE);
      
      return response;
    })
  );
});
```

---

## Workbox (bibliothèque Google)

### Installation

```bash
npm install workbox-webpack-plugin --save-dev
```

### Configuration webpack

```javascript
// webpack.config.js
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
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
      })
    ]
  })
);

// Autres : Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'assets'
  })
);
```

---

## Background Sync

Synchroniser les données quand la connexion revient.

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  const db = await openDB();
  const messages = await db.getAll('outbox');
  
  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(message)
      });
      
      await db.delete('outbox', message.id);
    } catch (error) {
      console.error('Erreur sync:', error);
    }
  }
}

// app.js
async function sendMessage(message) {
  if (navigator.onLine) {
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  } else {
    // Sauvegarder en local
    const db = await openDB();
    await db.add('outbox', message);
    
    // Enregistrer sync
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-messages');
  }
}
```

---

## Cache API avancé

### Cloner les réponses

```javascript
const response = await fetch(request);
const cache = await caches.open('my-cache');

// IMPORTANT : Clone avant de mettre en cache
cache.put(request, response.clone());

return response;
```

### Requêtes avec query params

```javascript
// Ignorer les query params pour le cache
function getCacheKey(request) {
  const url = new URL(request.url);
  url.search = ''; // Supprimer ?param=value
  return url.toString();
}

self.addEventListener('fetch', (event) => {
  const cacheKey = getCacheKey(event.request);
  
  event.respondWith(
    caches.match(cacheKey).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
```

---

## Précaching

Mettre en cache au moment de l'installation.

```javascript
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/logo.png',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('precache-v1').then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});
```

---

## Exercice pratique

Créez une **app avec cache intelligent** :
- Cache First pour images
- Network First pour API
- Stale While Revalidate pour pages
- Expiration après 7 jours
- Limite de 50 entrées
- Background Sync pour formulaires

**Bonus** : Utilisez Workbox !

---

**Prochaine étape** : [PWA & Manifest](./pwa-manifest.md) pour une vraie PWA ! 📱
