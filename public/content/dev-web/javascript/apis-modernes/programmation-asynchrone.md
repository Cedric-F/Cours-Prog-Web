# Programmation Asynchrone

Maîtrisez les callbacks, Promises, et async/await pour gérer les opérations asynchrones et créer des applications réactives et performantes.

---

## Comprendre l'asynchronicité

JavaScript est **single-threaded** (un seul fil d'exécution) mais peut gérer des tâches asynchrones grâce à l'**event loop**.

### Code synchrone

```javascript
console.log("1");
console.log("2");
console.log("3");

// Affichage :
// 1
// 2
// 3
```

### Code asynchrone

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");

// Affichage :
// 1
// 3
// 2 (après, même avec délai 0)
```

**Pourquoi ?** Les callbacks asynchrones sont placées dans la **queue** et exécutées après le code synchrone.

---

## Callbacks

Fonction passée en argument, exécutée après une opération asynchrone.

### setTimeout / setInterval

```javascript
// setTimeout : exécuter après un délai
setTimeout(() => {
  console.log("Après 2 secondes");
}, 2000);

// setInterval : exécuter répétitivement
const intervalId = setInterval(() => {
  console.log("Chaque seconde");
}, 1000);

// Arrêter l'interval
setTimeout(() => {
  clearInterval(intervalId);
  console.log("Interval arrêté");
}, 5000);
```

### Exemple : Animation

```javascript
function animateProgress(callback) {
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += 10;
    console.log(`Progression: ${progress}%`);
    
    if (progress >= 100) {
      clearInterval(interval);
      callback(); // Appeler callback quand terminé
    }
  }, 100);
}

animateProgress(() => {
  console.log("Animation terminée !");
});
```

### Callback hell (pyramide de la mort)

```javascript
// ❌ Difficile à lire et maintenir
getData((data1) => {
  processData(data1, (data2) => {
    saveData(data2, (data3) => {
      validateData(data3, (data4) => {
        sendData(data4, (response) => {
          console.log("Terminé", response);
        });
      });
    });
  });
});
```

---

## Promises

Les **Promises** représentent le résultat futur d'une opération asynchrone.

### États d'une Promise

1. **Pending** (en attente) : état initial
2. **Fulfilled** (résolue) : opération réussie
3. **Rejected** (rejetée) : opération échouée

### Créer une Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // Opération asynchrone
  setTimeout(() => {
    const success = true;
    
    if (success) {
      resolve("Données reçues !"); // Succès
    } else {
      reject("Erreur lors du chargement"); // Échec
    }
  }, 1000);
});

// Utiliser la Promise
promise
  .then((result) => {
    console.log("Succès:", result); // "Données reçues !"
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });
```

### then() et catch()

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice", email: "alice@example.com" });
      } else {
        reject(new Error("ID invalide"));
      }
    }, 1000);
  });
}

// Utilisation
fetchUser(1)
  .then((user) => {
    console.log("Utilisateur:", user);
    return user.id; // Retourner pour chaîner
  })
  .then((id) => {
    console.log("ID:", id);
  })
  .catch((error) => {
    console.error("Erreur:", error.message);
  })
  .finally(() => {
    console.log("Terminé (succès ou échec)");
  });
```

### Chaînage de Promises

```javascript
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Alice" }), 500);
  });
}

function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 1, title: "Post 1", userId },
      { id: 2, title: "Post 2", userId }
    ]), 500);
  });
}

function getComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 1, text: "Comment 1", postId },
      { id: 2, text: "Comment 2", postId }
    ]), 500);
  });
}

// ✅ Chaînage lisible
getUser(1)
  .then((user) => {
    console.log("User:", user);
    return getPosts(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return getComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });
```

### Gestion d'erreurs

```javascript
function riskyOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.5) {
        resolve("Succès");
      } else {
        reject(new Error("Échec aléatoire"));
      }
    }, 1000);
  });
}

riskyOperation()
  .then((result) => console.log(result))
  .catch((error) => console.error("Erreur:", error.message))
  .finally(() => console.log("Opération terminée"));
```

---

## Promise.all, Promise.race, Promise.allSettled

### Promise.all

Attendre que **toutes** les Promises soient résolues.

```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.resolve(20);
const promise3 = Promise.resolve(30);

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log(results); // [10, 20, 30]
    const sum = results.reduce((a, b) => a + b, 0);
    console.log("Somme:", sum); // 60
  })
  .catch((error) => {
    console.error("Une Promise a échoué:", error);
  });

// Exemple pratique : charger plusieurs ressources
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: `User ${id}` }), 1000);
  });
}

const userIds = [1, 2, 3, 4, 5];

Promise.all(userIds.map(id => fetchUser(id)))
  .then((users) => {
    console.log("Tous les utilisateurs:", users);
  });

// ⚠️ Si UNE Promise échoue, Promise.all échoue
Promise.all([
  Promise.resolve(1),
  Promise.reject("Erreur"),
  Promise.resolve(3)
])
  .then((results) => {
    console.log(results); // Pas exécuté
  })
  .catch((error) => {
    console.error("Échec:", error); // "Erreur"
  });
```

### Promise.race

Retourne dès que la **première** Promise est résolue ou rejetée.

```javascript
const slow = new Promise((resolve) => setTimeout(() => resolve("Lent"), 3000));
const fast = new Promise((resolve) => setTimeout(() => resolve("Rapide"), 1000));

Promise.race([slow, fast])
  .then((result) => {
    console.log(result); // "Rapide" (après 1s)
  });

// Exemple : Timeout
function fetchWithTimeout(url, timeout) {
  const fetchPromise = fetch(url);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeout);
  });
  
  return Promise.race([fetchPromise, timeoutPromise]);
}

fetchWithTimeout("https://api.example.com/data", 5000)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Erreur:", error.message));
```

### Promise.allSettled

Attendre que **toutes** les Promises soient terminées (succès ou échec).

```javascript
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Erreur"),
  Promise.resolve(3)
])
  .then((results) => {
    console.log(results);
    /*
    [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: "Erreur" },
      { status: "fulfilled", value: 3 }
    ]
    */
    
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(`Promise ${i} réussie:`, result.value);
      } else {
        console.error(`Promise ${i} échouée:`, result.reason);
      }
    });
  });
```

### Promise.any

Retourne dès que la **première** Promise est **résolue** (ignore les rejets).

```javascript
Promise.any([
  Promise.reject("Erreur 1"),
  Promise.reject("Erreur 2"),
  Promise.resolve("Succès"),
  Promise.resolve("Autre succès")
])
  .then((result) => {
    console.log(result); // "Succès"
  })
  .catch((error) => {
    console.error("Toutes ont échoué:", error);
  });
```

---

## async / await

Syntaxe moderne pour travailler avec des Promises (plus lisible).

### Principe

```javascript
// Avec Promises (then/catch)
function fetchData() {
  return fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

// Avec async/await (plus lisible)
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

### Syntaxe

```javascript
// async : déclare une fonction asynchrone
async function myFunction() {
  // await : attend la résolution d'une Promise
  const result = await somePromise();
  return result;
}

// Fonction async retourne toujours une Promise
const result = myFunction();
result.then((value) => console.log(value));
```

### Exemples

```javascript
// Fonction simple
async function getUser(id) {
  // Simuler un appel API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice", email: "alice@example.com" });
    }, 1000);
  });
}

// Utilisation avec await
async function displayUser() {
  console.log("Chargement...");
  
  const user = await getUser(1);
  console.log("User:", user);
  
  return user;
}

displayUser();

// Chaînage avec await
async function getUserData(id) {
  const user = await getUser(id);
  console.log("User:", user);
  
  const posts = await getPosts(user.id);
  console.log("Posts:", posts);
  
  const comments = await getComments(posts[0].id);
  console.log("Comments:", comments);
  
  return { user, posts, comments };
}

getUserData(1)
  .then((data) => console.log("Données complètes:", data))
  .catch((error) => console.error("Erreur:", error));
```

### Gestion d'erreurs (try/catch)

```javascript
async function fetchUserData(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du fetch:", error.message);
    throw error; // Re-throw si besoin
  }
}

// Utilisation
async function main() {
  try {
    const user = await fetchUserData(1);
    console.log("User:", user);
  } catch (error) {
    console.error("Impossible de charger l'utilisateur");
  }
}

main();
```

### Parallélisation avec Promise.all

```javascript
// ❌ Séquentiel (lent)
async function loadDataSequential() {
  const user = await getUser(1);      // Attend 1s
  const posts = await getPosts(1);    // Attend 1s
  const comments = await getComments(1); // Attend 1s
  // Total : 3 secondes
  
  return { user, posts, comments };
}

// ✅ Parallèle (rapide)
async function loadDataParallel() {
  const [user, posts, comments] = await Promise.all([
    getUser(1),
    getPosts(1),
    getComments(1)
  ]);
  // Total : 1 seconde (tout en parallèle)
  
  return { user, posts, comments };
}
```

### Boucles avec await

```javascript
// ❌ Ne fonctionne PAS avec forEach
async function processUsers(userIds) {
  userIds.forEach(async (id) => {
    const user = await getUser(id); // forEach n'attend pas
    console.log(user);
  });
  console.log("Terminé"); // Affiché avant les users
}

// ✅ for...of (séquentiel)
async function processUsersSequential(userIds) {
  for (const id of userIds) {
    const user = await getUser(id);
    console.log(user);
  }
  console.log("Terminé"); // Affiché après tous les users
}

// ✅ map + Promise.all (parallèle)
async function processUsersParallel(userIds) {
  const promises = userIds.map(id => getUser(id));
  const users = await Promise.all(promises);
  
  users.forEach(user => console.log(user));
  console.log("Terminé");
}
```

---

## Patterns avancés

### Retry avec délai exponentiel

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      console.log(`Tentative ${attempt} échouée, nouvelle tentative dans ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Délai exponentiel
    }
  }
}

// Utilisation
async function unreliableAPI() {
  if (Math.random() < 0.7) {
    throw new Error("API error");
  }
  return { data: "Success" };
}

retry(() => unreliableAPI(), 5, 500)
  .then((result) => console.log("Résultat:", result))
  .catch((error) => console.error("Toutes les tentatives ont échoué:", error));
```

### Queue asynchrone

```javascript
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }
  
  async add(fn) {
    this.queue.push(fn);
    
    if (!this.running) {
      await this.process();
    }
  }
  
  async process() {
    this.running = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      try {
        await fn();
      } catch (error) {
        console.error("Erreur dans la queue:", error);
      }
    }
    
    this.running = false;
  }
}

// Utilisation
const queue = new AsyncQueue();

queue.add(async () => {
  console.log("Tâche 1 start");
  await new Promise(r => setTimeout(r, 1000));
  console.log("Tâche 1 end");
});

queue.add(async () => {
  console.log("Tâche 2 start");
  await new Promise(r => setTimeout(r, 500));
  console.log("Tâche 2 end");
});
```

### Cache avec TTL

```javascript
class CacheWithTTL {
  constructor(ttl = 60000) { // 1 minute par défaut
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async get(key, fetchFn) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log("Cache hit");
      return cached.value;
    }
    
    console.log("Cache miss");
    const value = await fetchFn();
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
    
    return value;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Utilisation
const cache = new CacheWithTTL(10000); // 10 secondes

async function getUser(id) {
  return cache.get(`user:${id}`, async () => {
    console.log("Fetching from API...");
    await new Promise(r => setTimeout(r, 1000));
    return { id, name: "Alice" };
  });
}

// Premier appel : API
await getUser(1); // "Cache miss", "Fetching from API..."

// Deuxième appel (< 10s) : Cache
await getUser(1); // "Cache hit"

// Après 10s : API à nouveau
setTimeout(async () => {
  await getUser(1); // "Cache miss", "Fetching from API..."
}, 11000);
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. async/await pour code lisible
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// 2. Promise.all pour parallélisation
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

// 3. Toujours gérer les erreurs
async function safeOperation() {
  try {
    await riskyOperation();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// 4. for...of pour await dans boucles
for (const item of items) {
  await processItem(item);
}

// 5. Promise.allSettled si besoin de tous les résultats
const results = await Promise.allSettled(promises);
```

### ❌ À éviter

```javascript
// 1. await dans forEach
items.forEach(async (item) => {
  await processItem(item); // ❌ Ne fonctionne pas
});

// 2. Oublier try/catch
async function bad() {
  await riskyOperation(); // ❌ Erreur non gérée
}

// 3. await inutiles séquentiels
const a = await fetchA();
const b = await fetchB(); // ❌ Pourrait être en parallèle

// 4. Callback hell avec Promises
promise
  .then(() => promise2.then(() => promise3.then())); // ❌ Utiliser async/await
```

---

## Exercice pratique

### API Client avec retry et cache

Créez `api-client.js` :

```javascript
class APIClient {
  constructor(baseURL, cacheTimeout = 60000) {
    this.baseURL = baseURL;
    this.cache = new CacheWithTTL(cacheTimeout);
  }
  
  async get(endpoint, useCache = true) {
    if (useCache) {
      return this.cache.get(endpoint, () => this._fetch(endpoint));
    }
    return this._fetch(endpoint);
  }
  
  async _fetch(endpoint) {
    return retry(async () => {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }, 3, 1000);
  }
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

// Utilisation
const api = new APIClient('https://jsonplaceholder.typicode.com');

async function demo() {
  try {
    const users = await api.get('/users');
    console.log('Users:', users);
    
    const user = await api.get('/users/1');
    console.log('User:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}

demo();
```

---

**Prochaine sous-section** : Fetch API & Storage !
