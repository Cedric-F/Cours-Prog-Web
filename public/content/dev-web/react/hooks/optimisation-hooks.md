# Optimisation avec Hooks

Optimisez vos applications React avec **useMemo**, **useCallback** et les patterns de performance avancés.

---

## useMemo : Mémoïsation de valeurs

Le hook **useMemo** mémoïse le résultat d'un calcul coûteux pour éviter de le recalculer à chaque render.

### Problème : Calculs répétés

```jsx
function ExpensiveList({ items }) {
  // ❌ Ce calcul s'exécute à CHAQUE render
  const sortedItems = items.sort((a, b) => b.price - a.price);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id}>{item.name} - {item.price}€</li>
      ))}
    </ul>
  );
}
```

### Solution : useMemo

```jsx
import { useMemo } from 'react';

function ExpensiveList({ items }) {
  // ✅ Ce calcul ne s'exécute que quand items change
  const sortedItems = useMemo(() => {
    console.log('Tri des items...');
    return items.sort((a, b) => b.price - a.price);
  }, [items]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id}>{item.name} - {item.price}€</li>
      ))}
    </ul>
  );
}
```

### Quand utiliser useMemo ?

```jsx
// ✅ BON : Calcul coûteux
const expensiveResult = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// ✅ BON : Filtrage/tri de grandes listes
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);

// ❌ INUTILE : Calcul simple
const sum = useMemo(() => a + b, [a, b]);  // Overkill !
```

### Exemples pratiques

```jsx
function ProductList({ products, category, sortBy }) {
  // Filtrer par catégorie
  const filteredProducts = useMemo(() => {
    console.log('Filtrage...');
    return products.filter(p => 
      category === 'all' || p.category === category
    );
  }, [products, category]);

  // Trier
  const sortedProducts = useMemo(() => {
    console.log('Tri...');
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });
  }, [filteredProducts, sortBy]);

  // Statistiques
  const stats = useMemo(() => {
    console.log('Calcul des stats...');
    return {
      total: sortedProducts.length,
      averagePrice: sortedProducts.reduce((sum, p) => sum + p.price, 0) / sortedProducts.length
    };
  }, [sortedProducts]);

  return (
    <div>
      <p>Total : {stats.total} produits</p>
      <p>Prix moyen : {stats.averagePrice.toFixed(2)}€</p>
      <ul>
        {sortedProducts.map(product => (
          <li key={product.id}>{product.name} - {product.price}€</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## useCallback : Mémoïsation de fonctions

Le hook **useCallback** mémoïse une fonction pour éviter de la recréer à chaque render.

### Problème : Fonctions recréées

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ Cette fonction est RECRÉÉE à chaque render
  const handleClick = () => {
    console.log('Cliqué !');
  };

  return <Child onClick={handleClick} />;
}

// Child se re-render même si rien n'a changé
const Child = React.memo(({ onClick }) => {
  console.log('Child render');
  return <button onClick={onClick}>Cliquez</button>;
});
```

### Solution : useCallback

```jsx
import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Cette fonction est MÉMOÏSÉE
  const handleClick = useCallback(() => {
    console.log('Cliqué !');
  }, []);  // Dépendances vides = fonction stable

  return (
    <div>
      <p>Count : {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
      <Child onClick={handleClick} />
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child render');  // Ne s'affiche qu'une fois !
  return <button onClick={onClick}>Cliquez</button>;
});
```

### Avec dépendances

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // ✅ Fonction mémoïsée qui dépend de todos
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);  // Pas de dépendances car on utilise setTodos avec fonction

  // ✅ Fonction mémoïsée avec dépendance
  const getFilteredTodos = useCallback(() => {
    if (filter === 'active') {
      return todos.filter(t => !t.done);
    }
    if (filter === 'completed') {
      return todos.filter(t => t.done);
    }
    return todos;
  }, [todos, filter]);

  return (
    <div>
      {getFilteredTodos().map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onDelete }) => {
  console.log('TodoItem render:', todo.id);
  return (
    <div>
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Supprimer</button>
    </div>
  );
});
```

### useCallback vs useMemo

```jsx
// useCallback : Mémoïse la FONCTION
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo : Mémoïse le RÉSULTAT
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// Équivalent :
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

---

## React.memo : Mémoïsation de composants

**React.memo** empêche les re-renders inutiles d'un composant.

### Sans React.memo

```jsx
// ❌ Ce composant se re-render même si les props n'ont pas changé
function ExpensiveComponent({ name }) {
  console.log('Render:', name);
  // Calculs coûteux...
  return <div>{name}</div>;
}

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent name="Alice" />
      {/* Re-render à chaque clic même si name ne change pas ! */}
    </div>
  );
}
```

### Avec React.memo

```jsx
import { memo } from 'react';

// ✅ Ce composant ne se re-render que si les props changent
const ExpensiveComponent = memo(function ExpensiveComponent({ name }) {
  console.log('Render:', name);
  return <div>{name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent name="Alice" />
      {/* Ne re-render PAS quand count change ! */}
    </div>
  );
}
```

### Comparaison personnalisée

```jsx
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>;
  },
  // Comparaison personnalisée
  (prevProps, nextProps) => {
    // Retourner true si les props sont ÉGALES (pas de re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

---

## Patterns d'optimisation

### Pattern : Séparation des états

```jsx
// ❌ MAUVAIS : Un état cause le re-render de tout
function App() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [products, setProducts] = useState([]);

  return (
    <div>
      <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
      {/* ProductList se re-render à chaque frappe ! */}
      <ProductList products={products} />
    </div>
  );
}

// ✅ BON : Séparer en composants
function App() {
  const [products, setProducts] = useState([]);

  return (
    <div>
      <UserForm />
      <ProductList products={products} />
    </div>
  );
}

function UserForm() {
  const [user, setUser] = useState({ name: '', email: '' });
  return (
    <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
  );
}
```

### Pattern : Composition avec children

```jsx
// ❌ MAUVAIS : Parent re-render = children re-render
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent />
    </div>
  );
}

// ✅ BON : children ne re-render pas
function App() {
  return (
    <CounterWrapper>
      <ExpensiveComponent />
    </CounterWrapper>
  );
}

function CounterWrapper({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {children}  {/* Pas re-render ! */}
    </div>
  );
}
```

### Pattern : Lazy state initialization

```jsx
// ❌ MAUVAIS : Calcul à chaque render
function Component() {
  const [data, setData] = useState(expensiveComputation());
}

// ✅ BON : Calcul uniquement au premier render
function Component() {
  const [data, setData] = useState(() => expensiveComputation());
}
```

---

## Exemple complet : Liste optimisée

```jsx
import { useState, useMemo, useCallback, memo } from 'react';

function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', price: 1000, category: 'tech' },
    { id: 2, name: 'Phone', price: 500, category: 'tech' },
    { id: 3, name: 'Shirt', price: 30, category: 'clothing' },
    // ... 1000 produits
  ]);

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filtrer (mémoïsé)
  const filteredProducts = useMemo(() => {
    console.log('Filtrage...');
    return products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);

  // Trier (mémoïsé)
  const sortedProducts = useMemo(() => {
    console.log('Tri...');
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });
  }, [filteredProducts, sortBy]);

  // Supprimer (fonction mémoïsée)
  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Modifier (fonction mémoïsée)
  const updateProduct = useCallback((id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  return (
    <div>
      <SearchBar value={filter} onChange={setFilter} />
      <SortSelector value={sortBy} onChange={setSortBy} />
      
      <div className="product-grid">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={deleteProduct}
            onUpdate={updateProduct}
          />
        ))}
      </div>
    </div>
  );
}

// Composants optimisés avec memo
const SearchBar = memo(({ value, onChange }) => {
  console.log('SearchBar render');
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Rechercher..."
    />
  );
});

const SortSelector = memo(({ value, onChange }) => {
  console.log('SortSelector render');
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="name">Nom</option>
      <option value="price">Prix</option>
    </select>
  );
});

const ProductCard = memo(({ product, onDelete, onUpdate }) => {
  console.log('ProductCard render:', product.id);

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>{product.price}€</p>
      <button onClick={() => onDelete(product.id)}>Supprimer</button>
      <button onClick={() => onUpdate(product.id, { price: product.price + 10 })}>
        +10€
      </button>
    </div>
  );
});

export default ProductList;
```

---

## Bonnes pratiques

### ✅ Profiler avant d'optimiser

```jsx
// Utilisez React DevTools Profiler pour identifier
// les problèmes de performance AVANT d'optimiser
```

### ✅ N'optimisez pas prématurément

```jsx
// ❌ MAUVAIS : Optimiser sans raison
const sum = useMemo(() => a + b, [a, b]);  // Inutile !

// ✅ BON : Optimiser quand nécessaire
const expensiveResult = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

### ✅ Combiner les optimisations

```jsx
// ✅ React.memo + useCallback
const Child = memo(({ onClick }) => {
  return <button onClick={onClick}>Cliquez</button>;
});

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Cliqué');
  }, []);

  return <Child onClick={handleClick} />;
}
```

### ✅ Attention aux dépendances

```jsx
// ❌ MAUVAIS : Dépendances manquantes
const memoized = useMemo(() => {
  return items.filter(item => item.category === filter);
}, [items]);  // filter manquant !

// ✅ BON : Toutes les dépendances
const memoized = useMemo(() => {
  return items.filter(item => item.category === filter);
}, [items, filter]);
```

---

## Exercice pratique

Créez une **App de Data Table** avec :
- Liste de 1000+ items
- Recherche avec debounce (custom hook)
- Tri par colonne (useMemo)
- Pagination (useMemo)
- Actions sur items (useCallback)
- Composants optimisés (React.memo)
- Profiling des performances

**Bonus** : Ajoutez la sélection multiple et l'export CSV !

---

**Chapitre suivant** : [Context API](../state-management/context-api.md) pour le state global ! 🌍
