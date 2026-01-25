# Resource Hints

Maîtrisez les **resource hints** (dns-prefetch, preconnect, prefetch, preload) pour optimiser le chargement des ressources.

---

## Les 4 Resource Hints

### 1. dns-prefetch

**Résolution DNS en avance** pour domaines externes.

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://analytics.google.com">
```

**Gain** : ~20-120ms économisés sur la résolution DNS

**Cas d'usage** :
- APIs externes
- CDN
- Fonts Google
- Scripts analytics

### 2. preconnect

**Connexion complète établie** (DNS + TCP + TLS).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Gain** : ~100-500ms économisés (DNS + TCP handshake + TLS)

**Cas d'usage** :
- Ressources critiques externes
- Fonts
- API principale

**⚠️ Attention** : Max 4-6 preconnect (coûteux en ressources)

### 3. prefetch

**Précharge pour navigation future** (basse priorité).

```html
<link rel="prefetch" href="/page-suivante.html">
<link rel="prefetch" href="/assets/video.mp4">
<link rel="prefetch" as="script" href="/analytics.js">
```

**Cas d'usage** :
- Pages suivantes probables
- Ressources pour navigation future
- Assets non critiques

### 4. preload

**Précharge immédiate** (haute priorité).

```html
<link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/app.js" as="script">
```

**Cas d'usage** :
- Images critiques (hero, logo)
- Fonts
- CSS critique
- Scripts essentiels

---

## Comparaison

| Hint | Action | Priorité | Timing | Cas d'usage |
|------|--------|----------|--------|-------------|
| **dns-prefetch** | Résout DNS | Basse | En avance | Domaines externes |
| **preconnect** | DNS+TCP+TLS | Moyenne | En avance | Ressources critiques |
| **prefetch** | Télécharge | Très basse | Idle time | Navigation future |
| **preload** | Télécharge | Haute | Immédiat | Ressources critiques |

---

## dns-prefetch en détail

### Utilisation

```html
<head>
  <!-- Résolution DNS anticipée -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
</head>
```

### Dynamique avec JavaScript

```javascript
function dnsPrefetch(url) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// Précharger les DNS au chargement
window.addEventListener('load', () => {
  dnsPrefetch('https://api.example.com');
  dnsPrefetch('https://cdn.example.com');
});
```

---

## preconnect en détail

### Utilisation optimale

```html
<head>
  <!-- Connexion complète pour fonts (critique) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- API principale -->
  <link rel="preconnect" href="https://api.example.com">
</head>
```

### ⚠️ Limiter à 4-6 connexions

```html
<!-- ❌ Mauvais : Trop de preconnect -->
<link rel="preconnect" href="https://site1.com">
<link rel="preconnect" href="https://site2.com">
<link rel="preconnect" href="https://site3.com">
<link rel="preconnect" href="https://site4.com">
<link rel="preconnect" href="https://site5.com">
<link rel="preconnect" href="https://site6.com">
<link rel="preconnect" href="https://site7.com">
<link rel="preconnect" href="https://site8.com">

<!-- ✅ Bon : Seulement les critiques avec preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://api.example.com">

<!-- Autres avec dns-prefetch -->
<link rel="dns-prefetch" href="https://site3.com">
<link rel="dns-prefetch" href="https://site4.com">
```

---

## prefetch en détail

### Précharge de pages

```html
<head>
  <!-- Précharge la page suivante probable -->
  <link rel="prefetch" href="/blog">
  <link rel="prefetch" href="/contact">
</head>
```

### Précharge dynamique au survol

```javascript
const links = document.querySelectorAll('a');

links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    const href = link.getAttribute('href');
    
    // Créer prefetch
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = href;
    document.head.appendChild(prefetch);
  });
});
```

### Classe utilitaire

```javascript
class PrefetchManager {
  constructor() {
    this.prefetched = new Set();
  }
  
  prefetch(url, as = 'document') {
    if (this.prefetched.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
    
    this.prefetched.add(url);
    console.log(`✅ Prefetch: ${url}`);
  }
  
  prefetchOnHover(selector) {
    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener('mouseenter', () => {
        const href = element.getAttribute('href');
        if (href) this.prefetch(href);
      });
    });
  }
  
  prefetchOnVisible(selector) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href');
          if (href) this.prefetch(href);
          observer.unobserve(entry.target);
        }
      });
    });
    
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  }
}

// Utilisation
const prefetcher = new PrefetchManager();

// Prefetch au survol
prefetcher.prefetchOnHover('a[href^="/"]');

// Prefetch quand visible
prefetcher.prefetchOnVisible('.important-link');
```

---

## preload en détail

### Images critiques

```html
<!-- Précharge l'image hero -->
<link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">

<!-- Responsive -->
<link
  rel="preload"
  as="image"
  href="/hero-desktop.jpg"
  imagesrcset="/hero-mobile.jpg 400w, /hero-desktop.jpg 800w"
  imagesizes="(max-width: 600px) 400px, 800px"
>
```

### Fonts

```html
<!-- TOUJOURS avec crossorigin -->
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

### CSS et JS

```html
<!-- CSS critique -->
<link rel="preload" href="/critical.css" as="style">

<!-- JS essentiel -->
<link rel="preload" href="/app.js" as="script">
```

### Avec fetchpriority

```html
<!-- Haute priorité -->
<link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">

<!-- Basse priorité -->
<link rel="preload" href="/banner.jpg" as="image" fetchpriority="low">
```

---

## Stratégies combinées

### Google Fonts optimisé

```html
<head>
  <!-- 1. Préconnexion -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- 2. Précharge CSS -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
  
  <!-- 3. Load CSS -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  
  <!-- 4. Précharge font -->
  <link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

### API + Images

```html
<head>
  <!-- API -->
  <link rel="preconnect" href="https://api.example.com">
  
  <!-- Hero image -->
  <link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">
  
  <!-- CDN -->
  <link rel="dns-prefetch" href="https://cdn.example.com">
  
  <!-- Page suivante -->
  <link rel="prefetch" href="/about">
</head>
```

---

## modulepreload (ES Modules)

```html
<!-- Précharge un module ES -->
<link rel="modulepreload" href="/app.js">
<link rel="modulepreload" href="/utils.js">

<script type="module" src="/app.js"></script>
```

---

## Détection de support

```javascript
function supportsResourceHint(hint) {
  const link = document.createElement('link');
  return link.relList && link.relList.supports(hint);
}

console.log('dns-prefetch:', supportsResourceHint('dns-prefetch'));
console.log('preconnect:', supportsResourceHint('preconnect'));
console.log('prefetch:', supportsResourceHint('prefetch'));
console.log('preload:', supportsResourceHint('preload'));
```

---

## Bonnes pratiques

### ✅ À faire

1. **preconnect** pour fonts et API critique (max 4-6)
2. **preload** pour images hero et fonts
3. **dns-prefetch** pour domaines externes non critiques
4. **prefetch** pour pages suivantes probables
5. **fetchpriority="high"** sur images critiques
6. **crossorigin** sur fonts preload

### ❌ À éviter

1. Trop de preconnect (>6)
2. Preload de ressources non utilisées
3. Oublier crossorigin sur fonts
4. Prefetch de ressources critiques (utiliser preload)
5. dns-prefetch sur même domaine

---

## Mesurer l'impact

### Chrome DevTools

1. **Network** tab
2. Voir "Priority" column
3. "Initiator" montre les resource hints

### Lighthouse

Resource hints sont évalués dans :
- "Preload key requests"
- "Uses rel=preconnect"

---

## Exercice pratique

Optimisez une page avec resource hints :
- preconnect pour Google Fonts + API
- preload pour hero image + font principale
- dns-prefetch pour CDN + analytics
- prefetch pour pages suivantes au survol
- fetchpriority sur éléments critiques

**Objectif** : Réduire le LCP de 500ms grâce aux resource hints !

---

**Prochaine étape** : [HTTP Caching](../caching/http-caching.md) pour un cache navigateur optimal ! 💾
