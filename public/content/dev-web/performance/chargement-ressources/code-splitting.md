# Code Splitting

Maîtrisez le **découpage de code** pour des bundles JavaScript optimisés et un chargement ultra-rapide.

---

## Qu'est-ce que le Code Splitting ?

**Code splitting** = Diviser votre bundle en plusieurs petits fichiers chargés à la demande.

### Avantages

✅ **Bundle initial plus petit** (faster First Contentful Paint)  
✅ **Chargement à la demande** (économie de bande passante)  
✅ **Cache optimisé** (vendor chunks mis en cache séparément)  
✅ **Parallélisation** (téléchargements simultanés)

### Types de code splitting

1. **Entry Points** : Diviser par point d'entrée
2. **Dynamic Imports** : Diviser à la demande
3. **Vendor Splitting** : Séparer les node_modules

---

## Dynamic Imports (ES2020)

### Syntaxe

```javascript
// ❌ Import statique (chargé immédiatement)
import { heavyFunction } from './heavy-module';

// ✅ Import dynamique (chargé à la demande)
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module');
  heavyFunction();
});
```

### Avec Webpack

```javascript
// Webpack crée automatiquement un chunk séparé
button.addEventListener('click', async () => {
  const module = await import(/* webpackChunkName: "heavy-module" */ './heavy-module');
  module.default();
});
```

### Avec prefetch/preload

```javascript
// Prefetch : Chargé pendant les temps morts
import(/* webpackPrefetch: true */ './module');

// Preload : Chargé en parallèle
import(/* webpackPreload: true */ './module');
```

---

## React Code Splitting

### React.lazy

```javascript
import { lazy, Suspense } from 'react';

// Composant chargé paresseusement
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

function App() {
  return (
    <div>
      <h1>Mon App</h1>
      
      <Suspense fallback={<div>Chargement...</div>}>
        <HeavyComponent />
      </Suspense>
      
      {isAdmin && (
        <Suspense fallback={<div>Chargement admin...</div>}>
          <AdminDashboard />
        </Suspense>
      )}
    </div>
  );
}
```

### Route-based splitting

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Component-based splitting

```javascript
import { lazy, Suspense, useState } from 'react';

const Modal = lazy(() => import('./Modal'));
const Chart = lazy(() => import('./Chart'));

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Ouvrir Modal</button>
      <button onClick={() => setShowChart(true)}>Afficher Chart</button>
      
      {showModal && (
        <Suspense fallback={<div>Chargement modal...</div>}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
      
      {showChart && (
        <Suspense fallback={<div>Chargement chart...</div>}>
          <Chart data={data} />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Webpack SplitChunks

### Configuration avancée

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk (node_modules)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        
        // React + React-DOM séparés
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20
        },
        
        // Lodash séparé
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          priority: 15
        },
        
        // Chunks communs (utilisés par 2+ modules)
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // Runtime chunk séparé
    runtimeChunk: 'single'
  }
};
```

### Résultat

```
dist/
├── runtime.js (5 KB) ← Webpack runtime
├── react.js (130 KB) ← React + ReactDOM
├── vendors.js (200 KB) ← Autres node_modules
├── common.js (20 KB) ← Code partagé
├── home.js (30 KB) ← Page Home
├── about.js (25 KB) ← Page About
└── dashboard.js (40 KB) ← Page Dashboard
```

---

## Next.js Code Splitting

### Automatique par route

```javascript
// pages/index.js
export default function Home() {
  return <h1>Home</h1>;
}

// pages/about.js (chunk séparé automatiquement)
export default function About() {
  return <h1>About</h1>;
}
```

### next/dynamic

```javascript
import dynamic from 'next/dynamic';

// Sans SSR
const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Chargement...</p>,
  ssr: false
});

// Avec preload
const DynamicComponentWithPreload = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Chargement...</p>
});

export default function Page() {
  return (
    <>
      <DynamicComponent />
      <DynamicComponentWithPreload />
    </>
  );
}
```

### Conditional loading

```javascript
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  ssr: false
});

export default function Dashboard({ isAdmin }) {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

---

## Vite Code Splitting

### Configuration

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ['react', 'react-dom'],
          lodash: ['lodash'],
          
          // Component chunks
          charts: ['chart.js', 'recharts'],
          editor: ['monaco-editor']
        }
      }
    }
  }
};
```

### Dynamic import

```javascript
// Vite gère automatiquement les dynamic imports
button.addEventListener('click', async () => {
  const { default: module } = await import('./module');
  module.init();
});
```

---

## Stratégies de splitting

### 1. Route-based (recommandé)

```javascript
// Un chunk par route
const Home = lazy(() => import('./routes/Home'));
const Blog = lazy(() => import('./routes/Blog'));
const Contact = lazy(() => import('./routes/Contact'));
```

**Avantages** :
- Simple à mettre en place
- Navigation rapide
- Cache efficace

### 2. Component-based

```javascript
// Chunker les gros composants
const Chart = lazy(() => import('./components/Chart'));
const RichTextEditor = lazy(() => import('./components/Editor'));
```

**Avantages** :
- Granularité fine
- Utilisateur ne charge que ce qu'il utilise

### 3. Vendor splitting

```javascript
// Séparer les node_modules
splitChunks: {
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      chunks: 'all'
    }
  }
}
```

**Avantages** :
- Cache à long terme (vendor change rarement)
- Parallélisation du téléchargement

### 4. Feature-based

```javascript
// Par fonctionnalité métier
const Checkout = lazy(() => import('./features/Checkout'));
const Dashboard = lazy(() => import('./features/Dashboard'));
const Analytics = lazy(() => import('./features/Analytics'));
```

---

## Optimisations avancées

### Preload critique

```javascript
// Précharge le chunk avant qu'il soit nécessaire
const preloadDashboard = () => import('./Dashboard');

// Déclencher au survol du lien
<Link to="/dashboard" onMouseEnter={preloadDashboard}>
  Dashboard
</Link>
```

### Magic Comments (Webpack)

```javascript
// Nommer le chunk
import(/* webpackChunkName: "my-chunk" */ './module');

// Prefetch (chargé pendant temps mort)
import(/* webpackPrefetch: true */ './module');

// Preload (chargé en parallèle)
import(/* webpackPreload: true */ './module');

// Mode (lazy, lazy-once, eager, weak)
import(/* webpackMode: "lazy" */ './module');
```

### Groupe de chunks

```javascript
// Plusieurs imports dans le même chunk
import(/* webpackChunkName: "admin" */ './AdminPanel');
import(/* webpackChunkName: "admin" */ './AdminSettings');
import(/* webpackChunkName: "admin" */ './AdminUsers');
// → Génère 1 seul chunk "admin"
```

---

## Mesurer l'impact

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

module.exports = withBundleAnalyzer({});
```

```bash
ANALYZE=true npm run build
```

---

## Bonnes pratiques

1. ✅ **Route-based splitting** par défaut
2. ✅ **Vendor chunks** séparés (React, Lodash, etc.)
3. ✅ **Chunks communs** pour code partagé
4. ✅ **Runtime chunk** séparé
5. ✅ **Preload** les routes suivantes probables
6. ✅ **Lazy load** les composants lourds
7. ✅ **Cache headers** à 1 an pour chunks avec hash
8. ✅ **Analyser** régulièrement les bundles

---

## Exemple complet

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js',
  
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      
      cacheGroups: {
        // React
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20
        },
        
        // Lodash
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          priority: 15
        },
        
        // Vendor
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        
        // Common
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

---

## Exercice pratique

Optimisez une application React :
- Route-based splitting avec React Router
- Component-based splitting (Modal, Chart, Editor)
- Vendor chunks (React, Lodash séparés)
- Preload au survol des liens
- Bundle analyzer pour visualiser

**Objectif** : Réduire le bundle initial de 500 KB → 100 KB !

---

**Prochaine étape** : [Resource Hints](./resource-hints.md) pour optimiser le chargement ! 🚀
