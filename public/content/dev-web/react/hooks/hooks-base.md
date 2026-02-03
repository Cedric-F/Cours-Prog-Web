# Hooks de Base

Maîtrisez les hooks fondamentaux de React : **useState**, **useEffect** et **useRef** pour gérer l'état, les effets de bord et les références.

---

## Ce que vous allez apprendre

- Utiliser `useState` pour gérer l'état local
- Utiliser `useEffect` pour les effets de bord
- Utiliser `useRef` pour les références
- Connaître les règles des hooks

## Prérequis

- [React - JSX & Composants](../composants-jsx/jsx-composants-base)
- [React - Props & Composition](../composants-jsx/props-composition)

---

## Introduction aux Hooks

Les **Hooks** sont des fonctions qui permettent d'utiliser le state et d'autres fonctionnalités React dans les composants fonctionnels.

### Avant vs Après les Hooks

```jsx
// ❌ Avant : Composants de classe (complexe)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}

// ✅ Après : Hooks (simple et clair)
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Règles des Hooks

**Règle 1 : Appeler les Hooks au niveau supérieur uniquement**

```jsx
function MyComponent() {
  const [state, setState] = useState(0);  // ✅ OK

  // ❌ JAMAIS dans une condition
  if (condition) {
    const [data, setData] = useState(null);  // ❌ ERREUR
  }

  // ❌ JAMAIS dans une boucle
  for (let i = 0; i < 5; i++) {
    const [item, setItem] = useState(i);  // ❌ ERREUR
  }

  // ❌ JAMAIS après un return
  return <div>Contenu</div>;
  const [late, setLate] = useState(0);  // ❌ ERREUR
}
```

**Règle 2 : Appeler les Hooks uniquement dans des fonctions React**

```jsx
// ✅ OK : Dans un composant React
function MyComponent() {
  const [state, setState] = useState(0);
}

// ✅ OK : Dans un custom hook
function useMyHook() {
  const [state, setState] = useState(0);
}

// ❌ ERREUR : Dans une fonction normale
function regularFunction() {
  const [state, setState] = useState(0);  // ❌
}
```

---

## useState : Gérer l'état local

Le hook **useState** permet d'ajouter un état local à un composant fonctionnel.

### Syntaxe de base

```jsx
import { useState } from 'react';

function Counter() {
  // [valeur actuelle, fonction pour mettre à jour]
  const [count, setCount] = useState(0);  // 0 = valeur initiale

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### États multiples

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Âge"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Actif
      </label>
    </div>
  );
}
```

### État object

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,      // Copier l'ancien état
      [field]: value    // Mettre à jour le champ
    }));
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Nom"
      />
      <input
        value={user.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={user.age}
        onChange={(e) => handleChange('age', Number(e.target.value))}
        placeholder="Âge"
      />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
```

### État array

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Apprendre React', done: false },
    { id: 2, text: 'Créer une app', done: false }
  ]);

  // Ajouter
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      done: false
    };
    setTodos([...todos, newTodo]);
  };

  // Supprimer
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  // Modifier
  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Supprimer</button>
        </li>
      ))}
    </ul>
  );
}
```

### Fonction de mise à jour

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Problème : Utilise l'ancienne valeur
  const incrementThreeTimes = () => {
    setCount(count + 1);  // count = 0 → 1
    setCount(count + 1);  // count = 0 → 1 (pas 2 !)
    setCount(count + 1);  // count = 0 → 1 (pas 3 !)
  };

  // ✅ Solution : Fonction de mise à jour
  const incrementThreeTimesCorrect = () => {
    setCount(prev => prev + 1);  // 0 → 1
    setCount(prev => prev + 1);  // 1 → 2
    setCount(prev => prev + 1);  // 2 → 3
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementThreeTimesCorrect}>+3</button>
    </div>
  );
}
```

### Lazy initialization

```jsx
// ❌ Calcul coûteux à chaque render
function ExpensiveComponent() {
  const [data, setData] = useState(expensiveComputation());
  // ...
}

// ✅ Calcul uniquement au premier render
function ExpensiveComponent() {
  const [data, setData] = useState(() => expensiveComputation());
  // ...
}

function expensiveComputation() {
  console.log('Calcul coûteux...');
  return Array.from({ length: 10000 }, (_, i) => i);
}
```

---

## useEffect : Effets de bord

Le hook **useEffect** permet d'exécuter du code après le rendu (side effects).

### Syntaxe de base

```jsx
import { useState, useEffect } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);

  // S'exécute après chaque render
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Tableau de dépendances

```jsx
function User({ userId }) {
  const [user, setUser] = useState(null);

  // S'exécute uniquement quand userId change
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);  // Dépendances

  if (!user) return <div>Chargement...</div>;
  return <div>{user.name}</div>;
}
```

**3 cas de dépendances** :

```jsx
// 1. Pas de tableau : S'exécute après CHAQUE render
useEffect(() => {
  console.log('Après chaque render');
});

// 2. Tableau vide : S'exécute UNE SEULE FOIS (au mount)
useEffect(() => {
  console.log('Une seule fois');
}, []);

// 3. Avec dépendances : S'exécute quand les dépendances changent
useEffect(() => {
  console.log('Quand count change');
}, [count]);
```

### Nettoyage (cleanup)

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Setup : Démarrer le timer
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup : Nettoyer le timer
    return () => {
      clearInterval(interval);
    };
  }, []);  // Une seule fois

  return <div>Secondes : {seconds}</div>;
}
```

### Fetch data

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Event listeners

```jsx
function WindowSize() {
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>{size.width} x {size.height}</div>;
}
```

---

## useRef : Références mutables

Le hook **useRef** crée une référence mutable qui persiste entre les renders.

### Accéder aux éléments DOM

```jsx
import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();  // Focus l'input
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus</button>
    </div>
  );
}
```

### Stocker des valeurs mutables

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;  // Déjà démarré

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  return (
    <div>
      <p>Secondes : {seconds}</p>
      <button onClick={start}>Démarrer</button>
      <button onClick={stop}>Arrêter</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Valeur précédente

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Actuel : {count}</p>
      <p>Précédent : {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

---

## Exemple complet : Formulaire de recherche

```jsx
import { useState, useEffect, useRef } from 'react';

function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Focus automatique au mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    // Annuler la recherche précédente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Attendre 500ms avant de rechercher
    timeoutRef.current = setTimeout(() => {
      fetch(`https://jsonplaceholder.typicode.com/users?name_like=${query}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 500);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un utilisateur..."
      />

      {loading && <p>Recherche...</p>}

      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchForm;
```

---

## Bonnes pratiques

### ✅ Respecter les règles des Hooks

```jsx
// ✅ BON : Au niveau supérieur
function Component() {
  const [state, setState] = useState(0);
  useEffect(() => {}, []);
}

// ❌ MAUVAIS : Dans une condition
function Component() {
  if (condition) {
    const [state, setState] = useState(0);  // ❌
  }
}
```

### ✅ Dépendances complètes

```jsx
// ❌ MAUVAIS : Dépendance manquante
function Component({ userId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(/* ... */);
  }, []);  // ❌ userId manquant
}

// ✅ BON : Toutes les dépendances
function Component({ userId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(/* ... */);
  }, [userId]);  // ✅
}
```

### ✅ Cleanup pour les subscriptions

```jsx
// ✅ Toujours nettoyer les timers, listeners, subscriptions
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

## Erreurs courantes

| Erreur | Exemple | Solution |
|--------|---------|----------|
| Hook dans condition | `if (x) { useState(0) }` | Toujours au niveau supérieur |
| Dépendance manquante | `useEffect(() => {...}, [])` avec variable externe | Ajouter dans le tableau |
| Pas de cleanup | Timer/listener sans `return` | Toujours nettoyer |
| Modifier state directement | `state.push(x)` | Créer nouveau tableau `[...state, x]` |

---

## Quiz de vérification

:::quiz
Q: Que retourne `useState(0)` ?
- [ ] Juste la valeur
- [x] Un tableau `[valeur, setter]`
- [ ] Un objet
> `useState` retourne un tableau avec la valeur actuelle et une fonction pour la modifier.

Q: Quand s'exécute `useEffect(() => {}, [])` ?
- [ ] À chaque rendu
- [x] Au montage seulement
- [ ] Jamais
> Un tableau de dépendances vide `[]` signifie que l'effet ne s'exécute qu'une fois au montage.

Q: À quoi sert `useRef` ?
- [ ] Gérer l'état
- [x] Référencer un élément DOM ou valeur persistante
- [ ] Remplacer `useState`
> `useRef` permet d'accéder au DOM ou de stocker une valeur qui persiste entre les rendus sans causer de re-render.

Q: Comment nettoyer un timer dans useEffect ?
- [ ] `clearInterval(timer)` dans le callback
- [x] Retourner une fonction de cleanup
- [ ] Utiliser `useRef`
> La fonction retournée par useEffect est appelée au démontage ou avant la prochaine exécution.
:::

---

## Exercice pratique

Créez une **App Météo** avec :
- Input pour la ville (`useRef` pour focus auto)
- Recherche avec API (`useState` + `useEffect`)
- Affichage des données météo
- Gestion du loading et des erreurs

<details>
<summary>Structure suggérée</summary>

```jsx
function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    // fetch weather...
    setLoading(false);
  };

  return (/* ... */);
}
```
</details>

---

## Prochaine étape

Découvrez les [Hooks Avancés](./hooks-avances) pour aller plus loin.
