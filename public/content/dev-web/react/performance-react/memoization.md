# Memoization

Apprenez à optimiser vos composants avec **React.memo**, **useMemo** et **useCallback** pour éviter les re-renders inutiles.

---

## Ce que vous allez apprendre

- Comprendre pourquoi les composants se re-render
- Utiliser `React.memo` pour les composants
- Appliquer `useMemo` pour les calculs coûteux
- Utiliser `useCallback` pour les fonctions

## Prérequis

- [React - Hooks](../hooks/hooks-base)
- [React - Composants](../composants-jsx/jsx-composants-base)

---

## Comprendre les re-renders

Un composant React se re-render quand :
1. Son **state** change
2. Ses **props** changent
3. Son **parent** se re-render

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild />  {/* Se re-render même si pas de props ! */}
    </div>
  );
}

function ExpensiveChild() {
  console.log('ExpensiveChild render');
  
  // Calcul coûteux
  const result = Array.from({ length: 10000 }).reduce((acc, _, i) => acc + i, 0);
  
  return <div>Result: {result}</div>;
}
```

**Problème** : `ExpensiveChild` se re-render à chaque clic, même si ses props ne changent pas !

---

## React.memo

**React.memo** empêche le re-render si les props n'ont pas changé.

### Syntaxe de base

```jsx
const ExpensiveChild = React.memo(function ExpensiveChild() {
  console.log('ExpensiveChild render');
  
  const result = Array.from({ length: 10000 }).reduce((acc, _, i) => acc + i, 0);
  
  return <div>Result: {result}</div>;
});
```

✅ Maintenant, `ExpensiveChild` ne se re-render **que** si ses props changent !

### Avec props

```jsx
const UserCard = React.memo(function UserCard({ user }) {
  console.log('UserCard render');
  
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const user = { name: 'Alice', email: 'alice@example.com' };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <UserCard user={user} />  {/* Se re-render quand même ! Pourquoi ? */}
    </div>
  );
}
```

**Problème** : `user` est un **nouvel objet** à chaque render → props "changent" → re-render !

### Solution : useMemo pour les objets

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  const user = useMemo(
    () => ({ name: 'Alice', email: 'alice@example.com' }),
    []  // Dépendances vides = même objet à chaque render
  );
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <UserCard user={user} />  {/* Ne se re-render plus ! ✅ */}
    </div>
  );
}
```

### Comparaison personnalisée

Par défaut, `React.memo` compare les props avec `===`. Pour une comparaison personnalisée :

```jsx
const UserList = React.memo(
  function UserList({ users }) {
    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  },
  (prevProps, nextProps) => {
    // Retourner `true` si égaux (pas de re-render)
    return prevProps.users.length === nextProps.users.length &&
           prevProps.users.every((u, i) => u.id === nextProps.users[i].id);
  }
);
```

---

## useMemo

**useMemo** mémorise le **résultat** d'un calcul coûteux.

### Syntaxe

```jsx
const memoizedValue = useMemo(() => {
  // Calcul coûteux
  return computeExpensiveValue(a, b);
}, [a, b]);  // Recalculer uniquement si a ou b changent
```

### Exemple : Filtrage d'une grande liste

```jsx
function ProductList({ products, searchTerm }) {
  // ❌ SANS useMemo : filtrage à chaque render
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <ul>
      {filteredProducts.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

```jsx
function ProductList({ products, searchTerm }) {
  // ✅ AVEC useMemo : filtrage uniquement si products ou searchTerm changent
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  return (
    <ul>
      {filteredProducts.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Exemple : Tri complexe

```jsx
function DataTable({ data, sortBy, sortOrder }) {
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortBy, sortOrder]);
  
  return (
    <table>
      <tbody>
        {sortedData.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Quand utiliser useMemo ?

✅ **OUI** :
- Calculs coûteux (filtres, tris, aggrégations)
- Grandes listes (milliers d'éléments)
- Objets/tableaux passés en props à des composants mémoïsés

❌ **NON** :
- Calculs simples (`a + b`, `x * 2`)
- Petites listes (< 100 éléments)
- Variables primitives (string, number, boolean)

```jsx
// ❌ PAS NÉCESSAIRE
const double = useMemo(() => count * 2, [count]);

// ✅ OK comme ça
const double = count * 2;
```

---

## useCallback

**useCallback** mémorise une **fonction** pour éviter qu'elle soit recréée à chaque render.

### Syntaxe

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);  // Recréer uniquement si a ou b changent
```

### Problème : Fonctions recréées

```jsx
const Button = React.memo(function Button({ onClick, children }) {
  console.log('Button render');
  return <button onClick={onClick}>{children}</button>;
});

function App() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('Clicked!');
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Button onClick={handleClick}>Action</Button>  {/* Se re-render ! */}
    </div>
  );
}
```

**Problème** : `handleClick` est une **nouvelle fonction** à chaque render → props "changent" → `Button` se re-render !

### Solution : useCallback

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);  // Jamais recréée
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Button onClick={handleClick}>Action</Button>  {/* Ne se re-render plus ! ✅ */}
    </div>
  );
}
```

### Avec dépendances

```jsx
function TodoList({ todos }) {
  const [filter, setFilter] = useState('all');
  
  const handleDelete = useCallback((id) => {
    console.log('Deleting todo', id);
    // Appel API...
  }, []);  // Pas de dépendances, fonction stable
  
  const handleToggle = useCallback((id) => {
    console.log('Toggling todo', id, 'with filter', filter);
    // Utilise `filter`...
  }, [filter]);  // Recréée uniquement si `filter` change
  
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  );
}

const TodoItem = React.memo(function TodoItem({ todo, onDelete, onToggle }) {
  console.log('TodoItem render');
  
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

---

## useCallback vs useMemo

### Différence

- **useCallback** : mémorise la **fonction**
- **useMemo** : mémorise le **résultat** d'une fonction

```jsx
// useCallback
const handleClick = useCallback(() => {
  console.log('Clicked!');
}, []);

// Équivalent avec useMemo
const handleClick = useMemo(() => {
  return () => {
    console.log('Clicked!');
  };
}, []);
```

### Quand utiliser quoi ?

```jsx
// ✅ useCallback : mémoiser une fonction passée en prop
const handleClick = useCallback(() => {
  doSomething();
}, []);

<Button onClick={handleClick} />

// ✅ useMemo : mémoiser le résultat d'un calcul
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);

<List items={filteredData} />
```

---

## Exemple complet : ProductList optimisée

```jsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [category, setCategory] = useState('all');
  
  // Fetch products (stable avec useCallback)
  const fetchProducts = useCallback(async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // 1. Filtrer par catégorie (useMemo)
  const filteredByCategory = useMemo(() => {
    console.log('Filtering by category...');
    
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
  }, [products, category]);
  
  // 2. Filtrer par recherche (useMemo)
  const filteredBySearch = useMemo(() => {
    console.log('Filtering by search...');
    
    return filteredByCategory.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredByCategory, searchTerm]);
  
  // 3. Trier (useMemo)
  const sortedProducts = useMemo(() => {
    console.log('Sorting products...');
    
    return [...filteredBySearch].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });
  }, [filteredBySearch, sortBy]);
  
  // Handlers (useCallback)
  const handleAddToCart = useCallback((product) => {
    console.log('Adding to cart:', product);
    // Logique panier...
  }, []);
  
  const handleFavorite = useCallback((productId) => {
    console.log('Toggling favorite:', productId);
    // Logique favoris...
  }, []);
  
  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <div className="products">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

// Composants optimisés
const SearchBar = React.memo(function SearchBar({ value, onChange }) {
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

const FilterBar = React.memo(function FilterBar({
  category,
  onCategoryChange,
  sortBy,
  onSortChange
}) {
  console.log('FilterBar render');
  
  return (
    <div>
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="all">Toutes</option>
        <option value="electronics">Électronique</option>
        <option value="clothing">Vêtements</option>
      </select>
      
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="name">Nom</option>
        <option value="price">Prix</option>
      </select>
    </div>
  );
});

const ProductCard = React.memo(function ProductCard({
  product,
  onAddToCart,
  onFavorite
}) {
  console.log('ProductCard render:', product.id);
  
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}€</p>
      <button onClick={() => onAddToCart(product)}>Ajouter au panier</button>
      <button onClick={() => onFavorite(product.id)}>♥</button>
    </div>
  );
});
```

**Résultat** :
- ✅ `SearchBar` se re-render uniquement si `value` change
- ✅ `FilterBar` se re-render uniquement si `category` ou `sortBy` changent
- ✅ `ProductCard` se re-render uniquement si `product` change
- ✅ Filtrage et tri ne se refont que si nécessaire

---

## Erreurs courantes

### ❌ Dépendances manquantes

```jsx
// ❌ MAUVAIS : `count` n'est pas dans les dépendances
const handleClick = useCallback(() => {
  console.log('Count:', count);
}, []);  // ❌ count manquant !
```

```jsx
// ✅ BON
const handleClick = useCallback(() => {
  console.log('Count:', count);
}, [count]);  // ✅
```

### ❌ useMemo/useCallback partout

```jsx
// ❌ MAUVAIS : Sur-optimisation
const name = useMemo(() => user.name, [user]);
const age = useMemo(() => user.age, [user]);
const double = useMemo(() => count * 2, [count]);
```

```jsx
// ✅ BON : Pas besoin de mémoïser
const name = user.name;
const age = user.age;
const double = count * 2;
```

### ❌ React.memo sans nécessité

```jsx
// ❌ MAUVAIS : Composant simple sans props coûteuses
const Title = React.memo(function Title({ text }) {
  return <h1>{text}</h1>;
});
```

```jsx
// ✅ BON : Pas besoin
function Title({ text }) {
  return <h1>{text}</h1>;
}
```

---

## Profiler pour mesurer

Utilisez **React DevTools Profiler** pour identifier les re-renders coûteux.

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} took ${actualDuration}ms to render`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <ProductList />
    </Profiler>
  );
}
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| useMemo/useCallback partout | Overhead inutile | Mesurer d'abord |
| Dépendances manquantes | Valeurs périmées | Inclure toutes les dépendances |
| Objet/fonction inline en prop | React.memo inefficace | useCallback ou useMemo |
| Ignorer le Profiler | Optimisation aveugle | Toujours mesurer |

---

## Quiz de vérification

:::quiz
Q: Quand un composant React se re-render ?
- [ ] Seulement quand ses props changent
- [x] Quand son state, props ou parent change
- [ ] Jamais automatiquement
> Un composant re-render quand son state change, ses props changent, ou son parent re-render.

Q: Que fait `React.memo` ?
- [ ] Mémorise le state
- [x] Empêche le re-render si props identiques
- [ ] Accélère le DOM
> `React.memo` fait une comparaison superficielle des props et évite le re-render si elles sont identiques.

Q: Quand utiliser `useMemo` ?
- [ ] Pour toutes les variables
- [x] Pour les calculs coûteux
- [ ] Pour les événements
> `useMemo` mémorise le résultat d'un calcul coûteux pour éviter de le recalculer à chaque rendu.

Q: Pourquoi `useCallback` pour une fonction passée en prop ?
- [ ] Pour la rendre plus rapide
- [x] Pour garder la même référence entre renders
- [ ] Pour la rendre asynchrone
> `useCallback` évite de recréer la fonction à chaque rendu, préservant ainsi React.memo.
:::

---

## Bonnes pratiques

- Mesurez d'abord avec le Profiler
- `React.memo` pour composants avec props stables
- `useMemo` pour calculs coûteux (filtres, tris)
- `useCallback` pour fonctions passées en props
- Toujours inclure toutes les dépendances
- Évitez la sur-optimisation prématurée

---

## Prochaine étape

Découvrez le [Code Splitting](./code-splitting) pour réduire la taille du bundle.
