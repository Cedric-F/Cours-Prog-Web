# Écosystème & Outils Node.js

## NPM : Node Package Manager

### Introduction à NPM

NPM est le gestionnaire de packages par défaut de Node.js et le plus grand registre de logiciels au monde avec plus de 2 millions de packages. Il permet de :
- Installer et gérer des dépendances
- Partager du code réutilisable
- Gérer les versions de packages
- Exécuter des scripts automatisés

### Commandes NPM Essentielles

```bash
# Vérifier la version de npm
npm --version
npm -v

# Mettre à jour npm
npm install -g npm@latest

# Aide sur une commande
npm help install
npm install --help
```

**Installation de Packages :**

```bash
# Installer un package en dépendance
npm install express
npm i express  # raccourci

# Installer plusieurs packages
npm install express mongoose dotenv

# Installer en dépendance de développement
npm install --save-dev nodemon eslint
npm i -D nodemon  # raccourci

# Installer globalement (accessible partout)
npm install -g typescript ts-node

# Installer une version spécifique
npm install express@4.18.0

# Installer la dernière version mineure
npm install express@^4.0.0  # ^4.18.0 → 4.x.x (pas 5.0.0)

# Installer la dernière version patch
npm install express@~4.18.0  # ~4.18.0 → 4.18.x (pas 4.19.0)
```

**Désinstallation :**

```bash
# Désinstaller un package local
npm uninstall express
npm un express  # raccourci

# Désinstaller un package global
npm uninstall -g typescript

# Désinstaller sans modifier package.json
npm uninstall --no-save express
```

**Mise à Jour :**

```bash
# Lister les packages obsolètes
npm outdated

# Mettre à jour tous les packages (selon package.json)
npm update

# Mettre à jour un package spécifique
npm update express

# Mettre à jour à la dernière version (ignore package.json)
npm install express@latest
```

**Autres Commandes Utiles :**

```bash
# Lister les packages installés
npm list
npm ls

# Lister uniquement les dépendances principales
npm ls --depth=0

# Rechercher un package
npm search express

# Voir les informations d'un package
npm info express
npm view express

# Nettoyer le cache
npm cache clean --force

# Auditer les vulnérabilités
npm audit

# Corriger les vulnérabilités automatiquement
npm audit fix
```

### Le Fichier package.json

Le fichier `package.json` est le cœur de tout projet Node.js. Il contient les métadonnées et la configuration du projet.

**Créer un package.json :**

```bash
# Mode interactif (pose des questions)
npm init

# Mode rapide (valeurs par défaut)
npm init -y
npm init --yes
```

**Structure d'un package.json :**

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "description": "Description de mon projet",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "lint": "eslint .",
    "build": "tsc"
  },
  "keywords": ["api", "express", "mongodb"],
  "author": "Votre Nom <email@example.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.50.0",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Sections Importantes :**

```json
{
  // Identité du projet
  "name": "mon-package",        // Nom unique (requis)
  "version": "1.0.0",           // Version sémantique (requis)
  "description": "Mon package", // Description courte
  
  // Point d'entrée
  "main": "index.js",           // Fichier principal (require('mon-package'))
  "module": "index.mjs",        // Point d'entrée ES modules
  "types": "index.d.ts",        // Déclarations TypeScript
  
  // Scripts personnalisés
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "build": "webpack --mode production",
    "deploy": "npm run build && npm run upload"
  },
  
  // Dépendances
  "dependencies": {             // Packages requis en production
    "express": "^4.18.2"
  },
  "devDependencies": {          // Packages requis en développement
    "nodemon": "^3.0.1"
  },
  "peerDependencies": {         // Packages requis par les utilisateurs
    "react": ">=16.8.0"
  },
  "optionalDependencies": {     // Packages optionnels (ne bloquent pas)
    "sharp": "^0.32.0"
  },
  
  // Configuration
  "engines": {                  // Versions Node.js/npm requises
    "node": ">=18.0.0"
  },
  "private": true,              // Empêche la publication sur npm
  "repository": {               // Repo Git
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
}
```

### Scripts NPM

Les scripts NPM permettent d'automatiser des tâches courantes :

**Scripts Prédéfinis (Lifecycle Scripts) :**

```json
{
  "scripts": {
    "preinstall": "echo Avant installation",
    "install": "node-gyp rebuild",
    "postinstall": "echo Après installation",
    
    "prestart": "npm run build",
    "start": "node server.js",
    "poststart": "echo Serveur démarré",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run coverage",
    
    "prepublish": "npm run build",
    "publish": "npm publish",
    "postpublish": "git push"
  }
}
```

**Exécution de Scripts :**

```bash
# Scripts prédéfinis (start, test, stop, restart)
npm start
npm test
npm stop
npm restart

# Scripts personnalisés (nécessitent 'run')
npm run dev
npm run build
npm run deploy

# Passer des arguments aux scripts
npm run test -- --watch
npm start -- --port=4000

# Exécuter plusieurs scripts en séquence
npm run lint && npm run test && npm run build

# Exécuter en parallèle (avec npm-run-all)
npm-run-all --parallel dev:*
```

**Exemples de Scripts Utiles :**

```json
{
  "scripts": {
    "dev": "nodemon --watch src src/index.js",
    "start": "node src/index.js",
    "build": "babel src -d dist",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "clean": "rm -rf dist node_modules",
    "reinstall": "npm run clean && npm install"
  }
}
```

### package-lock.json

Le fichier `package-lock.json` garantit des installations reproductibles :

**Rôle :**
- Verrouille les versions exactes de toutes les dépendances
- Optimise l'installation (arbre de dépendances résolu)
- Assure la cohérence entre les environnements

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "mon-projet",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.2"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "body-parser": "1.20.1",
        "cookie": "0.5.0"
      }
    }
  }
}
```

**Bonnes Pratiques :**
- ✅ Toujours commiter `package-lock.json` dans Git
- ✅ Utiliser `npm ci` en CI/CD (plus rapide, stricte)
- ❌ Ne pas modifier `package-lock.json` manuellement

```bash
# Installation normale (génère/met à jour lock)
npm install

# Installation stricte (utilise lock, plus rapide)
npm ci  # Clean Install (utilisé en CI/CD)
```

## Packages Incontournables

### 1. Frameworks Web

**Express.js** - Le framework le plus populaire

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ user });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('Serveur sur port 3000');
});
```

**Fastify** - Alternative ultra-rapide

```javascript
const fastify = require('fastify')({ logger: true });

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Validation avec JSON Schema
fastify.post('/users', {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
      },
      required: ['name', 'email']
    }
  }
}, async (request, reply) => {
  const user = request.body;
  return { user };
});

fastify.listen({ port: 3000 });
```

### 2. Bases de Données

**Mongoose** - ODM pour MongoDB

```javascript
const mongoose = require('mongoose');

// Connexion
await mongoose.connect('mongodb://localhost/myapp');

// Schéma
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Modèle
const User = mongoose.model('User', userSchema);

// CRUD
const user = new User({ name: 'Alice', email: 'alice@example.com' });
await user.save();

const users = await User.find({ age: { $gte: 18 } });
await User.updateOne({ _id: userId }, { age: 30 });
await User.deleteOne({ _id: userId });
```

**Prisma** - ORM moderne

```javascript
// schema.prisma
// model User {
//   id    Int     @id @default(autoincrement())
//   email String  @unique
//   name  String?
//   posts Post[]
// }

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CRUD avec type-safety
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    posts: {
      create: { title: 'Hello World' }
    }
  },
  include: { posts: true }
});

const users = await prisma.user.findMany({
  where: { email: { contains: '@example.com' } }
});
```

### 3. Utilitaires Essentiels

**dotenv** - Variables d'environnement

```javascript
require('dotenv').config();

// .env
// PORT=3000
// DB_URL=mongodb://localhost/myapp
// API_KEY=secret123

console.log(process.env.PORT);     // 3000
console.log(process.env.DB_URL);   // mongodb://localhost/myapp
console.log(process.env.API_KEY);  // secret123

// Configuration avec valeurs par défaut
const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL || 'mongodb://localhost/default',
  isDev: process.env.NODE_ENV !== 'production'
};
```

**Lodash** - Utilitaires pour JavaScript

```javascript
const _ = require('lodash');

// Manipulation de tableaux
const numbers = [1, 2, 3, 4, 5];
console.log(_.chunk(numbers, 2)); // [[1, 2], [3, 4], [5]]
console.log(_.shuffle(numbers));  // [3, 1, 5, 2, 4] (aléatoire)
console.log(_.uniq([1, 2, 2, 3])); // [1, 2, 3]

// Manipulation d'objets
const user = { name: 'Alice', age: 25, email: 'alice@example.com' };
console.log(_.pick(user, ['name', 'email'])); // { name: 'Alice', email: '...' }
console.log(_.omit(user, ['age'])); // { name: 'Alice', email: '...' }

// Debounce/Throttle
const saveInput = _.debounce((value) => {
  console.log('Sauvegarde:', value);
}, 1000);

saveInput('a'); // Attendra 1s après le dernier appel
saveInput('ab');
saveInput('abc'); // Seulement celui-ci sera exécuté
```

**date-fns** - Manipulation de dates

```javascript
const { format, addDays, differenceInDays, parseISO } = require('date-fns');
const { fr } = require('date-fns/locale');

const now = new Date();

// Formatage
console.log(format(now, 'dd/MM/yyyy')); // 24/01/2026
console.log(format(now, 'PPP', { locale: fr })); // 24 janvier 2026

// Calculs
const future = addDays(now, 10);
const diff = differenceInDays(future, now); // 10

// Parsing
const date = parseISO('2026-01-24T12:00:00Z');
```

### 4. Validation et Parsing

**Joi** - Validation de schémas

```javascript
const Joi = require('joi');

// Définir un schéma
const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(120),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{8,}$/),
  role: Joi.string().valid('user', 'admin').default('user')
});

// Valider des données
const { error, value } = schema.validate({
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});

if (error) {
  console.error('Erreur de validation:', error.details);
} else {
  console.log('Données valides:', value);
}

// Middleware Express
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

app.post('/users', validate(schema), (req, res) => {
  // req.body est validé
  res.json({ user: req.body });
});
```

**Zod** - Validation avec TypeScript

```javascript
const { z } = require('zod');

// Schéma avec inférence de type
const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().positive().optional(),
  role: z.enum(['user', 'admin']).default('user')
});

// Validation
try {
  const user = UserSchema.parse({
    name: 'Alice',
    email: 'alice@example.com'
  });
  console.log(user); // { name: 'Alice', email: '...', role: 'user' }
} catch (err) {
  console.error(err.errors);
}

// Safe parse (sans throw)
const result = UserSchema.safeParse({ name: 'Al', email: 'invalid' });
if (!result.success) {
  console.error(result.error);
}
```

### 5. Logging et Monitoring

**Winston** - Logging professionnel

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Fichier pour les erreurs
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Fichier pour tout
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Console en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Utilisation
logger.info('Serveur démarré');
logger.warn('Connexion lente');
logger.error('Erreur de base de données', { error: err.message });
```

**Morgan** - HTTP request logger

```javascript
const express = require('express');
const morgan = require('morgan');

const app = express();

// Format prédéfini
app.use(morgan('combined')); // Apache style
app.use(morgan('dev'));      // Dev friendly

// Format personnalisé
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Log dans un fichier
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
```

### 6. Sécurité

**Helmet** - Sécurité HTTP headers

```javascript
const helmet = require('helmet');
const express = require('express');

const app = express();

// Configuration par défaut (recommandé)
app.use(helmet());

// Configuration personnalisée
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://cdn.example.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**bcrypt** - Hashing de mots de passe

```javascript
const bcrypt = require('bcrypt');

// Hasher un mot de passe
async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Vérifier un mot de passe
async function verifyPassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

// Exemple d'utilisation
const password = 'monMotDePasse123';
const hash = await hashPassword(password);
console.log('Hash:', hash);

const isValid = await verifyPassword('monMotDePasse123', hash);
console.log('Valide:', isValid); // true

const isInvalid = await verifyPassword('mauvaisMotDePasse', hash);
console.log('Invalide:', isInvalid); // false
```

## Alternatives à NPM

### Yarn

Yarn est un gestionnaire de packages créé par Facebook, compatible avec NPM.

**Installation :**

```bash
npm install -g yarn
```

**Commandes Équivalentes :**

```bash
# NPM                    # Yarn
npm install              yarn install / yarn
npm install express      yarn add express
npm install -D nodemon   yarn add --dev nodemon
npm install -g pm2       yarn global add pm2
npm uninstall express    yarn remove express
npm update               yarn upgrade
npm run dev              yarn dev
```

**Avantages de Yarn :**
- ⚡ Plus rapide (cache optimisé, installation parallèle)
- 🔒 Fichier `yarn.lock` plus déterministe
- 📦 Workspaces pour monorepos
- 🎯 Commandes plus courtes (`yarn` au lieu de `npm install`)

**yarn.lock :**

```yaml
express@^4.18.2:
  version "4.18.2"
  resolved "https://registry.yarnpkg.com/express/-/express-4.18.2.tgz"
  integrity sha512-...
  dependencies:
    body-parser "1.20.1"
    cookie "0.5.0"
```

### PNPM

PNPM (Performant NPM) utilise un système de liens symboliques pour économiser l'espace disque.

**Installation :**

```bash
npm install -g pnpm
```

**Avantages de PNPM :**
- 💾 Économie d'espace disque (store global avec symlinks)
- ⚡ Installation très rapide
- 🔒 Strict par défaut (évite les dépendances fantômes)

```bash
# Structure de PNPM
node_modules/
  .pnpm/               # Store local avec toutes les dépendances
    express@4.18.2/
    mongoose@7.5.0/
  express -> .pnpm/express@4.18.2/node_modules/express
  mongoose -> .pnpm/mongoose@7.5.0/node_modules/mongoose
```

## Outils de Développement

### Nodemon

Redémarre automatiquement l'application lors des modifications :

```bash
npm install -D nodemon
```

**Utilisation :**

```bash
# Au lieu de: node app.js
nodemon app.js

# Avec options
nodemon --watch src --ext js,json app.js
```

**Configuration (nodemon.json) :**

```json
{
  "watch": ["src"],
  "ext": "js,json,ts",
  "ignore": ["src/**/*.test.js"],
  "exec": "node --inspect src/index.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

**Script package.json :**

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "dev:debug": "nodemon --inspect src/index.js"
  }
}
```

### Debugger

**VS Code Launch Configuration (.vscode/launch.json) :**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Démarrer l'application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Nodemon",
      "runtimeExecutable": "nodemon",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

**Debugging en ligne de commande :**

```bash
# Démarrer avec le debugger
node --inspect src/index.js

# Attendre le debugger au démarrage
node --inspect-brk src/index.js

# Se connecter avec Chrome DevTools
# chrome://inspect
```

### ESLint

Linter pour détecter les problèmes de code :

```bash
npm install -D eslint
npx eslint --init
```

**Configuration (.eslintrc.json) :**

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

**Scripts :**

```json
{
  "scripts": {
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  }
}
```

### Prettier

Formateur de code automatique :

```bash
npm install -D prettier
```

**Configuration (.prettierrc) :**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

**Scripts :**

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\""
  }
}
```

## Exercices Pratiques

### Exercice 1 : Créer un CLI avec NPM

Créez un outil en ligne de commande :

```javascript
#!/usr/bin/env node
// cli.js

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'greet':
    console.log(`Hello, ${args[1] || 'World'}!`);
    break;
  case 'version':
    const pkg = require('./package.json');
    console.log(`v${pkg.version}`);
    break;
  default:
    console.log('Usage: mycli <command> [args]');
}
```

**package.json :**

```json
{
  "name": "mycli",
  "version": "1.0.0",
  "bin": {
    "mycli": "./cli.js"
  }
}
```

**Installation locale :**

```bash
npm link
mycli greet Alice  # Hello, Alice!
```

### Exercice 2 : Créer un Middleware Express Réutilisable

```javascript
// middleware/requestLogger.js
function requestLogger(options = {}) {
  const format = options.format || 'simple';
  
  return (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      if (format === 'json') {
        console.log(JSON.stringify({
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`
        }));
      } else {
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
      }
    });
    
    next();
  };
}

module.exports = requestLogger;
```

**Utilisation :**

```javascript
const express = require('express');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(requestLogger({ format: 'json' }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(3000);
```

## Résumé

**NPM : Gestionnaire de Packages**
- Plus de 2 millions de packages disponibles
- Commandes essentielles : install, update, uninstall, audit
- `package.json` : configuration du projet
- `package-lock.json` : versions verrouillées

**Packages Incontournables**
- **Web :** Express, Fastify
- **BDD :** Mongoose, Prisma
- **Utilitaires :** dotenv, lodash, date-fns
- **Validation :** Joi, Zod
- **Logging :** Winston, Morgan
- **Sécurité :** Helmet, bcrypt

**Alternatives à NPM**
- **Yarn :** Plus rapide, commandes simplifiées
- **PNPM :** Économie d'espace, strict par défaut

**Outils de Dev**
- **Nodemon :** Redémarrage automatique
- **ESLint :** Linting du code
- **Prettier :** Formatage automatique
- **Debugger :** VS Code, Chrome DevTools

Avec cet écosystème riche, vous êtes prêt à développer des applications Node.js professionnelles. Le prochain chapitre explorera les **avantages et inconvénients** de Node.js en profondeur.