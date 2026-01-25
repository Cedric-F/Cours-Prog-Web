# HTTP Caching

Maîtrisez le **cache HTTP** avec les en-têtes Cache-Control, ETag, et les stratégies de mise en cache pour des performances optimales.

---

## Pourquoi le cache ?

**Sans cache** :
- ❌ Requête à chaque visite
- ❌ Bande passante gaspillée
- ❌ Serveur surchargé
- ❌ Latence élevée

**Avec cache** :
- ✅ Ressources servies localement
- ✅ Économie de bande passante (90%+)
- ✅ Serveur déchargé
- ✅ Chargement instantané

---

## Cache-Control

### Syntaxe

```
Cache-Control: <directive>, <directive>, ...
```

### Directives principales

| Directive | Description | Exemple |
|-----------|-------------|---------|
| `public` | Cache partagé OK | `public` |
| `private` | Cache navigateur uniquement | `private` |
| `no-cache` | Validation requise | `no-cache` |
| `no-store` | Jamais mis en cache | `no-store` |
| `max-age=<seconds>` | Durée de validité | `max-age=31536000` |
| `s-maxage=<seconds>` | Durée pour CDN | `s-maxage=86400` |
| `immutable` | Ne jamais revalider | `immutable` |
| `must-revalidate` | Revalider si expiré | `must-revalidate` |

---

## Stratégies de cache

### 1. Assets immutables (avec hash)

```
Cache-Control: public, max-age=31536000, immutable
```

**Utilisation** : Fichiers avec hash dans le nom
- `app.a3f2b1.js`
- `styles.9d4e2c.css`
- `logo.f8a7b3.png`

**Durée** : 1 an (31536000 secondes)

### 2. HTML (toujours frais)

```
Cache-Control: no-cache
```

ou

```
Cache-Control: max-age=0, must-revalidate
```

**Utilisation** : Pages HTML, API responses

### 3. Assets versionnés

```
Cache-Control: public, max-age=604800
```

**Utilisation** : Assets sans hash (7 jours)

### 4. Données privées

```
Cache-Control: private, max-age=3600
```

**Utilisation** : Données utilisateur (1 heure)

### 5. Pas de cache

```
Cache-Control: no-store
```

**Utilisation** : Données sensibles, tokens

---

## Configuration serveur

### Nginx

```nginx
# nginx.conf
server {
  # Assets immutables
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  
  # HTML
  location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache";
  }
  
  # API
  location /api/ {
    add_header Cache-Control "no-store";
  }
}
```

### Apache

```apache
# .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Assets immutables
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # HTML
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
  # Immutable pour fichiers avec hash
  <FilesMatch "\.[a-f0-9]{8}\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

### Express.js

```javascript
const express = require('express');
const app = express();

// Assets statiques avec cache
app.use('/static', express.static('public', {
  maxAge: '1y',
  immutable: true
}));

// HTML sans cache
app.get('*.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, req.path));
});

// API sans cache
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
```

### Next.js

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store'
          }
        ]
      }
    ];
  }
};
```

---

## ETag (Entity Tag)

### Qu'est-ce qu'un ETag ?

Identifiant unique basé sur le contenu du fichier.

```
ETag: "5d8c72a5edda8d1f"
```

### Fonctionnement

1. **Première requête** :
   ```
   GET /app.js
   
   Response:
   ETag: "abc123"
   Cache-Control: max-age=0, must-revalidate
   ```

2. **Requête suivante** :
   ```
   GET /app.js
   If-None-Match: "abc123"
   
   Response (si non modifié):
   304 Not Modified
   ```

### Configuration

```nginx
# Nginx (activé par défaut)
etag on;
```

```javascript
// Express.js (activé par défaut)
app.use(express.static('public', {
  etag: true
}));
```

---

## Last-Modified

### Fonctionnement

1. **Première requête** :
   ```
   GET /app.js
   
   Response:
   Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
   ```

2. **Requête suivante** :
   ```
   GET /app.js
   If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
   
   Response (si non modifié):
   304 Not Modified
   ```

---

## Vary

Indique que la réponse varie selon certains headers.

```
Vary: Accept-Encoding
```

**Utilisation** :
- Compression (gzip/brotli)
- Accept-Language
- User-Agent (mobile/desktop)

```nginx
add_header Vary "Accept-Encoding";
```

---

## Stale-While-Revalidate

Cache stale utilisé pendant revalidation.

```
Cache-Control: max-age=3600, stale-while-revalidate=86400
```

**Fonctionnement** :
1. Cache valide pendant 1h
2. Entre 1h et 25h : Servir cache + revalider en arrière-plan
3. Après 25h : Attendre la revalidation

---

## Clear Site Data

Vider le cache programmatiquement.

```javascript
// Côté serveur
res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
```

**Directives** :
- `"cache"` : Vide le cache HTTP
- `"cookies"` : Supprime les cookies
- `"storage"` : Vide localStorage/sessionStorage
- `"*"` : Tout vider

---

## Stratégie complète

### Structure de fichiers

```
dist/
├── index.html (no-cache)
├── static/
│   ├── js/
│   │   ├── main.a3f2b1.js (1 an, immutable)
│   │   └── vendor.9d4e2c.js (1 an, immutable)
│   ├── css/
│   │   └── styles.f8a7b3.css (1 an, immutable)
│   └── images/
│       ├── logo.png (1 an)
│       └── hero.jpg (1 an)
```

### Configuration complète

```nginx
server {
  # HTML : Toujours frais
  location = /index.html {
    add_header Cache-Control "no-cache";
    etag on;
  }
  
  # Assets avec hash : Immutables
  location ~* \.[a-f0-9]{8}\.(js|css)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    gzip_static on;
  }
  
  # Images : 1 an
  location ~* \.(png|jpg|jpeg|gif|webp|avif|svg)$ {
    add_header Cache-Control "public, max-age=31536000";
  }
  
  # Fonts : 1 an, crossorigin
  location ~* \.(woff2|woff|ttf|eot)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Access-Control-Allow-Origin "*";
  }
  
  # API : Jamais en cache
  location /api/ {
    add_header Cache-Control "no-store";
  }
}
```

---

## Service Worker + HTTP Cache

```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Respecter les headers HTTP Cache
  event.respondWith(
    caches.match(request).then(cached => {
      // Si en cache et valide, utiliser
      if (cached && !isExpired(cached)) {
        return cached;
      }
      
      // Sinon, fetch
      return fetch(request).then(response => {
        // Cache selon Cache-Control
        const cacheControl = response.headers.get('Cache-Control');
        
        if (cacheControl && !cacheControl.includes('no-store')) {
          caches.open('http-cache').then(cache => {
            cache.put(request, response.clone());
          });
        }
        
        return response;
      });
    })
  );
});

function isExpired(response) {
  const cacheControl = response.headers.get('Cache-Control');
  if (!cacheControl) return true;
  
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  if (!maxAgeMatch) return true;
  
  const maxAge = parseInt(maxAgeMatch[1]);
  const date = new Date(response.headers.get('Date'));
  const now = new Date();
  
  return (now - date) / 1000 > maxAge;
}
```

---

## Debugging

### Chrome DevTools

1. **Network** tab
2. Colonne **Size** :
   - `(disk cache)` : Cache disque
   - `(memory cache)` : Cache mémoire
   - `304 Not Modified` : Revalidé

3. **Disable cache** : Pendant debug

### Headers à vérifier

```bash
curl -I https://example.com/app.js

HTTP/2 200
cache-control: public, max-age=31536000, immutable
etag: "abc123"
last-modified: Wed, 21 Oct 2023 07:28:00 GMT
```

---

## Bonnes pratiques

1. ✅ **Assets immutables** : `max-age=31536000, immutable`
2. ✅ **HTML** : `no-cache` avec ETag
3. ✅ **Fonts** : 1 an + CORS
4. ✅ **Images** : 1 an
5. ✅ **API** : `no-store` ou courte durée
6. ✅ **Vary** : Pour compression
7. ✅ **ETag** : Pour validation
8. ❌ Éviter `Expires` (obsolète, utiliser `max-age`)

---

## Exercice pratique

Configurez le cache HTTP pour :
- HTML : no-cache avec ETag
- JS/CSS avec hash : 1 an immutable
- Images : 1 an
- Fonts : 1 an avec CORS
- API : no-store

**Bonus** : Vérifier avec curl et DevTools !

---

**Prochaine étape** : [Service Worker Cache](./service-worker-cache.md) pour le cache avancé ! 💾
