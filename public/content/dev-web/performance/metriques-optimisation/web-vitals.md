# Web Vitals

Maîtrisez les **Core Web Vitals**, les métriques clés de performance web définies par Google pour mesurer l'expérience utilisateur.

---

## Les 3 Core Web Vitals

### 1. LCP (Largest Contentful Paint)

**Mesure** : Temps de chargement du plus grand élément visible.

**Seuil** :
- ✅ **Bon** : < 2,5 secondes
- ⚠️ **À améliorer** : 2,5 - 4 secondes
- ❌ **Mauvais** : > 4 secondes

**Éléments mesurés** :
- Images `<img>`
- Vidéos `<video>`
- Blocs avec image de fond
- Blocs de texte

### 2. FID (First Input Delay)

**Mesure** : Délai avant la première interaction (clic, tap).

**Seuil** :
- ✅ **Bon** : < 100 ms
- ⚠️ **À améliorer** : 100 - 300 ms
- ❌ **Mauvais** : > 300 ms

**Remplacé par INP** (Interaction to Next Paint) depuis 2024.

### 3. CLS (Cumulative Layout Shift)

**Mesure** : Stabilité visuelle (déplacements inattendus).

**Seuil** :
- ✅ **Bon** : < 0,1
- ⚠️ **À améliorer** : 0,1 - 0,25
- ❌ **Mauvais** : > 0,25

---

## Mesurer les Web Vitals

### Avec l'API native

```javascript
// LCP
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// FID
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  
  entries.forEach((entry) => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
}).observe({ type: 'first-input', buffered: true });

// CLS
let clsValue = 0;

new PerformanceObserver((list) => {
  const entries = list.getEntries();
  
  entries.forEach((entry) => {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      console.log('CLS:', clsValue);
    }
  });
}).observe({ type: 'layout-shift', buffered: true });
```

### Avec la bibliothèque web-vitals

#### Installation

```bash
npm install web-vitals
```

#### Utilisation

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  console.log(`${name}:`, value);
  
  // Envoyer à Google Analytics
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(value),
    event_label: id,
    non_interaction: true
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics); // First Contentful Paint
getTTFB(sendToAnalytics); // Time to First Byte
```

---

## Optimiser LCP (Largest Contentful Paint)

### 1. Précharger les images critiques

```html
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">
```

### 2. Optimiser les images

```html
<!-- Format WebP/AVIF -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
</picture>

<!-- Responsive avec srcset -->
<img
  srcset="/hero-400w.jpg 400w, /hero-800w.jpg 800w, /hero-1200w.jpg 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  src="/hero-800w.jpg"
  alt="Hero"
  loading="eager"
/>
```

### 3. Réduire le temps serveur (TTFB)

```javascript
// Next.js : SSR ou SSG
export async function getServerSideProps() {
  const data = await fetch('https://api.example.com/data');
  
  return {
    props: { data }
  };
}

// CDN avec cache
Cache-Control: public, max-age=31536000, immutable
```

### 4. Éliminer les render-blocking resources

```html
<!-- Déférer les scripts non critiques -->
<script src="/app.js" defer></script>

<!-- CSS critique inline -->
<style>
  /* CSS critique pour le above-the-fold */
  body { margin: 0; font-family: sans-serif; }
  .hero { height: 100vh; }
</style>

<!-- CSS non critique avec media -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
```

### 5. Lazy load les ressources non critiques

```html
<!-- Images hors du viewport -->
<img src="/image.jpg" loading="lazy" alt="Image">

<!-- Iframes -->
<iframe src="https://youtube.com/embed/..." loading="lazy"></iframe>
```

---

## Optimiser FID / INP (Interactivité)

### 1. Réduire le JavaScript

```javascript
// Code splitting avec dynamic import
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Utilisation
<Suspense fallback={<Loader />}>
  <HeavyComponent />
</Suspense>
```

### 2. Utiliser Web Workers

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const result = expensiveCalculation(e.data);
  self.postMessage(result);
});

// main.js
const worker = new Worker('/worker.js');

worker.postMessage({ data: 'heavy task' });

worker.addEventListener('message', (e) => {
  console.log('Résultat:', e.data);
});
```

### 3. Debounce / Throttle

```javascript
// Debounce (attendre la fin des événements)
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));

// Throttle (limiter la fréquence)
function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const handleScroll = throttle(() => {
  console.log('Scroll');
}, 100);

window.addEventListener('scroll', handleScroll);
```

### 4. requestIdleCallback

```javascript
function heavyTask() {
  // Tâche lourde
  for (let i = 0; i < 1000000; i++) {
    // ...
  }
}

// Exécuter pendant les temps morts
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0) {
    heavyTask();
  }
});
```

---

## Optimiser CLS (Cumulative Layout Shift)

### 1. Réserver l'espace pour les images

```html
<!-- Avec aspect-ratio -->
<img
  src="/image.jpg"
  alt="Image"
  width="800"
  height="600"
  style="aspect-ratio: 800 / 600; width: 100%; height: auto;"
>

<!-- Avec padding-top -->
<div style="position: relative; padding-top: 75%; /* 600/800 = 0.75 */">
  <img
    src="/image.jpg"
    alt="Image"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  >
</div>
```

### 2. Fonts avec font-display

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap; /* Affiche le fallback puis swap */
}
```

### 3. Éviter les insertions dynamiques

```javascript
// ❌ Mauvais : Insertion sans réservation d'espace
document.body.innerHTML += '<div>Nouveau contenu</div>';

// ✅ Bon : Réserver l'espace
<div class="banner" style="min-height: 100px;">
  <!-- Bannière chargée dynamiquement -->
</div>
```

### 4. Animations avec transform

```css
/* ❌ Mauvais : Provoque des reflows */
.element {
  animation: move 1s;
}

@keyframes move {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ Bon : GPU-accelerated */
.element {
  animation: move 1s;
}

@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

---

## Dashboard de monitoring

```javascript
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }
  
  handleMetric({ name, value, id }) {
    this.metrics[name] = { value, id };
    
    this.updateUI(name, value);
    this.sendToAnalytics(name, value, id);
  }
  
  updateUI(name, value) {
    const element = document.getElementById(`metric-${name}`);
    if (!element) return;
    
    element.textContent = this.formatValue(name, value);
    element.className = this.getClassForMetric(name, value);
  }
  
  formatValue(name, value) {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)} ms`;
  }
  
  getClassForMetric(name, value) {
    const thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 }
    };
    
    const threshold = thresholds[name];
    
    if (value <= threshold.good) {
      return 'metric-good';
    } else if (value <= threshold.needsImprovement) {
      return 'metric-needs-improvement';
    } else {
      return 'metric-poor';
    }
  }
  
  sendToAnalytics(name, value, id) {
    if (typeof gtag === 'function') {
      gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        event_label: id,
        non_interaction: true
      });
    }
    
    // Ou vers votre API
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, id, url: window.location.href })
    });
  }
  
  getReport() {
    return this.metrics;
  }
}

// Utilisation
const monitor = new PerformanceMonitor();

// Afficher le rapport
console.table(monitor.getReport());
```

### Interface HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Performance Monitor</title>
  <style>
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    
    .metric-card {
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    
    .metric-good { border-color: #0cce6b; background: #d4f8e8; }
    .metric-needs-improvement { border-color: #ffa400; background: #fff4e0; }
    .metric-poor { border-color: #ff4e42; background: #ffe0e0; }
    
    .metric-name {
      font-weight: bold;
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .metric-value {
      font-size: 32px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>📊 Performance Dashboard</h1>
  
  <div class="metrics">
    <div class="metric-card">
      <div class="metric-name">LCP</div>
      <div id="metric-LCP" class="metric-value">-</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-name">FID</div>
      <div id="metric-FID" class="metric-value">-</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-name">CLS</div>
      <div id="metric-CLS" class="metric-value">-</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-name">FCP</div>
      <div id="metric-FCP" class="metric-value">-</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-name">TTFB</div>
      <div id="metric-TTFB" class="metric-value">-</div>
    </div>
  </div>
  
  <script type="module">
    import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'https://unpkg.com/web-vitals@3?module';
    
    // Code du PerformanceMonitor ici
  </script>
</body>
</html>
```

---

## Outils d'analyse

### 1. Lighthouse (Chrome DevTools)

```bash
# CLI
npm install -g lighthouse

lighthouse https://example.com --view
```

### 2. PageSpeed Insights

https://pagespeed.web.dev/

### 3. Chrome User Experience Report (CrUX)

Données réelles des utilisateurs Chrome.

### 4. Web Vitals Extension

Extension Chrome pour voir les métriques en temps réel.

---

## Exercice pratique

Optimisez une page pour atteindre :
- ✅ LCP < 2,5s
- ✅ FID < 100ms
- ✅ CLS < 0,1

**Techniques à utiliser** :
- Préchargement des images critiques
- Code splitting
- Lazy loading
- Réservation d'espace pour images
- font-display: swap

**Bonus** : Score Lighthouse 100/100 !

---

**Prochaine étape** : [Optimisation JavaScript](./optimisation-js.md) pour du code ultra-rapide ! ⚡
