# Pagination et Filtrage API

Implémentez la pagination et le filtrage pour vos API REST avec de grandes collections.

---

## 📚 Ce que vous allez apprendre

- Implémenter la pagination offset et cursor
- Ajouter le tri et le filtrage
- Créer des réponses API standardisées
- Optimiser les performances

## ⚠️ Prérequis

- [Création d'API REST](./api-rest.md)
- [MongoDB & Mongoose](../databases/mongodb-base.md)

---

## Pourquoi paginer ?

### Sans pagination

```javascript
// ❌ DANGER : Charge TOUS les produits
app.get('/api/products', async (req, res) => {
  const products = await Product.find(); // 100 000 produits = 💥
  res.json(products);
});
```

### Avec pagination

```javascript
// ✅ Charge seulement 20 produits à la fois
app.get('/api/products', async (req, res) => {
  const products = await Product.find().limit(20);
  res.json(products);
});
```

---

## Pagination Offset (classique)

### Principe

```
Page 1: skip(0).limit(10)   → produits 1-10
Page 2: skip(10).limit(10)  → produits 11-20
Page 3: skip(20).limit(10)  → produits 21-30
```

### Implémentation basique

```javascript
app.get('/api/products', async (req, res) => {
  try {
    // Paramètres avec valeurs par défaut
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validation
    const maxLimit = 100;
    const safeLimit = Math.min(limit, maxLimit);
    const skip = (page - 1) * safeLimit;
    
    // Requête
    const products = await Product.find()
      .skip(skip)
      .limit(safeLimit);
    
    // Total pour la pagination
    const total = await Product.countDocuments();
    
    res.json({
      data: products,
      pagination: {
        page,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Exemple de réponse

```json
{
  "data": [
    { "_id": "...", "name": "Produit 1", "price": 29.99 },
    { "_id": "...", "name": "Produit 2", "price": 49.99 }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### URL d'exemple

```
GET /api/products?page=2&limit=20
```

---

## Middleware de pagination réutilisable

```javascript
// middleware/paginate.js
const paginate = (defaultLimit = 10, maxLimit = 100) => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      maxLimit,
      Math.max(1, parseInt(req.query.limit) || defaultLimit)
    );
    
    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit
    };
    
    next();
  };
};

module.exports = paginate;
```

```javascript
// Utilisation
const paginate = require('../middleware/paginate');

router.get('/products', paginate(10, 50), async (req, res) => {
  const { skip, limit, page } = req.pagination;
  
  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments()
  ]);
  
  res.json({
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
});
```

---

## Tri (Sorting)

### Implémentation

```javascript
app.get('/api/products', async (req, res) => {
  const { sort, order } = req.query;
  
  // Champs autorisés pour le tri
  const allowedSortFields = ['name', 'price', 'createdAt', 'rating'];
  
  let sortOptions = {};
  
  if (sort && allowedSortFields.includes(sort)) {
    sortOptions[sort] = order === 'desc' ? -1 : 1;
  } else {
    // Tri par défaut
    sortOptions.createdAt = -1;
  }
  
  const products = await Product.find()
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  
  res.json({ data: products });
});
```

### URLs d'exemple

```
GET /api/products?sort=price&order=asc    # Prix croissant
GET /api/products?sort=price&order=desc   # Prix décroissant
GET /api/products?sort=createdAt          # Plus récents (défaut: asc)
GET /api/products?sort=name               # Alphabétique
```

### Tri multiple

```javascript
// ?sort=category,-price (catégorie asc, prix desc)
const sortQuery = req.query.sort || '-createdAt';

const sortOptions = {};
sortQuery.split(',').forEach(field => {
  if (field.startsWith('-')) {
    sortOptions[field.slice(1)] = -1;
  } else {
    sortOptions[field] = 1;
  }
});
```

---

## Filtrage

### Filtres basiques

```javascript
app.get('/api/products', async (req, res) => {
  const { category, minPrice, maxPrice, inStock } = req.query;
  
  const filter = {};
  
  // Filtre par catégorie
  if (category) {
    filter.category = category;
  }
  
  // Filtre par prix
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  
  // Filtre booléen
  if (inStock !== undefined) {
    filter.stock = inStock === 'true' ? { $gt: 0 } : 0;
  }
  
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit);
  
  res.json({ data: products });
});
```

### URLs d'exemple

```
GET /api/products?category=electronics
GET /api/products?minPrice=10&maxPrice=100
GET /api/products?inStock=true
GET /api/products?category=electronics&minPrice=50&sort=-price
```

### Recherche textuelle

```javascript
// Avec index texte MongoDB
// Dans le modèle : productSchema.index({ name: 'text', description: 'text' });

app.get('/api/products', async (req, res) => {
  const { search } = req.query;
  
  let filter = {};
  
  if (search) {
    filter.$text = { $search: search };
  }
  
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit);
  
  res.json({ data: products });
});

// URL: /api/products?search=laptop gaming
```

### Recherche par regex (simple)

```javascript
if (search) {
  filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];
}
```

---

## Solution complète

```javascript
// controllers/productController.js
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    // === PAGINATION ===
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    
    // === FILTRES ===
    const filter = {};
    
    // Catégorie
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Prix
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Stock
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    // Recherche
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // === TRI ===
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };
    
    // === EXÉCUTION ===
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-__v'), // Exclure __v
      Product.countDocuments(filter)
    ]);
    
    // === RÉPONSE ===
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      filters: {
        category: req.query.category || null,
        priceRange: {
          min: req.query.minPrice || null,
          max: req.query.maxPrice || null
        },
        search: req.query.search || null
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = { getProducts };
```

---

## Pagination Cursor (avancée)

### Pourquoi ?

| Offset | Cursor |
|--------|--------|
| Simple à implémenter | Plus complexe |
| ⚠️ Problème si données changent | ✅ Stable |
| ⚠️ Lent sur grandes collections | ✅ Performant |
| Accès page N direct | Séquentiel seulement |

### Implémentation

```javascript
app.get('/api/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor; // ID du dernier élément
  
  let filter = {};
  
  if (cursor) {
    filter._id = { $gt: cursor };
  }
  
  const products = await Product.find(filter)
    .sort({ _id: 1 })
    .limit(limit + 1); // +1 pour savoir s'il y a une page suivante
  
  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, -1) : products;
  const nextCursor = hasMore ? data[data.length - 1]._id : null;
  
  res.json({
    data,
    pagination: {
      nextCursor,
      hasMore
    }
  });
});
```

### Utilisation côté client

```javascript
// Première page
const res1 = await fetch('/api/products?limit=10');
const { data, pagination } = await res1.json();

// Page suivante
if (pagination.hasMore) {
  const res2 = await fetch(`/api/products?limit=10&cursor=${pagination.nextCursor}`);
}
```

---

## Côté Client (React)

### Hook personnalisé

```javascript
// hooks/usePagination.js
import { useState, useEffect } from 'react';

export function usePagination(fetchFn, initialParams = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFn(params);
        setData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params]);
  
  const goToPage = (page) => {
    setParams(prev => ({ ...prev, page }));
  };
  
  const updateFilters = (newFilters) => {
    setParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  return { 
    data, 
    pagination, 
    loading, 
    error, 
    goToPage, 
    updateFilters 
  };
}
```

### Composant de pagination

```jsx
function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;
  
  const { page, pages, hasNextPage, hasPrevPage } = pagination;
  
  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Précédent
      </button>
      
      <span>
        Page {page} sur {pages}
      </span>
      
      <button 
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
}
```

### Page produits complète

```jsx
function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  
  const { data, pagination, loading, goToPage, updateFilters } = usePagination(
    (params) => api.get('/products', params),
    { page: 1, limit: 12 }
  );
  
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters(filters);
  };
  
  return (
    <div>
      {/* Filtres */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Toutes catégories</option>
          <option value="electronics">Électronique</option>
          <option value="clothing">Vêtements</option>
        </select>
        <button type="submit">Filtrer</button>
      </form>
      
      {/* Résultats */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {data.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <Pagination 
            pagination={pagination} 
            onPageChange={goToPage} 
          />
        </>
      )}
    </div>
  );
}
```

---

## Optimisations

### Index MongoDB

```javascript
// Dans le modèle
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

// Index composé pour les requêtes fréquentes
productSchema.index({ category: 1, price: 1 });
```

### Projection (sélection de champs)

```javascript
// Ne charger que les champs nécessaires
const products = await Product.find(filter)
  .select('name price image category')
  .skip(skip)
  .limit(limit);
```

### Cache des comptages

```javascript
// Le countDocuments() est coûteux sur grandes collections
// Mettre en cache si les données changent peu

const redis = require('redis');
const client = redis.createClient();

const getProductCount = async (filter) => {
  const cacheKey = `products:count:${JSON.stringify(filter)}`;
  
  // Vérifier le cache
  const cached = await client.get(cacheKey);
  if (cached) return parseInt(cached);
  
  // Calculer et mettre en cache
  const count = await Product.countDocuments(filter);
  await client.setEx(cacheKey, 300, count.toString()); // 5 min
  
  return count;
};
```

---

## ❌ Erreurs Courantes

### 1. Pas de limite maximale

```javascript
// ❌ L'utilisateur peut demander 1 million de résultats
const limit = parseInt(req.query.limit);

// ✅ Toujours limiter
const limit = Math.min(parseInt(req.query.limit) || 10, 100);
```

### 2. Oublier le total

```javascript
// ❌ Le client ne peut pas afficher "Page X sur Y"
res.json({ data: products });

// ✅ Inclure les infos de pagination
res.json({
  data: products,
  pagination: { page, limit, total, pages }
});
```

### 3. Filtrer sur des champs non indexés

```javascript
// ❌ Très lent sur grandes collections
Product.find({ description: /laptop/i });

// ✅ Utiliser un index texte
Product.find({ $text: { $search: 'laptop' } });
```

---

## ✅ Quiz Rapide

1. Quelle méthode Mongoose saute N documents ?
   - A) `offset()`
   - B) `skip()` ✅
   - C) `jump()`

2. Pourquoi limiter le `limit` maximum ?
   - A) Pour le style
   - B) Éviter de surcharger le serveur ✅
   - C) MongoDB l'exige

3. Quel type de pagination est meilleur pour l'infinite scroll ?
   - A) Offset
   - B) Cursor ✅
   - C) Les deux sont égaux

---

## 🔗 Pour aller plus loin

- [MongoDB - Query Optimization](https://docs.mongodb.com/manual/core/query-optimization/)
- [Mongoose - Queries](https://mongoosejs.com/docs/queries.html)

---

## ➡️ Prochaine étape

Découvrez l'[Upload de fichiers](../files/upload-fichiers.md) pour gérer les images de vos produits.
