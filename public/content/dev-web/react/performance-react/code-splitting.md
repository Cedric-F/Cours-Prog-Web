# Code Splitting

Découvrez comment diviser votre application en **chunks** pour réduire le temps de chargement avec **React.lazy** et **Suspense**.

---

## Pourquoi le code splitting ?

Sans code splitting, tout votre code est chargé d'un coup :

```
Bundle.js (2 MB)
├── Home page (100 KB)
├── Dashboard page (500 KB)
├── Admin page (300 KB)
├── Settings page (200 KB)
└── Libraries (900 KB)
```

**Problème** : L'utilisateur charge 2 MB même s'il visite uniquement la Home !

Avec code splitting :

```
Home.chunk.js (100 KB)  ← Chargé immédiatement
Dashboard.chunk.js (500 KB)  ← Chargé à la demande
Admin.chunk.js (300 KB)  ← Chargé à la demande
...
```

**Avantage** : L'utilisateur charge uniquement ce dont il a besoin !

---

## React.lazy

**React.lazy** permet de charger un composant de manière **asynchrone**.

### Syntaxe de base

```jsx
// ❌ Import classique : chargé immédiatement
import Dashboard from './Dashboard';

// ✅ Import dynamique : chargé à la demande
const Dashboard = React.lazy(() => import('./Dashboard'));
```

### Avec Suspense

`React.lazy` nécessite un composant `Suspense` pour afficher un fallback pendant le chargement :

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Exemple complet : Routes

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Pages lazy
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div className="spinner">Chargement...</div>
    </div>
  );
}
```

---

## Suspense avancé

### Plusieurs Suspense

Vous pouvez avoir plusieurs `Suspense` à différents niveaux :

```jsx
function App() {
  return (
    <div>
      <Header />
      
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/dashboard" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}
```

### Fallback personnalisé

```jsx
function LoadingScreen({ message }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>{message || 'Chargement...'}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen message="Chargement du dashboard..." />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Skeleton screens

```jsx
function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-chart" />
      <div className="skeleton skeleton-table" />
    </div>
  );
}

// CSS
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-title {
  height: 30px;
  width: 60%;
  margin-bottom: 20px;
}

.skeleton-chart {
  height: 300px;
  margin-bottom: 20px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Code splitting par route

### Stratégie classique

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Composants communs chargés immédiatement
import Layout from './Layout';
import NotFound from './NotFound';

// Pages lazy
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
```

---

## Code splitting de bibliothèques

### Charger une bibliothèque à la demande

```jsx
function ChartComponent({ data }) {
  const [Chart, setChart] = useState(null);
  
  useEffect(() => {
    // Charger Chart.js uniquement quand nécessaire
    import('chart.js').then((chartjs) => {
      setChart(() => chartjs);
    });
  }, []);
  
  if (!Chart) return <div>Chargement du graphique...</div>;
  
  return <Chart.Bar data={data} />;
}
```

### Avec React.lazy

```jsx
// ChartWrapper.jsx
import { Chart } from 'chart.js';

export default function ChartWrapper({ data }) {
  return <Chart.Bar data={data} />;
}

// App.jsx
const ChartWrapper = lazy(() => import('./ChartWrapper'));

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      {showChart && <ChartWrapper data={data} />}
    </Suspense>
  );
}
```

---

## Code splitting conditionnel

### Charger selon la condition

```jsx
function EditorPage() {
  const [Editor, setEditor] = useState(null);
  
  const loadEditor = async () => {
    // Charger Monaco Editor uniquement au clic
    const monaco = await import('monaco-editor');
    setEditor(() => monaco.default);
  };
  
  return (
    <div>
      {!Editor ? (
        <button onClick={loadEditor}>Ouvrir l'éditeur</button>
      ) : (
        <Editor />
      )}
    </div>
  );
}
```

### Modal lazy

```jsx
const Modal = lazy(() => import('./Modal'));

function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Ouvrir modal</button>
      
      {showModal && (
        <Suspense fallback={null}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Preload et Prefetch

### Preload : Charger à l'avance

```jsx
// Preloader.jsx
export function preloadDashboard() {
  import('./pages/Dashboard');
}

export function preloadSettings() {
  import('./pages/Settings');
}

// App.jsx
import { preloadDashboard } from './Preloader';

function App() {
  return (
    <div>
      <Link
        to="/dashboard"
        onMouseEnter={preloadDashboard}  // Preload au survol
      >
        Dashboard
      </Link>
    </div>
  );
}
```

### Prefetch avec Webpack

```jsx
// Précharger au moment du build
const Dashboard = lazy(() => import(/* webpackPrefetch: true */ './Dashboard'));

// Précharger immédiatement
const Settings = lazy(() => import(/* webpackPreload: true */ './Settings'));
```

**Différence** :
- **Preload** : Chargé immédiatement (haute priorité)
- **Prefetch** : Chargé quand le navigateur est idle (basse priorité)

---

## Named exports avec lazy

### Problème

```jsx
// ❌ NE FONCTIONNE PAS
const Dashboard = lazy(() => import('./Dashboard').then(module => module.Dashboard));
```

### Solution

```jsx
// Dashboard.jsx
export function Dashboard() {
  return <div>Dashboard</div>;
}

// DashboardExport.jsx
export { Dashboard as default } from './Dashboard';

// App.jsx
const Dashboard = lazy(() => import('./DashboardExport'));
```

Ou avec un helper :

```jsx
function lazyWithNamed(importFn, name) {
  return lazy(() => importFn().then(module => ({ default: module[name] })));
}

// Usage
const Dashboard = lazyWithNamed(() => import('./Dashboard'), 'Dashboard');
```

---

## Error Boundaries

Gérez les erreurs de chargement avec **Error Boundaries**.

### Créer un Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error loading component:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h2>Oops ! Erreur de chargement</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recharger
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Utilisation

```jsx
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Analyse du bundle

### Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```js
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Avec Create React App

```bash
npm install --save-dev source-map-explorer

# Dans package.json
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}

npm run build
npm run analyze
```

---

## Exemple complet : E-commerce app

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

// Composants communs (non lazy)
import Header from './components/Header';
import Footer from './components/Footer';

// Pages lazy
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Pages admin (chunk séparé)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));

// Preloaders
export function preloadProducts() {
  import('./pages/Products');
}

export function preloadCart() {
  import('./pages/Cart');
}

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="spinner" />
      <p>Chargement...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

## Stratégies de code splitting

### 1. **Par route** (le plus courant)

```jsx
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 2. **Par feature**

```jsx
const AdminPanel = lazy(() => import('./features/admin'));
const UserProfile = lazy(() => import('./features/user'));
```

### 3. **Par taille**

```jsx
// Bibliothèques lourdes (charts, éditeurs, etc.)
const ChartComponent = lazy(() => import('./ChartComponent'));
const MarkdownEditor = lazy(() => import('./MarkdownEditor'));
```

### 4. **Par condition**

```jsx
// Charger uniquement si admin
{isAdmin && (
  <Suspense fallback={<Spinner />}>
    <AdminPanel />
  </Suspense>
)}
```

---

## Bonnes pratiques

1. ✅ **Route-based splitting** : Toujours pour les pages
2. ✅ **Suspense au bon niveau** : Près du composant lazy
3. ✅ **Error Boundaries** : Toujours avec lazy
4. ✅ **Preload** : Pour améliorer l'UX (survol, idle time)
5. ✅ **Fallback pertinent** : Skeleton > Spinner
6. ❌ **Pas trop de chunks** : Pas de lazy pour chaque petit composant

---

## Exercice pratique

Optimisez une **App Dashboard** avec :
- Home, Dashboard, Settings, Admin (lazy)
- Modal lazy (ouvert au clic)
- Chart.js chargé à la demande
- Error Boundary
- Preload au survol
- Skeleton screens

**Bonus** : Analysez le bundle avec Webpack Bundle Analyzer !

---

**Prochaine étape** : [Optimisations Avancées](./optimisations-avancees.md) pour aller encore plus loin ! 🚀
