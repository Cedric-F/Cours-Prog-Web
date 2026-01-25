# Structure de Projet Node.js

## Architecture de Projet

Une bonne structure de projet facilite la maintenance, la scalabilité et la collaboration. Il n'existe pas de structure "universelle", mais des conventions établies par la communauté.

## Structure Simple (Petit Projet)

```
my-app/
├── node_modules/          # Dépendances (gitignored)
├── src/                   # Code source
│   ├── index.js          # Point d'entrée
│   ├── routes.js         # Routes
│   └── utils.js          # Utilitaires
├── tests/                # Tests
│   └── index.test.js
├── .env                  # Variables d'environnement (gitignored)
├── .env.example          # Template .env
├── .gitignore            # Git ignore
├── package.json          # Manifest npm
├── package-lock.json     # Lockfile npm
└── README.md             # Documentation
```

**index.js :**

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Structure MVC (Moyenne Application)

```
my-app/
├── node_modules/
├── src/
│   ├── controllers/       # Logique métier
│   │   ├── userController.js
│   │   └── productController.js
│   ├── models/            # Modèles de données
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/            # Définition des routes
│   │   ├── index.js
│   │   ├── users.js
│   │   └── products.js
│   ├── middlewares/       # Middlewares Express
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── config/            # Configuration
│   │   ├── database.js
│   │   └── app.js
│   ├── utils/             # Fonctions utilitaires
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── app.js             # Configuration Express
│   └── server.js          # Point d'entrée
├── tests/
│   ├── unit/
│   └── integration/
├── public/                # Fichiers statiques
│   ├── css/
│   ├── js/
│   └── images/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Exemple de fichiers :**

**src/server.js :**

```javascript
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**src/app.js :**

```javascript
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;
```

**src/routes/index.js :**

```javascript
const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const productRoutes = require('./products');

router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
```

**src/routes/users.js :**

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', authMiddleware, userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
```

**src/controllers/userController.js :**

```javascript
const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
```

**src/models/User.js :**

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

**src/middlewares/errorHandler.js :**

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## Structure Avancée (Grande Application)

```
my-app/
├── node_modules/
├── src/
│   ├── api/                   # API REST
│   │   ├── v1/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── validators/
│   │   │   └── index.js
│   │   └── v2/
│   ├── config/                # Configuration
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── email.js
│   │   └── index.js
│   ├── models/                # Modèles
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── services/              # Business logic
│   │   ├── userService.js
│   │   ├── emailService.js
│   │   └── paymentService.js
│   ├── repositories/          # Data access layer
│   │   ├── userRepository.js
│   │   └── productRepository.js
│   ├── middlewares/           # Middlewares
│   │   ├── auth.js
│   │   ├── validator.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── utils/                 # Utilitaires
│   │   ├── logger.js
│   │   ├── encryption.js
│   │   └── helpers.js
│   ├── jobs/                  # Tâches asynchrones
│   │   ├── emailJob.js
│   │   └── cleanupJob.js
│   ├── database/              # Migrations & Seeds
│   │   ├── migrations/
│   │   └── seeds/
│   ├── constants/             # Constantes
│   │   └── index.js
│   ├── types/                 # Types TypeScript (si TS)
│   │   └── index.d.ts
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   └── api/
│   ├── e2e/
│   └── fixtures/
├── scripts/                   # Scripts utilitaires
│   ├── seed.js
│   └── migrate.js
├── docs/                      # Documentation
│   ├── api.md
│   └── architecture.md
├── logs/                      # Logs (gitignored)
├── uploads/                   # Fichiers uploadés (gitignored)
├── public/                    # Assets statiques
├── .env
├── .env.example
├── .env.test
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
├── package.json
└── README.md
```

## Architecture en Couches

### 1. Controllers (Couche Présentation)

```javascript
// src/api/v1/controllers/userController.js
const userService = require('../../../services/userService');
const { validateUser } = require('../validators/userValidator');

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { error } = validateUser(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

### 2. Services (Couche Métier)

```javascript
// src/services/userService.js
const userRepository = require('../repositories/userRepository');
const emailService = require('./emailService');
const bcrypt = require('bcrypt');

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async createUser(userData) {
    // Business logic
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email);

    return user;
  }

  async updateUser(userId, updates) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.update(userId, updates);
  }
}

module.exports = new UserService();
```

### 3. Repositories (Couche Accès Données)

```javascript
// src/repositories/userRepository.js
const User = require('../models/User');

class UserRepository {
  async findAll() {
    return await User.find().select('-password');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, updates) {
    return await User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
```

## Configuration

### Gestion des Environnements

**.env (development) :**

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=myapp_dev
DB_USER=admin
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-user
SMTP_PASS=your-pass

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=my-bucket

# Logging
LOG_LEVEL=debug
```

**.env.production :**

```env
NODE_ENV=production
PORT=8080

DB_HOST=prod-db.example.com
DB_PORT=27017
DB_NAME=myapp_prod

# ... autres configs production
```

**src/config/index.js :**

```javascript
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DATABASE_URL || 
         `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
```

## Fichiers de Configuration Essentiels

### .gitignore

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
.cache/

# Testing
coverage/
.nyc_output/

# Uploads
uploads/

# Temporary
tmp/
temp/
```

### .eslintrc.json

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/**/*.test.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### nodemon.json

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js", "node_modules"],
  "exec": "node src/server.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": 1000
}
```

## Patterns et Bonnes Pratiques

### Separation of Concerns

```javascript
// ❌ Mauvais : Tout dans le controller
app.post('/users', async (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  // Vérifier si existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User exists' });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Créer user
  const user = new User({ email, password: hashedPassword });
  await user.save();
  
  // Envoyer email
  await sendWelcomeEmail(email);
  
  res.status(201).json(user);
});

// ✅ Bon : Séparation en couches
// Controller
app.post('/users', userController.create);

// Service
class UserService {
  async createUser(userData) {
    await this.validateUser(userData);
    await this.checkUserExists(userData.email);
    
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
    });
    
    await emailService.sendWelcome(user.email);
    
    return user;
  }
}
```

### Error Handling

```javascript
// src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// src/middlewares/errorHandler.js
const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production : pas de détails sensibles
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

// Usage
const AppError = require('../utils/AppError');

async function getUser(id) {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}
```

### Dependency Injection

```javascript
// src/services/userService.js
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.info('Creating user', { email: userData.email });
    
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcome(user.email);
    
    return user;
  }
}

// src/container.js
const UserService = require('./services/userService');
const UserRepository = require('./repositories/userRepository');
const EmailService = require('./services/emailService');
const logger = require('./utils/logger');

const userRepository = new UserRepository();
const emailService = new EmailService();
const userService = new UserService(userRepository, emailService, logger);

module.exports = {
  userService,
  userRepository,
  emailService
};

// Usage dans controller
const { userService } = require('../container');

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
```

## TypeScript Structure

```
my-app/
├── src/
│   ├── controllers/
│   │   └── userController.ts
│   ├── services/
│   │   └── userService.ts
│   ├── models/
│   │   └── User.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   └── IUser.ts
│   └── server.ts
├── dist/                  # Compiled JS
├── tests/
├── tsconfig.json
└── package.json
```

**tsconfig.json :**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@models/*": ["models/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Résumé

**📁 Structure Simple :**
- `src/` : Code source
- `tests/` : Tests
- `.env` : Variables d'environnement
- Convient pour petits projets

**🏗️ Structure MVC :**
- **Models** : Données
- **Views** : (API REST dans Node.js)
- **Controllers** : Logique de présentation
- Convient pour applications moyennes

**🏢 Architecture en Couches :**
- **Controllers** : Requêtes HTTP
- **Services** : Logique métier
- **Repositories** : Accès données
- **Models** : Définition des entités
- Convient pour grandes applications

**⚙️ Configuration :**
- `.env` pour variables d'environnement
- `config/` pour configuration centralisée
- Différents environnements (dev, test, prod)

**📝 Fichiers Essentiels :**
- `.gitignore` : Exclure fichiers
- `.eslintrc` : Linting
- `.prettierrc` : Formatting
- `jest.config.js` : Tests

**🎯 Bonnes Pratiques :**
- **Separation of Concerns** : Chaque module a une responsabilité
- **DRY** : Don't Repeat Yourself
- **Dependency Injection** : Facilite les tests
- **Error Handling** : Gestion centralisée des erreurs
- **TypeScript** : Types pour sécurité

**🚀 Scalabilité :**
- Versioning API (`/api/v1`, `/api/v2`)
- Microservices si nécessaire
- Domain-Driven Design pour grandes apps

Une structure bien organisée est la clé d'une application maintenable et scalable.