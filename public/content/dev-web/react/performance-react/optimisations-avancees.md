# Optimisations Avancées

Découvrez les **techniques avancées** pour maximiser les performances de vos applications React : **virtual scrolling**, **React Profiler**, **web workers** et plus encore.

---

## Virtual Scrolling

Affichez efficacement de **grandes listes** en ne rendant que les éléments visibles.

### Problème : Liste de 10,000 éléments

```jsx
// ❌ MAUVAIS : Render 10,000 éléments → navigateur lag
function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Solution : react-window

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window';

function ProductList({ products }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}          // Hauteur du conteneur
      itemCount={products.length}
      itemSize={100}        // Hauteur de chaque item
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Résultat** : Seulement ~10 éléments rendus (ceux visibles) au lieu de 10,000 !

### Avec hauteur variable

```jsx
import { VariableSizeList } from 'react-window';

function MessageList({ messages }) {
  const listRef = useRef();
  
  // Fonction pour calculer la hauteur de chaque message
  const getItemSize = (index) => {
    const message = messages[index];
    // Calculer la hauteur basée sur le contenu
    return message.text.length > 100 ? 150 : 80;
  };
  
  const Row = ({ index, style }) => (
    <div style={style}>
      <Message message={messages[index]} />
    </div>
  );
  
  return (
    <VariableSizeList
      height={600}
      itemCount={messages.length}
      itemSize={getItemSize}
      width="100%"
      ref={listRef}
    >
      {Row}
    </VariableSizeList>
  );
}
```

### react-virtualized (alternative)

```bash
npm install react-virtualized
```

```jsx
import { List, AutoSizer } from 'react-virtualized';

function ProductList({ products }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      <ProductCard product={products[index]} />
    </div>
  );
  
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          rowCount={products.length}
          rowHeight={100}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  );
}
```

---

## React Profiler

**React Profiler** mesure les performances de vos composants.

### API Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,                   // Identifiant du Profiler
  phase,                // "mount" ou "update"
  actualDuration,       // Temps de render (ms)
  baseDuration,         // Temps estimé sans mémo
  startTime,            // Timestamp début
  commitTime            // Timestamp commit
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

### Profiler pour plusieurs composants

```jsx
function App() {
  return (
    <div>
      <Profiler id="Header" onRender={onRenderCallback}>
        <Header />
      </Profiler>
      
      <Profiler id="ProductList" onRender={onRenderCallback}>
        <ProductList />
      </Profiler>
      
      <Profiler id="Cart" onRender={onRenderCallback}>
        <Cart />
      </Profiler>
    </div>
  );
}
```

### Logger les performances

```jsx
const performanceLog = [];

function onRenderCallback(id, phase, actualDuration) {
  performanceLog.push({
    id,
    phase,
    duration: actualDuration,
    timestamp: Date.now()
  });
  
  // Envoyer au serveur tous les 10 logs
  if (performanceLog.length >= 10) {
    fetch('/api/performance', {
      method: 'POST',
      body: JSON.stringify(performanceLog)
    });
    performanceLog.length = 0;
  }
}
```

### React DevTools Profiler

Dans le navigateur, ouvrez **React DevTools** > **Profiler** :

1. Cliquez sur le bouton **Record**
2. Interagissez avec votre app
3. Cliquez sur **Stop**
4. Analysez les résultats :
   - **Flamegraph** : Visualiser les composants lents
   - **Ranked** : Trier par durée
   - **Interactions** : Suivre les interactions utilisateur

---

## Web Workers

Déplacez les **calculs lourds** dans un thread séparé avec **Web Workers**.

### Créer un Worker

```js
// worker.js
self.addEventListener('message', (e) => {
  const { data } = e;
  
  // Calcul lourd
  const result = processData(data);
  
  // Envoyer le résultat
  self.postMessage(result);
});

function processData(data) {
  // Exemple : calcul de Fibonacci
  return data.map(n => fibonacci(n));
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Utiliser le Worker

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const processWithWorker = (data) => {
    setLoading(true);
    
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    
    worker.postMessage(data);
    
    worker.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
      worker.terminate();
    };
  };
  
  return (
    <div>
      <button onClick={() => processWithWorker([40, 41, 42])}>
        Calculer Fibonacci
      </button>
      
      {loading && <p>Calcul en cours...</p>}
      {result && <p>Résultat : {JSON.stringify(result)}</p>}
    </div>
  );
}
```

### Hook personnalisé pour Worker

```jsx
function useWorker(workerUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback((payload) => {
    setLoading(true);
    setError(null);
    
    const worker = new Worker(workerUrl);
    
    worker.postMessage(payload);
    
    worker.onmessage = (e) => {
      setData(e.data);
      setLoading(false);
      worker.terminate();
    };
    
    worker.onerror = (err) => {
      setError(err.message);
      setLoading(false);
      worker.terminate();
    };
  }, [workerUrl]);
  
  return { data, loading, error, execute };
}

// Usage
function App() {
  const { data, loading, execute } = useWorker(
    new URL('./worker.js', import.meta.url)
  );
  
  return (
    <div>
      <button onClick={() => execute([40, 41, 42])}>
        Calculer
      </button>
      
      {loading && <Spinner />}
      {data && <p>Résultat : {JSON.stringify(data)}</p>}
    </div>
  );
}
```

---

## Debounce et Throttle

Limitez la fréquence d'exécution des fonctions.

### Debounce : Attendre la fin

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Faire la recherche uniquement après 500ms d'inactivité
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher..."
    />
  );
}
```

### Throttle : Limiter la fréquence

```jsx
import { useRef, useEffect } from 'react';

function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}

// Usage
function ScrollTracker() {
  const handleScroll = () => {
    console.log('Scroll position:', window.scrollY);
  };
  
  const throttledScroll = useThrottle(handleScroll, 200);
  
  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [throttledScroll]);
  
  return <div>Scroll pour voir les logs (max 1 tous les 200ms)</div>;
}
```

---

## Intersection Observer

Chargez les éléments **à la demande** quand ils deviennent visibles.

### Hook useInView

```jsx
import { useState, useEffect, useRef } from 'react';

function useInView(options) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  
  return [ref, isInView];
}

// Usage : Lazy load images
function LazyImage({ src, alt }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [imageSrc, setImageSrc] = useState(null);
  
  useEffect(() => {
    if (isInView && !imageSrc) {
      setImageSrc(src);
    }
  }, [isInView, src, imageSrc]);
  
  return (
    <div ref={ref}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} />
      ) : (
        <div className="skeleton">Chargement...</div>
      )}
    </div>
  );
}
```

### Infinite scroll

```jsx
function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreRef, isInView] = useInView({ threshold: 0.1 });
  
  useEffect(() => {
    if (isInView && hasMore) {
      fetch(`/api/products?page=${page}`)
        .then(res => res.json())
        .then(data => {
          setItems(prev => [...prev, ...data]);
          setPage(prev => prev + 1);
          
          if (data.length === 0) {
            setHasMore(false);
          }
        });
    }
  }, [isInView, hasMore, page]);
  
  return (
    <div>
      {items.map(item => (
        <ProductCard key={item.id} product={item} />
      ))}
      
      {hasMore && (
        <div ref={loadMoreRef}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
```

---

## Request Animation Frame

Utilisez **requestAnimationFrame** pour les animations fluides.

```jsx
import { useEffect, useState, useRef } from 'react';

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const requestRef = useRef();
  const startTimeRef = useRef();
  
  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const duration = 2000;  // 2 secondes
    
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    
    setCount(Math.floor(target * easeOutQuad));
    
    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target]);
  
  return <h1>{count}</h1>;
}

// Usage
<AnimatedCounter target={1000} />
```

---

## Optimiser les images

### Lazy loading natif

```jsx
function OptimizedImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"  // Lazy load natif du navigateur
      decoding="async"  // Décodage asynchrone
    />
  );
}
```

### Responsive images

```jsx
function ResponsiveImage({ src, alt }) {
  return (
    <picture>
      <source
        srcSet={`${src}-small.webp`}
        type="image/webp"
        media="(max-width: 640px)"
      />
      <source
        srcSet={`${src}-medium.webp`}
        type="image/webp"
        media="(max-width: 1024px)"
      />
      <source
        srcSet={`${src}-large.webp`}
        type="image/webp"
      />
      <img src={`${src}.jpg`} alt={alt} loading="lazy" />
    </picture>
  );
}
```

---

## Memoïser les Context values

```jsx
// ❌ MAUVAIS : Nouvel objet à chaque render
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ BON : useMemo pour éviter les re-renders
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## Production build optimizations

### Variables d'environnement

```bash
# .env.production
REACT_APP_API_URL=https://api.production.com
REACT_APP_ENABLE_ANALYTICS=true
```

```jsx
if (process.env.NODE_ENV === 'production') {
  // Code uniquement en production
  console.log = () => {};  // Désactiver les logs
}
```

### Tree shaking

Importez uniquement ce dont vous avez besoin :

```jsx
// ❌ MAUVAIS : Import tout lodash
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ BON : Import uniquement debounce
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);
```

### Minification et compression

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Supprimer les console.log
        drop_debugger: true
      }
    }
  }
});
```

---

## Checklist d'optimisation

### ✅ Rendering
- [ ] React.memo pour composants coûteux
- [ ] useMemo pour calculs lourds
- [ ] useCallback pour fonctions passées en props
- [ ] Virtual scrolling pour grandes listes
- [ ] Éviter les re-renders inutiles

### ✅ Code Splitting
- [ ] Route-based splitting
- [ ] Lazy load des modals
- [ ] Preload des routes importantes
- [ ] Error Boundaries

### ✅ Data Fetching
- [ ] Cache avec React Query ou SWR
- [ ] Debounce pour recherche
- [ ] Infinite scroll au lieu de pagination
- [ ] Optimistic updates

### ✅ Images
- [ ] Lazy loading
- [ ] Responsive images (srcSet)
- [ ] Format WebP
- [ ] Compression

### ✅ Bundle
- [ ] Tree shaking
- [ ] Analyser le bundle
- [ ] Supprimer les dépendances inutiles
- [ ] Utiliser des alternatives légères

### ✅ Monitoring
- [ ] React Profiler
- [ ] Lighthouse
- [ ] Web Vitals (LCP, FID, CLS)
- [ ] Error tracking (Sentry)

---

## Outils de mesure

1. **Lighthouse** : Audit de performance
2. **React DevTools Profiler** : Profiler les composants
3. **Webpack Bundle Analyzer** : Analyser le bundle
4. **Chrome DevTools Performance** : Profiler le runtime
5. **Web Vitals** : Mesurer les Core Web Vitals

---

## Exercice pratique

Optimisez une **App Dashboard** avec :
- Virtual scrolling pour 10,000 lignes
- Web Worker pour calculs lourds
- Debounce pour recherche
- Lazy load des images
- Infinite scroll
- React Profiler pour mesurer

**Bonus** : Atteignez un score Lighthouse de 90+ !

---

**Prochaine étape** : Explorez [TypeScript](../../typescript/introduction.md) pour typer votre code !
