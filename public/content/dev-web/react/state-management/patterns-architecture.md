# Patterns & Architecture

Découvrez les **patterns architecturaux** pour structurer votre state management efficacement.

---

## Principes fondamentaux

### 1. **Separation of Concerns**

Séparez la logique métier de l'UI :

```jsx
// ❌ MAUVAIS : Tout dans le composant
function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (/* JSX complexe */);
}
```

```jsx
// ✅ BON : Séparation claire
// store.js
export const useProductStore = create((set) => ({
  products: [],
  filter: '',
  loading: false,
  
  fetchProducts: async () => {
    set({ loading: true });
    const response = await fetch('/api/products');
    const data = await response.json();
    set({ products: data, loading: false });
  },
  
  setFilter: (filter) => set({ filter })
}));

// selectors.js
export const selectFilteredProducts = (state) =>
  state.products.filter(p =>
    p.name.toLowerCase().includes(state.filter.toLowerCase())
  );

// ProductList.jsx
function ProductList() {
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const filteredProducts = useProductStore(selectFilteredProducts);
  const loading = useProductStore(state => state.loading);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  if (loading) return <Spinner />;
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

### 2. **Single Source of Truth**

Un seul endroit pour chaque donnée :

```jsx
// ❌ MAUVAIS : Données dupliquées
const [user, setUser] = useState(null);
const [userId, setUserId] = useState(null);
const [userName, setUserName] = useState('');

// ✅ BON : Une seule source
const [user, setUser] = useState(null);
const userId = user?.id;
const userName = user?.name;
```

### 3. **Immutabilité**

Ne jamais muter le state directement :

```jsx
// ❌ MAUVAIS
state.todos.push(newTodo);

// ✅ BON
set({ todos: [...state.todos, newTodo] });
```

---

## Pattern : Flux Architecture

**Flux** est le pattern architectural derrière Redux.

### Flux unidirectionnel

```
Action → Dispatcher → Store → View
   ↑                              ↓
   └──────────────────────────────┘
```

### Implémentation avec Redux Toolkit

```jsx
// slice.js
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      state.total += item.price;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload);
      if (index !== -1) {
        state.total -= state.items[index].price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    }
  }
});
```

```jsx
// Component.jsx
function Cart() {
  const items = useSelector(state => state.cart.items);
  const total = useSelector(state => state.cart.total);
  const dispatch = useDispatch();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} x{item.quantity}</span>
          <button onClick={() => dispatch(removeItem(item.id))}>
            Supprimer
          </button>
        </div>
      ))}
      <p>Total : {total}€</p>
    </div>
  );
}
```

---

## Pattern : Atomic State

**Jotai** et **Recoil** utilisent ce pattern.

### Atomes indépendants

```jsx
// atoms.js
export const userAtom = atom(null);
export const cartAtom = atom([]);
export const themeAtom = atom('light');

// Atomes dérivés
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
```

### Avantages

- ✅ **Granularité** : Chaque composant s'abonne uniquement aux atomes nécessaires
- ✅ **Performance** : Pas de re-render inutile
- ✅ **Composition** : Les atomes dérivés se recomposent facilement

```jsx
function CartBadge() {
  const count = useAtomValue(cartCountAtom);  // S'abonne uniquement au count
  
  return <span className="badge">{count}</span>;
}

function CartTotal() {
  const total = useAtomValue(cartTotalAtom);  // S'abonne uniquement au total
  
  return <p>Total : {total}€</p>;
}
```

---

## Pattern : Feature-based Structure

Organisez votre code par **feature** plutôt que par type de fichier.

### ❌ Mauvaise structure (par type)

```
src/
├── components/
│   ├── ProductList.jsx
│   ├── CartItem.jsx
│   ├── UserProfile.jsx
├── store/
│   ├── productSlice.js
│   ├── cartSlice.js
│   ├── userSlice.js
├── hooks/
│   ├── useProducts.js
│   ├── useCart.js
```

### ✅ Bonne structure (par feature)

```
src/
├── features/
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductItem.jsx
│   │   ├── productSlice.js
│   │   ├── useProducts.js
│   ├── cart/
│   │   ├── Cart.jsx
│   │   ├── CartItem.jsx
│   │   ├── cartSlice.js
│   │   ├── useCart.js
│   ├── user/
│   │   ├── UserProfile.jsx
│   │   ├── userSlice.js
│   │   ├── useUser.js
```

**Avantages** :
- ✅ Facile de trouver tout ce qui concerne une feature
- ✅ Suppression d'une feature = suppression d'un dossier
- ✅ Scalable pour grandes apps

---

## Pattern : Layered Architecture

Séparez votre app en **couches** :

```
┌─────────────────────────────┐
│        UI Layer             │  ← Composants React
├─────────────────────────────┤
│     Application Layer       │  ← Hooks, logique métier
├─────────────────────────────┤
│       State Layer           │  ← Store, Context, Atoms
├─────────────────────────────┤
│        API Layer            │  ← Services, fetch
└─────────────────────────────┘
```

### Implémentation

```jsx
// API Layer
// services/productService.js
export const productService = {
  fetchAll: () => fetch('/api/products').then(res => res.json()),
  fetchById: (id) => fetch(`/api/products/${id}`).then(res => res.json()),
  create: (data) => fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json())
};

// State Layer
// store/productSlice.js
const productSlice = createSlice({
  name: 'products',
  initialState: { data: [], loading: false, error: null },
  reducers: { /* ... */ }
});

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  () => productService.fetchAll()
);

// Application Layer
// hooks/useProducts.js
export function useProducts() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.data);
  const loading = useSelector(state => state.products.loading);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  return { products, loading };
}

// UI Layer
// components/ProductList.jsx
function ProductList() {
  const { products, loading } = useProducts();
  
  if (loading) return <Spinner />;
  
  return (
    <ul>
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

---

## Pattern : Container/Presentational

Séparez les **composants logiques** des **composants d'affichage**.

### Container (Smart Component)

Gère la logique et le state :

```jsx
// ProductListContainer.jsx
function ProductListContainer() {
  const { products, loading, fetchProducts } = useProducts();
  const { addToCart } = useCart();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Produit ajouté !');
  };
  
  return (
    <ProductListView
      products={products}
      loading={loading}
      onAddToCart={handleAddToCart}
    />
  );
}
```

### Presentational (Dumb Component)

Affiche uniquement :

```jsx
// ProductListView.jsx
function ProductListView({ products, loading, onAddToCart }) {
  if (loading) return <Spinner />;
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}€</p>
          <button onClick={() => onAddToCart(product)}>
            Ajouter au panier
          </button>
        </li>
      ))}
    </ul>
  );
}
```

**Avantages** :
- ✅ Composants d'affichage réutilisables
- ✅ Facile à tester (props uniquement)
- ✅ Logique centralisée

---

## Pattern : Optimistic Updates

Mettre à jour l'UI **avant** la réponse du serveur.

```jsx
// Zustand
export const useTodoStore = create((set, get) => ({
  todos: [],
  
  addTodo: async (text) => {
    const newTodo = { id: Date.now(), text, done: false };
    
    // 1. Mise à jour optimiste
    set({ todos: [...get().todos, newTodo] });
    
    try {
      // 2. Requête serveur
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo)
      });
      const savedTodo = await response.json();
      
      // 3. Remplacer avec ID serveur
      set({
        todos: get().todos.map(t => 
          t.id === newTodo.id ? savedTodo : t
        )
      });
    } catch (error) {
      // 4. Rollback si erreur
      set({
        todos: get().todos.filter(t => t.id !== newTodo.id)
      });
      toast.error('Erreur lors de l\'ajout');
    }
  }
}));
```

---

## Pattern : Normalization

Stocker les données de manière **normalisée** (comme une base de données).

### ❌ Données dénormalisées

```jsx
const state = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 10, name: 'Alice' },
      comments: [
        { id: 100, text: 'Comment 1', author: { id: 10, name: 'Alice' } },
        { id: 101, text: 'Comment 2', author: { id: 20, name: 'Bob' } }
      ]
    }
  ]
};
```

**Problèmes** :
- Données dupliquées (Alice apparaît 2 fois)
- Difficile de mettre à jour un utilisateur

### ✅ Données normalisées

```jsx
const state = {
  users: {
    10: { id: 10, name: 'Alice' },
    20: { id: 20, name: 'Bob' }
  },
  posts: {
    1: { id: 1, title: 'Post 1', authorId: 10, commentIds: [100, 101] }
  },
  comments: {
    100: { id: 100, text: 'Comment 1', authorId: 10 },
    101: { id: 101, text: 'Comment 2', authorId: 20 }
  }
};
```

**Avantages** :
- ✅ Pas de duplication
- ✅ Facile de mettre à jour
- ✅ Lookups O(1)

### Avec Redux Toolkit

```jsx
import { createEntityAdapter } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter();
const postsAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser: usersAdapter.addOne,
    updateUser: usersAdapter.updateOne
  }
});

// Sélecteurs générés automatiquement
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors((state) => state.users);
```

---

## Quand utiliser quoi ?

### Context API
- ✅ State simple (theme, auth, langue)
- ✅ Petites apps
- ✅ Pas besoin de DevTools

### Redux Toolkit
- ✅ Grandes apps
- ✅ Beaucoup d'actions
- ✅ DevTools essentiels
- ✅ Middleware (logs, analytics)

### Zustand
- ✅ Apps moyennes
- ✅ Simplicité prioritaire
- ✅ Performance critique

### Jotai
- ✅ État granulaire
- ✅ Dérivations complexes
- ✅ Suspense

---

## Anti-patterns à éviter

### ❌ Tout dans le state global

```jsx
// ❌ MAUVAIS
const useStore = create((set) => ({
  modalOpen: false,        // Local !
  hoveredItem: null,       // Local !
  inputValue: '',          // Local !
  user: null,              // Global ✅
  products: []             // Global ✅
}));
```

### ❌ State trop profond

```jsx
// ❌ MAUVAIS
const state = {
  app: {
    user: {
      profile: {
        settings: {
          preferences: {
            theme: 'dark'  // Trop profond !
          }
        }
      }
    }
  }
};

// ✅ BON
const state = {
  user: { id: 1, name: 'Alice' },
  userSettings: { theme: 'dark' }
};
```

### ❌ Actions non descriptives

```jsx
// ❌ MAUVAIS
dispatch({ type: 'UPDATE', payload: data });

// ✅ BON
dispatch({ type: 'products/updatePrice', payload: { id: 1, price: 20 } });
```

---

## Projet complet : E-commerce

### Structure

```
src/
├── features/
│   ├── products/
│   │   ├── productSlice.js
│   │   ├── ProductList.jsx
│   │   ├── ProductItem.jsx
│   ├── cart/
│   │   ├── cartSlice.js
│   │   ├── Cart.jsx
│   │   ├── CartItem.jsx
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── LoginForm.jsx
├── services/
│   ├── api.js
│   ├── productService.js
│   ├── authService.js
├── store/
│   ├── index.js
│   ├── middleware.js
├── App.jsx
```

### Store configuration

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import { loggerMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware)
});
```

### Middleware custom

```jsx
// store/middleware.js
export const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Action:', action.type);
  console.log('State avant:', store.getState());
  
  const result = next(action);
  
  console.log('State après:', store.getState());
  
  return result;
};
```

---

## Bonnes pratiques récapitulatives

1. ✅ **Séparer la logique de l'UI**
2. ✅ **Une seule source de vérité**
3. ✅ **Immutabilité stricte**
4. ✅ **Normaliser les données**
5. ✅ **Structure par feature**
6. ✅ **Utiliser des sélecteurs**
7. ✅ **Actions descriptives**
8. ✅ **State local quand possible**

---

## Exercice pratique

Créez une **App de gestion de projets** avec :
- Redux Toolkit : Projets et tâches (normalisés)
- Context API : Thème et langue
- Layered architecture
- Optimistic updates
- Feature-based structure

**Bonus** : Ajoutez un middleware pour logger les actions !

---

**Prochaine étape** : [Memoization](../performance-react/memoization.md) pour optimiser !
