# Lazy Loading

Maîtrisez le **chargement paresseux** pour charger les ressources uniquement quand nécessaire et améliorer drastiquement les performances.

---

## Lazy Loading d'Images

### Natif avec `loading="lazy"`

```html
<!-- Chargé immédiatement (above the fold) -->
<img src="/hero.jpg" alt="Hero" loading="eager" fetchpriority="high">

<!-- Chargé quand proche du viewport -->
<img src="/image1.jpg" alt="Image 1" loading="lazy">
<img src="/image2.jpg" alt="Image 2" loading="lazy">
<img src="/image3.jpg" alt="Image 3" loading="lazy">
```

**Support** : 97% des navigateurs (Chrome 76+, Firefox 75+, Safari 15.4+)

### Avec Intersection Observer

```javascript
// Fallback pour navigateurs anciens
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
} else {
  // Fallback : Charger toutes les images
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
}
```

```html
<!-- HTML -->
<img data-src="/image.jpg" alt="Image" class="lazy">

<style>
  .lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy.loaded {
    opacity: 1;
  }
</style>
```

### Avec placeholder (LQIP - Low Quality Image Placeholder)

```html
<img
  src="/image-placeholder-10px.jpg"
  data-src="/image-full.jpg"
  alt="Image"
  class="lazy-blur"
>

<style>
  .lazy-blur {
    filter: blur(10px);
    transition: filter 0.3s;
  }
  
  .lazy-blur.loaded {
    filter: blur(0);
  }
</style>
```

### Classe utilitaire réutilisable

```javascript
class LazyLoader {
  constructor(selector = 'img[data-src]', options = {}) {
    this.selector = selector;
    this.options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
    
    this.init();
  }
  
  init() {
    const elements = document.querySelectorAll(this.selector);
    elements.forEach(el => this.observer.observe(el));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  loadElement(element) {
    if (element.tagName === 'IMG') {
      element.src = element.dataset.src;
      
      if (element.dataset.srcset) {
        element.srcset = element.dataset.srcset;
      }
      
      element.addEventListener('load', () => {
        element.classList.add('loaded');
      });
    } else if (element.tagName === 'IFRAME') {
      element.src = element.dataset.src;
    } else {
      // Background image
      element.style.backgroundImage = `url(${element.dataset.src})`;
      element.classList.add('loaded');
    }
  }
}

// Utilisation
const lazyLoader = new LazyLoader('img[data-src], iframe[data-src]', {
  rootMargin: '100px'
});
```

---

## Lazy Loading de Vidéos

### Vidéo avec poster

```html
<video
  poster="/video-poster.jpg"
  preload="none"
  controls
>
  <source data-src="/video.webm" type="video/webm">
  <source data-src="/video.mp4" type="video/mp4">
</video>

<script>
  const video = document.querySelector('video');
  
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach(source => {
          source.src = source.dataset.src;
        });
        video.load();
        videoObserver.unobserve(video);
      }
    });
  });
  
  videoObserver.observe(video);
</script>
```

### Autoplay lazy

```javascript
class LazyVideo {
  constructor(video) {
    this.video = video;
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.5 }
    );
    
    this.observer.observe(this.video);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.video.play();
      } else {
        this.video.pause();
      }
    });
  }
}

// Utilisation
document.querySelectorAll('video[autoplay]').forEach(video => {
  new LazyVideo(video);
});
```

---

## Lazy Loading d'Iframes

### YouTube avec façade

```html
<div class="youtube-facade" data-video-id="dQw4w9WgXcQ">
  <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Vidéo">
  <button class="play-button">▶️</button>
</div>

<style>
  .youtube-facade {
    position: relative;
    cursor: pointer;
    aspect-ratio: 16 / 9;
  }
  
  .youtube-facade img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 64px;
    background: rgba(0, 0, 0, 0.8);
    border: none;
    border-radius: 50%;
    padding: 20px 30px;
    cursor: pointer;
  }
</style>

<script>
  document.querySelectorAll('.youtube-facade').forEach(facade => {
    facade.addEventListener('click', () => {
      const videoId = facade.dataset.videoId;
      
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
      
      facade.innerHTML = '';
      facade.appendChild(iframe);
    });
  });
</script>
```

---

## Lazy Loading de Composants React

### React.lazy

```javascript
import { lazy, Suspense } from 'react';

// Chargement paresseux
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <div>
      <h1>Mon App</h1>
      
      <Suspense fallback={<div>Chargement...</div>}>
        <HeavyComponent />
      </Suspense>
      
      {isAdmin && (
        <Suspense fallback={<div>Chargement admin...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}
```

### Avec retry

```javascript
function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const LazyComponent = lazy(() =>
  retry(() => import('./Component'))
);
```

### Preload au survol

```javascript
import { lazy, Suspense, useState } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [show, setShow] = useState(false);
  
  const preload = () => {
    // Précharge le composant
    import('./HeavyComponent');
  };
  
  return (
    <div>
      <button
        onMouseEnter={preload}
        onClick={() => setShow(true)}
      >
        Afficher
      </button>
      
      {show && (
        <Suspense fallback={<div>Chargement...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Lazy Loading de Routes

### React Router

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Chargement de la page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Next.js (automatique)

```javascript
// pages/index.js
export default function Home() {
  return <h1>Home</h1>;
}

// pages/about.js (chargé seulement si on visite /about)
export default function About() {
  return <h1>About</h1>;
}
```

---

## Lazy Loading de Scripts

### Avec dynamic import

```javascript
// ❌ Chargé immédiatement
import analytics from 'analytics';

// ✅ Chargé à la demande
button.addEventListener('click', async () => {
  const { default: analytics } = await import('analytics');
  analytics.track('button_click');
});
```

### Script externe

```javascript
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Utilisation
document.getElementById('map-trigger').addEventListener('click', async () => {
  await loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_KEY');
  initMap();
});
```

---

## Lazy Loading de CSS

```javascript
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Charger le CSS d'un composant
button.addEventListener('click', async () => {
  await loadCSS('/modal.css');
  showModal();
});
```

---

## Stratégie de chargement intelligente

### Priorités

```html
<!-- Critique : eager + high priority -->
<img src="/hero.jpg" loading="eager" fetchpriority="high">

<!-- Important : eager + auto priority -->
<img src="/logo.jpg" loading="eager">

<!-- Secondaire : lazy + low priority -->
<img src="/banner.jpg" loading="lazy" fetchpriority="low">

<!-- Hors viewport : lazy -->
<img src="/footer.jpg" loading="lazy">
```

### Preload stratégique

```html
<head>
  <!-- Précharge l'image critique -->
  <link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">
  
  <!-- Précharge la font -->
  <link rel="preload" as="font" href="/fonts/inter.woff2" crossorigin>
  
  <!-- Précharge le CSS critique -->
  <link rel="preload" as="style" href="/critical.css">
</head>
```

---

## Exercice pratique

Créez une **galerie d'images lazy-loaded** avec :
- Lazy loading natif + fallback Intersection Observer
- Placeholder LQIP (Low Quality Image Placeholder)
- Transition smooth au chargement
- Preload au survol (optimisation)
- Responsive avec srcset
- Indicateur de progression

**Bonus** : Lazy load de vidéos YouTube avec façade cliquable !

---

**Prochaine étape** : [Code Splitting](./code-splitting) pour optimiser vos bundles JS !
