# Middleware & Routing

Les middlewares et le système de routage sont au cœur d'Express.js. Comprendre ces concepts est essentiel pour construire des applications bien structurées.

---

## Ce que vous allez apprendre

- Comprendre le concept de middleware
- Créer des middlewares personnalisés
- Organiser les routes avec `express.Router()`
- Gérer les erreurs proprement

## Prérequis

- [Express.js - Introduction](./express-base.md)
- [JavaScript - Fonctions](../../javascript/fonctions/bases-fonctions.md)

---

## Qu'est-ce qu'un Middleware ?

Un middleware est une fonction qui a accès à l'objet requête (`req`), l'objet réponse (`res`), et à la fonction `next()` qui passe au middleware suivant.

### Anatomie d'un middleware

```javascript
//        req      res      next
//         ↓        ↓        ↓
function monMiddleware(req, res, next) {
  // 1. Logique du middleware
  console.log('Middleware exécuté');
  
  // 2. Modifier req ou res
  req.customData = 'données ajoutées';
  
  // 3. Passer au middleware suivant
  next();
  
  // OU terminer la requête
  // res.send('Réponse');
}
```

### Flux des middlewares

```
Requête HTTP
     ↓
┌─────────────┐
│ Middleware 1│ → next() →
└─────────────┘
┌─────────────┐
│ Middleware 2│ → next() →
└─────────────┘
┌─────────────┐
│ Middleware 3│ → res.send()
└─────────────┘
     ↓
Réponse HTTP
```

---

## Types de Middlewares

### 1. Middleware d'application

S'applique à toutes les routes ou à des routes spécifiques.

```javascript
const express = require('express');
const app = express();

// Middleware global (toutes les routes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Middleware pour un chemin spécifique
app.use('/api', (req, res, next) => {
  console.log('Requête API reçue');
  next();
});

// Middleware pour une route spécifique
app.get('/users', 
  (req, res, next) => {
    console.log('Accès à /users');
    next();
  },
  (req, res) => {
    res.json([{ id: 1, name: 'Alice' }]);
  }
);
```

### 2. Middleware de routeur

Lié à une instance de `express.Router()`.

```javascript
const express = require('express');
const router = express.Router();

// Middleware spécifique à ce routeur
router.use((req, res, next) => {
  console.log('Middleware du routeur users');
  next();
});

router.get('/', (req, res) => {
  res.json([]);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

module.exports = router;
```

### 3. Middleware intégrés

Express fournit des middlewares prêts à l'emploi.

```javascript
const express = require('express');
const app = express();

// Parser le JSON dans req.body
app.use(express.json());

// Parser les données de formulaire URL-encoded
app.use(express.urlencoded({ extended: true }));

// Servir des fichiers statiques
app.use(express.static('public'));

// Options avancées
app.use(express.json({ 
  limit: '10mb',           // Taille max du body
  strict: true             // N'accepte que les objets/tableaux
}));
```

### 4. Middleware tiers

Installez des middlewares de la communauté.

```bash
npm install cors helmet morgan
```

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Sécurité HTTP (headers)
app.use(helmet());

// CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Logging des requêtes
app.use(morgan('dev'));     // Format développement
// app.use(morgan('combined')); // Format production

// CORS avec options
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Créer ses Propres Middlewares

### Logger personnalisé

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Intercepter la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

module.exports = logger;
```

```javascript
// app.js
const logger = require('./middleware/logger');
app.use(logger);
```

### Middleware d'authentification

```javascript
// middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token manquant' 
    });
  }
  
  try {
    // Vérifier le token (exemple simplifié)
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token invalide' 
    });
  }
};

module.exports = authMiddleware;
```

```javascript
// Utilisation
const auth = require('./middleware/auth');

// Protéger toutes les routes /api
app.use('/api', auth);

// Ou une route spécifique
app.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});
```

### Middleware de validation

```javascript
// middleware/validate.js
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

module.exports = validateBody;
```

```javascript
// Utilisation avec Joi
const Joi = require('joi');
const validateBody = require('./middleware/validate');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150)
});

app.post('/users', validateBody(userSchema), (req, res) => {
  // req.body est validé
  res.status(201).json(req.body);
});
```

---

## Gestion des Erreurs

### Middleware d'erreur

Un middleware d'erreur a **4 paramètres** : `(err, req, res, next)`.

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err.stack);
  
  // Erreur personnalisée avec statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

```javascript
// app.js - Le middleware d'erreur doit être en DERNIER
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use('/api/users', userRoutes);

// Middleware 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware d'erreur (toujours en dernier)
app.use(errorHandler);
```

### Propager les erreurs

```javascript
// Erreur synchrone
app.get('/sync-error', (req, res, next) => {
  throw new Error('Erreur synchrone');
});

// Erreur asynchrone (Express 5+ les gère automatiquement)
app.get('/async-error', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    next(error); // Passer l'erreur au middleware d'erreur
  }
});

// Helper pour les erreurs async (Express 4)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

### Erreurs personnalisées

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

```javascript
// Utilisation
const AppError = require('./utils/AppError');

app.get('/users/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  
  res.json(user);
});
```

---

## Système de Routing

### Router Express

Organisez vos routes en modules séparés.

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice' });
});

// POST /api/users
router.post('/', (req, res) => {
  res.status(201).json({ id: 3, ...req.body });
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  res.status(204).send();
});

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

app.use(express.json());

// Monter les routeurs
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

module.exports = app;
```

### Paramètres de route

```javascript
// Paramètre simple
router.get('/users/:id', (req, res) => {
  console.log(req.params.id); // "123"
});

// Paramètres multiples
router.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Paramètre optionnel
router.get('/files/:name.:ext?', (req, res) => {
  // /files/document → { name: "document", ext: undefined }
  // /files/document.pdf → { name: "document", ext: "pdf" }
  res.json(req.params);
});

// Validation de paramètre avec regex
router.get('/users/:id(\\d+)', (req, res) => {
  // Uniquement si :id est numérique
  res.json({ id: parseInt(req.params.id) });
});
```

### Route chaînée

```javascript
router.route('/users/:id')
  .get((req, res) => {
    res.json({ action: 'get', id: req.params.id });
  })
  .put((req, res) => {
    res.json({ action: 'update', id: req.params.id });
  })
  .delete((req, res) => {
    res.status(204).send();
  });
```

### Middleware de paramètre

```javascript
// Exécuté pour toute route contenant :userId
router.param('userId', async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

// req.user est maintenant disponible
router.get('/users/:userId', (req, res) => {
  res.json(req.user);
});

router.get('/users/:userId/posts', (req, res) => {
  res.json({ user: req.user.name, posts: [] });
});
```

---

## Architecture Complète

### Structure recommandée

```
src/
├── controllers/
│   ├── userController.js
│   └── productController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── validate.js
├── routes/
│   ├── index.js
│   ├── userRoutes.js
│   └── productRoutes.js
├── utils/
│   └── AppError.js
└── app.js
```

### Exemple complet

```javascript
// controllers/userController.js
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
```

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userSchema } = require('../schemas/userSchema');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', auth, validate(userSchema), userController.createUser);

module.exports = router;
```

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');

router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier `next()` | Requête bloque | Appeler `next()` ou envoyer réponse |
| Middleware d'erreur mal placé | Erreurs non capturées | Toujours en dernier |
| Mauvais ordre | `app.use(json())` après les routes | Middlewares avant les routes |
| Erreur async non capturée | Crash serveur | `try/catch` ou wrapper async |

---

## Quiz de vérification

:::quiz
Q: Combien de paramètres a un middleware d'erreur ?
- [ ] 2
- [ ] 3
- [x] 4 (err, req, res, next)
> Un middleware d'erreur se distingue par ses 4 paramètres, le premier étant l'erreur.

Q: Que fait `next()` ?
- [ ] Termine la requête
- [x] Passe au middleware suivant
- [ ] Envoie une réponse
> `next()` appelle le prochain middleware dans la chaîne. Sans appel à `next()`, la requête reste bloquée.

Q: Comment appliquer un middleware à une seule route ?
- [ ] `app.use(middleware)`
- [x] `app.get('/route', middleware, handler)`
- [ ] `app.middleware('/route')`
> On peut passer un middleware comme deuxième argument avant le handler de route.

Q: Où placer le middleware de gestion d'erreurs ?
- [ ] Au début
- [x] Après les routes
- [ ] N'importe où
> Le middleware d'erreur doit être défini après toutes les routes pour capturer leurs erreurs.
:::

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| Middleware | Fonction `(req, res, next)` |
| `next()` | Passe au middleware suivant |
| `app.use()` | Ajoute un middleware global |
| `express.json()` | Parse le body JSON |
| `express.Router()` | Crée un routeur modulaire |
| `router.param()` | Middleware pour un paramètre |
| Middleware d'erreur | 4 paramètres : `(err, req, res, next)` |
| `app.use(errorHandler)` | Toujours en dernier |

---

## Prochaine étape

Découvrez la [Création d'API REST](./api-rest.md) pour construire des APIs complètes.
