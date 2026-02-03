# Patterns & Best Practices

Découvrez les design patterns fonctionnels, techniques avancées (currying, composition, memoization) et les meilleures pratiques pour écrire du code JavaScript maintenable.

---

## Fonctions pures

Une **fonction pure** :
1. Retourne toujours le même résultat pour les mêmes entrées
2. N'a aucun effet de bord (side effect)

### Exemples

```javascript
// ✅ Fonction pure
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5 (toujours le même résultat)

function multiply(x, y) {
  return x * y;
}

// ✅ Pure : pas de mutation
function addToArray(arr, item) {
  return [...arr, item]; // Crée un nouveau tableau
}

const numbers = [1, 2, 3];
const result = addToArray(numbers, 4);
console.log(numbers); // [1, 2, 3] (original inchangé)
console.log(result);  // [1, 2, 3, 4]

// ❌ Fonction impure : mutation
function impureAdd(arr, item) {
  arr.push(item); // Modifie le tableau original
  return arr;
}

const numbers2 = [1, 2, 3];
impureAdd(numbers2, 4);
console.log(numbers2); // [1, 2, 3, 4] (original modifié !)

// ❌ Fonction impure : dépend d'une variable externe
let multiplier = 2;

function impureMultiply(x) {
  return x * multiplier; // Résultat dépend de 'multiplier'
}

console.log(impureMultiply(5)); // 10
multiplier = 3;
console.log(impureMultiply(5)); // 15 (résultat différent !)

// ❌ Fonction impure : effet de bord (console.log, DOM, etc.)
function impureLog(message) {
  console.log(message); // Effet de bord
  return message;
}
```

### Avantages des fonctions pures

- **Testabilité** : Facile à tester (pas de dépendances externes)
- **Prévisibilité** : Comportement déterministe
- **Mise en cache** : Peut utiliser la mémorisation
- **Parallélisation** : Sûr pour exécution parallèle
- **Débogage** : Plus facile à raisonner

```javascript
// ✅ Bon : fonctions pures
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function applyDiscount(total, discount) {
  return total - (total * discount);
}

// Composables et testables
const items = [{ price: 10 }, { price: 20 }];
const total = calculateTotal(items);
const finalPrice = applyDiscount(total, 0.1);
console.log(finalPrice); // 27
```

---

## Currying

Transformer une fonction à plusieurs paramètres en une séquence de fonctions à un paramètre.

### Principe

```javascript
// Fonction curried pour multiplier
function multiply(x) {
  return function(y) {
    return x * y;
  };
}
```

La fonction `multiply` mémorise le paramètre `x` et retourne une fonction qui attend un unique paramètre `y`, qui peut être "sauvegardée" dans une constante invocable.

```javascript
// Exemple
const n = 100;
const double = multiply(2);
const triple = multiply(3);
const quadruple = multiply(4);
const multiples = [n, double(n), triple(n), quadruple(n)]
console.log(multiples); // [100, 200, 300, 400]
```

### Applications pratiques

```javascript
// 1. Configuration réutilisable
const createLogger = level => message => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

const infoLog = createLogger("INFO");
const errorLog = createLogger("ERROR");

infoLog("Server started");    // "[2024-01-24T...] [INFO] Server started"
errorLog("Connection failed"); // "[2024-01-24T...] [ERROR] Connection failed"

// 2. Opérations partiellement appliquées
const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Filtres configurables
const createFilter = property => value => obj => obj[property] === value;

const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" }
];

const filterByRole = createFilter("role");
const admins = users.filter(filterByRole("admin"));
console.log(admins); // [{ name: "Alice", ... }, { name: "Charlie", ... }]
```

---

## Composition de fonctions

Combiner plusieurs fonctions pour créer des transformations complexes.

### Principe

```javascript
// Fonctions simples
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const square = x => x * x;

// Application séquentielle
const result = square(multiply3(add5(2)));
console.log(result); // ((2 + 5) * 3)² = 441

// Fonction compose (droite à gauche)
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const transform = compose(square, multiply3, add5);
console.log(transform(2)); // 441

// Fonction pipe (gauche à droite)
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

const transform2 = pipe(add5, multiply3, square);
console.log(transform2(2)); // 441
```

### Applications pratiques

```javascript
// 1. Transformation de données
const users = [
  { name: "alice", age: 25, active: true },
  { name: "bob", age: 17, active: false },
  { name: "charlie", age: 30, active: true }
];

// Fonctions de transformation
const filterActive = arr => arr.filter(u => u.active);
const filterAdults = arr => arr.filter(u => u.age >= 18);
const mapNames = arr => arr.map(u => u.name);
const capitalize = arr => arr.map(name => name.toUpperCase());

// Composition
const getActiveAdultNames = pipe(
  filterActive,
  filterAdults,
  mapNames,
  capitalize
);

console.log(getActiveAdultNames(users)); // ["ALICE", "CHARLIE"]

// 2. Validation
const isNotEmpty = str => str.trim().length > 0;
const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isLongEnough = min => str => str.length >= min;

const validateEmail = pipe(
  isNotEmpty,
  isEmail
);

const validatePassword = pipe(
  isNotEmpty,
  isLongEnough(8)
);

console.log(validateEmail("test@example.com")); // true
console.log(validatePassword("mypassword123")); // true
```

---

## Memoization (mise en cache)

Stocker les résultats de fonctions coûteuses pour éviter les recalculs.

### Implémentation

```javascript
// Fonction de mémorisation générique
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log("Depuis le cache");
      return cache[key];
    }
    
    console.log("Calcul en cours...");
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// Exemple : Fibonacci (très coûteux sans cache)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoFib = memoize(fibonacci);

console.log(memoFib(10)); // Calcul... → 55
console.log(memoFib(10)); // Cache → 55 (instantané)

// Exemple : Factorielle
const factorial = memoize(function(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

console.log(factorial(5)); // Calcul... → 120
console.log(factorial(5)); // Cache → 120
```

### Mémorisation avec Map

```javascript
// Meilleure gestion avec Map
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Avec limite de taille de cache (LRU)
function memoizeWithLimit(fn, limit = 100) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      // Déplacer à la fin (LRU)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    const result = fn(...args);
    
    // Supprimer le plus ancien si limite atteinte
    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}
```

---

## Partial application

Fixer certains paramètres d'une fonction pour créer une nouvelle fonction.

```javascript
// Application partielle manuelle
function multiply(a, b, c) {
  return a * b * c;
}

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

// Fixer le premier paramètre
const multiplyBy2 = partial(multiply, 2);
console.log(multiplyBy2(3, 4)); // 2 * 3 * 4 = 24

// Fixer les deux premiers
const multiplyBy2And3 = partial(multiply, 2, 3);
console.log(multiplyBy2And3(4)); // 2 * 3 * 4 = 24

// Exemple pratique : configuration
function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`;
}

const greetFormal = partial(greet, "Good morning", ".");
const greetCasual = partial(greet, "Hey", "!");

console.log(greetFormal("Alice")); // "Good morning, Alice."
console.log(greetCasual("Bob"));   // "Hey, Bob!"
```

---

## Debounce et Throttle

Contrôler la fréquence d'exécution de fonctions.

### Debounce

Exécute la fonction seulement après un délai sans nouvel appel.

```javascript
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Exemple : recherche avec API
const searchAPI = (query) => {
  console.log(`Searching for: ${query}`);
  // Appel API...
};

const debouncedSearch = debounce(searchAPI, 500);

// Simule la saisie utilisateur
debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
debouncedSearch("hell");
debouncedSearch("hello");
// Seulement "Searching for: hello" après 500ms

// Usage réel
document.getElementById("search").addEventListener("input", debounce((e) => {
  searchAPI(e.target.value);
}, 300));
```

### Throttle

Exécute la fonction au maximum une fois par intervalle.

```javascript
function throttle(fn, interval) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Exemple : scroll event
const handleScroll = () => {
  console.log("Scroll position:", window.scrollY);
};

const throttledScroll = throttle(handleScroll, 1000);

window.addEventListener("scroll", throttledScroll);
// Exécuté au maximum 1 fois par seconde

// Exemple : resize
const handleResize = () => {
  console.log("Window size:", window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", throttle(handleResize, 500));
```

---

## Design patterns fonctionnels

### 1. Factory Pattern

```javascript
// Créer des objets sans utiliser new
function createUser(name, role) {
  return {
    name,
    role,
    permissions: role === "admin" ? ["read", "write", "delete"] : ["read"],
    greet() {
      return `Hello, I'm ${this.name} (${this.role})`;
    }
  };
}

const admin = createUser("Alice", "admin");
const user = createUser("Bob", "user");

console.log(admin.greet()); // "Hello, I'm Alice (admin)"
console.log(admin.permissions); // ["read", "write", "delete"]
```

### 2. Observer Pattern (callbacks)

```javascript
function createEventEmitter() {
  const events = {};
  
  return {
    on(event, callback) {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback);
    },
    
    emit(event, data) {
      if (events[event]) {
        events[event].forEach(callback => callback(data));
      }
    },
    
    off(event, callback) {
      if (events[event]) {
        events[event] = events[event].filter(cb => cb !== callback);
      }
    }
  };
}

// Utilisation
const emitter = createEventEmitter();

emitter.on("user:login", (user) => {
  console.log(`${user.name} logged in`);
});

emitter.on("user:login", (user) => {
  console.log(`Welcome, ${user.name}!`);
});

emitter.emit("user:login", { name: "Alice" });
// "Alice logged in"
// "Welcome, Alice!"
```

### 3. Decorator Pattern

```javascript
// Ajouter des fonctionnalités à une fonction existante
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${fn.name} took ${end - start}ms`);
    return result;
  };
}

// Fonction de base
function calculateSum(numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// Décorée
const decoratedSum = withTiming(withLogging(calculateSum));

decoratedSum([1, 2, 3, 4, 5]);
// "Calling calculateSum with [[1, 2, 3, 4, 5]]"
// "Result: 15"
// "calculateSum took 0.123ms"
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. Préférer les fonctions pures
function calculateDiscount(price, discount) {
  return price - (price * discount);
}

// 2. Nommage descriptif
function getUsersByActiveStatus(users, isActive) {
  return users.filter(user => user.active === isActive);
}

// 3. Paramètres par défaut
function createUser(name, role = "user") {
  return { name, role };
}

// 4. Early return
function processUser(user) {
  if (!user) return null;
  if (!user.active) return null;
  
  // Logique principale
  return transformUser(user);
}

// 5. Composition plutôt que héritage
const withTimestamp = obj => ({
  ...obj,
  createdAt: new Date()
});

const withId = obj => ({
  ...obj,
  id: Math.random().toString(36)
});

const createDocument = pipe(withTimestamp, withId);
const doc = createDocument({ title: "My Doc" });

// 6. Currying pour configuration
const log = level => message => {
  console.log(`[${level}] ${message}`);
};

const error = log("ERROR");
const info = log("INFO");
```

### ❌ À éviter

```javascript
// 1. Fonctions trop longues
function doEverything() {
  // 200 lignes...
}

// 2. Effets de bord non documentés
function calculateTotal(items) {
  items.forEach(item => item.processed = true); // ❌ Mutation
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 3. Trop de paramètres
function createUser(name, age, email, phone, address, city, zip, country) {
  // Utiliser un objet
}

// 4. Magic numbers
function isAdult(age) {
  return age >= 18; // ✅ OK (valeur évidente)
}

function calculatePrice(price) {
  return price * 1.2; // ❌ Que représente 1.2 ?
}

// Mieux :
const TAX_RATE = 0.2;
function calculatePrice(price) {
  return price * (1 + TAX_RATE);
}
```

---

## Exercice pratique

### Patterns avancés

Créez `patterns-exercise.js` :

1. **Fonctions pures** : Convertir ces fonctions impures en pures
```javascript
let total = 0;
function addToTotal(n) {
  total += n;
  return total;
}
```

2. **Currying** : Créer `createMultiplier` curryfiée pour `multiply(a)(b)(c)`

3. **Composition** : Créer un pipeline de transformation de données
```javascript
const data = [
  { name: "alice", age: 25, score: 85 },
  { name: "bob", age: 17, score: 92 },
  { name: "charlie", age: 30, score: 78 }
];

// Pipeline : filterAdults → sortByScore → mapNames → capitalize
```

4. **Memoization** : Mémoriser une fonction `expensiveCalculation(n)` qui simule un délai

5. **Debounce** : Implémenter un système de recherche avec debounce

6. **Decorator** : Créer un décorateur `withRetry(fn, maxAttempts)` qui réessaie en cas d'échec

```javascript
// Exemple de solution

// 1. Fonctions pures
function addToTotal(currentTotal, n) {
  return currentTotal + n;
}

let total = 0;
total = addToTotal(total, 5);
total = addToTotal(total, 10);

// 3. Composition
const filterAdults = arr => arr.filter(u => u.age >= 18);
const sortByScore = arr => [...arr].sort((a, b) => b.score - a.score);
const mapNames = arr => arr.map(u => u.name);
const capitalize = arr => arr.map(name => name.toUpperCase());

const processData = pipe(filterAdults, sortByScore, mapNames, capitalize);
console.log(processData(data)); // ["ALICE", "CHARLIE"]

// 6. Decorator
function withRetry(fn, maxAttempts = 3) {
  return async function(...args) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
        console.log(`Attempt ${i + 1} failed, retrying...`);
      }
    }
  };
}

const unreliableAPI = withRetry(async (url) => {
  // Simule un appel qui peut échouer
  if (Math.random() < 0.7) throw new Error("API Error");
  return { data: "Success" };
}, 5);
```

---

**Prochaine sous-section** : DOM Manipulation - Sélection & Modification !
