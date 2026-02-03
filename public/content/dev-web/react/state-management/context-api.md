# Context API

Gérez l'état global de votre application avec la **Context API** de React, sans bibliothèque tierce.

---

## Ce que vous allez apprendre

- Créer et utiliser un Context
- Éviter le prop drilling
- Combiner Context avec useReducer
- Optimiser les performances avec mémoïsation

## Prérequis

- [React - Hooks](../hooks/hooks-base)
- [React - Composants](../composants-jsx/jsx-composants-base)

---

## Introduction à Context API

La **Context API** permet de partager des données entre composants sans passer par les props (évite le "prop drilling").

### Problème : Prop Drilling

```jsx
// ❌ Prop Drilling : passer les props à travers plusieurs niveaux
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });
  
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Enfin utilisé ici après 3 niveaux !
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setUser({ ...user, name: 'Bob' })}>
        Changer
      </button>
    </div>
  );
}
```

### Solution : Context API

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Créer le Context
const UserContext = createContext();

// 2. Provider : Fournir les données
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// 3. Consumer : Consommer les données
function Dashboard() {
  return <Sidebar />;  // Pas besoin de props !
}

function Sidebar() {
  return <UserMenu />;
}

function UserMenu() {
  const { user, setUser } = useContext(UserContext);  // ✅ Accès direct

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setUser({ ...user, name: 'Bob' })}>
        Changer
      </button>
    </div>
  );
}
```

---

## Créer un Context

### Syntaxe de base

```jsx
import { createContext } from 'react';

// Créer le Context
const ThemeContext = createContext();

// Ou avec valeur par défaut
const ThemeContext = createContext('light');
```

### Provider

```jsx
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}
```

### Consumer avec useContext

```jsx
import { useContext } from 'react';

function Dashboard() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={`theme-${theme}`}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

---

## Pattern : Context + Custom Hook

Ce pattern facilite l'utilisation et ajoute de la validation.

```jsx
// ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

// Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme doit être utilisé dans ThemeProvider');
  }
  
  return context;
}
```

```jsx
// App.jsx
import { ThemeProvider, useTheme } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-${theme}`}>
      <h1>Dashboard</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

## Context avec useReducer

Pour des états complexes, combinez Context avec useReducer.

```jsx
// TodoContext.jsx
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

// Provider
export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  // Actions helpers
  const addTodo = (text) => {
    dispatch({
      type: 'ADD',
      payload: { id: Date.now(), text, done: false }
    });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom Hook
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos doit être utilisé dans TodoProvider');
  }
  return context;
}
```

```jsx
// App.jsx
import { TodoProvider, useTodos } from './TodoContext';

function App() {
  return (
    <TodoProvider>
      <TodoList />
      <TodoForm />
    </TodoProvider>
  );
}

function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>Supprimer</button>
        </li>
      ))}
    </ul>
  );
}

function TodoForm() {
  const { addTodo } = useTodos();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
```

---

## Multiples Contexts

Vous pouvez utiliser plusieurs Contexts dans une application.

### Approche modulaire

```jsx
// AuthContext.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (credentials) => {
    // Logique de connexion
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

```jsx
// ThemeContext.jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

```jsx
// App.jsx
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { TodoProvider } from './TodoContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoProvider>
          <Dashboard />
        </TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { todos } = useTodos();

  return (
    <div className={`theme-${theme}`}>
      <h1>Bienvenue, {user?.name}</h1>
      <p>{todos.length} tâches</p>
    </div>
  );
}
```

---

## Optimisation des performances

### Problème : Re-renders inutiles

```jsx
// ❌ Tous les consumers re-render quand la valeur change
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = { user, setUser, theme, setTheme };  // Nouvel objet à chaque render !

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### Solution 1 : useMemo

```jsx
import { useMemo } from 'react';

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({
    user,
    setUser,
    theme,
    setTheme
  }), [user, theme]);  // Mémoïsé

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### Solution 2 : Séparer les Contexts

```jsx
// ✅ Contexts séparés = moins de re-renders
const UserContext = createContext();
const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Dashboard />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// Les composants qui utilisent uniquement theme ne re-render pas quand user change
```

---

## Exemple complet : Authentification

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error('Identifiants incorrects');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}

// Hook pour protéger les routes
export function useRequireAuth() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Rediriger vers /login
      window.location.href = '/login';
    }
  }, [user, loading]);

  return { user, loading };
}
```

```jsx
// App.jsx
import { AuthProvider, useAuth, useRequireAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Connexion</h1>
      {error && <p className="error">{error}</p>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      
      <button type="submit">Se connecter</button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenue, {user.name} !</h1>
      <p>Email : {user.email}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}

// Composant protégé
function ProtectedPage() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Chargement...</div>;

  return <div>Page protégée pour {user.name}</div>;
}
```

---

## Bonnes pratiques

### ✅ Un Context par responsabilité

```jsx
// ✅ BON : Contexts séparés
<AuthProvider>
  <ThemeProvider>
    <TodoProvider>
      <App />
    </TodoProvider>
  </ThemeProvider>
</AuthProvider>

// ❌ MAUVAIS : Tout dans un Context
<AppProvider>  {/* user, theme, todos, settings, etc. */}
  <App />
</AppProvider>
```

### ✅ Toujours créer un custom hook

```jsx
// ✅ BON
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}

// ❌ MAUVAIS : useContext direct partout
const { user } = useContext(AuthContext);
```

### ✅ Mémoïser les valeurs

```jsx
// ✅ BON
const value = useMemo(() => ({
  user,
  login,
  logout
}), [user]);

// ❌ MAUVAIS
const value = { user, login, logout };  // Nouvel objet à chaque render
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| useContext sans Provider | Context undefined | Envelopper avec Provider |
| Value non mémoïsée | Re-renders inutiles | `useMemo` sur la value |
| Trop de données dans un Context | Couplage fort | Séparer les contexts |
| Pas de custom hook | Oublier le check d'erreur | Toujours créer `useXxxContext` |

---

## Quiz de vérification

:::quiz
Q: Quel problème résout Context API ?
- [ ] Les performances
- [x] Le prop drilling
- [ ] La sécurité
> Context permet de partager des données entre composants sans les passer via les props.

Q: Quel hook accède au Context ?
- [ ] `useState`
- [x] `useContext`
- [ ] `useRef`
> `useContext(MonContext)` permet de consommer les valeurs fournies par le Provider.

Q: Pourquoi mémoïser la value du Provider ?
- [ ] Pour la lisibilité
- [x] Pour éviter les re-renders inutiles
- [ ] Pour le SEO
> Sans mémoisation, un nouvel objet est créé à chaque rendu, causant des re-renders de tous les consumers.

Q: Quand combiner Context avec useReducer ?
- [ ] Jamais
- [x] Pour un état complexe avec plusieurs actions
- [ ] Toujours
> Context + useReducer est un pattern puissant pour gérer un état global complexe.
:::

---

## Exercice pratique

Créez un système e-commerce avec :
- `AuthContext` : Authentification utilisateur
- `CartContext` : Panier d'achat (useReducer)
- `ThemeContext` : Thème light/dark
- Custom hooks pour chaque Context
- Persistance en localStorage

---

## Prochaine étape

Découvrez les [Libraries Externes](./libraries-externes) (Redux, Zustand) pour des besoins plus complexes.
