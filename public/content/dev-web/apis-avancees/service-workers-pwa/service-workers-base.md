# Service Workers - Base

Découvrez les **Service Workers**, des scripts qui s'exécutent en arrière-plan pour intercepter les requêtes réseau et gérer le cache.

---

## Qu'est-ce qu'un Service Worker ?

Un **Service Worker** est un script JavaScript qui :
- S'exécute en **arrière-plan** (pas dans le thread principal)
- Agit comme un **proxy** entre votre app et le réseau
- Permet le **mode offline**
- Fonctionne uniquement en **HTTPS** (sauf localhost)

### Cycle de vie

```
Installation → Activation → Idle → Fetch/Message → Terminated
```

### Capacités

✅ **Intercepter les requêtes réseau**  
✅ **Gérer le cache**  
✅ **Notifications push**  
✅ **Background sync**  
✅ **Mode offline**  

---

## Enregistrer un Service Worker

### Vérifier le support

```javascript
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker supporté');
} else {
  console.log('❌ Service Worker non supporté');
}
```

### Enregistrement basique

```javascript
// app.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ SW enregistré:', registration);
      })
      .catch(error => {
        console.error('❌ Erreur enregistrement:', error);
      });
  });
}
```

### Service Worker minimal

```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';

// Installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  console.log('📡 Fetch:', event.request.url);
});
```

---

## Cycle de vie détaillé

### 1. Installation

```javascript
self.addEventListener('install', (event) => {
  console.log('Installation du Service Worker');
  
  event.waitUntil(
    caches.open('my-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/app.js',
        '/logo.png'
      ]);
    })
  );
  
  // Forcer l'activation immédiate
  self.skipWaiting();
});
```

### 2. Activation

```javascript
self.addEventListener('activate', (event) => {
  console.log('Activation du Service Worker');
  
  const cacheWhitelist = ['my-cache-v1'];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Prendre le contrôle immédiatement
  return self.clients.claim();
});
```

### 3. Fetch (interception)

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retourner depuis le cache si disponible
      if (response) {
        return response;
      }
      
      // Sinon, requête réseau
      return fetch(event.request);
    })
  );
});
```

---

## Stratégies de cache

### 1. Cache First (offline first)

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Retourner le cache si disponible
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Sinon fetch et mettre en cache
      return fetch(event.request).then(response => {
        return caches.open('my-cache-v1').then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```

### 2. Network First (données fraîches)

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache
        caches.open('my-cache-v1').then(cache => {
          cache.put(event.request, response.clone());
        });
        return response;
      })
      .catch(() => {
        // Si erreur réseau, utiliser le cache
        return caches.match(event.request);
      })
  );
});
```

### 3. Stale While Revalidate

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Mettre à jour le cache
        caches.open('my-cache-v1').then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      
      // Retourner cache immédiatement, fetch en arrière-plan
      return cachedResponse || fetchPromise;
    })
  );
});
```

---

## Mise à jour du Service Worker

### Détection de nouvelle version

```javascript
// app.js
navigator.serviceWorker.register('/sw.js').then(registration => {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Nouvelle version disponible
        if (confirm('Nouvelle version disponible. Recharger ?')) {
          window.location.reload();
        }
      }
    });
  });
});
```

### Forcer la mise à jour

```javascript
// sw.js
const VERSION = 'v2';

self.addEventListener('install', (event) => {
  console.log(`Installation ${VERSION}`);
  self.skipWaiting();  // Activer immédiatement
});

self.addEventListener('activate', (event) => {
  console.log(`Activation ${VERSION}`);
  
  event.waitUntil(
    // Supprimer les anciens caches
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== `cache-${VERSION}`)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});
```

---

## Communication bidirectionnelle

### Envoyer un message au SW

```javascript
// app.js
navigator.serviceWorker.controller.postMessage({
  type: 'CLEAR_CACHE'
});
```

### Recevoir dans le SW

```javascript
// sw.js
self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
    
    // Répondre
    event.ports[0].postMessage({ success: true });
  }
});
```

### Recevoir dans l'app

```javascript
// app.js
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Message du SW:', event.data);
});
```

---

## Gestion des erreurs

### Fallback pour requêtes échouées

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache la réponse
        caches.open('my-cache-v1').then(cache => {
          cache.put(event.request, response.clone());
        });
        return response;
      })
      .catch(() => {
        // Essayer le cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Fallback page offline
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Fallback image
          if (event.request.destination === 'image') {
            return caches.match('/fallback-image.png');
          }
        });
      })
  );
});
```

---

## Exemple complet : App offline-ready

### Structure de l'app

```
/
├── index.html
├── offline.html
├── app.js
├── sw.js
└── styles.css
```

### index.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Offline</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>App Offline-Ready</h1>
  
  <div id="status">
    <p>Statut: <span id="online-status">En ligne</span></p>
    <p>Service Worker: <span id="sw-status">Non enregistré</span></p>
  </div>
  
  <button id="clear-cache">Vider le cache</button>
  
  <script src="/app.js"></script>
</body>
</html>
```

### app.js

```javascript
// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ SW enregistré:', registration.scope);
      
      document.getElementById('sw-status').textContent = 'Enregistré';
      
      // Écouter les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (confirm('Nouvelle version disponible. Recharger ?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('❌ Erreur SW:', error);
      document.getElementById('sw-status').textContent = 'Erreur';
    }
  });
}

// Détection online/offline
window.addEventListener('online', () => {
  document.getElementById('online-status').textContent = 'En ligne';
  document.getElementById('online-status').style.color = 'green';
});

window.addEventListener('offline', () => {
  document.getElementById('online-status').textContent = 'Hors ligne';
  document.getElementById('online-status').style.color = 'red';
});

// Vider le cache
document.getElementById('clear-cache').addEventListener('click', async () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHE'
    });
    
    alert('Cache vidé !');
  }
});
```

### sw.js

```javascript
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/app.js',
  '/styles.css'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Mise en cache des fichiers');
      return cache.addAll(urlsToCache);
    }).then(() => {
      console.log('[SW] Installation terminée');
      return self.skipWaiting();
    })
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation terminée');
      return self.clients.claim();
    })
  );
});

// Fetch (stratégie Network First avec fallback)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone pour mettre en cache
        const responseClone = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Fallback au cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Page offline pour navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Messages
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache vidé');
    });
  }
});
```

---

## Debugging

### Chrome DevTools

1. Ouvrir **DevTools** > **Application** > **Service Workers**
2. Voir le statut, l'URL source, la portée
3. Options :
   - **Update** : Forcer la mise à jour
   - **Unregister** : Désenregistrer
   - **Bypass for network** : Désactiver temporairement

### Console logs

```javascript
// sw.js
console.log('[SW] Message de debug');

// Voir dans DevTools > Console > Filter > Service Workers
```

---

## Bonnes pratiques

1. ✅ **Toujours HTTPS** (sauf localhost)
2. ✅ **skipWaiting() avec précaution** (peut casser l'app en cours)
3. ✅ **Versioning du cache** (CACHE_NAME = 'v1', 'v2'...)
4. ✅ **Nettoyer les anciens caches** lors de l'activation
5. ✅ **Page offline** pour meilleure UX
6. ✅ **Tester en mode offline** (DevTools > Network > Offline)
7. ❌ **Pas de cache pour les API** (sauf stratégie spécifique)

---

## Exercice pratique

Créez une **app offline-first** avec :
- Service Worker avec cache
- Page offline
- Indicateur online/offline
- Bouton pour vider le cache
- Stratégie Network First

**Bonus** : Ajoutez une notification quand nouvelle version disponible !

---

**Prochaine étape** : [Stratégies de Cache](./caching-strategies.md) pour optimiser ! ⚡
