# CORS : Comprendre et résoudre les erreurs

CORS (Cross-Origin Resource Sharing) est la source de nombreuses frustrations chez les développeurs. Comprenons comment ça fonctionne.

## Le problème

Vous avez ce code :

```javascript
fetch('https://api.exemple.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

Et vous obtenez cette erreur :

```
Access to fetch at 'https://api.exemple.com/data' from origin 
'http://localhost:3000' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## Qu'est-ce que l'origine (origin) ?

Une origine est définie par :
- **Protocole** : http ou https
- **Domaine** : exemple.com
- **Port** : 3000, 8080, etc.

### Même origine vs origine différente

| URL | Même origine que `http://localhost:3000` ? |
|-----|-------------------------------------------|
| `http://localhost:3000/api` | ✅ Oui |
| `http://localhost:3001` | ❌ Non (port différent) |
| `https://localhost:3000` | ❌ Non (protocole différent) |
| `http://127.0.0.1:3000` | ❌ Non (domaine différent !) |
| `http://api.localhost:3000` | ❌ Non (sous-domaine différent) |

---

## Same-Origin Policy

Pour des raisons de sécurité, les navigateurs bloquent par défaut les requêtes vers une origine différente.

### Pourquoi ?

Imaginez ce scénario sans cette protection :

1. Vous êtes connecté à votre banque (bank.com)
2. Vous visitez un site malveillant (evil.com)
3. Ce site fait : `fetch('https://bank.com/transfer?to=hacker&amount=1000')`
4. La requête part avec vos cookies de session !

La Same-Origin Policy empêche cela.

### Ce qui est autorisé sans CORS

- `<img src="...">` - Charger des images
- `<script src="...">` - Charger des scripts
- `<link href="...">` - Charger des CSS
- `<form action="...">` - Soumettre des formulaires
- `<iframe src="...">` - Intégrer des pages (avec restrictions)

### Ce qui nécessite CORS

- `fetch()` et `XMLHttpRequest`
- Polices web (`@font-face`)
- Textures WebGL
- Canvas avec `drawImage()`

---

## Comment fonctionne CORS

### Requêtes simples

Pour les requêtes GET/POST simples, le navigateur ajoute un header `Origin` :

```http
GET /data HTTP/1.1
Host: api.exemple.com
Origin: http://localhost:3000
```

Le serveur doit répondre avec :

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
```

Si ce header est absent ou différent → erreur CORS.

### Requêtes préalables (preflight)

Pour les requêtes "complexes", le navigateur envoie d'abord une requête OPTIONS :

```http
OPTIONS /data HTTP/1.1
Host: api.exemple.com
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Le serveur doit autoriser :

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Qu'est-ce qu'une requête "complexe" ?

Une requête déclenche un preflight si :
- Méthode autre que GET, HEAD, POST
- Headers personnalisés (Authorization, X-Custom-Header)
- Content-Type autre que `text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`

---

## Configurer CORS côté serveur

### Express.js

```javascript
import cors from 'cors';

// Option 1 : Autoriser toutes les origines (développement)
app.use(cors());

// Option 2 : Configuration spécifique
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Pour envoyer les cookies
}));

// Option 3 : Origines multiples
app.use(cors({
  origin: ['http://localhost:3000', 'https://monapp.com'],
}));

// Option 4 : Validation dynamique
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'https://monapp.com'];
    
    // Autoriser les requêtes sans origin (Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin non autorisée'));
    }
  }
}));
```

### Configuration manuelle

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Répondre immédiatement aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});
```

### Next.js API Routes

```javascript
// pages/api/data.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Votre logique
  res.json({ data: 'Hello' });
}
```

### Nginx

```nginx
server {
    location /api {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 86400;
            return 204;
        }
        
        proxy_pass http://backend;
    }
}
```

---

## Cookies et authentification

Pour envoyer des cookies cross-origin :

### Côté client

```javascript
fetch('https://api.exemple.com/data', {
  credentials: 'include' // Envoie les cookies
});

// Ou avec axios
axios.get('https://api.exemple.com/data', {
  withCredentials: true
});
```

### Côté serveur

```javascript
app.use(cors({
  origin: 'http://localhost:3000', // ⚠️ Pas '*' avec credentials
  credentials: true
}));
```

> ⚠️ **Important** : `Access-Control-Allow-Origin: *` ne fonctionne pas avec `credentials: true`. Vous devez spécifier l'origine exacte.

---

## Solutions de contournement

### 1. Proxy de développement (recommandé)

Configurez votre serveur de dev pour proxifier les requêtes :

#### Vite

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.exemple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

#### Next.js

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.exemple.com/:path*'
      }
    ];
  }
};
```

#### Create React App

```json
// package.json
{
  "proxy": "https://api.exemple.com"
}
```

### 2. Proxy CORS (développement uniquement)

```javascript
// ⚠️ NE PAS utiliser en production !
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
fetch(proxyUrl + 'https://api.exemple.com/data');
```

### 3. Extension navigateur (développement)

Des extensions comme "CORS Unblock" désactivent CORS localement.

> ⚠️ Ces solutions ne sont que pour le développement ! En production, configurez correctement le serveur.

---

## Débugger les erreurs CORS

### 1. Vérifiez l'onglet Network

Trouvez la requête échouée :
- Regardez si la requête OPTIONS a réussi
- Vérifiez les headers de réponse

### 2. Erreurs courantes

#### "No 'Access-Control-Allow-Origin' header"

Le serveur ne renvoie pas le header. Ajoutez-le !

#### "The value of the 'Access-Control-Allow-Origin' header must not be the wildcard"

Vous utilisez `*` avec `credentials: true`. Spécifiez l'origine exacte.

#### "Method X is not allowed"

Ajoutez la méthode dans `Access-Control-Allow-Methods`.

#### "Request header field X is not allowed"

Ajoutez le header dans `Access-Control-Allow-Headers`.

#### La requête fonctionne avec Postman mais pas dans le navigateur

CORS est une restriction du navigateur. Postman ne l'applique pas.

---

## Schéma récapitulatif

```
                       Navigateur
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  1. Requête depuis http://localhost:3000                      │
│     vers https://api.exemple.com                              │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  2. Le navigateur ajoute: Origin: http://localhost:3000       │
│     (Si complexe: envoie d'abord OPTIONS)                     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  3. Le serveur répond avec:                                   │
│     Access-Control-Allow-Origin: http://localhost:3000        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  4. Le navigateur vérifie le header                           │
│     ✅ Match → Requête autorisée                              │
│     ❌ Pas de match → Erreur CORS                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Checklist CORS

- [ ] Le serveur envoie `Access-Control-Allow-Origin` ?
- [ ] L'origine correspond exactement ?
- [ ] Les méthodes sont autorisées (`Access-Control-Allow-Methods`) ?
- [ ] Les headers sont autorisés (`Access-Control-Allow-Headers`) ?
- [ ] Pour les cookies : `credentials: true` côté client ET `Access-Control-Allow-Credentials: true` côté serveur ?
- [ ] Pas de `*` avec credentials ?
- [ ] La requête OPTIONS répond avec 200/204 ?

---

## Ressources

- [MDN - CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [web.dev - Cross-Origin Resource Sharing](https://web.dev/cross-origin-resource-sharing/)
