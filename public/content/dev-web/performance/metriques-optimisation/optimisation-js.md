# Optimisation JavaScript

Maîtrisez les **techniques d'optimisation JavaScript** pour des applications ultra-rapides et performantes.

---

## Minification et Uglification

### Webpack avec Terser

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Supprimer console.log
            drop_debugger: true
          }
        }
      })
    ]
  }
};
```

### Résultat

```javascript
// Avant (15 KB)
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// Après minification (3 KB)
function calculateTotal(t){let e=0;for(let l=0;l<t.length;l++)e+=t[l].price*t[l].quantity;return e}
```

---

## Tree Shaking (suppression du code mort)

### Configuration Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true, // Tree shaking
    sideEffects: false
  }
};
```

### Dans package.json

```json
{
  "sideEffects": false
}
```

### Imports nommés (ES6)

```javascript
// ❌ Mauvais : Importe tout
import _ from 'lodash';
_.map([1, 2, 3], n => n * 2);

// ✅ Bon : Importe seulement map
import map from 'lodash/map';
map([1, 2, 3], n => n * 2);

// ✅ Encore mieux : lodash-es
import { map } from 'lodash-es';
map([1, 2, 3], n => n * 2);
```

---

## Code Splitting

### Dynamic Import

```javascript
// ❌ Mauvais : Tout chargé d'un coup
import HeavyLibrary from 'heavy-library';

button.addEventListener('click', () => {
  HeavyLibrary.doSomething();
});

// ✅ Bon : Chargé à la demande
button.addEventListener('click', async () => {
  const { default: HeavyLibrary } = await import('heavy-library');
  HeavyLibrary.doSomething();
});
```

### React Lazy

```javascript
import { lazy, Suspense } from 'react';

// Chargement paresseux
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Next.js Dynamic

```javascript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Chargement...</p>,
  ssr: false // Ne pas charger côté serveur
});

export default function Page() {
  return <DynamicComponent />;
}
```

---

## Déduplication des bundles

### Webpack SplitChunks

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunks (node_modules)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // Chunks communs
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5
        }
      }
    }
  }
};
```

### Résultat

```
main.js (50 KB)
├── app.js (30 KB)
├── vendors.js (15 KB) ← React, Lodash, etc.
└── common.js (5 KB) ← Code partagé
```

---

## Optimisation des boucles

### Performance comparée

```javascript
const arr = Array.from({ length: 1000000 }, (_, i) => i);

// ❌ Lent : forEach (83ms)
arr.forEach(n => n * 2);

// ⚠️ Moyen : for...of (45ms)
for (const n of arr) {
  n * 2;
}

// ✅ Rapide : for classique (12ms)
for (let i = 0; i < arr.length; i++) {
  arr[i] * 2;
}

// 🚀 Le plus rapide : while avec cache (8ms)
let i = arr.length;
while (i--) {
  arr[i] * 2;
}
```

### Cache de longueur

```javascript
// ❌ Mauvais : Recalcule length à chaque itération
for (let i = 0; i < array.length; i++) {
  // ...
}

// ✅ Bon : Cache length
const len = array.length;
for (let i = 0; i < len; i++) {
  // ...
}
```

---

## Debounce & Throttle

### Debounce (attendre la fin)

```javascript
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Utilisation : Search input
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
```

### Throttle (limiter la fréquence)

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Utilisation : Scroll event
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

## Memoization

### Fonction pure

```javascript
// ❌ Sans memoization : Recalcule à chaque fois
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time('fib');
fibonacci(40); // ~1000ms
console.timeEnd('fib');

// ✅ Avec memoization : Cache les résultats
function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fibonacciMemo = memoize(fibonacci);

console.time('fib-memo');
fibonacciMemo(40); // ~2ms
console.timeEnd('fib-memo');
```

### React useMemo

```javascript
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const result = useMemo(() => {
    // Calcul coûteux
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]); // Recalcule seulement si data change
  
  return <div>{result}</div>;
}
```

---

## Web Workers

### worker.js

```javascript
self.addEventListener('message', (e) => {
  const { type, data } = e.data;
  
  if (type === 'HEAVY_TASK') {
    const result = heavyComputation(data);
    self.postMessage({ type: 'RESULT', result });
  }
});

function heavyComputation(data) {
  // Tâche lourde
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i) * data;
  }
  return result;
}
```

### main.js

```javascript
const worker = new Worker('/worker.js');

worker.addEventListener('message', (e) => {
  const { type, result } = e.data;
  
  if (type === 'RESULT') {
    console.log('Résultat:', result);
  }
});

// Lancer la tâche
worker.postMessage({ type: 'HEAVY_TASK', data: 42 });
```

---

## RequestIdleCallback

```javascript
function heavyTask() {
  console.log('Tâche lourde exécutée');
}

// ❌ Bloque l'UI
heavyTask();

// ✅ Exécuté pendant les temps morts
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0) {
    heavyTask();
  }
});
```

---

## Optimisation des objets

### Object.freeze

```javascript
// Empêche les modifications (optimisation V8)
const config = Object.freeze({
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000
});

config.API_URL = 'https://hack.com'; // Ignoré en mode strict
```

### Hidden classes (V8)

```javascript
// ❌ Mauvais : Propriétés ajoutées dynamiquement
function User(name) {
  this.name = name;
}

const user1 = new User('Alice');
user1.age = 25; // Hidden class change

const user2 = new User('Bob');
user2.email = 'bob@example.com'; // Autre hidden class

// ✅ Bon : Structure fixe
function User(name, age, email) {
  this.name = name;
  this.age = age || null;
  this.email = email || null;
}

const user1 = new User('Alice', 25);
const user2 = new User('Bob', 30, 'bob@example.com');
```

---

## Analyse de bundle

### Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Next.js Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // config
});
```

```bash
ANALYZE=true npm run build
```

---

## Lazy Evaluation

```javascript
// ❌ Calcule tout d'avance
const data = items.map(expensive).filter(condition);

// ✅ Calcule à la demande (générateur)
function* lazyMap(items, mapper) {
  for (const item of items) {
    yield mapper(item);
  }
}

function* lazyFilter(items, predicate) {
  for (const item of items) {
    if (predicate(item)) {
      yield item;
    }
  }
}

// Utilisation
const mapped = lazyMap(items, expensive);
const filtered = lazyFilter(mapped, condition);

for (const item of filtered) {
  console.log(item); // Calculé à la demande
}
```

---

## Virtualization (listes longues)

### React Virtualized

```bash
npm install react-virtualized
```

```javascript
import { List } from 'react-virtualized';

function VirtualList({ items }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <List
      width={800}
      height={600}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={rowRenderer}
    />
  );
}
```

### react-window (plus léger)

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Compression

### Gzip / Brotli

```javascript
// Express.js avec compression
const compression = require('compression');

app.use(compression({
  level: 6, // 0-9
  threshold: 0 // Compresse tout
}));
```

### Next.js (automatique)

```javascript
// next.config.js
module.exports = {
  compress: true // Activé par défaut
};
```

---

## Exercice pratique

Optimisez une application React :
- Code splitting avec lazy()
- useMemo pour calculs coûteux
- Debounce sur search input
- Web Worker pour traitement lourd
- Virtualisation de liste (10 000 items)
- Bundle analyzer pour détecter les gros modules

**Objectif** : Réduire le bundle de 50% et améliorer le FID de 200ms → 50ms !

---

**Prochaine étape** : [Optimisation des Assets](./optimisation-assets.md) pour images et fonts ultra-légères !
