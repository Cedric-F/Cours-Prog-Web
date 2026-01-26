# Variables d'Environnement

Gérez la configuration de votre application de manière sécurisée avec les variables d'environnement.

---

## Ce que vous allez apprendre

- Comprendre les variables d'environnement
- Utiliser dotenv pour le développement
- Sécuriser les secrets (API keys, mots de passe)
- Configurer différents environnements

## Prérequis

- [Introduction à Node.js](../presentation/nodejs-introduction.md)
- Notions de Git (pour le .gitignore)

---

## Pourquoi les variables d'environnement ?

### Le problème

```javascript
// ❌ DANGER : Secrets en dur dans le code
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:MotDePasseSecret@cluster.mongodb.net/madb');

const stripe = require('stripe')('sk_live_abc123xyz'); // Clé API Stripe

// Si ce code est sur GitHub → vos secrets sont exposés !
```

### La solution

```javascript
// ✅ Variables d'environnement
mongoose.connect(process.env.DATABASE_URL);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

---

## Fonctionnement

```
┌─────────────────────────────────────────────────────────────┐
│                     Fichier .env                             │
│                                                              │
│  DATABASE_URL=mongodb://localhost:27017/mydb                │
│  JWT_SECRET=super_secret_key                                │
│  PORT=3000                                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   process.env                                │
│                                                              │
│  process.env.DATABASE_URL  → "mongodb://localhost..."       │
│  process.env.JWT_SECRET    → "super_secret_key"             │
│  process.env.PORT          → "3000"                         │
└─────────────────────────────────────────────────────────────┘
```

---

## dotenv - Configuration

### Installation

```bash
npm install dotenv
```

### Créer le fichier .env

```env
# .env (à la racine du projet)

# Base de données
DATABASE_URL=mongodb://localhost:27017/myapp

# Authentification
JWT_SECRET=votre_secret_jwt_tres_long_et_complexe
JWT_EXPIRES_IN=7d

# Serveur
PORT=3000
NODE_ENV=development

# Services externes
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_URL=cloudinary://...

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=abc123
SMTP_PASS=xyz789
```

### Charger les variables

```javascript
// app.js ou index.js (tout en haut du fichier !)
require('dotenv').config();

// Maintenant process.env contient vos variables
console.log(process.env.PORT); // "3000"

const express = require('express');
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Serveur sur le port ${process.env.PORT}`);
});
```

### Import ES Modules

```javascript
// Pour ES Modules (type: "module" dans package.json)
import 'dotenv/config';

// Ou
import dotenv from 'dotenv';
dotenv.config();
```

---

## Sécurité - .gitignore

### CRUCIAL : Ne jamais commit .env

```gitignore
# .gitignore

# Variables d'environnement
.env
.env.local
.env.*.local
.env.production

# Garder le template
!.env.example
```

### Créer un template

```env
# .env.example (à commit sur Git)

# Base de données
DATABASE_URL=mongodb://localhost:27017/myapp

# Authentification
JWT_SECRET=votre_secret_ici
JWT_EXPIRES_IN=7d

# Serveur
PORT=3000
NODE_ENV=development

# Services (remplacez par vos vraies clés)
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_URL=cloudinary://...
```

### Documentation dans le README

```markdown
## Configuration

1. Copier le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```

2. Remplir les valeurs dans `.env`

3. Obtenir les clés API :
   - Stripe : https://dashboard.stripe.com/apikeys
   - Cloudinary : https://cloudinary.com/console
```

---

## Configuration centralisée

### Fichier de configuration

```javascript
// config/index.js
require('dotenv').config();

const config = {
  // Serveur
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base de données
  database: {
    url: process.env.DATABASE_URL,
    options: {
      // Options MongoDB...
    }
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Services
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  
  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  
  // Helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

// Validation des variables requises
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante : ${envVar}`);
  }
}

module.exports = config;
```

### Utilisation

```javascript
// Ailleurs dans l'application
const config = require('./config');

// Connexion base de données
mongoose.connect(config.database.url);

// JWT
jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

// Vérifications
if (config.isDevelopment) {
  app.use(morgan('dev'));
}
```

---

## Environnements multiples

### Fichiers par environnement

```
project/
├── .env                  # Local (ignoré par Git)
├── .env.example          # Template (commit)
├── .env.development      # Dev (optionnel)
├── .env.test             # Tests
└── .env.production       # Prod (NE PAS COMMIT !)
```

### Charger selon l'environnement

```javascript
// config/dotenv.js
const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : process.env.NODE_ENV === 'test'
    ? '.env.test'
    : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
```

### Scripts npm

```json
{
  "scripts": {
    "start": "NODE_ENV=production node app.js",
    "dev": "NODE_ENV=development nodemon app.js",
    "test": "NODE_ENV=test jest"
  }
}
```

Pour Windows, utiliser `cross-env` :

```bash
npm install cross-env
```

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js"
  }
}
```

---

## Validation avec Joi

### Installation

```bash
npm install joi
```

### Validation au démarrage

```javascript
// config/validate.js
const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number().default(3000),
  
  DATABASE_URL: Joi.string().required()
    .description('MongoDB connection string'),
  
  JWT_SECRET: Joi.string().min(32).required()
    .description('JWT secret key (min 32 caractères)'),
  
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  STRIPE_SECRET_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required()
    }),
  
}).unknown(); // Autoriser d'autres variables

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = envVars;
```

---

## Variables en production

### Ne JAMAIS stocker .env en production

Les plateformes de déploiement gèrent les variables :

### Render

```bash
# Dashboard → Environment
DATABASE_URL = mongodb+srv://...
JWT_SECRET = ...
```

### Railway

```bash
# Variables tab
railway variables set DATABASE_URL="mongodb://..."
```

### Vercel

```bash
# Settings → Environment Variables
vercel env add DATABASE_URL
```

### Heroku

```bash
heroku config:set DATABASE_URL="mongodb://..."
heroku config:set JWT_SECRET="..."
```

### Docker

```dockerfile
# Dockerfile
ENV NODE_ENV=production
ENV PORT=3000
```

```yaml
# docker-compose.yml
services:
  api:
    environment:
      - DATABASE_URL=mongodb://db:27017/myapp
      - JWT_SECRET=${JWT_SECRET}  # Depuis .env local
```

---

## Bonnes pratiques

### 1. Valeurs par défaut sensées

```javascript
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
```

### 2. Typage des variables

```javascript
// ⚠️ process.env retourne toujours des strings !
const port = parseInt(process.env.PORT, 10);
const isEnabled = process.env.FEATURE_FLAG === 'true';
const maxRetries = Number(process.env.MAX_RETRIES) || 3;
```

### 3. Préfixer les variables

```env
# Préfixes pour clarifier l'usage
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp

REDIS_URL=redis://localhost:6379

SMTP_HOST=smtp.example.com
SMTP_PORT=587

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### 4. Secrets complexes

```bash
# Générer un secret JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Ou
openssl rand -hex 64
```

### 5. Ne pas logger les secrets

```javascript
// ❌ DANGER
console.log('Config:', process.env);

// ✅ Logger seulement les non-secrets
console.log('Port:', process.env.PORT);
console.log('Env:', process.env.NODE_ENV);
```

---

## ❌ Erreurs Courantes

### 1. Charger dotenv trop tard

```javascript
// ❌ Les variables ne sont pas encore chargées
const config = require('./config');
require('dotenv').config();

// ✅ Charger en premier
require('dotenv').config();
const config = require('./config');
```

### 2. Commit le fichier .env

```bash
# ❌ Oops, j'ai commit mes secrets !
git add .
git commit -m "Add config"

# ✅ Vérifier le .gitignore AVANT
cat .gitignore | grep .env
git status  # .env ne doit PAS apparaître
```

### 3. Oublier .env en production

```javascript
// ❌ Erreur si pas de DATABASE_URL
mongoose.connect(process.env.DATABASE_URL);
// TypeError: Cannot read property 'split' of undefined

// ✅ Valider au démarrage
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL manquant');
  process.exit(1);
}
```

### 4. Utiliser .env en production

```javascript
// ❌ Fichier .env sur le serveur
// Problèmes : permissions, rotation, secrets dans le filesystem

// ✅ Variables injectées par la plateforme
// Render, Railway, Vercel gèrent ça pour vous
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Configuration basique

**Objectif** : Configurer dotenv pour une app Express

1. Installer dotenv
2. Créer `.env` avec PORT et DATABASE_URL
3. Créer `.env.example`
4. Configurer `.gitignore`
5. Utiliser les variables dans l'app

<details>
<summary>💡 Solution</summary>

```bash
npm install dotenv
```

```env
# .env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=dev_secret_key_change_in_production
```

```env
# .env.example
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your_secret_here
```

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

```javascript
// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ MongoDB erreur:', err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur sur le port ${process.env.PORT}`);
});
```
</details>

### Exercice 2 : Configuration centralisée avec validation

**Objectif** : Créer un module de configuration robuste

1. Créer `config/index.js`
2. Valider les variables requises
3. Fournir des valeurs par défaut
4. Exporter un objet structuré

<details>
<summary>Solution</summary>

```javascript
// config/index.js
require('dotenv').config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
];

// Vérification des variables requises
const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:');
  missing.forEach(key => console.error(`   - ${key}`));
  process.exit(1);
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  db: {
    url: process.env.DATABASE_URL
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  
  get isDev() {
    return this.env === 'development';
  },
  
  get isProd() {
    return this.env === 'production';
  }
};

module.exports = config;
```

```javascript
// app.js
const config = require('./config');
const express = require('express');

const app = express();

if (config.isDev) {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});
```
</details>

---

## Quiz de vérification

:::quiz
Q: Pourquoi utiliser des variables d'environnement ?
- [ ] Pour accélérer l'application
- [x] Pour sécuriser les secrets
- [ ] Pour réduire le code
> Les variables d'environnement permettent de garder les secrets (API keys, passwords) hors du code source.

Q: Quel fichier ne doit JAMAIS être commit ?
- [ ] `.env.example`
- [x] `.env`
- [ ] `config.js`
> Le fichier `.env` contient les secrets réels. Seul `.env.example` (sans valeurs) doit être commité.

Q: Comment charger les variables avec dotenv ?
- [ ] `dotenv.load()`
- [x] `require('dotenv').config()`
- [ ] `import dotenv`
> `require('dotenv').config()` charge les variables du fichier `.env` dans `process.env`.

Q: Quel type retourne `process.env.PORT` ?
- [ ] Number
- [x] String
- [ ] Undefined
> Toutes les variables d'environnement sont des strings. Pensez à les convertir avec `parseInt()` si nécessaire.
:::

---

## Pour aller plus loin

- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [12 Factor App - Config](https://12factor.net/config)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices)

---

## Prochaine étape

Découvrez le [déploiement](../../deployment/frontend-deployment.md) de votre application sur le cloud.
