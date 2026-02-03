# Hooks Avancés

Maîtrisez les hooks avancés : **useContext**, **useReducer** et **custom hooks** pour gérer des états complexes et partager de la logique.

---

## Ce que vous allez apprendre

- Utiliser `useContext` pour le state global
- Gérer un état complexe avec `useReducer`
- Créer des custom hooks réutilisables
- Combiner ces patterns efficacement

## Prérequis

- [React - Hooks de base](./hooks-base)
- [JavaScript - Fonctions avancées](../../javascript/fonctions/concepts-avances)

---

## useContext : Partager des données globalement

Le hook **useContext** permet d'accéder à un Context sans wrapper imbriqués.

### Problème : Prop Drilling

```jsx
// ❌ Prop Drilling : Passer les props à travers plusieurs niveaux
function App() {
  const [user, setUser] = useState({ name: 'Alice' });
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  return <div>{user.name}</div>;  // Enfin utilisé ici !
}
```

### Solution : Context API

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Créer le Context
const UserContext = createContext();

// 2. Provider (fournir les données)
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}

// 3. Consumer (consommer les données)
function Layout() {
  return <Header />;  // Pas besoin de passer les props !
}

function Header() {
  return <UserMenu />;
}

function UserMenu() {
  const { user, setUser } = useContext(UserContext);  // ✅ Accès direct !

  return (
    <div>
      <p>Bonjour, {user.name}</p>
      <button onClick={() => setUser({ ...user, name: 'Bob' })}>
        Changer de nom
      </button>
    </div>
  );
}
```

### Pattern : Context + Custom Hook

```jsx
// UserContext.jsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook pour faciliter l'utilisation
export function useUser() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser doit être utilisé dans UserProvider');
  }
  
  return context;
}
```

```jsx
// App.jsx
import { UserProvider, useUser } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

function Dashboard() {
  const { user, login, logout } = useUser();

  if (!user) {
    return (
      <button onClick={() => login({ name: 'Alice', role: 'admin' })}>
        Se connecter
      </button>
    );
  }

  return (
    <div>
      <h1>Bienvenue, {user.name} !</h1>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
```

### Multiples Contexts

```jsx
const ThemeContext = createContext();
const UserContext = createContext();
const LanguageContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('fr');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <Dashboard />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { language } = useContext(LanguageContext);

  return (
    <div className={`theme-${theme}`}>
      <h1>{language === 'fr' ? 'Tableau de bord' : 'Dashboard'}</h1>
      <p>{user?.name}</p>
    </div>
  );
}
```

---

## useReducer : Gestion d'état complexe

Le hook **useReducer** est une alternative à useState pour les états complexes.

### Quand utiliser useReducer ?

```jsx
// ✅ useState : État simple
const [count, setCount] = useState(0);

// ✅ useReducer : État complexe avec logique
const [state, dispatch] = useReducer(reducer, initialState);
```

### Syntaxe de base

```jsx
import { useReducer } from 'react';

// 1. Définir le reducer
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

// 2. Utiliser le reducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### Avec payload

```jsx
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, done: !todo.done }
            : todo
        )
      };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: []
  });

  const addTodo = (text) => {
    dispatch({
      type: 'add',
      payload: { id: Date.now(), text, done: false }
    });
  };

  return (
    <div>
      {state.todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => dispatch({ type: 'toggle', payload: todo.id })}
          />
          <span>{todo.text}</span>
          <button onClick={() => dispatch({ type: 'delete', payload: todo.id })}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
```

### useReducer + useContext

```jsx
// TodoContext.jsx
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.payload];
    case 'delete':
      return state.filter(todo => todo.id !== action.payload);
    case 'toggle':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

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
  const { todos, dispatch } = useTodos();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => dispatch({ type: 'delete', payload: todo.id })}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}

function TodoForm() {
  const { dispatch } = useTodos();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'add',
      payload: { id: Date.now(), text, done: false }
    });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Ajouter</button>
    </form>
  );
}
```

---

## Custom Hooks : Réutiliser la logique

Les **custom hooks** permettent d'extraire et de réutiliser de la logique stateful.

### Convention de nommage

```jsx
// ✅ Les custom hooks commencent par "use"
function useCounter() { }
function useFetch() { }
function useLocalStorage() { }

// ❌ Ne commence pas par "use"
function counter() { }  // Pas un hook
```

### useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return [value, toggle, setTrue, setFalse];
}

// Utilisation
function Modal() {
  const [isOpen, toggleModal, openModal, closeModal] = useToggle(false);

  return (
    <div>
      <button onClick={openModal}>Ouvrir</button>
      {isOpen && (
        <div className="modal">
          <button onClick={closeModal}>Fermer</button>
        </div>
      )}
    </div>
  );
}
```

### useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// Utilisation
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  
  return <div>{user.name}</div>;
}
```

### useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  return [value, setStoredValue];
}

// Utilisation
function App() {
  const [name, setName] = useLocalStorage('username', '');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Votre nom"
    />
  );
}
```

### useDebounce

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Utilisation
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Faire la recherche
      console.log('Recherche:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher..."
    />
  );
}
```

### useWindowSize

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Utilisation
function ResponsiveComponent() {
  const { width } = useWindowSize();

  return (
    <div>
      {width < 768 ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

---

## Exemple complet : Authentification

```jsx
// useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au démarrage
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setUser)
        .finally(() => setLoading(false));
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
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
```

```jsx
// App.jsx
import { AuthProvider, useAuth } from './useAuth';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  return user ? <Dashboard /> : <LoginPage />;
}

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
```

---

## Bonnes pratiques

### ✅ Un custom hook par responsabilité

```jsx
// ✅ BON : Hooks focalisés
function useFetch(url) { }
function useLocalStorage(key) { }
function useDebounce(value) { }

// ❌ MAUVAIS : Hook qui fait trop de choses
function useEverything() { }
```

### ✅ Retourner un objet pour plus de flexibilité

```jsx
// ✅ BON : Retourner un objet
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount, increment: () => setCount(c => c + 1) };
}

// Utilisation : Destructuration dans n'importe quel ordre
const { increment, count } = useCounter();

// ✅ BON : Retourner un array pour ordre fixe
function useToggle() {
  const [value, setValue] = useState(false);
  return [value, () => setValue(v => !v)];
}

// Utilisation : Nommage libre
const [isOpen, toggleOpen] = useToggle();
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| useContext hors Provider | undefined | Envelopper avec Provider |
| Reducer avec effets de bord | Comportement imprévisible | Reducer pur, effets dans useEffect |
| Hook sans préfixe `use` | Erreur React | Toujours nommer `useXxx` |
| Dépendances manquantes | Valeurs périmées | Inclure toutes les dépendances |

---

## Quiz de vérification

:::quiz
Q: Quel problème résout `useContext` ?
- [ ] Les performances
- [x] Le prop drilling
- [ ] Les erreurs
> `useContext` permet d'accéder à des données sans les passer manuellement à travers chaque niveau de composants.

Q: Quand utiliser `useReducer` plutôt que `useState` ?
- [ ] Toujours
- [x] Pour un état complexe avec plusieurs actions
- [ ] Pour les formulaires uniquement
> `useReducer` est idéal pour gérer un état complexe avec une logique de mise à jour structurée.

Q: Comment doit commencer le nom d'un custom hook ?
- [ ] `hook`
- [x] `use`
- [ ] `custom`
> Par convention React, tous les hooks doivent commencer par `use` pour que le linter les reconnaisse.

Q: Que retourne typiquement un custom hook ?
- [ ] Rien
- [x] Un objet ou array avec state et fonctions
- [ ] Uniquement des fonctions
> Un custom hook retourne généralement des valeurs d'état et des fonctions pour les manipuler.
:::

---

## Exercice pratique

Créez une app de gestion de panier avec :
- Context pour le panier (useContext + useReducer)
- Custom hook `useCart` pour accéder au panier
- Actions : ajouter, supprimer, modifier quantité
- Custom hook `useLocalStorage` pour persister

---

## Prochaine étape

Découvrez l'[Optimisation avec les Hooks](./optimisation-hooks) pour améliorer les performances.
