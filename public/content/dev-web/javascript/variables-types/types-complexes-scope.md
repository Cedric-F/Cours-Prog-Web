# Types Complexes & Scope

Explorez les objets, tableaux, et comprenez les règles de portée (scope) et le hoisting pour maîtriser la gestion de vos données en JavaScript.

---

## Ce que vous allez apprendre

- Manipuler les objets et tableaux
- Comprendre la différence valeur vs référence
- Maîtriser le scope (portée des variables)
- Éviter les pièges du hoisting

## Prérequis

- [JavaScript - Déclaration et types primitifs](./declaration-types-primitifs)

---

## Types complexes (référence)

Les types primitifs stockent des **valeurs**. Les types complexes (objets, tableaux) stockent des **références**.

### Objets

```javascript
// Création d'objet (littéral)
const person = {
  name: "Alice",
  age: 25,
  city: "Paris"
};

// Accès aux propriétés
console.log(person.name);    // "Alice" (notation point)
console.log(person["age"]);  // 25 (notation crochet)

// Modification
person.age = 26;
person.job = "Developer"; // Ajout de propriété
delete person.city;       // Suppression

// Propriétés calculées
const key = "name";
console.log(person[key]); // "Alice"

// Méthodes (fonctions dans un objet)
const user = {
  name: "Bob",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
user.greet(); // "Hello, I'm Bob"

// Syntaxe courte (ES6)
const firstName = "Alice";
const age = 25;
const user2 = {
  firstName,  // équivalent à firstName: firstName
  age,
  greet() {   // équivalent à greet: function()
    console.log("Hello");
  }
};

// Objets imbriqués
const company = {
  name: "TechCorp",
  address: {
    street: "123 Main St",
    city: "Paris",
    country: "France"
  },
  employees: [
    { name: "Alice", role: "Dev" },
    { name: "Bob", role: "Designer" }
  ]
};
console.log(company.address.city);     // "Paris"
console.log(company.employees[0].name); // "Alice"

// Destructuration d'objet
const { name, age } = person;
console.log(name); // "Alice"
console.log(age);  // 26

// Destructuration imbriquée
const { address: { city } } = company;
console.log(city); // "Paris"

// Valeurs par défaut
const { name, country = "Unknown" } = person;
console.log(country); // "Unknown" (propriété inexistante)

// Renommage
const { name: userName } = person;
console.log(userName); // "Alice"
```

### Tableaux (Arrays)

```javascript
// Création
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true, { name: "Alice" }];
const empty = [];

// Accès aux éléments (index commence à 0)
console.log(numbers[0]);  // 1
console.log(numbers[4]);  // 5
console.log(numbers[10]); // undefined

// Longueur
console.log(numbers.length); // 5

// Modification
numbers[0] = 10;
numbers[numbers.length] = 6; // Ajouter à la fin
console.log(numbers); // [10, 2, 3, 4, 5, 6]

// Méthodes d'ajout/suppression
const fruits = ["apple", "banana"];

// Fin du tableau
fruits.push("orange");     // Ajoute à la fin → ["apple", "banana", "orange"]
const last = fruits.pop(); // Retire le dernier → "orange"

// Début du tableau
fruits.unshift("mango");    // Ajoute au début → ["mango", "apple", "banana"]
const first = fruits.shift(); // Retire le premier → "mango"

// Au milieu (splice)
const numbers2 = [1, 2, 3, 4, 5];
numbers2.splice(2, 1);      // À partir de l'index 2, retire 1 élément → [1, 2, 4, 5]
numbers2.splice(2, 0, 3);   // À partir de l'index 2, retire 0, ajoute 3 → [1, 2, 3, 4, 5]
numbers2.splice(2, 2, 10, 20); // Retire 2, ajoute 10, 20 → [1, 2, 10, 20, 5]

// Méthodes de recherche
const arr = [10, 20, 30, 40];
console.log(arr.indexOf(30));     // 2 (index)
console.log(arr.indexOf(100));    // -1 (pas trouvé)
console.log(arr.includes(30));    // true
console.log(arr.find(x => x > 25)); // 30 (premier élément qui match)
console.log(arr.findIndex(x => x > 25)); // 2 (index du premier match)

// Transformation
const doubled = numbers.map(x => x * 2);      // [2, 4, 6, 8, 10]
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, x) => acc + x, 0); // 15

// Itération
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});

// Tri
const names = ["Charlie", "Alice", "Bob"];
names.sort(); // ["Alice", "Bob", "Charlie"] (ordre alphabétique)

const nums = [10, 5, 40, 25];
nums.sort((a, b) => a - b); // [5, 10, 25, 40] (ordre numérique)

// Copie et fusion
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const copy = [...arr1];           // [1, 2, 3] (copie superficielle)
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const merged2 = arr1.concat(arr2); // [1, 2, 3, 4, 5, 6]

// Destructuration
const [first2, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first2); // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Valeurs par défaut
const [a, b, c = 0] = [1, 2];
console.log(c); // 0
```

### Différence valeur vs référence

```javascript
// PRIMITIFS : copie par valeur
let a = 10;
let b = a;  // Copie la valeur
b = 20;
console.log(a); // 10 (a n'a pas changé)

// OBJETS : copie par référence
let obj1 = { name: "Alice" };
let obj2 = obj1; // obj2 pointe vers le même objet
obj2.name = "Bob";
console.log(obj1.name); // "Bob" (obj1 modifié aussi !)

// Même chose avec les tableaux
let arr1 = [1, 2, 3];
let arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4]

// Comparaison d'objets
const obj3 = { name: "Alice" };
const obj4 = { name: "Alice" };
console.log(obj3 === obj4); // false (références différentes)

const obj5 = obj3;
console.log(obj3 === obj5); // true (même référence)

// Copie superficielle (shallow copy)
const original = { name: "Alice", age: 25 };
const copy1 = { ...original };           // Spread operator
const copy2 = Object.assign({}, original); // Object.assign

copy1.name = "Bob";
console.log(original.name); // "Alice" (original intact)

// ⚠️ Problème avec objets imbriqués
const person = {
  name: "Alice",
  address: { city: "Paris" }
};
const copy3 = { ...person };
copy3.address.city = "Lyon";
console.log(person.address.city); // "Lyon" (objet imbriqué partagé !)

// Copie profonde (deep copy)
const deepCopy = JSON.parse(JSON.stringify(person)); // Simple mais limité
// Ou utiliser structuredClone (moderne)
const deepCopy2 = structuredClone(person);

deepCopy.address.city = "Marseille";
console.log(person.address.city); // "Lyon" (original intact)
```

---

## Scope (portée)

Le **scope** détermine où une variable est accessible.

### Global scope

```javascript
// Variable globale (en dehors de toute fonction)
const globalVar = "Je suis global";

function test() {
  console.log(globalVar); // Accessible
}

test(); // "Je suis global"
console.log(globalVar); // Accessible aussi
```

### Function scope

```javascript
function myFunction() {
  const functionVar = "Je suis dans la fonction";
  console.log(functionVar); // ✅ OK
}

myFunction();
// console.log(functionVar); // ❌ ReferenceError (pas accessible ici)

// var est function-scoped
function test() {
  if (true) {
    var x = 10; // Accessible dans toute la fonction
  }
  console.log(x); // 10 (var ignore les blocs)
}
```

### Block scope (let/const)

```javascript
// let et const respectent les blocs { }
if (true) {
  const blockVar = "Je suis dans le bloc";
  console.log(blockVar); // ✅ OK
}
// console.log(blockVar); // ❌ ReferenceError

// Exemples de blocs
{
  const x = 10;
  console.log(x); // 10
}
// console.log(x); // ❌ ReferenceError

for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
// console.log(i); // ❌ ReferenceError

// ⚠️ Différence var vs let dans les boucles
for (var j = 0; j < 3; j++) {}
console.log(j); // 3 (var accessible en dehors)

for (let k = 0; k < 3; k++) {}
// console.log(k); // ❌ ReferenceError
```

### Lexical scope (portée lexicale)

Les fonctions imbriquées ont accès aux variables de leurs fonctions parentes.

```javascript
function outer() {
  const outerVar = "Je suis dans outer";
  
  function inner() {
    console.log(outerVar); // Accès à la variable du parent
  }
  
  inner(); // "Je suis dans outer"
}

outer();

// Chaîne de scope
function level1() {
  const a = 1;
  
  function level2() {
    const b = 2;
    
    function level3() {
      const c = 3;
      console.log(a, b, c); // 1, 2, 3 (accès à tous les niveaux)
    }
    
    level3();
  }
  
  level2();
}

level1();
```

---

## Hoisting (remontée)

JavaScript "remonte" les déclarations au sommet de leur scope.

### Hoisting avec var

```javascript
console.log(x); // undefined (pas d'erreur)
var x = 5;
console.log(x); // 5

// Équivalent à :
var x;
console.log(x); // undefined
x = 5;
console.log(x); // 5
```

### Hoisting avec let/const

```javascript
// console.log(y); // ❌ ReferenceError: Cannot access before initialization
let y = 10;

// Temporal Dead Zone (TDZ)
{
  // TDZ commence
  // console.log(z); // ❌ ReferenceError
  const z = 20; // TDZ se termine
  console.log(z); // 20
}
```

### Hoisting avec fonctions

```javascript
// Function declaration : remontée complète
greet(); // "Hello" (fonctionne avant la déclaration)

function greet() {
  console.log("Hello");
}

// Function expression : pas de remontée
// sayHi(); // ❌ ReferenceError

const sayHi = function() {
  console.log("Hi");
};

sayHi(); // ✅ OK ici
```

---

## Closures (fermetures)

Une fonction qui "capture" les variables de son scope parent.

```javascript
function createCounter() {
  let count = 0; // Variable privée
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Chaque appel de createCounter crée un nouveau scope
const counter2 = createCounter();
console.log(counter2()); // 1 (indépendant)

// Exemple pratique : données privées
function createUser(name) {
  let password = "secret123"; // Privé
  
  return {
    getName() {
      return name;
    },
    checkPassword(input) {
      return input === password;
    }
  };
}

const user = createUser("Alice");
console.log(user.getName());         // "Alice"
console.log(user.checkPassword("secret123")); // true
// console.log(user.password);       // undefined (pas accessible)
```

---

## Strict mode

Mode strict pour éviter les erreurs courantes.

```javascript
"use strict";

// Sans strict mode (sloppy mode)
// x = 10; // ✅ Crée une variable globale (dangereux)

// Avec strict mode
// y = 20; // ❌ ReferenceError: y is not defined

// Autres bénéfices du strict mode
"use strict";

// 1. Interdit les variables implicites
// z = 5; // ❌ ReferenceError

// 2. Interdit les propriétés dupliquées (avant ES6)
// const obj = { a: 1, a: 2 }; // Erreur en strict mode

// 3. Interdit delete sur variables
// const x = 10;
// delete x; // ❌ SyntaxError

// 4. this = undefined dans les fonctions (pas window)
function test() {
  "use strict";
  console.log(this); // undefined (pas window)
}
test();

// ✅ Recommandation : toujours utiliser strict mode
// En modules ES6, strict mode est automatique
```

---

## Types avancés

### Map et Set

```javascript
// Map : clés de n'importe quel type
const map = new Map();
map.set("name", "Alice");
map.set(1, "one");
map.set(true, "boolean");

console.log(map.get("name")); // "Alice"
console.log(map.has(1));      // true
console.log(map.size);        // 3

map.delete(1);
map.clear();

// Itération
const userMap = new Map([
  ["name", "Alice"],
  ["age", 25]
]);

for (const [key, value] of userMap) {
  console.log(`${key}: ${value}`);
}

// Set : valeurs uniques
const set = new Set();
set.add(1);
set.add(2);
set.add(2); // Ignoré (déjà présent)

console.log(set.size); // 2
console.log(set.has(1)); // true

// Retirer les doublons d'un tableau
const numbers = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(numbers)]; // [1, 2, 3, 4]
```

### WeakMap et WeakSet

Versions avec références faibles (garbage collection).

```javascript
// WeakMap : clés = objets seulement
const weakMap = new WeakMap();
let obj = { name: "Alice" };

weakMap.set(obj, "some data");
console.log(weakMap.get(obj)); // "some data"

// Si obj est supprimé, la donnée dans WeakMap aussi
obj = null; // L'entrée dans WeakMap sera collectée par le GC

// WeakSet : similaire mais pour un ensemble
const weakSet = new WeakSet();
let obj2 = { id: 1 };
weakSet.add(obj2);
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// Utiliser const par défaut
const config = { apiUrl: "..." };

// let si réassignation nécessaire
let counter = 0;
counter++;

// Copie d'objets (spread)
const original = { a: 1, b: 2 };
const copy = { ...original };

// Destructuration pour extraire
const { name, age } = user;

// Éviter les variables globales
function process() {
  const temp = 10; // Local
  // ...
}

// Strict mode
"use strict";
```

### ❌ À éviter

```javascript
// var (obsolète)
var x = 10;

// Modifier les paramètres
function test(obj) {
  obj.name = "Changed"; // ❌ Effet de bord
}

// Variables globales
globalVar = 10; // ❌ Sans déclaration

// Ignorer le scope
if (true) {
  var leaky = "accessible partout"; // ❌ Utiliser let
}
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Modifier objet passé en paramètre | Effet de bord | Copier avec spread `{...obj}` |
| `var` au lieu de `let/const` | Scope global ou fonction | Toujours utiliser `let` ou `const` |
| Oublier le hoisting | Variable undefined | Déclarer avant utilisation |
| Comparer objets avec `===` | Toujours false | Comparer les propriétés |

---

## Quiz de vérification

:::quiz
Q: Quelle est la différence entre valeur et référence ?
- [ ] Aucune différence
- [x] Les primitifs sont copiés, les objets pointent vers la même adresse
- [ ] Les objets sont copiés
> Les types primitifs sont copiés par valeur, tandis que les objets sont passés par référence (même adresse mémoire).

Q: Quel est le scope d'une variable `let` dans un `if` ?
- [ ] Global
- [ ] Fonction
- [x] Bloc (entre `{}`)
> `let` et `const` ont un scope de bloc, contrairement à `var` qui a un scope de fonction.

Q: Que fait le hoisting avec `let` ?
- [ ] Déplace la déclaration en haut
- [x] Crée une TDZ (Temporal Dead Zone)
- [ ] Rien
> Avec `let`, la variable existe mais n'est pas accessible avant sa déclaration (Temporal Dead Zone).

Q: Comment copier un objet sans lien ?
- [ ] `const copy = obj`
- [x] `const copy = { ...obj }`
- [ ] `const copy = obj.copy()`
> Le spread operator `...` crée une copie superficielle de l'objet.
:::

---

## Prochaine étape

Découvrez les [Fonctions](../fonctions/bases-fonctions) pour structurer votre code.
