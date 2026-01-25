# React Router

Gérez la navigation entre les pages de votre application React avec React Router.

---

## 📚 Ce que vous allez apprendre

- Installer et configurer React Router v6
- Créer des routes et des liens
- Gérer les paramètres d'URL
- Implémenter des routes protégées

## ⚠️ Prérequis

- [Composants et JSX](../composants-jsx/jsx-composants-base.md)
- [Hooks de base](../hooks/hooks-base.md)

---

## Installation

```bash
npm install react-router-dom
```

---

## Configuration de base

### BrowserRouter

```jsx
// main.jsx ou index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### Définir les routes

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} /> {/* 404 */}
    </Routes>
  );
}

export default App;
```

---

## Navigation

### Le composant Link

```jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* ✅ Utiliser Link pour la navigation interne */}
      <Link to="/">Accueil</Link>
      <Link to="/about">À propos</Link>
      <Link to="/contact">Contact</Link>
      
      {/* ❌ Ne pas utiliser <a> pour la navigation interne */}
      {/* <a href="/about">À propos</a> ← Recharge la page ! */}
    </nav>
  );
}
```

### NavLink (avec style actif)

```jsx
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Accueil
      </NavLink>
      
      <NavLink 
        to="/about"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? 'blue' : 'black'
        })}
      >
        À propos
      </NavLink>
    </nav>
  );
}
```

### Navigation programmatique

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await login(credentials);
    
    if (success) {
      // Rediriger vers le dashboard
      navigate('/dashboard');
      
      // Ou remplacer l'historique (pas de retour possible)
      navigate('/dashboard', { replace: true });
      
      // Retour en arrière
      navigate(-1);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Paramètres d'URL

### Paramètres dynamiques

```jsx
// App.jsx
<Routes>
  <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/users/:userId/posts/:postId" element={<UserPost />} />
</Routes>
```

```jsx
// ProductDetail.jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  
  // URL: /products/123 → id = "123"
  
  return <div>Produit n°{id}</div>;
}
```

```jsx
// UserPost.jsx
import { useParams } from 'react-router-dom';

function UserPost() {
  const { userId, postId } = useParams();
  
  // URL: /users/5/posts/42 → userId = "5", postId = "42"
  
  return <div>Post {postId} de l'utilisateur {userId}</div>;
}
```

### Query strings

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL: /products?category=electronics&sort=price
  const category = searchParams.get('category'); // "electronics"
  const sort = searchParams.get('sort');         // "price"
  
  const handleFilterChange = (newCategory) => {
    setSearchParams({ category: newCategory, sort });
  };
  
  return (
    <div>
      <select onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="all">Tous</option>
        <option value="electronics">Électronique</option>
        <option value="clothing">Vêtements</option>
      </select>
      
      {/* Produits filtrés... */}
    </div>
  );
}
```

---

## Routes imbriquées (Nested Routes)

### Layout avec Outlet

```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="products" element={<Products />}>
      <Route index element={<ProductList />} />
      <Route path=":id" element={<ProductDetail />} />
    </Route>
  </Route>
</Routes>
```

```jsx
// Layout.jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      
      <main>
        {/* Les routes enfants s'affichent ici */}
        <Outlet />
      </main>
      
      <footer>
        <p>© 2024</p>
      </footer>
    </div>
  );
}
```

```jsx
// Products.jsx
import { Outlet, Link } from 'react-router-dom';

function Products() {
  return (
    <div>
      <h1>Produits</h1>
      <nav>
        <Link to="/products">Tous les produits</Link>
      </nav>
      
      {/* ProductList ou ProductDetail s'affiche ici */}
      <Outlet />
    </div>
  );
}
```

### Schéma des routes imbriquées

```
URL                     Composants rendus
─────────────────────────────────────────────────────
/                       Layout → Home
/about                  Layout → About
/products               Layout → Products → ProductList
/products/123           Layout → Products → ProductDetail
```

---

## Routes protégées

### Composant ProtectedRoute

```jsx
// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!user) {
    // Rediriger vers login en sauvegardant la destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

### Utilisation

```jsx
// App.jsx
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  
  {/* Routes protégées */}
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
  
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Redirection après login

```jsx
// Login.jsx
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer la destination d'origine
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleLogin = async () => {
    await login(credentials);
    
    // Rediriger vers la page demandée initialement
    navigate(from, { replace: true });
  };
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

### Routes par rôle

```jsx
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

// Utilisation
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  } 
/>
```

---

## Chargement de données

### Loader (React Router 6.4+)

```jsx
// App.jsx avec createBrowserRouter
import { 
  createBrowserRouter, 
  RouterProvider,
  useLoaderData 
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/products/:id',
    element: <ProductDetail />,
    loader: async ({ params }) => {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error('Produit non trouvé');
      return response.json();
    },
    errorElement: <ProductError />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

```jsx
// ProductDetail.jsx
import { useLoaderData } from 'react-router-dom';

function ProductDetail() {
  // Les données sont déjà chargées !
  const product = useLoaderData();
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}€</span>
    </div>
  );
}
```

---

## Lazy Loading des pages

```jsx
import { lazy, Suspense } from 'react';

// Chargement différé des composants
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Structure de fichiers recommandée

```
src/
├── components/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── products/
│   │   ├── ProductList.jsx
│   │   └── ProductDetail.jsx
│   └── NotFound.jsx
├── hooks/
│   └── useAuth.js
├── App.jsx
└── main.jsx
```

---

## ❌ Erreurs Courantes

### 1. Oublier BrowserRouter

```jsx
// ❌ Erreur: useNavigate() may be used only in the context of a <Router>
function App() {
  return <Routes>...</Routes>;
}

// ✅ Envelopper avec BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <Routes>...</Routes>
    </BrowserRouter>
  );
}
```

### 2. Utiliser `<a>` au lieu de `<Link>`

```jsx
// ❌ Recharge toute la page
<a href="/about">À propos</a>

// ✅ Navigation SPA
<Link to="/about">À propos</Link>
```

### 3. Oublier le slash initial

```jsx
// ❌ Route relative mal configurée
<Route path="about" element={<About />} />

// ✅ Route absolue claire
<Route path="/about" element={<About />} />

// Ou route relative dans un parent
<Route path="/" element={<Layout />}>
  <Route path="about" element={<About />} /> {/* OK ici */}
</Route>
```

### 4. Ne pas gérer le 404

```jsx
// ❌ Rien ne s'affiche pour /page-inexistante

// ✅ Ajouter une route catch-all
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} /> {/* 404 */}
</Routes>
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Navigation basique

**Objectif** : Créer une navigation entre 3 pages

1. Créer les pages Home, About, Contact
2. Configurer les routes
3. Ajouter une navbar avec NavLink
4. Styler le lien actif

<details>
<summary>💡 Solution</summary>

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

// Navbar.jsx
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        Accueil
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
        À propos
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
        Contact
      </NavLink>
    </nav>
  );
}

// Navbar.css
.active {
  font-weight: bold;
  color: blue;
}
```
</details>

### Exercice 2 : Routes dynamiques

**Objectif** : Afficher le détail d'un produit

1. Créer une liste de produits
2. Chaque produit lien vers `/products/:id`
3. Afficher les détails du produit sélectionné

<details>
<summary>💡 Solution</summary>

```jsx
// ProductList.jsx
import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Tablet', price: 499 }
];

function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>
            {product.name} - {product.price}€
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ProductDetail.jsx
import { useParams } from 'react-router-dom';

const products = [
  { id: 1, name: 'Laptop', price: 999, desc: 'Super laptop' },
  { id: 2, name: 'Phone', price: 699, desc: 'Smartphone' },
  { id: 3, name: 'Tablet', price: 499, desc: 'Tablette' }
];

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) return <div>Produit non trouvé</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.desc}</p>
      <p>{product.price}€</p>
    </div>
  );
}
```
</details>

### Exercice 3 : Route protégée

**Objectif** : Protéger la page /dashboard

1. Créer un contexte d'authentification simple
2. Implémenter ProtectedRoute
3. Rediriger vers /login si non connecté

<details>
<summary>💡 Solution</summary>

```jsx
// AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (username) => setUser({ name: username });
  const logout = () => setUser(null);
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// App.jsx
<AuthProvider>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
  </Routes>
</AuthProvider>
```
</details>

---

## ✅ Quiz Rapide

1. Quel composant permet la navigation sans rechargement ?
   - A) `<a>`
   - B) `<Link>` ✅
   - C) `<Button>`

2. Quel hook récupère les paramètres d'URL ?
   - A) `useParams()` ✅
   - B) `useQuery()`
   - C) `useURL()`

3. Comment afficher les routes enfants ?
   - A) `<Children />`
   - B) `<Outlet />` ✅
   - C) `{children}`

4. Quelle route gère les pages 404 ?
   - A) `path="/404"`
   - B) `path="*"` ✅
   - C) `path="/not-found"`

---

## 🔗 Pour aller plus loin

- [Documentation React Router](https://reactrouter.com/)
- [Tutorial officiel](https://reactrouter.com/en/main/start/tutorial)

---

## ➡️ Prochaine étape

Apprenez à [gérer les formulaires](./forms-validation.md) dans React pour créer des interfaces interactives.
