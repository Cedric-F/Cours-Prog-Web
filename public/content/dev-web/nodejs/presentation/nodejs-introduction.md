# Introduction à Node.js

## Qu'est-ce que Node.js ?

Node.js est un environnement d'exécution JavaScript côté serveur, construit sur le moteur JavaScript V8 de Google Chrome. Créé par Ryan Dahl en 2009, Node.js révolutionne le développement web en permettant d'utiliser JavaScript pour créer des applications serveur performantes et scalables.

### Définition et Concept

Node.js n'est **pas** un langage de programmation, mais un **runtime environment** qui permet d'exécuter du code JavaScript en dehors d'un navigateur web. Cette distinction est fondamentale pour comprendre sa nature et ses capacités.

```javascript
// Exemple simple : serveur HTTP avec Node.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bienvenue sur Node.js!\n');
});

server.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000/');
});
```

### Les Principes Fondamentaux

Node.js repose sur trois piliers essentiels :

1. **JavaScript partout** : Utilisation du même langage côté client et serveur
2. **Architecture non-bloquante** : I/O asynchrone pour des performances optimales
3. **Event-driven** : Programmation basée sur les événements

```javascript
// Approche synchrone (bloquante) - À ÉVITER
const fs = require('fs');
const data = fs.readFileSync('fichier.txt', 'utf8');
console.log(data);
console.log('Fichier lu');

// Approche asynchrone (non-bloquante) - RECOMMANDÉE
fs.readFile('fichier.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('Lecture en cours...');
```

## Histoire et Évolution

### La Naissance (2009)

Ryan Dahl crée Node.js en réponse aux limitations des serveurs web traditionnels qui utilisent un modèle multi-thread bloquant. Son objectif : créer un serveur capable de gérer des milliers de connexions simultanées sans consommer d'énormes ressources.

**Motivations initiales :**
- Besoin de gérer des connexions longues (long-polling, WebSockets)
- Inefficacité des serveurs Apache avec des milliers de connexions
- Popularité croissante de JavaScript avec l'apparition de V8

```javascript
// Exemple de code Node.js de 2009 (première version)
var sys = require('sys');
var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello Node.js World\n');
}).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
```

### Évolution Majeure

**2010-2011 : Adoption Croissante**
- Création de NPM (Node Package Manager) par Isaac Z. Schlueter
- Première conférence NodeConf
- Support Windows officiel

**2014 : La Fork io.js**
- Désaccord sur la gouvernance de Node.js
- Création d'io.js avec un cycle de release plus rapide
- Adoption d'ES6 features plus rapidement

**2015 : Fusion et Node.js Foundation**
- Réconciliation entre Node.js et io.js
- Création de la Node.js Foundation
- Version 4.0 qui unifie les deux projets

```javascript
// Évolution de la syntaxe avec ES6+
// Avant (ES5)
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// Après (ES6+)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World with Arrow Functions!');
});
```

**2019-2023 : Modernisation Continue**
- Support des modules ES6 natifs
- Amélioration des performances V8
- Introduction de nouvelles APIs (fs/promises, fetch, test runner)
- Support expérimental de TypeScript

```javascript
// Modules ES6 modernes dans Node.js
import express from 'express';
import { readFile } from 'fs/promises';

const app = express();

app.get('/data', async (req, res) => {
  try {
    const data = await readFile('data.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## Le Moteur V8

### Qu'est-ce que V8 ?

V8 est le moteur JavaScript open-source développé par Google, écrit en C++. Il compile le JavaScript directement en code machine natif plutôt que de l'interpréter, offrant ainsi des performances exceptionnelles.

**Caractéristiques principales :**
- Compilation Just-In-Time (JIT)
- Gestion avancée de la mémoire avec garbage collection
- Optimisations dynamiques du code
- Support des dernières spécifications ECMAScript

### Comment V8 Fonctionne ?

```
┌─────────────────────────────────────────────────┐
│           Code JavaScript Source                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Parser (Analyse)                   │
│        Génère l'AST (Abstract Syntax Tree)      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Ignition (Interpréteur)            │
│          Génère du Bytecode                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│           TurboFan (Compilateur JIT)            │
│       Optimise et compile en code machine       │
└─────────────────────────────────────────────────┘
```

```javascript
// Exemple d'optimisation V8
function addNumbers(a, b) {
  return a + b;
}

// Premier appel : V8 compile en bytecode
addNumbers(5, 10);

// Appels répétés : V8 détecte le pattern et optimise
for (let i = 0; i < 100000; i++) {
  addNumbers(i, i + 1); // TurboFan optimise cette fonction
}

// Si le type change, V8 "dé-optimise"
addNumbers("hello", "world"); // Déclenchera une dé-optimisation
```

### Optimisations V8 dans Node.js

**Hidden Classes (Classes Cachées) :**
V8 crée des classes cachées pour les objets ayant la même structure, améliorant l'accès aux propriétés.

```javascript
// BIEN : Même structure pour tous les objets
function User(name, age) {
  this.name = name; // Toujours dans le même ordre
  this.age = age;
}

const user1 = new User('Alice', 25);
const user2 = new User('Bob', 30);
// V8 peut optimiser car la structure est identique

// MAL : Structure différente
const user3 = { age: 35, name: 'Charlie' }; // Ordre inversé
user3.email = 'charlie@example.com'; // Propriété ajoutée dynamiquement
// V8 ne peut pas optimiser efficacement
```

**Inline Caching :**
V8 met en cache les emplacements mémoire des propriétés d'objets.

```javascript
// V8 optimise cet accès répété
function getUsername(user) {
  return user.name; // V8 mémorise l'emplacement de 'name'
}

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

// Appels multiples : inline caching optimise l'accès
users.forEach(user => console.log(getUsername(user)));
```

## L'Event Loop : Le Cœur de Node.js

### Qu'est-ce que l'Event Loop ?

L'Event Loop est le mécanisme qui permet à Node.js d'effectuer des opérations non-bloquantes malgré le fait que JavaScript soit mono-thread. C'est l'élément central qui gère l'exécution asynchrone.

### Architecture de l'Event Loop

```
┌───────────────────────────┐
┌─>│           timers          │ <- setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ <- I/O callbacks différés
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ <- usage interne
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │ <- setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ <- socket.on('close', ...)
   └───────────────────────────┘
```

### Les Phases de l'Event Loop

**1. Timers :** Exécute les callbacks de `setTimeout()` et `setInterval()`

```javascript
console.log('1. Début');

setTimeout(() => {
  console.log('3. Timeout');
}, 0);

console.log('2. Fin synchrone');

// Résultat :
// 1. Début
// 2. Fin synchrone
// 3. Timeout (dans la phase timers du prochain cycle)
```

**2. Pending Callbacks :** Exécute les I/O callbacks (sauf close, timers, setImmediate)

```javascript
const fs = require('fs');

fs.readFile('file.txt', (err, data) => {
  console.log('Callback I/O'); // Exécuté dans pending callbacks
});
```

**3. Poll :** Récupère les nouveaux événements I/O

```javascript
const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('Données reçues'); // Géré dans la phase poll
  });
});
```

**4. Check :** Exécute `setImmediate()` callbacks

```javascript
setImmediate(() => {
  console.log('Immediate');
});

setTimeout(() => {
  console.log('Timeout');
}, 0);

// setImmediate s'exécute avant setTimeout dans certains contextes
```

**5. Close Callbacks :** Exécute les callbacks de fermeture

```javascript
const server = http.createServer();

server.on('close', () => {
  console.log('Serveur fermé'); // Phase close callbacks
});
```

### Microtasks et Macrotasks

Node.js gère deux files d'attente distinctes :

**Microtasks (priorité haute) :**
- `process.nextTick()`
- Promises (`.then()`, `.catch()`, `.finally()`)

**Macrotasks (priorité normale) :**
- `setTimeout()`
- `setInterval()`
- `setImmediate()`
- I/O callbacks

```javascript
console.log('1. Script début');

setTimeout(() => console.log('4. setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('3. Promise 1'))
  .then(() => console.log('5. Promise 2'));

process.nextTick(() => console.log('2. nextTick'));

console.log('6. Script fin');

// Résultat :
// 1. Script début
// 6. Script fin
// 2. nextTick (microtask, priorité maximale)
// 3. Promise 1 (microtask)
// 5. Promise 2 (microtask)
// 4. setTimeout (macrotask)
```

### Exemple Complet d'Event Loop

```javascript
const fs = require('fs');

console.log('Start');

// Macrotask : setTimeout
setTimeout(() => {
  console.log('Timeout 1');
  
  // Microtask dans setTimeout
  Promise.resolve().then(() => console.log('Promise dans Timeout'));
}, 0);

// Microtask : Promise
Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    
    // Nouvelle microtask
    process.nextTick(() => console.log('NextTick dans Promise'));
  })
  .then(() => console.log('Promise 2'));

// Microtask : process.nextTick (priorité max)
process.nextTick(() => console.log('NextTick 1'));

// Macrotask : setImmediate
setImmediate(() => console.log('Immediate 1'));

// I/O opération
fs.readFile(__filename, () => {
  console.log('File read');
  
  setTimeout(() => console.log('Timeout dans I/O'), 0);
  setImmediate(() => console.log('Immediate dans I/O'));
});

console.log('End');

/* Résultat typique :
Start
End
NextTick 1
Promise 1
Promise 2
NextTick dans Promise
Timeout 1
Promise dans Timeout
Immediate 1
File read
Immediate dans I/O
Timeout dans I/O
*/
```

## Le Modèle Non-Bloquant

### Pourquoi le Non-Bloquant ?

Les opérations I/O (lecture/écriture fichiers, requêtes réseau, bases de données) sont **très lentes** comparées au CPU. Le modèle non-bloquant permet de ne pas attendre la fin d'une opération pour en commencer une autre.

**Comparaison des modèles :**

```javascript
// MODÈLE BLOQUANT (synchrone)
console.log('Début');
const data = fs.readFileSync('gros-fichier.txt'); // Bloque tout
console.log('Données lues');
console.log('Suite du programme'); // Attend la lecture

// MODÈLE NON-BLOQUANT (asynchrone)
console.log('Début');
fs.readFile('gros-fichier.txt', (err, data) => {
  console.log('Données lues'); // S'exécute quand les données sont prêtes
});
console.log('Suite du programme'); // S'exécute immédiatement

/* Résultat non-bloquant :
Début
Suite du programme
Données lues
*/
```

### Performance : Bloquant vs Non-Bloquant

```javascript
// Simulation de comparaison de performance
const start = Date.now();

// APPROCHE BLOQUANTE : 3 requêtes séquentielles
function blockerWay() {
  const data1 = performSlowOperation(); // 1 seconde
  const data2 = performSlowOperation(); // 1 seconde
  const data3 = performSlowOperation(); // 1 seconde
  return [data1, data2, data3];
  // Temps total : 3 secondes
}

// APPROCHE NON-BLOQUANTE : 3 requêtes parallèles
async function nonBlockingWay() {
  const [data1, data2, data3] = await Promise.all([
    performSlowOperationAsync(), // 1 seconde
    performSlowOperationAsync(), // 1 seconde (en parallèle)
    performSlowOperationAsync()  // 1 seconde (en parallèle)
  ]);
  return [data1, data2, data3];
  // Temps total : 1 seconde (3x plus rapide!)
}
```

### Patterns Asynchrones dans Node.js

**1. Callbacks (style classique) :**

```javascript
const fs = require('fs');

fs.readFile('fichier.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur:', err);
    return;
  }
  console.log('Contenu:', data);
});
```

**2. Promises (ES6+) :**

```javascript
const fs = require('fs').promises;

fs.readFile('fichier.txt', 'utf8')
  .then(data => console.log('Contenu:', data))
  .catch(err => console.error('Erreur:', err));
```

**3. Async/Await (ES2017+, recommandé) :**

```javascript
const fs = require('fs').promises;

async function lireFichier() {
  try {
    const data = await fs.readFile('fichier.txt', 'utf8');
    console.log('Contenu:', data);
  } catch (err) {
    console.error('Erreur:', err);
  }
}

lireFichier();
```

## Node.js vs Navigateur

### Différences Fondamentales

| Aspect | Navigateur | Node.js |
|--------|-----------|---------|
| **Environnement** | Client-side | Server-side |
| **APIs Globales** | `window`, `document` | `global`, `process` |
| **Modules** | ES Modules (import/export) | CommonJS + ES Modules |
| **Système de fichiers** | ❌ Pas d'accès direct | ✅ Accès complet (fs) |
| **Réseau** | fetch, XMLHttpRequest | http, https, net |
| **UI** | DOM manipulation | ❌ Pas d'interface graphique |

### APIs Spécifiques à Node.js

```javascript
// 1. Process : informations sur le processus Node.js
console.log('Version Node.js:', process.version);
console.log('Plateforme:', process.platform);
console.log('Répertoire courant:', process.cwd());
console.log('Arguments:', process.argv);

// Variables d'environnement
console.log('PORT:', process.env.PORT || 3000);

// Sortir du programme
// process.exit(0); // Code 0 = succès, 1 = erreur

// 2. Buffer : manipulation de données binaires
const buffer = Buffer.from('Hello Node.js', 'utf8');
console.log(buffer); // <Buffer 48 65 6c 6c 6f ...>
console.log(buffer.toString('hex')); // Hexadécimal
console.log(buffer.toString('base64')); // Base64

// 3. __dirname et __filename (CommonJS)
console.log('Fichier actuel:', __filename);
console.log('Répertoire actuel:', __dirname);

// 4. Module global
global.myVariable = 'disponible partout';
console.log(global.myVariable);
```

### Compatibilité du Code

```javascript
// Code compatible navigateur ET Node.js
const isNode = typeof process !== 'undefined' 
  && process.versions 
  && process.versions.node;

if (isNode) {
  console.log('Running in Node.js');
  // Code spécifique Node.js
  const fs = require('fs');
} else {
  console.log('Running in browser');
  // Code spécifique navigateur
  const element = document.getElementById('app');
}

// Polyfill pour fetch dans Node.js (< v18)
if (isNode && typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
```

## Premier Serveur HTTP

### Serveur Minimal

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>Mon Premier Serveur Node.js!</h1>');
});

server.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}/`);
});
```

### Serveur avec Routing

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');
  
  if (pathname === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Page d\'accueil' }));
  } 
  else if (pathname === '/api/users' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      users: ['Alice', 'Bob', 'Charlie'] 
    }));
  } 
  else if (pathname === '/api/users' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      const user = JSON.parse(body);
      res.statusCode = 201;
      res.end(JSON.stringify({ 
        message: 'Utilisateur créé', 
        user 
      }));
    });
  } 
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route non trouvée' }));
  }
});

server.listen(3000, () => {
  console.log('Serveur API sur http://localhost:3000');
});
```

### Serveur avec Gestion d'Erreurs

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    if (req.url === '/error') {
      throw new Error('Erreur simulée!');
    }
    
    res.end('Serveur fonctionnel\n');
  } catch (error) {
    console.error('Erreur capturée:', error.message);
    res.statusCode = 500;
    res.end('Erreur interne du serveur\n');
  }
});

// Gestion des erreurs non capturées
server.on('error', (err) => {
  console.error('Erreur serveur:', err);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu, fermeture du serveur...');
  server.close(() => {
    console.log('Serveur fermé proprement');
    process.exit(0);
  });
});

server.listen(3000, () => {
  console.log('Serveur avec gestion d\'erreurs sur port 3000');
});
```

## Exercices Pratiques

### Exercice 1 : Comprendre l'Event Loop

Prédisez l'ordre d'exécution :

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

process.nextTick(() => console.log('D'));

console.log('E');

// Quelle sera la sortie ?
```

<details>
<summary>Solution</summary>

```
A
E
D
C
B
```

**Explication :**
1. `A` et `E` : code synchrone
2. `D` : `process.nextTick()` (microtask prioritaire)
3. `C` : Promise (microtask)
4. `B` : `setTimeout()` (macrotask)
</details>

### Exercice 2 : Serveur avec Plusieurs Routes

Créez un serveur avec les routes suivantes :
- `GET /` : Retourne "Bienvenue"
- `GET /about` : Retourne des infos sur l'API
- `GET /api/time` : Retourne l'heure actuelle
- `404` pour toutes les autres routes

<details>
<summary>Solution</summary>

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  switch(req.url) {
    case '/':
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Bienvenue' }));
      break;
      
    case '/about':
      res.statusCode = 200;
      res.end(JSON.stringify({ 
        name: 'Mon API', 
        version: '1.0.0' 
      }));
      break;
      
    case '/api/time':
      res.statusCode = 200;
      res.end(JSON.stringify({ 
        time: new Date().toISOString() 
      }));
      break;
      
    default:
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Route non trouvée' }));
  }
});

server.listen(3000);
```
</details>

### Exercice 3 : Opérations Asynchrones

Convertissez ce code callback en async/await :

```javascript
const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const parsed = JSON.parse(data);
  console.log(parsed);
  
  fs.writeFile('output.json', JSON.stringify(parsed, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Fichier écrit');
  });
});
```

<details>
<summary>Solution</summary>

```javascript
const fs = require('fs').promises;

async function processFile() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    const parsed = JSON.parse(data);
    console.log(parsed);
    
    await fs.writeFile('output.json', JSON.stringify(parsed, null, 2));
    console.log('Fichier écrit');
  } catch (err) {
    console.error(err);
  }
}

processFile();
```
</details>

## Résumé

Node.js est un environnement d'exécution JavaScript côté serveur qui révolutionne le développement web. Voici les points clés :

**🎯 Points Essentiels :**
- Runtime JavaScript basé sur le moteur V8 de Chrome
- Architecture événementielle et non-bloquante
- JavaScript côté client ET serveur (full-stack JS)
- Event Loop : gestion intelligente des opérations asynchrones
- Performances exceptionnelles pour les applications I/O intensives

**⚙️ Concepts Techniques :**
- V8 : compilation JIT, optimisations dynamiques
- Event Loop : phases (timers, poll, check, close)
- Microtasks vs Macrotasks : ordre d'exécution
- Non-blocking I/O : plusieurs opérations simultanées
- APIs Node.js : process, Buffer, modules système

**🚀 Premier Pas :**
- Serveur HTTP minimal en quelques lignes
- Approche asynchrone avec callbacks, Promises, async/await
- Différences avec l'environnement navigateur

Dans le prochain chapitre, nous explorerons l'**architecture interne de Node.js** : libuv, thread pool, et le fonctionnement détaillé du modèle événementiel.