# Bases des Fonctions

Maîtrisez les fondamentaux des fonctions JavaScript : déclaration, paramètres, valeurs de retour, et les différentes syntaxes pour écrire du code réutilisable.

---

## Ce que vous allez apprendre

- Déclarer des fonctions (declaration, expression, arrow)
- Gérer les paramètres et valeurs par défaut
- Comprendre le `return` et les valeurs de retour
- Utiliser le rest operator

## Prérequis

- [Variables et Types](../variables-types/declaration-types-primitifs.md)

---

## Qu'est-ce qu'une fonction ?

Une **fonction** est un bloc de code réutilisable qui effectue une tâche spécifique.

```javascript
// Fonction simple
function greet() {
  console.log("Hello!");
}

greet(); // Appel de la fonction → "Hello!"
greet(); // Peut être appelée plusieurs fois
```

**Avantages des fonctions :**
- ♻️ **Réutilisabilité** : Écrire une fois, utiliser partout
- 📦 **Organisation** : Code modulaire et structuré
- 🧪 **Testabilité** : Facile à tester isolément
- 🔧 **Maintenance** : Modifier à un seul endroit

---

## Déclaration de fonctions

### Function declaration

```javascript
// Syntaxe classique
function sayHello() {
  console.log("Hello!");
}

sayHello(); // "Hello!"

// Avec paramètres
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Alice"); // "Hello, Alice!"
greet("Bob");   // "Hello, Bob!"

// ✅ Hoisting : peut être appelée avant sa déclaration
celebrate(); // "🎉" (fonctionne !)

function celebrate() {
  console.log("🎉");
}
```

### Function expression

```javascript
// Assignée à une variable
const greet = function(name) {
  console.log(`Hello, ${name}!`);
};

greet("Alice"); // "Hello, Alice!"

// ⚠️ Pas de hoisting
// sayHi(); // ❌ ReferenceError

const sayHi = function() {
  console.log("Hi!");
};

sayHi(); // ✅ OK ici
```

### Différence declaration vs expression

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const multiply = function(a, b) {
  return a * b;
};

// Principale différence : hoisting
subtract(10, 5); // ✅ Fonctionne (hoisting)

function subtract(a, b) {
  return a - b;
}

// divide(10, 2); // ❌ ReferenceError (pas de hoisting)

const divide = function(a, b) {
  return a / b;
};
```

### Named function expression

```javascript
// Fonction avec nom (utile pour la récursion et le débogage)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Utilise son propre nom
};

console.log(factorial(5)); // 120
// console.log(fact(5));   // ❌ ReferenceError (fact n'est pas accessible)
```

---

## Paramètres et arguments

### Paramètres basiques

```javascript
// Un paramètre
function square(n) {
  return n * n;
}

console.log(square(5)); // 25

// Plusieurs paramètres
function add(a, b) {
  return a + b;
}

console.log(add(3, 7)); // 10

// Paramètres manquants → undefined
function greet(name, greeting) {
  console.log(`${greeting}, ${name}!`);
}

greet("Alice", "Hello");  // "Hello, Alice!"
greet("Bob");             // "undefined, Bob!" (greeting manquant)
```

### Paramètres par défaut

```javascript
// Valeurs par défaut (ES6)
function greet(name = "Guest", greeting = "Hello") {
  console.log(`${greeting}, ${name}!`);
}

greet("Alice", "Hi");  // "Hi, Alice!"
greet("Bob");          // "Hello, Bob!"
greet();               // "Hello, Guest!"

// Expressions dans les valeurs par défaut
function createUser(name, id = Date.now()) {
  return { name, id };
}

console.log(createUser("Alice")); // { name: "Alice", id: 1734567890123 }

// Paramètre par défaut basé sur un autre paramètre
function calculatePrice(price, tax = price * 0.2) {
  return price + tax;
}

console.log(calculatePrice(100));     // 120 (100 + 20)
console.log(calculatePrice(100, 10)); // 110 (100 + 10)
```

### Rest parameters (paramètres rest)

```javascript
// Collecter les arguments restants dans un tableau
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum());              // 0

// Rest parameter après d'autres paramètres
function introduce(firstName, lastName, ...hobbies) {
  console.log(`${firstName} ${lastName}`);
  console.log("Hobbies:", hobbies);
}

introduce("Alice", "Doe", "reading", "coding", "gaming");
// "Alice Doe"
// Hobbies: ["reading", "coding", "gaming"]

// ⚠️ Rest parameter doit être le dernier
// function invalid(a, ...rest, b) {} // ❌ SyntaxError
```

### Arguments object (ancienne méthode)

```javascript
// Avant ES6 : arguments (pseudo-tableau)
function oldSum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(oldSum(1, 2, 3)); // 6

// ⚠️ arguments n'est pas un vrai tableau
function test() {
  console.log(arguments);         // [1, 2, 3]
  // arguments.map(x => x * 2);   // ❌ TypeError (pas de méthode map)
  
  // Conversion en tableau
  const arr = Array.from(arguments);
  console.log(arr.map(x => x * 2)); // [2, 4, 6]
}

test(1, 2, 3);

// ✅ Préférer rest parameters (plus moderne)
```

---

## Valeurs de retour

### return

```javascript
// Retourner une valeur
function multiply(a, b) {
  return a * b;
}

const result = multiply(5, 3);
console.log(result); // 15

// Fonction sans return → retourne undefined
function sayHello() {
  console.log("Hello");
}

const value = sayHello(); // "Hello" affiché
console.log(value);       // undefined

// return arrête l'exécution
function checkAge(age) {
  if (age < 18) {
    return "Trop jeune";
    console.log("Ceci ne sera jamais exécuté");
  }
  return "Autorisé";
}

console.log(checkAge(15)); // "Trop jeune"
console.log(checkAge(25)); // "Autorisé"

// Return multiple : utiliser un objet ou tableau
function getUser() {
  return {
    name: "Alice",
    age: 25,
    city: "Paris"
  };
}

const user = getUser();
console.log(user.name); // "Alice"

// Ou destructuration directe
const { name, age } = getUser();
console.log(name); // "Alice"
```

### Return implicite (arrow functions)

```javascript
// Expression simple : return implicite
const square = n => n * n;
console.log(square(5)); // 25

// Équivalent à :
const square2 = n => {
  return n * n;
};

// Objets : entourer de parenthèses
const createUser = (name, age) => ({ name, age });
console.log(createUser("Alice", 25)); // { name: "Alice", age: 25 }

// Sans parenthèses → erreur
// const wrong = (name) => { name: name }; // ❌ Interprété comme un bloc
```

---

## Fonctions comme valeurs

En JavaScript, les fonctions sont des **first-class citizens** (citoyens de première classe).

### Assignation

```javascript
// Fonction assignée à une variable
const greet = function(name) {
  return `Hello, ${name}!`;
};

console.log(greet("Alice")); // "Hello, Alice!"

// Réassigner une fonction
let operation = function(a, b) {
  return a + b;
};

console.log(operation(5, 3)); // 8

operation = function(a, b) {
  return a * b;
};

console.log(operation(5, 3)); // 15
```

### Fonctions dans des objets

```javascript
// Méthodes d'objet
const calculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract(a, b) { // Syntaxe courte
    return a - b;
  },
  multiply: (a, b) => a * b // Arrow function
};

console.log(calculator.add(5, 3));      // 8
console.log(calculator.subtract(10, 4)); // 6
console.log(calculator.multiply(2, 6)); // 12
```

### Fonctions dans des tableaux

```javascript
const operations = [
  function(a, b) { return a + b; },
  function(a, b) { return a - b; },
  function(a, b) { return a * b; }
];

console.log(operations[0](5, 3)); // 8
console.log(operations[1](5, 3)); // 2
console.log(operations[2](5, 3)); // 15
```

### Fonctions passées en arguments

```javascript
// Fonction callback
function processArray(arr, callback) {
  const result = [];
  for (let item of arr) {
    result.push(callback(item));
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];

const doubled = processArray(numbers, function(n) {
  return n * 2;
});

console.log(doubled); // [2, 4, 6, 8, 10]

// Ou avec arrow function
const squared = processArray(numbers, n => n * n);
console.log(squared); // [1, 4, 9, 16, 25]
```

### Fonctions retournées

```javascript
// Fonction qui retourne une fonction
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Factory pattern
function createCounter(start = 0) {
  let count = start;
  
  return function() {
    return ++count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2

const counter2 = createCounter(10);
console.log(counter2()); // 11
console.log(counter2()); // 12
```

---

## Scope et contexte

### Variables locales

```javascript
function calculate() {
  const result = 10 + 5; // Variable locale
  console.log(result);   // 15
}

calculate();
// console.log(result); // ❌ ReferenceError (pas accessible)
```

### Paramètres = variables locales

```javascript
function greet(name) { // name est local à la fonction
  console.log(`Hello, ${name}!`);
}

greet("Alice");
// console.log(name); // ❌ ReferenceError
```

### Accès aux variables externes

```javascript
const globalMessage = "Hello from global";

function showMessage() {
  console.log(globalMessage); // Accès à la variable globale
}

showMessage(); // "Hello from global"

// Variable externe modifiable
let counter = 0;

function increment() {
  counter++; // Modifie la variable externe
}

increment();
increment();
console.log(counter); // 2
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. Noms descriptifs
function calculateTotalPrice(items, tax) {
  // ...
}

// 2. Une responsabilité par fonction
function validateEmail(email) {
  // Seulement valider
}

function sendEmail(email) {
  // Seulement envoyer
}

// 3. Paramètres par défaut
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

// 4. Return explicite
function isAdult(age) {
  return age >= 18; // ✅ Clair
}

// 5. Rest parameters pour arguments multiples
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// 6. Fonctions pures (pas d'effets de bord)
function add(a, b) {
  return a + b; // Prévisible, testable
}
```

### ❌ À éviter

```javascript
// 1. Noms vagues
function doStuff(x, y) { // ❌ Pas clair
  // ...
}

// 2. Fonctions trop longues
function processEverything() {
  // 200 lignes de code...
}

// 3. Modifier les paramètres d'objets
function updateUser(user) {
  user.name = "Changed"; // ❌ Effet de bord
}

// 4. Arguments object
function oldWay() {
  console.log(arguments); // ❌ Obsolète, utiliser rest
}

// 5. Manque de return
function calculate(a, b) {
  a + b; // ❌ Pas de return → undefined
}
```

---

## Exercice pratique

### Créer des fonctions utilitaires

Créez `functions-basics-exercise.js` :

1. **Calculator** : Fonction `calculate(a, b, operation)` qui accepte '+', '-', '*', '/'
2. **Validator** : Fonction `validatePassword(password, minLength = 8)` qui retourne true/false
3. **Formatter** : Fonction `formatName(firstName, lastName, title = "Mr.")` qui retourne "Mr. John Doe"
4. **Array processor** : Fonction `processNumbers(...numbers)` qui retourne { sum, average, max, min }
5. **Multiplier factory** : Fonction `createMultiplier(factor)` qui retourne une fonction multiplicatrice

```javascript
// Exemple de structure
function calculate(a, b, operation = '+') {
  switch(operation) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error: Division by zero';
    default: return 'Error: Invalid operation';
  }
}

console.log(calculate(10, 5, '+'));  // 15
console.log(calculate(10, 5, '*'));  // 50
console.log(calculate(10, 0, '/'));  // "Error: Division by zero"

// Test processNumbers
function processNumbers(...numbers) {
  return {
    sum: numbers.reduce((a, b) => a + b, 0),
    average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    max: Math.max(...numbers),
    min: Math.min(...numbers)
  };
}

console.log(processNumbers(1, 2, 3, 4, 5));
// { sum: 15, average: 3, max: 5, min: 1 }
```

---

## Erreurs courantes

| Erreur | Exemple | Solution |
|--------|---------|----------|
| Oublier `return` | `function add(a,b) { a + b; }` | Ajouter `return a + b;` |
| Mauvais nombre de params | `greet()` sans argument | Valeur par défaut : `function greet(name = "World")` |
| Noms non descriptifs | `function f(x)` | `function calculateTotal(price)` |
| Fonctions trop longues | 100+ lignes | Découper en sous-fonctions |

---

## Quiz de vérification

:::quiz
Q: Quelle syntaxe supporte le hoisting ?
- [ ] Function expression
- [x] Function declaration
- [ ] Arrow function
> Les function declarations sont hoistées, vous pouvez les appeler avant leur définition dans le code.

Q: Que retourne une fonction sans `return` ?
- [ ] `null`
- [ ] `0`
- [x] `undefined`
> Sans instruction `return`, une fonction retourne implicitement `undefined`.

Q: Comment définir une valeur par défaut ?
- [x] `function f(x = 10)`
- [ ] `function f(x || 10)`
- [ ] `function f(x : 10)`
> ES6 permet de définir des valeurs par défaut directement dans les paramètres avec `=`.

Q: Que fait le rest operator `...args` ?
- [ ] Copie un tableau
- [x] Collecte les arguments restants dans un tableau
- [ ] Détruit un objet
> Le rest operator rassemble tous les arguments restants dans un tableau.
:::

---

## Prochaine étape

Découvrez les [Concepts Avancés](./concepts-avances.md) : Arrow Functions, Callbacks, Closures.
