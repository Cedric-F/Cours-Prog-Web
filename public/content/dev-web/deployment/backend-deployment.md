# Déploiement Backend

Mettez votre API Node.js/Express en ligne sur Render ou Railway.

---

## Ce que vous allez apprendre

- Préparer votre backend pour la production
- Déployer sur Render (gratuit)
- Déployer sur Railway
- Configurer MongoDB Atlas

## Prérequis

- [Variables d'environnement](../nodejs/env/variables-environnement)
- [Git & GitHub](../git/github-collaboration)
- Une API Express fonctionnelle

---

## Préparation au déploiement

### 1. Vérifier package.json

```json
{
  "name": "mon-api",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### 2. Configurer le port dynamique

```javascript
// app.js
require('dotenv').config();
const express = require('express');

const app = express();

// ⚠️ CRUCIAL : Utiliser process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Configurer CORS pour la production

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://mon-frontend.vercel.app', 'https://mondomaine.com']
    : 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
```

### 4. Health check endpoint

```javascript
// Route pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ou simplement
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});
```

---

## MongoDB Atlas (Base de données cloud)

### Créer un cluster gratuit

1. Aller sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Créer un compte gratuit
3. "Build a Database" → Shared (Free)
4. Choisir une région proche (Paris, Frankfurt)
5. "Create Cluster"

### Configurer l'accès

1. **Database Access** → Add Database User
   ```
   Username: myapp_user
   Password: (générer un mot de passe fort)
   Role: Read and write to any database
   ```

2. **Network Access** → Add IP Address
   ```
   # Pour le développement
   My Current IP Address
   
   # Pour la production (autoriser tout - simplifié)
   0.0.0.0/0 (Allow access from anywhere)
   ```

3. **Récupérer la connection string**
   - Clusters → Connect → Connect your application
   ```
   mongodb+srv://myapp_user:<password>@cluster0.xxxxx.mongodb.net/myapp?retryWrites=true&w=majority
   ```

### Utiliser dans l'application

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

```env
# .env
DATABASE_URL=mongodb+srv://myapp_user:motdepasse@cluster0.xxxxx.mongodb.net/myapp?retryWrites=true&w=majority
```

---

## Render (Recommandé - Gratuit)

### Pourquoi Render ?

| Avantage | Description |
|----------|-------------|
| 💰 Gratuit | Plan gratuit généreux |
| 🔄 Auto-deploy | Deploy sur chaque push |
| 🔒 HTTPS | Certificat SSL automatique |
| 📊 Logs | Accès aux logs en temps réel |

### Déploiement

1. **Créer un compte**
   - [render.com](https://render.com) → Sign up avec GitHub

2. **New Web Service**
   - Connect repository
   - Sélectionner votre repo

3. **Configuration**
   ```
   Name: mon-api
   Region: Frankfurt (EU)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Variables d'environnement**
   ```
   DATABASE_URL = mongodb+srv://...
   JWT_SECRET = votre_secret_jwt
   NODE_ENV = production
   ```

5. **Deploy**
   - Cliquer "Create Web Service"
   - Attendre le build (~2-5 min)
   - URL : `https://mon-api.onrender.com`

### render.yaml (optionnel)

```yaml
services:
  - type: web
    name: mon-api
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # À configurer manuellement
      - key: JWT_SECRET
        sync: false
```

### ⚠️ Limitations du plan gratuit

- **Spin down** : L'instance s'arrête après 15 min d'inactivité
- **Cold start** : ~30 secondes pour redémarrer
- **Solution** : Ping régulier avec un cron job

```javascript
// Garder l'API active (côté frontend ou cron externe)
setInterval(() => {
  fetch('https://mon-api.onrender.com/health');
}, 14 * 60 * 1000); // Toutes les 14 minutes
```

---

## Railway

### Configuration

1. **Créer un compte**
   - [railway.app](https://railway.app) → Login avec GitHub

2. **New Project**
   - "Deploy from GitHub repo"
   - Sélectionner le repository

3. **Variables**
   - Variables tab → Add
   ```
   DATABASE_URL = mongodb+srv://...
   JWT_SECRET = ...
   PORT = 3000
   ```

4. **Générer un domaine**
   - Settings → Domains → Generate Domain
   - URL : `https://mon-api.up.railway.app`

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Avantages Railway

- Pas de cold start (plan starter)
- Base de données intégrée (PostgreSQL, Redis, MongoDB)
- Interface moderne
- 5$ de crédit gratuit/mois

---

## Comparaison des plateformes

| Critère | Render | Railway | Fly.io |
|---------|--------|---------|--------|
| **Gratuit** | ✅ Oui | 5$/mois crédit | ✅ Oui |
| **Cold start** | ⚠️ 30s | ❌ Non | ❌ Non |
| **DB intégrée** | PostgreSQL | Plusieurs | PostgreSQL |
| **Régions** | 4 | 2 | 30+ |
| **Simplicité** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

**Recommandation** : 
- Render pour les débutants et projets gratuits
- Railway pour plus de fiabilité
- Fly.io pour les besoins avancés

---

## Structure de production recommandée

```javascript
// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const app = express();

// Connexion DB
connectDB();

// Middleware de sécurité
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Parsing
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## Connecter Frontend et Backend

### Variables d'environnement Frontend

```env
# .env.production (Vite)
VITE_API_URL=https://mon-api.onrender.com/api
```

### Exemple de fetch

```javascript
// services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};
```

---

## ❌ Erreurs Courantes

### 1. Port en dur

```javascript
// ❌ Ne fonctionnera pas en production
app.listen(3000);

// ✅ Utiliser la variable d'environnement
app.listen(process.env.PORT || 3000);
```

### 2. MongoDB local en production

```javascript
// ❌ Connection string locale
DATABASE_URL=mongodb://localhost:27017/mydb

// ✅ MongoDB Atlas
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/mydb
```

### 3. CORS bloque les requêtes

```javascript
// ❌ Frontend bloqué
// Access-Control-Allow-Origin error

// ✅ Configurer CORS avec le bon origin
app.use(cors({
  origin: 'https://mon-frontend.vercel.app'
}));
```

### 4. Secrets exposés dans les logs

```javascript
// ❌ DANGER
console.log('DB URL:', process.env.DATABASE_URL);

// ✅ Masquer les secrets
console.log('DB connected:', process.env.DATABASE_URL ? '✅' : '❌');
```

---

## 🏋️ Exercice Pratique

**Objectif** : Déployer votre API Express

1. Créer un cluster MongoDB Atlas
2. Préparer votre code (PORT dynamique, CORS)
3. Pusher sur GitHub
4. Déployer sur Render
5. Tester avec Postman ou le frontend

<details>
<summary>Checklist</summary>

- [ ] MongoDB Atlas configuré
- [ ] Connection string récupérée
- [ ] IP 0.0.0.0/0 autorisée
- [ ] package.json avec script "start"
- [ ] PORT = process.env.PORT
- [ ] CORS configuré
- [ ] Variables sur Render
- [ ] Deploy réussi
- [ ] /health retourne 200
- [ ] Frontend peut appeler l'API
</details>

---

## Quiz de vérification

:::quiz
Q: Pourquoi utiliser `process.env.PORT` ?
- [ ] Pour la sécurité
- [x] La plateforme attribue un port dynamique
- [ ] Pour le développement
> Les plateformes cloud assignent un port dynamique via la variable `PORT`, ne pas hardcoder le port.

Q: Où stocker la base de données en production ?
- [ ] localhost
- [x] MongoDB Atlas
- [ ] Dans le code
> MongoDB Atlas (ou autre service managé) offre haute disponibilité, backups et sécurité.

Q: Que faire si l'API met 30s à répondre sur Render ?
- [x] C'est normal (cold start)
- [ ] Bug dans le code
- [ ] Problème réseau
> Sur le plan gratuit, les services sont mis en veille. Le premier appel prend du temps (cold start).
:::

---

## Pour aller plus loin

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

## Prochaine étape

Retournez aux [projets](../projets/consignes.md) et déployez votre application complète !
