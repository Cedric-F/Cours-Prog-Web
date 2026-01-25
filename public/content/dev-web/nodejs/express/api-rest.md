# Création d'API REST

Apprenez à concevoir et implémenter des API RESTful professionnelles avec Express.js en suivant les bonnes pratiques de l'industrie.

---

## Ce que vous allez apprendre

- Comprendre les principes REST
- Structurer les routes et controllers
- Gérer les codes de statut HTTP
- Valider les données entrantes
- Formater les réponses de manière cohérente

## Prérequis

- [Express - Bases](./express-base.md)
- [Express - Middleware et Routing](./middleware-routing.md)

---

## Principes REST

REST (Representational State Transfer) est un style d'architecture pour les services web.

### Les 6 Contraintes REST

1. **Client-Serveur** : Séparation des responsabilités
2. **Sans état (Stateless)** : Chaque requête contient toutes les informations nécessaires
3. **Cacheable** : Les réponses peuvent être mises en cache
4. **Interface uniforme** : URLs et méthodes HTTP standards
5. **Système en couches** : L'architecture peut avoir des intermédiaires
6. **Code à la demande** (optionnel) : Le serveur peut envoyer du code exécutable

### Méthodes HTTP et CRUD

| Méthode | Action CRUD | Description | Idempotent |
|---------|-------------|-------------|------------|
| `GET` | Read | Récupérer des ressources | ✅ Oui |
| `POST` | Create | Créer une ressource | ❌ Non |
| `PUT` | Update | Remplacer entièrement | ✅ Oui |
| `PATCH` | Update | Modifier partiellement | ❌ Non |
| `DELETE` | Delete | Supprimer une ressource | ✅ Oui |

### Codes de Statut HTTP

```javascript
// 2xx - Succès
200 // OK - Requête réussie
201 // Created - Ressource créée
204 // No Content - Succès sans body (DELETE)

// 4xx - Erreur client
400 // Bad Request - Requête invalide
401 // Unauthorized - Non authentifié
403 // Forbidden - Non autorisé
404 // Not Found - Ressource inexistante
409 // Conflict - Conflit (doublon)
422 // Unprocessable Entity - Validation échouée

// 5xx - Erreur serveur
500 // Internal Server Error - Erreur interne
503 // Service Unavailable - Service indisponible
```

---

## Conception des URLs

### Bonnes pratiques

```bash
# ✅ Bonnes URLs
GET    /api/users              # Liste des utilisateurs
GET    /api/users/123          # Un utilisateur spécifique
POST   /api/users              # Créer un utilisateur
PUT    /api/users/123          # Remplacer un utilisateur
PATCH  /api/users/123          # Modifier un utilisateur
DELETE /api/users/123          # Supprimer un utilisateur

# Relations imbriquées
GET    /api/users/123/posts    # Posts d'un utilisateur
GET    /api/users/123/posts/456  # Post spécifique d'un utilisateur

# ❌ Mauvaises URLs
GET    /api/getUsers           # Verbe dans l'URL
GET    /api/user               # Singulier au lieu de pluriel
POST   /api/users/create       # Verbe redondant
GET    /api/users/123/delete   # Utiliser DELETE, pas GET
```

### Filtrage, tri et pagination

```bash
# Filtrage
GET /api/products?category=electronics&inStock=true

# Tri
GET /api/products?sort=price&order=asc
GET /api/products?sort=-price              # Préfixe - pour desc

# Pagination
GET /api/products?page=2&limit=20
GET /api/products?offset=20&limit=20       # Alternative

# Recherche
GET /api/products?search=iphone

# Combinaison
GET /api/products?category=phones&sort=-price&page=1&limit=10
```

---

## Implémentation CRUD Complète

### Structure du projet

```
src/
├── controllers/
│   └── productController.js
├── models/
│   └── Product.js
├── routes/
│   └── productRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── validate.js
├── utils/
│   └── AppError.js
└── app.js
```

### Modèle (simulation sans BDD)

```javascript
// models/Product.js
let products = [
  { id: 1, name: 'iPhone 15', price: 999, category: 'phones', stock: 50 },
  { id: 2, name: 'MacBook Pro', price: 2499, category: 'laptops', stock: 25 },
  { id: 3, name: 'AirPods Pro', price: 249, category: 'audio', stock: 100 }
];

let nextId = 4;

class Product {
  static findAll(filters = {}) {
    let result = [...products];
    
    // Filtrage
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }
    
    // Tri
    if (filters.sort) {
      const order = filters.order === 'desc' ? -1 : 1;
      result.sort((a, b) => (a[filters.sort] > b[filters.sort] ? order : -order));
    }
    
    // Pagination
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    
    return {
      data: result.slice(startIndex, startIndex + limit),
      pagination: {
        total: result.length,
        page,
        limit,
        totalPages: Math.ceil(result.length / limit)
      }
    };
  }
  
  static findById(id) {
    return products.find(p => p.id === Number(id));
  }
  
  static create(data) {
    const product = { id: nextId++, ...data };
    products.push(product);
    return product;
  }
  
  static update(id, data) {
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...data };
    return products[index];
  }
  
  static delete(id) {
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    
    products.splice(index, 1);
    return true;
  }
}

module.exports = Product;
```

### Contrôleur

```javascript
// controllers/productController.js
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, sort, order, page, limit } = req.query;
    
    const result = Product.findAll({
      category,
      minPrice,
      maxPrice,
      sort,
      order,
      page,
      limit
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError('Produit non trouvé', 404));
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock } = req.body;
    
    const product = Product.create({ name, price, category, stock });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = Product.update(req.params.id, req.body);
    
    if (!product) {
      return next(new AppError('Produit non trouvé', 404));
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id
exports.patchProduct = async (req, res, next) => {
  try {
    const existingProduct = Product.findById(req.params.id);
    
    if (!existingProduct) {
      return next(new AppError('Produit non trouvé', 404));
    }
    
    // Mise à jour partielle uniquement des champs fournis
    const product = Product.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = Product.delete(req.params.id);
    
    if (!deleted) {
      return next(new AppError('Produit non trouvé', 404));
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

### Routes

```javascript
// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');
const { productSchema, productUpdateSchema } = require('../schemas/productSchema');

router.route('/')
  .get(productController.getAllProducts)
  .post(validate(productSchema), productController.createProduct);

router.route('/:id')
  .get(productController.getProduct)
  .put(validate(productSchema), productController.updateProduct)
  .patch(validate(productUpdateSchema), productController.patchProduct)
  .delete(productController.deleteProduct);

module.exports = router;
```

---

## Validation des Données

### Avec Joi

```bash
npm install joi
```

```javascript
// schemas/productSchema.js
const Joi = require('joi');

exports.productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit faire au moins 2 caractères'
    }),
  price: Joi.number().positive().required()
    .messages({
      'number.positive': 'Le prix doit être positif'
    }),
  category: Joi.string().valid('phones', 'laptops', 'audio', 'accessories').required(),
  stock: Joi.number().integer().min(0).default(0)
});

exports.productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  price: Joi.number().positive(),
  category: Joi.string().valid('phones', 'laptops', 'audio', 'accessories'),
  stock: Joi.number().integer().min(0)
}).min(1); // Au moins un champ requis pour PATCH
```

```javascript
// middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // Retourne toutes les erreurs
      stripUnknown: true    // Supprime les champs non définis
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(422).json({
        success: false,
        error: 'Validation échouée',
        details: errors
      });
    }
    
    req.body = value; // Body validé et nettoyé
    next();
  };
};

module.exports = validate;
```

---

## Format de Réponse Standardisé

### Réponses de succès

```javascript
// Liste avec pagination
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}

// Ressource unique
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15",
    "price": 999
  }
}

// Création réussie (201)
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Nouveau produit",
    ...
  }
}

// Suppression réussie (204 No Content)
// Pas de body
```

### Réponses d'erreur

```javascript
// Erreur de validation (422)
{
  "success": false,
  "error": "Validation échouée",
  "details": [
    { "field": "name", "message": "Le nom est requis" },
    { "field": "price", "message": "Le prix doit être positif" }
  ]
}

// Ressource non trouvée (404)
{
  "success": false,
  "error": "Produit non trouvé"
}

// Erreur serveur (500)
{
  "success": false,
  "error": "Erreur interne du serveur"
}
```

### Helper de réponse

```javascript
// utils/response.js
exports.success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

exports.successWithPagination = (res, data, pagination) => {
  res.json({
    success: true,
    data,
    pagination
  });
};

exports.created = (res, data) => {
  res.status(201).json({
    success: true,
    data
  });
};

exports.noContent = (res) => {
  res.status(204).send();
};

exports.error = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: message
  };
  
  if (details) {
    response.details = details;
  }
  
  res.status(statusCode).json(response);
};
```

---

## Relations et Ressources Imbriquées

### Routes imbriquées

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const postRoutes = require('./postRoutes');

// Routes utilisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);

// Monter les routes posts sous /users/:userId/posts
router.use('/:userId/posts', postRoutes);

module.exports = router;
```

```javascript
// routes/postRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Accéder à :userId

router.get('/', async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.findByUserId(userId);
  res.json({ success: true, data: posts });
});

router.post('/', async (req, res) => {
  const { userId } = req.params;
  const post = await Post.create({ ...req.body, userId });
  res.status(201).json({ success: true, data: post });
});

router.get('/:postId', async (req, res) => {
  const { userId, postId } = req.params;
  const post = await Post.findOne({ id: postId, userId });
  res.json({ success: true, data: post });
});

module.exports = router;
```

---

## Versioning de l'API

### Par URL (recommandé)

```javascript
// routes/v1/index.js
const router = require('express').Router();
router.use('/users', require('./userRoutes'));
router.use('/products', require('./productRoutes'));
module.exports = router;

// routes/v2/index.js
const router = require('express').Router();
router.use('/users', require('./userRoutes')); // Nouvelle version
module.exports = router;

// app.js
app.use('/api/v1', require('./routes/v1'));
app.use('/api/v2', require('./routes/v2'));
```

### Par Header

```javascript
const apiVersion = (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
};

app.use(apiVersion);

app.get('/api/users', (req, res) => {
  if (req.apiVersion === 'v2') {
    // Comportement v2
  } else {
    // Comportement v1
  }
});
```

---

## Tests de l'API

### Avec cURL

```bash
# GET - Liste
curl http://localhost:3000/api/products

# GET - Avec filtres
curl "http://localhost:3000/api/products?category=phones&sort=price"

# GET - Un produit
curl http://localhost:3000/api/products/1

# POST - Créer
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPad Pro","price":1099,"category":"tablets","stock":30}'

# PUT - Remplacer
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15 Pro","price":1199,"category":"phones","stock":40}'

# PATCH - Modifier
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":899}'

# DELETE - Supprimer
curl -X DELETE http://localhost:3000/api/products/1
```

### Avec Thunder Client / Postman

Créez une collection avec les endpoints suivants :
- `GET {{baseUrl}}/products`
- `GET {{baseUrl}}/products/:id`
- `POST {{baseUrl}}/products`
- `PUT {{baseUrl}}/products/:id`
- `PATCH {{baseUrl}}/products/:id`
- `DELETE {{baseUrl}}/products/:id`

---

## Application Complète

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares de sécurité et parsing
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes API
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} non trouvée`
  });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Verbes dans les URLs | `/getUsers`, `/deleteUser` | Utiliser méthodes HTTP + noms |
| Singulier pour collections | `/user` | Utiliser `/users` |
| Toujours 200 | Erreurs non détectables | Codes HTTP appropriés |
| Pas de validation | Données corrompues | Joi ou express-validator |

---

## Quiz de vérification

1. Quelle méthode HTTP pour créer une ressource ?
   - A) GET
   - B) POST ✅
   - C) PUT

2. Quel code HTTP pour "ressource créée" ?
   - A) 200
   - B) 201 ✅
   - C) 204

3. Quelle URL est RESTful ?
   - A) `/getUsers`
   - B) `/users` ✅
   - C) `/user/list`

4. Qu'est-ce que l'idempotence ?
   - A) Une réponse rapide
   - B) Même résultat pour appels multiples ✅
   - C) Une erreur

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| REST | Architecture pour API web |
| CRUD | Create, Read, Update, Delete |
| Codes HTTP | 2xx (succès), 4xx (client), 5xx (serveur) |
| Pluriel | `/users` et non `/user` |
| Pas de verbes | `DELETE /users/1` et non `GET /users/1/delete` |
| Validation | Joi, express-validator |
| Réponse standard | `{ success, data, error, pagination }` |
| Versioning | `/api/v1/...` |

---

## Ressources

- [REST API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [Joi Validation](https://joi.dev/)
- [Thunder Client (VS Code)](https://www.thunderclient.com/)

---

## Prochaine étape

Découvrez la [Pagination et Filtrage](./pagination-filtrage.md) pour gérer les grandes collections de données.
