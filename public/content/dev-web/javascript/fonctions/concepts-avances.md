# Concepts Avancés

Explorez les arrow functions, callbacks, closures, et IIFE pour maîtriser les patterns fonctionnels avancés de JavaScript.

---

## Ce que vous allez apprendre

- Utiliser les arrow functions et leurs particularités
- Comprendre les callbacks et la programmation asynchrone
- Maîtriser les closures pour l'encapsulation
- Appliquer les IIFE et patterns fonctionnels

## Prérequis

- [JavaScript - Bases des fonctions](./bases-fonctions.md)
- [JavaScript - Variables et Types](../variables-types/declaration-types-primitifs.md)

---

## Arrow Functions (fonctions flèches)

Syntaxe moderne et concise introduite en ES6.

### Syntaxe

```javascript
// Fonction classique
function add(a, b) {
  return a + b;
}

// Arrow function
const add2 = (a, b) => {
  return a + b;
};

// Return implicite (expression simple)
const add3 = (a, b) => a + b;

console.log(add3(5, 3)); // 8
```

### Variations syntaxiques

```javascript
// 1. Pas de paramètres
const greet = () => console.log("Hello!");
greet(); // "Hello!"

// 2. Un paramètre : parenthèses optionnelles
const square = n => n * n;
console.log(square(5)); // 25

// Avec parenthèses (recommandé pour la cohérence)
const square2 = (n) => n * n;

// 3. Plusieurs paramètres : parenthèses obligatoires
const multiply = (a, b) => a * b;

// 4. Corps de fonction (plusieurs instructions)
const processData = (data) => {
  const cleaned = data.trim();
  const upper = cleaned.toUpperCase();
  return upper;
};

// 5. Retourner un objet : entourer de parenthèses
const createUser = (name, age) => ({ name, age });
console.log(createUser("Alice", 25)); // { name: "Alice", age: 25 }

// Sans parenthèses → erreur (interprété comme un bloc)
// const wrong = (name, age) => { name, age }; // ❌
```

### Différence avec les fonctions classiques

#### 1. this

```javascript
// Fonction classique : this dynamique
const obj1 = {
  name: "Alice",
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
};

obj1.greet(); // "Hello, Alice!"

// Arrow function : this lexical (hérité du scope parent)
const obj2 = {
  name: "Bob",
  greet: () => {
    console.log(`Hello, ${this.name}!`); // this = window (ou undefined en strict mode)
  }
};

obj2.greet(); // "Hello, undefined!"

// Exemple pratique : event handlers
const button = {
  label: "Click me",
  click: function() {
    // Fonction classique : this = button
    document.addEventListener("click", function() {
      console.log(this.label); // undefined (this = window ou element)
    });
    
    // Arrow function : this = button (lexical)
    document.addEventListener("click", () => {
      console.log(this.label); // "Click me"
    });
  }
};

// Méthodes d'objet : préférer fonction classique
const user = {
  name: "Alice",
  greet() {  // ✅ Syntaxe courte (function omis)
    console.log(`Hello, ${this.name}!`);
  }
};
```

#### 2. arguments

```javascript
// Fonction classique : a accès à arguments
function sum1() {
  console.log(arguments); // [1, 2, 3]
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

sum1(1, 2, 3); // 6

// Arrow function : pas d'arguments
const sum2 = () => {
  // console.log(arguments); // ❌ ReferenceError
};

// Solution : rest parameters
const sum3 = (...numbers) => {
  return numbers.reduce((a, b) => a + b, 0);
};

sum3(1, 2, 3); // 6
```

#### 3. Constructeurs

```javascript
// Fonction classique : peut être constructeur
function Person(name) {
  this.name = name;
}

const person1 = new Person("Alice");
console.log(person1.name); // "Alice"

// Arrow function : ne peut PAS être constructeur
const Person2 = (name) => {
  this.name = name;
};

// const person2 = new Person2("Bob"); // ❌ TypeError: Person2 is not a constructor
```

### Quand utiliser arrow functions ?

**✅ Utiliser arrow functions :**
- Callbacks courts (map, filter, reduce)
- Fonctions anonymes
- Quand on veut préserver le `this` du parent

**❌ Éviter arrow functions :**
- Méthodes d'objet (besoin de `this` dynamique)
- Constructeurs
- Fonctions avec `arguments`
- Gestionnaires d'événements DOM si besoin de `this`

```javascript
// ✅ Bon usage
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

const user = {
  name: "Alice",
  friends: ["Bob", "Charlie"],
  greet() {
    // Arrow function préserve this.name
    this.friends.forEach(friend => {
      console.log(`${this.name} says hello to ${friend}`);
    });
  }
};

user.greet();
// "Alice says hello to Bob"
// "Alice says hello to Charlie"

// ❌ Mauvais usage
const calculator = {
  value: 0,
  add: (n) => {
    this.value += n; // ❌ this ne pointe pas vers calculator
  }
};
```

---

## Callbacks

Une **callback** est une fonction passée en argument à une autre fonction.

### Callbacks synchrones

```javascript
// Fonction qui accepte une callback
function processArray(arr, callback) {
  const result = [];
  for (let item of arr) {
    result.push(callback(item));
  }
  return result;
}

// Utilisation
const numbers = [1, 2, 3, 4, 5];

const doubled = processArray(numbers, function(n) {
  return n * 2;
});

console.log(doubled); // [2, 4, 6, 8, 10]

// Avec arrow function
const squared = processArray(numbers, n => n * n);
console.log(squared); // [1, 4, 9, 16, 25]

// Méthodes natives avec callbacks
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

### Callbacks asynchrones

```javascript
// setTimeout : callback exécutée après un délai
console.log("Start");

setTimeout(() => {
  console.log("After 2 seconds");
}, 2000);

console.log("End");

// Affichage :
// "Start"
// "End"
// "After 2 seconds" (après 2s)

// Exemple : traitement asynchrone
function fetchData(callback) {
  console.log("Fetching data...");
  
  setTimeout(() => {
    const data = { id: 1, name: "Alice" };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log("Data received:", data);
});

// Affichage :
// "Fetching data..."
// (1 seconde plus tard)
// "Data received: { id: 1, name: 'Alice' }"
```

### Callback hell (pyramide de la mort)

```javascript
// ❌ Problème : callbacks imbriquées
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      getEvenEvenMoreData(c, function(d) {
        getFinalData(d, function(e) {
          console.log(e);
        });
      });
    });
  });
});

// ✅ Solution moderne : Promises / async-await (voir section APIs Modernes)
```

### Gestion d'erreurs avec callbacks

```javascript
// Pattern Node.js : error-first callback
function readFile(path, callback) {
  setTimeout(() => {
    const error = null; // ou new Error("File not found")
    const data = "File content";
    
    callback(error, data);
  }, 1000);
}

// Utilisation
readFile("file.txt", (err, data) => {
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("Data:", data);
});
```

---

## Closures (fermetures)

Une **closure** est une fonction qui "se souvient" de son environnement lexical.

### Principe

```javascript
function outer() {
  const message = "Hello from outer";
  
  function inner() {
    console.log(message); // Accès à la variable du parent
  }
  
  return inner;
}

const myFunction = outer();
myFunction(); // "Hello from outer"

// inner "capture" message même après l'exécution de outer
```

### Exemple pratique : compteur privé

```javascript
function createCounter() {
  let count = 0; // Variable privée
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

// count n'est pas accessible de l'extérieur
// console.log(counter.count); // undefined
```

### Closure dans les boucles

```javascript
// ❌ Problème avec var
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 (pas 0, 1, 2)
  }, 1000);
}

// var est function-scoped → i est partagé

// ✅ Solution 1 : let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2 ✅
  }, 1000);
}

// ✅ Solution 2 : IIFE (avec var)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2 ✅
    }, 1000);
  })(i);
}
```

### Closures pour configuration

```javascript
// Factory avec configuration
function createLogger(prefix) {
  return function(message) {
    console.log(`[${prefix}] ${message}`);
  };
}

const infoLogger = createLogger("INFO");
const errorLogger = createLogger("ERROR");

infoLogger("App started");    // "[INFO] App started"
errorLogger("Something failed"); // "[ERROR] Something failed"

// Multipliers
function createMultiplier(factor) {
  return (number) => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenfold = createMultiplier(10);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(tenfold(5)); // 50
```

### Module pattern

```javascript
const BankAccount = (function() {
  // Variables privées
  let balance = 0;
  const transactions = [];
  
  // Fonctions privées
  function log(type, amount) {
    transactions.push({ type, amount, date: new Date() });
  }
  
  // API publique
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        log("deposit", amount);
        return balance;
      }
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        log("withdraw", amount);
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    },
    getTransactions() {
      return [...transactions]; // Copie pour éviter modification
    }
  };
})();

BankAccount.deposit(100);
BankAccount.withdraw(30);
console.log(BankAccount.getBalance()); // 70
console.log(BankAccount.getTransactions());
// [
//   { type: "deposit", amount: 100, date: ... },
//   { type: "withdraw", amount: 30, date: ... }
// ]

// balance et transactions ne sont pas accessibles
// console.log(BankAccount.balance); // undefined
```

---

## IIFE (Immediately Invoked Function Expression)

Fonction exécutée immédiatement après sa définition.

### Syntaxe

```javascript
// Fonction anonyme exécutée immédiatement
(function() {
  console.log("IIFE exécutée !");
})();

// Avec arrow function
(() => {
  console.log("Arrow IIFE !");
})();

// Avec paramètres
(function(name) {
  console.log(`Hello, ${name}!`);
})("Alice");

// Avec return
const result = (function(a, b) {
  return a + b;
})(5, 3);

console.log(result); // 8
```

### Cas d'usage

#### 1. Éviter la pollution du scope global

```javascript
// Sans IIFE
var counter = 0;
var increment = function() { counter++; };

// counter et increment sont globaux (risque de conflit)

// Avec IIFE
(function() {
  var counter = 0;
  var increment = function() { counter++; };
  
  // counter et increment sont privés
})();

// console.log(counter); // ❌ ReferenceError
```

#### 2. Module pattern

```javascript
const Calculator = (function() {
  // Privé
  const PI = 3.14159;
  
  function validateNumber(n) {
    return typeof n === "number" && !isNaN(n);
  }
  
  // Public
  return {
    add(a, b) {
      if (validateNumber(a) && validateNumber(b)) {
        return a + b;
      }
      throw new Error("Invalid numbers");
    },
    circleArea(radius) {
      if (validateNumber(radius)) {
        return PI * radius * radius;
      }
      throw new Error("Invalid radius");
    }
  };
})();

console.log(Calculator.add(5, 3));        // 8
console.log(Calculator.circleArea(10));   // 314.159
// console.log(Calculator.PI);            // undefined (privé)
// console.log(Calculator.validateNumber); // undefined (privé)
```

#### 3. Initialisation

```javascript
// Exécuter du code d'initialisation
(function() {
  console.log("App initializing...");
  
  // Configuration
  const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000
  };
  
  // Setup
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");
  });
  
  console.log("App initialized");
})();
```

---

## Higher-order functions

Fonctions qui **acceptent** d'autres fonctions en paramètres ou **retournent** des fonctions.

### Exemples natifs

```javascript
// map, filter, reduce sont des higher-order functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);        // map accepte une fonction
const evens = numbers.filter(n => n % 2 === 0); // filter accepte une fonction
const sum = numbers.reduce((a, b) => a + b, 0); // reduce accepte une fonction
```

### Créer des higher-order functions

```javascript
// Fonction qui retourne une fonction
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob"));      // "Hi, Bob!"

// Fonction qui accepte une fonction
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, (i) => {
  console.log(`Iteration ${i}`);
});
// "Iteration 0"
// "Iteration 1"
// "Iteration 2"

// Composition de fonctions
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

const double = x => x * 2;
const square = x => x * x;

const doubleThenSquare = compose(square, double);
console.log(doubleThenSquare(5)); // (5 * 2)² = 100

const squareThenDouble = compose(double, square);
console.log(squareThenDouble(5)); // (5²) * 2 = 50
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. Arrow functions pour callbacks courts
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// 2. Closures pour encapsulation
function createUser(name) {
  let score = 0;
  return {
    getName: () => name,
    addScore: (points) => score += points,
    getScore: () => score
  };
}

// 3. IIFE pour modules
const Utils = (function() {
  const privateVar = "secret";
  return {
    publicMethod() { /* ... */ }
  };
})();

// 4. Higher-order functions pour réutilisabilité
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name}`);
    return fn(...args);
  };
}
```

### ❌ À éviter

```javascript
// 1. Arrow functions pour méthodes d'objet
const obj = {
  name: "Alice",
  greet: () => {
    console.log(this.name); // ❌ this ne pointe pas vers obj
  }
};

// 2. Callback hell
getData(a => {
  getMore(a, b => {
    getEven(b, c => {
      // ❌ Difficile à lire
    });
  });
});

// 3. Closures avec variables mutables dans boucles (var)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // ❌ 3, 3, 3
}
```

---

## Exercice pratique

### Fonctions avancées

Créez `advanced-functions-exercise.js` :

1. **Array processor** : Fonction `createArrayProcessor(operation)` qui retourne une fonction pour traiter des tableaux (operation = 'double', 'square', 'filter-even')

2. **Debounce** : Fonction `debounce(fn, delay)` qui retourne une fonction "ralentie" (exécutée seulement après `delay` ms sans nouvel appel)

3. **Memoization** : Fonction `memoize(fn)` qui cache les résultats pour éviter les recalculs

4. **Module User** : IIFE créant un module avec méthodes publiques (add, remove, list) et tableau privé d'utilisateurs

```javascript
// Exemple de structure

// 1. Array processor
function createArrayProcessor(operation) {
  const operations = {
    'double': n => n * 2,
    'square': n => n * n,
    'filter-even': n => n % 2 === 0
  };
  
  return function(arr) {
    const fn = operations[operation];
    return operation.startsWith('filter') 
      ? arr.filter(fn) 
      : arr.map(fn);
  };
}

const doubler = createArrayProcessor('double');
console.log(doubler([1, 2, 3])); // [2, 4, 6]

// 2. Debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const logMessage = debounce((msg) => console.log(msg), 1000);
logMessage("Hello"); // N'affiche rien encore
logMessage("World"); // Annule le précédent
// Après 1s : "World"

// 3. Memoization
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("From cache");
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveCalculation = memoize((n) => {
  console.log("Calculating...");
  return n * n;
});

console.log(expensiveCalculation(5)); // "Calculating..." puis 25
console.log(expensiveCalculation(5)); // "From cache" puis 25
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| `this` dans arrow function | Référence le parent, pas l'objet | Utiliser fonction classique pour méthodes |
| Callback sans gestion d'erreur | Erreurs silencieuses | Ajouter try/catch ou paramètre error |
| Closure sur variable de boucle | Même valeur pour tous | Utiliser `let` ou IIFE |
| IIFE oubliée des parenthèses | Erreur de syntaxe | `(function() {})()` |

---

## Quiz de vérification

:::quiz
Q: Quelle est la différence principale des arrow functions ?
- [ ] Plus rapides
- [x] `this` lié lexicalement
- [ ] Peuvent être nommées
> Les arrow functions héritent du `this` de leur contexte parent, contrairement aux fonctions classiques.

Q: Qu'est-ce qu'une closure ?
- [ ] Une fonction qui se ferme
- [x] Une fonction qui accède à des variables de son scope parent
- [ ] Une erreur JavaScript
> Une closure est une fonction qui "capture" les variables de son environnement lexical.

Q: Quel pattern crée un scope isolé immédiatement ?
- [ ] Callback
- [x] IIFE
- [ ] Arrow function
> IIFE (Immediately Invoked Function Expression) crée un scope privé qui s'exécute immédiatement.

Q: Que fait `debounce` ?
- [ ] Exécute immédiatement
- [x] Attend un délai sans nouvel appel avant d'exécuter
- [ ] Répète une fonction
> Le debounce retarde l'exécution jusqu'à ce qu'il n'y ait plus d'appels pendant un certain temps.
:::

---

## Prochaine étape

Découvrez la [Manipulation du DOM](../dom-manipulation/selection-modification.md) pour interagir avec les éléments de la page.
