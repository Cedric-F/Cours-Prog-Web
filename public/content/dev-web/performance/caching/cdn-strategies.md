# CDN Strategies

Maîtrisez les **Content Delivery Networks** pour distribuer vos assets mondialement avec une latence minimale.

---

## Qu'est-ce qu'un CDN ?

Un **CDN** (Content Delivery Network) est un réseau de serveurs distribués géographiquement qui sert vos assets depuis le serveur le plus proche de l'utilisateur.

### Avantages

✅ **Latence réduite** (serveur proche géographiquement)  
✅ **Bande passante économisée** (votre serveur déchargé)  
✅ **DDoS protection** (protection intégrée)  
✅ **Cache global** (ressources partagées)  
✅ **HTTPS gratuit** (SSL inclus)  
✅ **Compression** (Gzip/Brotli automatique)

### Principaux CDN

- **Cloudflare** : Gratuit, très performant
- **AWS CloudFront** : Intégration AWS
- **Fastly** : Edge computing avancé
- **Akamai** : Entreprise, très cher
- **Vercel** : Pour Next.js
- **Netlify** : Pour sites statiques

---

## Configuration Cloudflare

### 1. Ajouter un site

```
1. Créer un compte sur cloudflare.com
2. Ajouter votre domaine
3. Changer les nameservers DNS
```

### 2. Configuration DNS

```
Type  Name            Content               Proxy
A     example.com     192.0.2.1            ✅ Proxied
A     www             192.0.2.1            ✅ Proxied
CNAME cdn             example.com          ✅ Proxied
```

### 3. Cache Rules

```
Speed → Caching → Configuration

Cache Everything
Browser Cache TTL: 1 year
Edge Cache TTL: 1 month
```

### 4. Page Rules

```
example.com/static/*
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year

example.com/*.html
- Cache Level: Bypass
```

---

## AWS CloudFront

### Configuration

```javascript
// aws-cdk (Infrastructure as Code)
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';

const bucket = new s3.Bucket(this, 'AssetsBucket', {
  publicReadAccess: true,
  websiteIndexDocument: 'index.html'
});

const distribution = new cloudfront.Distribution(this, 'CDN', {
  defaultBehavior: {
    origin: new cloudfront.S3Origin(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    compress: true
  },
  
  // Cache behaviors
  additionalBehaviors: {
    '/static/*': {
      origin: new cloudfront.S3Origin(bucket),
      cachePolicy: new cloudfront.CachePolicy(this, 'StaticCache', {
        minTtl: Duration.days(365),
        maxTtl: Duration.days(365),
        defaultTtl: Duration.days(365)
      })
    },
    '/api/*': {
      origin: new cloudfront.HttpOrigin('api.example.com'),
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
    }
  }
});
```

---

## Stratégies de cache CDN

### 1. Assets statiques (immutables)

```
Cache-Control: public, max-age=31536000, immutable
CDN: Cache 1 an
```

**Fichiers** : JS, CSS, images avec hash

### 2. Images (changeantes)

```
Cache-Control: public, max-age=604800
CDN: Cache 7 jours
```

### 3. HTML (toujours frais)

```
Cache-Control: no-cache
CDN: Bypass ou très court (5 min)
```

### 4. API (données dynamiques)

```
Cache-Control: no-store
CDN: Bypass
```

---

## Invalidation de cache

### Cloudflare

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### AWS CloudFront

```bash
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### Vercel

```bash
vercel --prod
# Invalide automatiquement
```

---

## Edge Functions

### Cloudflare Workers

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Redirect www → non-www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
    return Response.redirect(url.toString(), 301);
  }
  
  // Ajouter headers de sécurité
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return newResponse;
}
```

### Vercel Edge Functions

```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: '/:path*'
};
```

---

## CDN pour différents assets

### Images

```html
<!-- CDN Cloudflare -->
<img src="https://cdn.example.com/images/hero.jpg" alt="Hero">

<!-- Avec transformations (Cloudflare Images) -->
<img src="https://example.com/cdn-cgi/image/width=800,quality=85/hero.jpg" alt="Hero">
```

### Fonts

```css
/* CDN Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

/* Self-hosted via CDN */
@font-face {
  font-family: 'Inter';
  src: url('https://cdn.example.com/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

### JavaScript

```html
<!-- CDN npm (jsDelivr) -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>

<!-- CDN unpkg -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
```

---

## Multi-CDN (Failover)

```javascript
// Charger jQuery avec fallback
<script src="https://cdn1.example.com/jquery.min.js"></script>
<script>
  if (typeof jQuery === 'undefined') {
    document.write('<script src="https://cdn2.example.com/jquery.min.js"><\/script>');
  }
</script>
<script>
  if (typeof jQuery === 'undefined') {
    document.write('<script src="/local/jquery.min.js"><\/script>');
  }
</script>
```

### Avec Service Worker

```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.url.includes('cdn1.example.com')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Fallback vers CDN2
        const fallbackUrl = request.url.replace('cdn1.example.com', 'cdn2.example.com');
        return fetch(fallbackUrl).catch(() => {
          // Fallback vers origin
          const originUrl = request.url.replace('https://cdn1.example.com', '');
          return fetch(originUrl);
        });
      })
    );
  }
});
```

---

## Image CDN avec transformations

### Cloudflare Images

```html
<!-- Redimensionnement -->
<img src="https://example.com/cdn-cgi/image/width=400/hero.jpg">

<!-- Format automatique (WebP/AVIF) -->
<img src="https://example.com/cdn-cgi/image/format=auto/hero.jpg">

<!-- Qualité -->
<img src="https://example.com/cdn-cgi/image/quality=85/hero.jpg">

<!-- Combiné -->
<img src="https://example.com/cdn-cgi/image/width=800,quality=85,format=auto/hero.jpg">
```

### Cloudinary

```html
<img src="https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/sample.jpg">
```

### imgix

```html
<img src="https://example.imgix.net/hero.jpg?w=800&auto=format,compress">
```

---

## Monitoring CDN

### Cloudflare Analytics

```
Analytics → Traffic
- Bandwidth saved
- Requests cached
- Cache hit rate
- Top countries
```

### AWS CloudFront Metrics

```javascript
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

new cloudwatch.Alarm(this, 'HighErrorRate', {
  metric: distribution.metricErrorRate(),
  threshold: 5,
  evaluationPeriods: 2
});
```

---

## Headers CDN

### Cloudflare

```
CF-Cache-Status: HIT | MISS | EXPIRED | BYPASS
CF-Ray: 123abc...
```

### AWS CloudFront

```
X-Cache: Hit from cloudfront
X-Amz-Cf-Pop: CDG50-C1
X-Amz-Cf-Id: abc123...
```

### Vérification

```bash
curl -I https://cdn.example.com/app.js

HTTP/2 200
cf-cache-status: HIT
cache-control: public, max-age=31536000, immutable
```

---

## Optimisations avancées

### 1. Preconnect au CDN

```html
<link rel="preconnect" href="https://cdn.example.com">
```

### 2. Subresource Integrity (SRI)

```html
<script
  src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>
```

### 3. HTTP/3 (QUIC)

```
# Cloudflare : Activé par défaut
# AWS CloudFront : Disponible (HTTP/3)
```

### 4. Early Hints (103)

```
Link: </style.css>; rel=preload; as=style
Link: </app.js>; rel=preload; as=script
Status: 103 Early Hints
```

---

## Bonnes pratiques

1. ✅ **Cache long** pour assets immutables (1 an)
2. ✅ **Invalidation** après déploiement
3. ✅ **Compression** Brotli activée
4. ✅ **HTTP/2 ou HTTP/3** activé
5. ✅ **HTTPS** obligatoire
6. ✅ **Preconnect** pour CDN externes
7. ✅ **SRI** pour scripts tiers
8. ✅ **Monitoring** du cache hit rate
9. ❌ Éviter de mettre API en CDN (sauf cache adapté)
10. ❌ Ne pas cacher HTML trop longtemps

---

## Architectures

### Architecture simple

```
User → CDN (Cloudflare) → Origin Server
```

### Architecture avec S3

```
User → CloudFront → S3 Bucket
```

### Architecture avec cache multiple

```
User → CDN → Varnish → Origin Server
```

### Architecture serverless

```
User → Vercel Edge → Next.js Serverless Functions
```

---

## Exercice pratique

Configurez un CDN pour votre site :
- Cloudflare ou AWS CloudFront
- Cache 1 an pour JS/CSS/images avec hash
- Cache 7 jours pour images sans hash
- Bypass pour HTML
- Headers de sécurité via Edge Function
- Invalidation automatique au déploiement

**Objectif** : 95%+ cache hit rate !

---

**Félicitations !** Vous avez terminé tous les chapitres APIs Avancées et Performance Web !

**Récapitulatif complet** :
- ✅ WebSockets (3 fichiers)
- ✅ Service Workers & PWA (3 fichiers)
- ✅ IndexedDB (3 fichiers)
- ✅ Web Vitals & Optimisation (3 fichiers)
- ✅ Chargement Ressources (3 fichiers)
- ✅ Caching (3 fichiers)