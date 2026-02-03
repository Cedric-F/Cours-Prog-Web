# Libraries Externes

Découvrez les bibliothèques de state management populaires : **Redux Toolkit**, **Zustand** et **Jotai** pour gérer l'état global.

---

## Redux Toolkit

**Redux Toolkit** est la façon moderne et recommandée d'utiliser Redux.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Configuration de base

```jsx
// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. Créer un slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;  // Immer permet la mutation directe
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

// 2. Exporter les actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 3. Créer le store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});
```

```jsx
// App.jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

```jsx
// Counter.jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

### Slice complexe : Todos

```jsx
// todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        done: false
      });
    },
    deleteTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
      }
    },
    updateTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
      }
    }
  }
});

export const { addTodo, deleteTodo, toggleTodo, updateTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

```jsx
// store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    counter: counterReducer
  }
});
```

### Async avec createAsyncThunk

```jsx
// usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default usersSlice.reducer;
```

```jsx
// UserList.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from './usersSlice';

function UserList() {
  const { data: users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Zustand

**Zustand** est une bibliothèque minimaliste et rapide pour le state management.

### Installation

```bash
npm install zustand
```

### Store de base

```jsx
// store.js
import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));
```

```jsx
// Counter.jsx
import { useCounterStore } from './store';

function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Store complexe : Todos

```jsx
// todoStore.js
import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [],
  
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      done: false
    }]
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  })),
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.done)
  }))
}));
```

```jsx
// TodoList.jsx
import { useTodoStore } from './todoStore';

function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

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
  const addTodo = useTodoStore((state) => state.addTodo);
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

### Async dans Zustand

```jsx
// userStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

```jsx
// UserList.jsx
import { useEffect } from 'react';
import { useUserStore } from './userStore';

function UserList() {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Persistance avec localStorage

```jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'fr',
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language })
    }),
    {
      name: 'settings-storage'  // Nom dans localStorage
    }
  )
);
```

---

## Jotai

**Jotai** est une bibliothèque atomique pour le state management.

### Installation

```bash
npm install jotai
```

### Atoms de base

```jsx
// atoms.js
import { atom } from 'jotai';

// Atom simple
export const countAtom = atom(0);

// Atom dérivé (lecture seule)
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Atom avec lecture et écriture
export const incrementAtom = atom(
  (get) => get(countAtom),
  (get, set) => set(countAtom, get(countAtom) + 1)
);
```

```jsx
// Counter.jsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { countAtom, doubleCountAtom, incrementAtom } from './atoms';

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  const increment = useSetAtom(incrementAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={increment}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Atoms complexes : Todos

```jsx
// todoAtoms.js
import { atom } from 'jotai';

// Atom des todos
export const todosAtom = atom([]);

// Atom dérivé : filtrer
export const filterAtom = atom('all');

export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'completed') return todos.filter(t => t.done);
  return todos;
});

// Atom dérivé : stats
export const statsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    active: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length
  };
});

// Actions
export const addTodoAtom = atom(
  null,
  (get, set, text) => {
    set(todosAtom, [
      ...get(todosAtom),
      { id: Date.now(), text, done: false }
    ]);
  }
);

export const toggleTodoAtom = atom(
  null,
  (get, set, id) => {
    set(todosAtom, get(todosAtom).map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }
);

export const deleteTodoAtom = atom(
  null,
  (get, set, id) => {
    set(todosAtom, get(todosAtom).filter(todo => todo.id !== id));
  }
);
```

```jsx
// TodoApp.jsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  filteredTodosAtom,
  statsAtom,
  filterAtom,
  addTodoAtom,
  toggleTodoAtom,
  deleteTodoAtom
} from './todoAtoms';

function TodoApp() {
  return (
    <div>
      <TodoForm />
      <TodoFilters />
      <TodoList />
      <TodoStats />
    </div>
  );
}

function TodoForm() {
  const addTodo = useSetAtom(addTodoAtom);
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

function TodoFilters() {
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <div>
      <button onClick={() => setFilter('all')}>Toutes</button>
      <button onClick={() => setFilter('active')}>Actives</button>
      <button onClick={() => setFilter('completed')}>Complétées</button>
    </div>
  );
}

function TodoList() {
  const todos = useAtomValue(filteredTodosAtom);
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);

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

function TodoStats() {
  const stats = useAtomValue(statsAtom);

  return (
    <div>
      <p>Total : {stats.total}</p>
      <p>Actives : {stats.active}</p>
      <p>Complétées : {stats.completed}</p>
    </div>
  );
}
```

### Async dans Jotai

```jsx
import { atom } from 'jotai';

// Atom asynchrone
export const usersAtom = atom(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
});
```

```jsx
import { useAtomValue } from 'jotai';
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <UserList />
    </Suspense>
  );
}

function UserList() {
  const users = useAtomValue(usersAtom);  // Attend automatiquement

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Comparaison des bibliothèques

| Feature | Redux Toolkit | Zustand | Jotai |
|---------|---------------|---------|-------|
| **Taille** | ~14 KB | ~1 KB | ~3 KB |
| **Boilerplate** | Moyen | Minimal | Minimal |
| **DevTools** | ✅ Excellent | ✅ Bon | ⚠️ Basique |
| **TypeScript** | ✅ Excellent | ✅ Bon | ✅ Excellent |
| **Courbe d'apprentissage** | Moyenne | Facile | Facile |
| **Performance** | Bon | Excellent | Excellent |
| **Async** | createAsyncThunk | Natif | Natif (Suspense) |
| **Persistance** | Plugin | Middleware | Plugin |
| **Cas d'usage** | Apps grandes | Apps petites/moyennes | Apps atomiques |

---

## Choisir la bonne bibliothèque

### Redux Toolkit si :
- ✅ Grande application avec beaucoup d'état
- ✅ Équipe habituée à Redux
- ✅ Besoin de DevTools puissants
- ✅ Nombreuses actions complexes

### Zustand si :
- ✅ Application petite à moyenne
- ✅ Besoin de simplicité
- ✅ Pas envie de boilerplate
- ✅ Performance critique

### Jotai si :
- ✅ État atomique et granulaire
- ✅ Besoin de dérivations complexes
- ✅ Utilisation de Suspense
- ✅ TypeScript strict

---

## Bonnes pratiques

### ✅ Séparer la logique du state

```jsx
// ✅ BON : store séparé
// store.js
export const useStore = create((set) => ({ ... }));

// Component.jsx
import { useStore } from './store';

// ❌ MAUVAIS : store dans le composant
function Component() {
  const store = create((set) => ({ ... }));  // ❌
}
```

### ✅ N'abuser pas du state global

```jsx
// ✅ BON : State local pour UI
function Modal() {
  const [isOpen, setIsOpen] = useState(false);  // Local
}

// ❌ MAUVAIS : State global pour tout
const useStore = create((set) => ({
  modalOpen: false,  // Pas nécessaire !
  ...
}));
```

---

## Exercice pratique

Créez une **App E-commerce** avec :
- **Redux Toolkit** : Produits et panier
- **Zustand** : Préférences utilisateur
- **Jotai** : Filtres et tri
- Async : Fetch des produits
- Persistance : localStorage
- DevTools : Debugging

**Bonus** : Comparez les 3 approches !

---

**Prochaine étape** : [Patterns & Architecture](./patterns-architecture) !
