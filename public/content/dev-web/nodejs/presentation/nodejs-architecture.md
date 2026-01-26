# Architecture & Fonctionnement de Node.js

## Architecture Globale

Node.js repose sur une architecture complexe qui combine plusieurs composants pour offrir des performances exceptionnelles. Comprendre cette architecture est essentiel pour écrire du code optimisé.

### Les Composants Principaux

```
┌─────────────────────────────────────────────────┐
│         Application JavaScript (votre code)      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│              Node.js Bindings (C++)             │
│    Pont entre JavaScript et bibliothèques C++   │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────┐      ┌───────▼────────┐
│  V8 Engine │      │     libuv      │
│ (JavaScript)│      │  (Event Loop)  │
└────────────┘      └────────────────┘
      │                     │
      └──────────┬──────────┘
                 │
┌────────────────▼────────────────────────────────┐
│         Système d'Exploitation (OS)             │
│    (Fichiers, Réseau, Processus, Threads)      │
└─────────────────────────────────────────────────┘
```

**Détail des composants :**

1. **Couche Application** : Votre code JavaScript
2. **Node.js Core** : APIs JavaScript (fs, http, crypto, etc.)
3. **Node.js Bindings** : Code C++ qui fait le lien
4. **V8** : Moteur JavaScript qui exécute le code
5. **libuv** : Bibliothèque C qui gère l'Event Loop et les opérations asynchrones
6. **Système d'Exploitation** : Ressources système

### libuv : Le Cœur Asynchrone

libuv est une bibliothèque C multi-plateforme qui fournit :
- L'Event Loop
- Le Thread Pool
- Les opérations I/O asynchrones
- La gestion des sockets
- Les timers

```javascript
// Exemple : libuv gère ces opérations en arrière-plan
const fs = require('fs');
const crypto = require('crypto');

// 1. Opération I/O (gérée par l'OS via libuv)
fs.readFile('file.txt', (err, data) => {
  console.log('Fichier lu');
});

// 2. Opération CPU-intensive (gérée par le Thread Pool)
crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('Hash calculé');
});

// 3. Timer (géré par libuv Event Loop)
setTimeout(() => {
  console.log('Timer expiré');
}, 1000);
```

## Le Modèle Single-Thread

### Single-Thread ≠ Single-Threaded

**Clarification importante :** Node.js utilise un **thread principal unique** pour exécuter votre code JavaScript, mais utilise **plusieurs threads en arrière-plan** pour les opérations I/O.

```
Thread Principal (JavaScript)     Threads Arrière-Plan (libuv)
┌─────────────────────┐           ┌─────────────────────┐
│                     │           │   Thread Pool        │
│   Event Loop        │◄─────────►│   (4 threads par    │
│   V8 Engine         │           │    défaut)          │
│   Votre Code JS     │           │                     │
│                     │           │  - Crypto           │
│                     │           │  - Compression      │
│                     │           │  - DNS Lookup       │
│                     │           │  - File System      │
└─────────────────────┘           └─────────────────────┘
```

### Avantages du Single-Thread

```javascript
// Pas de race conditions sur les variables partagées
let counter = 0;

// Ces deux fonctions ne créent pas de conflit
function increment() {
  counter++; // Opération atomique en JS
  console.log('Counter:', counter);
}

// Simulation de requêtes simultanées
for (let i = 0; i < 1000; i++) {
  setTimeout(increment, 0);
}
// counter sera toujours 1000 (pas de race condition)
```

**Comparaison avec le multi-threading traditionnel :**

```javascript
// Multi-threading (Java, C#) - PROBLÈME potentiel
// Thread 1 et Thread 2 accèdent simultanément
int counter = 0;

// Thread 1: counter++ (lit 0, écrit 1)
// Thread 2: counter++ (lit 0, écrit 1) <- RACE CONDITION!
// Résultat: counter = 1 au lieu de 2

// Node.js - PAS de problème
// Toutes les opérations s'exécutent séquentiellement
// dans l'Event Loop
```

### Limites du Single-Thread

**Opérations CPU-intensives bloquent l'Event Loop :**

```javascript
const http = require('http');

// Fonction qui bloque le thread principal
function blockingOperation() {
  const end = Date.now() + 5000; // Bloquer pendant 5 secondes
  while (Date.now() < end) {
    // Calcul intensif qui monopolise le CPU
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/blocking') {
    blockingOperation(); // MAUVAIS : bloque toutes les requêtes
    res.end('Operation terminée');
  } else {
    res.end('Requête rapide');
  }
});

server.listen(3000);

// Test : Pendant qu'une requête à /blocking s'exécute,
// TOUTES les autres requêtes sont bloquées!
```

## Le Thread Pool de libuv

### Opérations Utilisant le Thread Pool

Certaines opérations sont trop lentes pour l'Event Loop et sont déléguées au Thread Pool :

**1. Opérations Cryptographiques**
```javascript
const crypto = require('crypto');

// Utilise le Thread Pool (CPU-intensive)
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('Hash:', key.toString('hex'));
});
```

**2. Compression/Décompression**
```javascript
const zlib = require('zlib');
const fs = require('fs');

// Utilise le Thread Pool
const gzip = zlib.createGzip();
const source = fs.createReadStream('input.txt');
const destination = fs.createWriteStream('input.txt.gz');

source.pipe(gzip).pipe(destination);
```

**3. Opérations Fichiers (certaines)**
```javascript
const fs = require('fs');

// Utilise le Thread Pool pour certaines opérations
fs.readFile('large-file.txt', (err, data) => {
  console.log('Fichier lu');
});
```

**4. DNS Lookup**
```javascript
const dns = require('dns');

// Utilise le Thread Pool
dns.lookup('google.com', (err, address) => {
  console.log('IP:', address);
});
```

### Configuration du Thread Pool

```javascript
// Variables d'environnement pour configurer libuv

// Nombre de threads (défaut: 4, max: 1024)
process.env.UV_THREADPOOL_SIZE = 8;

const crypto = require('crypto');

// Maintenant 8 opérations peuvent s'exécuter en parallèle
for (let i = 0; i < 16; i++) {
  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, key) => {
    console.log(`Hash ${i} terminé`);
  });
}
```

### Mesurer l'Impact du Thread Pool

```javascript
const crypto = require('crypto');

const start = Date.now();
let completed = 0;

function logTime() {
  completed++;
  console.log(`Hash ${completed}: ${Date.now() - start}ms`);
}

// Avec UV_THREADPOOL_SIZE = 4 (défaut)
// Les 4 premiers terminent en ~1000ms
// Les 4 suivants terminent en ~2000ms (attendent un thread libre)
for (let i = 0; i < 8; i++) {
  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', logTime);
}

/* Résultat typique avec 4 threads :
Hash 1: 1015ms
Hash 2: 1018ms
Hash 3: 1022ms
Hash 4: 1025ms
Hash 5: 2031ms  <- Attend qu'un thread se libère
Hash 6: 2035ms
Hash 7: 2038ms
Hash 8: 2042ms
*/
```

## I/O Non-Bloquant

### Opérations I/O vs CPU

**Opérations I/O (Input/Output) :**
- Lecture/écriture fichiers
- Requêtes réseau (HTTP, bases de données)
- Opérations disque

**Caractéristique :** Temps d'attente >> Temps CPU

**Opérations CPU :**
- Calculs mathématiques
- Parsing JSON/XML
- Compression/cryptographie
- Algorithmes complexes

### Modèle Bloquant vs Non-Bloquant

**Modèle Bloquant (Apache, PHP traditionnel) :**

```
Requête 1: Thread 1 ─────[I/O]─────▶ Réponse (thread idle)
Requête 2: Thread 2 ─────[I/O]─────▶ Réponse (thread idle)
Requête 3: Thread 3 ─────[I/O]─────▶ Réponse (thread idle)
...
Requête 1000: Thread 1000 ─[I/O]──▶ Réponse

Problème: 1000 requêtes = 1000 threads (énorme consommation mémoire)
```

**Modèle Non-Bloquant (Node.js) :**

```
                    ┌─ Requête 1 [lance I/O] ──▶ Callback
Event Loop Thread ──┼─ Requête 2 [lance I/O] ──▶ Callback
                    ├─ Requête 3 [lance I/O] ──▶ Callback
                    └─ Requête 1000 [lance I/O] ─▶ Callback

Avantage: 1000 requêtes = 1 thread (+ Thread Pool pour I/O)
```

### Exemple Concret : Serveur de Fichiers

**Version Bloquante (à éviter) :**

```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // BLOQUANT : Le serveur attend la lecture avant de traiter
  // d'autres requêtes
  const data = fs.readFileSync('large-file.txt', 'utf8');
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(data);
});

server.listen(3000);

// Problème : Si large-file.txt prend 2 secondes à lire,
// TOUTES les requêtes sont bloquées pendant 2 secondes
```

**Version Non-Bloquante (recommandée) :**

```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // NON-BLOQUANT : Le serveur peut traiter d'autres requêtes
  // pendant la lecture du fichier
  fs.readFile('large-file.txt', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Erreur serveur');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(data);
  });
  
  // Le serveur continue immédiatement à traiter d'autres requêtes
});

server.listen(3000);

// Avantage : Même avec large-file.txt qui prend 2 secondes,
// des milliers d'autres requêtes peuvent être traitées
```

**Version avec Streams (optimal) :**

```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // STREAMING : Envoie les données au fur et à mesure
  // Consomme très peu de mémoire
  const stream = fs.createReadStream('large-file.txt', 'utf8');
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  stream.pipe(res); // Transfère les données chunk par chunk
  
  stream.on('error', (err) => {
    res.writeHead(500);
    res.end('Erreur serveur');
  });
});

server.listen(3000);

// Optimal : Ni bloquant, ni gourmand en mémoire
```

## Les Modules Node.js

### Système de Modules CommonJS

Node.js utilise principalement le système CommonJS pour gérer les modules.

**Structure d'un Module :**

```javascript
// mathUtils.js - Définition d'un module
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Exporter des éléments
module.exports = {
  add,
  multiply,
  PI
};

// Alternative : exports.add = add;
```

**Utilisation d'un Module :**

```javascript
// app.js - Import d'un module
const mathUtils = require('./mathUtils');

console.log(mathUtils.add(5, 3)); // 8
console.log(mathUtils.multiply(4, 7)); // 28
console.log(mathUtils.PI); // 3.14159

// Destructuration lors de l'import
const { add, PI } = require('./mathUtils');
console.log(add(10, 20)); // 30
```

### Modules Core de Node.js

Node.js fournit des modules intégrés (built-in) :

```javascript
// Pas besoin d'installation, disponibles par défaut
const fs = require('fs');        // Système de fichiers
const http = require('http');    // Serveur HTTP
const path = require('path');    // Manipulation de chemins
const os = require('os');        // Informations système
const crypto = require('crypto'); // Cryptographie
const url = require('url');      // Parsing d'URLs
const events = require('events'); // Event Emitter

// Exemple d'utilisation
console.log('Plateforme:', os.platform());
console.log('CPU:', os.cpus().length, 'cores');
console.log('Mémoire libre:', os.freemem() / 1024 / 1024, 'MB');
```

### Modules ES6 dans Node.js

Node.js supporte maintenant les modules ES6 (import/export) :

**Configuration package.json :**

```json
{
  "name": "mon-projet",
  "type": "module"
}
```

**Syntaxe ES6 :**

```javascript
// mathUtils.mjs (ou .js avec "type": "module")
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Export par défaut
export default function subtract(a, b) {
  return a - b;
}
```

```javascript
// app.mjs
import subtract, { add, multiply, PI } from './mathUtils.mjs';

console.log(add(5, 3));        // 8
console.log(subtract(10, 4));  // 6
console.log(PI);               // 3.14159

// Import dynamique (asynchrone)
async function loadModule() {
  const math = await import('./mathUtils.mjs');
  console.log(math.add(1, 2));
}
```

### Cache des Modules

Node.js met en cache les modules après le premier `require()` :

```javascript
// counter.js
let count = 0;

module.exports = {
  increment() {
    count++;
  },
  getCount() {
    return count;
  }
};
```

```javascript
// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
counter1.increment();

console.log(counter1.getCount()); // 2
console.log(counter2.getCount()); // 2 (même instance!)

// Les deux variables pointent vers le même objet en cache
console.log(counter1 === counter2); // true
```

**Vider le cache (rare, pour tests) :**

```javascript
// Charger le module
const counter = require('./counter');

// Supprimer du cache
delete require.cache[require.resolve('./counter')];

// Recharger le module (nouvelle instance)
const newCounter = require('./counter');
```

## Le Module `process`

### Informations sur le Processus

```javascript
// Informations générales
console.log('Version Node.js:', process.version); // v18.17.0
console.log('Versions des dépendances:', process.versions);
/*
{
  node: '18.17.0',
  v8: '10.2.154.26',
  uv: '1.44.2',
  zlib: '1.2.13',
  ...
}
*/

console.log('Plateforme:', process.platform); // darwin, linux, win32
console.log('Architecture:', process.arch); // x64, arm64

// Répertoire de travail
console.log('CWD:', process.cwd());

// Changer de répertoire
process.chdir('/tmp');

// PID (Process ID)
console.log('Process ID:', process.pid);

// Temps d'exécution
console.log('Uptime:', process.uptime(), 'secondes');
```

### Arguments de Ligne de Commande

```javascript
// node app.js arg1 arg2 --flag=value

console.log('Arguments:', process.argv);
/*
[
  '/path/to/node',           // process.argv[0]
  '/path/to/app.js',         // process.argv[1]
  'arg1',                    // process.argv[2]
  'arg2',                    // process.argv[3]
  '--flag=value'             // process.argv[4]
]
*/

// Parser les arguments
const args = process.argv.slice(2); // Ignorer node et script

args.forEach((arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    console.log(`Option: ${key} = ${value}`);
  } else {
    console.log(`Argument: ${arg}`);
  }
});
```

### Variables d'Environnement

```javascript
// Lire les variables d'environnement
console.log('PORT:', process.env.PORT || 3000);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('HOME:', process.env.HOME);

// Définir une variable (disponible dans ce processus uniquement)
process.env.CUSTOM_VAR = 'my-value';

// Configuration selon l'environnement
const config = {
  development: {
    dbUrl: 'mongodb://localhost/dev',
    debug: true
  },
  production: {
    dbUrl: process.env.DATABASE_URL,
    debug: false
  }
};

const env = process.env.NODE_ENV || 'development';
const appConfig = config[env];

console.log('Configuration:', appConfig);
```

### Gestion des Signaux

```javascript
// SIGINT : Ctrl+C
process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, fermeture propre...');
  
  // Nettoyer les ressources
  closeDatabase();
  closeServerConnections();
  
  process.exit(0);
});

// SIGTERM : Signal de terminaison
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});

// Erreurs non gérées
process.on('uncaughtException', (err) => {
  console.error('Exception non capturée:', err);
  
  // Logger l'erreur
  logger.error(err);
  
  // Sortir avec code d'erreur
  process.exit(1);
});

// Promesses rejetées non gérées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  
  // En production, considérer process.exit(1)
});
```

### Métriques de Performance

```javascript
// Utilisation mémoire
const memUsage = process.memoryUsage();
console.log('Mémoire:');
console.log('  RSS:', (memUsage.rss / 1024 / 1024).toFixed(2), 'MB');
console.log('  Heap Total:', (memUsage.heapTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('  Heap Used:', (memUsage.heapUsed / 1024 / 1024).toFixed(2), 'MB');
console.log('  External:', (memUsage.external / 1024 / 1024).toFixed(2), 'MB');

// Utilisation CPU
const cpuUsage = process.cpuUsage();
console.log('CPU Usage:');
console.log('  User:', cpuUsage.user, 'microseconds');
console.log('  System:', cpuUsage.system, 'microseconds');

// High-Resolution Time (pour benchmarking)
const start = process.hrtime.bigint();

// Code à mesurer
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}

const end = process.hrtime.bigint();
console.log('Durée:', Number(end - start) / 1000000, 'ms');
```

## Le Module Buffer

### Manipulation de Données Binaires

Buffer est utilisé pour manipuler des données binaires brutes :

```javascript
// Créer un Buffer
const buf1 = Buffer.from('Hello Node.js', 'utf8');
const buf2 = Buffer.alloc(10); // Buffer de 10 octets (initialisé à 0)
const buf3 = Buffer.allocUnsafe(10); // Plus rapide mais non-initialisé

console.log(buf1); // <Buffer 48 65 6c 6c 6f 20 4e 6f 64 65 2e 6a 73>

// Lire le contenu
console.log(buf1.toString()); // Hello Node.js
console.log(buf1.toString('hex')); // 48656c6c6f204e6f64652e6a73
console.log(buf1.toString('base64')); // SGVsbG8gTm9kZS5qcw==

// Accès par index
console.log(buf1[0]); // 72 (code ASCII de 'H')
buf1[0] = 74; // Modifier en 'J'
console.log(buf1.toString()); // Jello Node.js
```

### Opérations sur les Buffers

```javascript
// Longueur
const buf = Buffer.from('Node.js');
console.log('Longueur:', buf.length); // 7

// Copier
const target = Buffer.alloc(10);
buf.copy(target);
console.log(target.toString()); // Node.js\0\0\0

// Concaténer
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');
const result = Buffer.concat([buf1, buf2]);
console.log(result.toString()); // Hello World

// Slice
const buf = Buffer.from('Node.js Programming');
const slice = buf.slice(0, 7);
console.log(slice.toString()); // Node.js

// Comparer
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('ABD');
console.log(buf1.compare(buf2)); // -1 (buf1 < buf2)
console.log(buf1.equals(buf2)); // false
```

### Buffer et Streams

```javascript
const fs = require('fs');

// Lecture avec Buffer
fs.readFile('file.txt', (err, buffer) => {
  if (err) throw err;
  
  console.log('Type:', buffer instanceof Buffer); // true
  console.log('Contenu:', buffer.toString());
});

// Écriture avec Buffer
const data = Buffer.from('Données à écrire', 'utf8');
fs.writeFile('output.txt', data, (err) => {
  if (err) throw err;
  console.log('Fichier écrit');
});

// Stream avec Buffer
const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {
  console.log('Chunk reçu:', chunk instanceof Buffer); // true
  console.log('Taille:', chunk.length, 'octets');
  
  // Traiter le chunk
  const text = chunk.toString();
  console.log('Contenu:', text.substring(0, 50));
});
```

## Exercices Pratiques

### Exercice 1 : Comprendre le Thread Pool

Expérimentez avec la taille du Thread Pool :

```javascript
// Définir UV_THREADPOOL_SIZE avant de require
process.env.UV_THREADPOOL_SIZE = 2;

const crypto = require('crypto');
const start = Date.now();

// Lancer 4 opérations CPU-intensive
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', () => {
    console.log(`${i + 1}: ${Date.now() - start}ms`);
  });
}

// Observez la différence avec UV_THREADPOOL_SIZE = 2 vs 4
```

### Exercice 2 : Créer un Module Réutilisable

Créez un module de gestion de logs :

```javascript
// logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFile) {
    this.logFile = logFile;
  }
  
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logEntry);
    console.log(logEntry.trim());
  }
  
  info(message) {
    this.log('INFO', message);
  }
  
  error(message) {
    this.log('ERROR', message);
  }
  
  warn(message) {
    this.log('WARN', message);
  }
}

module.exports = Logger;
```

**Utilisation :**

```javascript
const Logger = require('./logger');

const logger = new Logger('app.log');

logger.info('Application démarrée');
logger.warn('Connexion lente détectée');
logger.error('Échec de connexion à la base de données');
```

### Exercice 3 : Mesurer les Performances

Comparez les performances synchrone vs asynchrone :

```javascript
const fs = require('fs');

// Version synchrone
console.time('Synchrone');
for (let i = 0; i < 5; i++) {
  const data = fs.readFileSync('file.txt', 'utf8');
}
console.timeEnd('Synchrone');

// Version asynchrone
console.time('Asynchrone');
let completed = 0;
for (let i = 0; i < 5; i++) {
  fs.readFile('file.txt', 'utf8', (err, data) => {
    completed++;
    if (completed === 5) {
      console.timeEnd('Asynchrone');
    }
  });
}
```

## Résumé

**Architecture de Node.js :**
- V8 (moteur JavaScript) + libuv (Event Loop et I/O)
- Single-thread pour JavaScript, multi-threads pour I/O
- Thread Pool (4 threads par défaut) pour opérations CPU-intensive

**I/O Non-Bloquant :**
- Permet des milliers de connexions simultanées
- Opérations asynchrones gérées par libuv
- Optimal pour applications I/O-intensive (APIs, real-time)

**Système de Modules :**
- CommonJS (require/module.exports) - standard actuel
- ES Modules (import/export) - support moderne
- Cache des modules pour optimiser les performances

**Modules Core Essentiels :**
- `process` : Informations et contrôle du processus
- `Buffer` : Manipulation de données binaires
- `fs`, `http`, `crypto`, `path`, etc.

Dans le prochain chapitre, nous explorerons l'**écosystème Node.js** : NPM, packages populaires, et les outils de développement.