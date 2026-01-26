# Introduction à Express.js

Express.js est le framework web minimaliste et flexible le plus populaire pour Node.js. Il fournit un ensemble robuste de fonctionnalités pour créer des applications web et des API.

---

## Ce que vous allez apprendre

- Comprendre ce qu'est Express.js et ses avantages
- Créer un serveur Express basique
- Définir des routes HTTP (GET, POST, PUT, DELETE)
- Gérer les requêtes et réponses

## Prérequis

- [Node.js - Installation](../installation-environnement/nodejs-installation.md)
- [Node.js - NPM](../installation-environnement/nodejs-npm.md)
- [JavaScript - Fonctions](../../javascript/fonctions/bases-fonctions.md)

---

## Qu'est-ce qu'Express.js ?

Express.js simplifie la création de serveurs HTTP en Node.js en ajoutant une couche d'abstraction au-dessus du module `http` natif.

### Comparaison : Node.js natif vs Express

```javascript
// ❌ Serveur HTTP avec Node.js natif (verbeux)
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Accueil</h1>');
  } else if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

```javascript
// ✅ Même serveur avec Express (simple et lisible)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Accueil</h1>');
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
```

### Avantages d'Express

| Fonctionnalité | Node.js natif | Express |
|----------------|---------------|---------|
| Routing | Manuel | Intégré |
| Parsing JSON | Manuel | Middleware |
| Fichiers statiques | Manuel | `express.static()` |
| Gestion d'erreurs | Manuel | Middleware dédié |
| Extensibilité | Limitée | Écosystème riche |

---

## Installation et Configuration

### Initialisation d'un projet

```bash
# Créer un dossier et initialiser npm
mkdir mon-api
cd mon-api
npm init -y

# Installer Express
npm install express

# Dépendances de développement recommandées
npm install -D nodemon
```

### Structure de projet recommandée

```
mon-api/
├── node_modules/
├── src/
│   ├── routes/
│   │   ├── index.js
│   │   └── users.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   └── app.js
├── package.json
└── server.js
```

### Configuration de base

```javascript
// server.js
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
```

```javascript
// src/app.js
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API!' });
});

module.exports = app;
```

### Script de développement avec Nodemon

```json
// package.json
{
  "name": "mon-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

```bash
# Lancer en développement (rechargement automatique)
npm run dev
```

---

## L'objet Application (app)

L'application Express est le cœur de votre serveur.

### Méthodes principales

```javascript
const express = require('express');
const app = express();

// Méthodes HTTP
app.get('/resource', handler);     // Lecture
app.post('/resource', handler);    // Création
app.put('/resource/:id', handler); // Mise à jour complète
app.patch('/resource/:id', handler); // Mise à jour partielle
app.delete('/resource/:id', handler); // Suppression

// Toutes les méthodes HTTP
app.all('/resource', handler);

// Middleware global
app.use(middleware);

// Monter un routeur
app.use('/api', router);
```

---

## L'objet Request (req)

L'objet `req` contient toutes les informations sur la requête HTTP.

### Propriétés essentielles

```javascript
app.get('/users/:id', (req, res) => {
  // Paramètres d'URL (ex: /users/123)
  console.log(req.params.id); // "123"
  
  // Query string (ex: /users/123?role=admin&active=true)
  console.log(req.query.role);   // "admin"
  console.log(req.query.active); // "true"
  
  // Headers HTTP
  console.log(req.headers['content-type']);
  console.log(req.headers.authorization);
  
  // Méthode HTTP
  console.log(req.method); // "GET"
  
  // URL complète
  console.log(req.originalUrl); // "/users/123?role=admin"
  console.log(req.path);        // "/users/123"
  
  // Adresse IP du client
  console.log(req.ip);
  
  res.send('OK');
});

app.post('/users', (req, res) => {
  // Corps de la requête (nécessite express.json())
  console.log(req.body); // { name: "Alice", email: "..." }
  
  res.json({ received: req.body });
});
```

### Exemple complet

```javascript
app.get('/api/products/:category/:id', (req, res) => {
  // URL: /api/products/electronics/42?sort=price&order=asc
  
  const { category, id } = req.params;
  const { sort, order } = req.query;
  
  console.log(`Catégorie: ${category}`);  // "electronics"
  console.log(`ID produit: ${id}`);       // "42"
  console.log(`Tri par: ${sort}`);        // "price"
  console.log(`Ordre: ${order}`);         // "asc"
  
  res.json({
    category,
    productId: id,
    sorting: { field: sort, direction: order }
  });
});
```

---

## L'objet Response (res)

L'objet `res` permet d'envoyer une réponse au client.

### Méthodes principales

```javascript
app.get('/demo', (req, res) => {
  // Envoyer du texte/HTML
  res.send('<h1>Hello World</h1>');
  
  // Envoyer du JSON
  res.json({ message: 'Hello', data: [1, 2, 3] });
  
  // Définir le status HTTP
  res.status(201).json({ created: true });
  res.status(404).json({ error: 'Not found' });
  
  // Redirection
  res.redirect('/autre-page');
  res.redirect(301, '/nouvelle-url'); // Redirection permanente
  
  // Envoyer un fichier
  res.sendFile('/chemin/vers/fichier.pdf');
  
  // Téléchargement
  res.download('/chemin/vers/fichier.pdf', 'mon-fichier.pdf');
  
  // Définir des headers
  res.set('X-Custom-Header', 'valeur');
  res.set({
    'Content-Type': 'application/json',
    'X-Powered-By': 'Mon API'
  });
});
```

### Chaînage des méthodes

```javascript
app.post('/users', (req, res) => {
  const newUser = { id: 1, ...req.body };
  
  res
    .status(201)
    .set('Location', `/users/${newUser.id}`)
    .json(newUser);
});

app.get('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Utilisateur non trouvé' 
    });
  }
  
  res.json(user);
});
```

---

## Servir des Fichiers Statiques

Express peut servir des fichiers statiques (HTML, CSS, JS, images).

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Servir le dossier "public"
app.use(express.static('public'));

// Avec un préfixe d'URL
app.use('/static', express.static('public'));
// Accès: http://localhost:3000/static/image.png

// Chemin absolu (recommandé)
app.use(express.static(path.join(__dirname, 'public')));

// Plusieurs dossiers (ordre de priorité)
app.use(express.static('public'));
app.use(express.static('uploads'));
```

### Structure avec fichiers statiques

```
mon-projet/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   └── logo.png
│   └── index.html
├── src/
│   └── app.js
└── server.js
```

---

## Variables d'Environnement

Utilisez les variables d'environnement pour la configuration.

### Installation de dotenv

```bash
npm install dotenv
```

### Configuration

```env
# .env (à la racine du projet)
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=mon_secret_super_securise
```

```javascript
// server.js (tout en haut du fichier)
require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Environnement: ${NODE_ENV}`);

app.listen(PORT, () => {
  console.log(`Serveur sur le port ${PORT}`);
});
```

> ⚠️ **Important** : Ajoutez `.env` à votre `.gitignore` pour ne jamais versionner vos secrets !

---

## Exercice Pratique

Créez un serveur Express basique :

```javascript
// Exercice : Compléter ce code
const express = require('express');
const app = express();

app.use(express.json());

// 1. Route GET / qui retourne { message: "Bienvenue!" }

// 2. Route GET /api/status qui retourne { status: "OK", timestamp: Date.now() }

// 3. Route POST /api/echo qui retourne le body reçu

// 4. Route GET /api/users/:id qui retourne { userId: <id reçu> }

app.listen(3000, () => {
  console.log('Serveur prêt!');
});
```

<details>
<summary>💡 Solution</summary>

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue!' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

app.post('/api/echo', (req, res) => {
  res.json(req.body);
});

app.get('/api/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

app.listen(3000, () => {
  console.log('Serveur prêt!');
});
```

</details>

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier `express.json()` | `req.body` est `undefined` | Ajouter `app.use(express.json())` |
| Port déjà utilisé | `EADDRINUSE` | Changer de port ou tuer le processus |
| Oublier `app.listen()` | Serveur ne démarre pas | Ajouter `app.listen(PORT)` |
| Mauvais ordre des routes | Route jamais atteinte | Routes spécifiques avant génériques |

---

## Quiz de vérification

:::quiz
Q: Comment envoyer une réponse JSON ?
- [ ] `res.send(json)`
- [x] `res.json(data)`
- [ ] `res.write(JSON.stringify(data))`
> `res.json()` envoie automatiquement le header `Content-Type: application/json` et stringify l'objet.

Q: Où sont les paramètres d'URL (`:id`) ?
- [ ] `req.query`
- [ ] `req.body`
- [x] `req.params`
> Les paramètres dynamiques de l'URL sont accessibles via `req.params.id`.

Q: Quel middleware parse le JSON du body ?
- [ ] `express.urlencoded()`
- [x] `express.json()`
- [ ] `express.static()`
> `express.json()` parse le body des requêtes avec `Content-Type: application/json`.

Q: Comment définir le code de statut HTTP ?
- [ ] `res.code(404)`
- [x] `res.status(404)`
- [ ] `res.httpStatus(404)`
> `res.status(code)` définit le code HTTP et peut être chaîné avec `.json()` ou `.send()`.
:::

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| `express()` | Crée une application Express |
| `app.get/post/put/delete()` | Définit des routes HTTP |
| `app.use()` | Ajoute un middleware global |
| `app.listen()` | Démarre le serveur |
| `req.params` | Paramètres d'URL (`:id`) |
| `req.query` | Query string (`?key=value`) |
| `req.body` | Corps de la requête |
| `res.json()` | Envoie une réponse JSON |
| `res.status()` | Définit le code HTTP |
| `express.static()` | Sert des fichiers statiques |

---

## Prochaine étape

Découvrez les [Middleware & Routing](./middleware-routing.md) pour structurer votre application.
