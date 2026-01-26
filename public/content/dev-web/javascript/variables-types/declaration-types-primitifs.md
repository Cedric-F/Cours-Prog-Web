# Déclaration & Types Primitifs

Maîtrisez les bases de JavaScript : déclaration de variables, types primitifs, et conversion de types pour écrire du code robuste et prévisible.

---

## Ce que vous allez apprendre

- Différencier `var`, `let` et `const`
- Connaître les 7 types primitifs JavaScript
- Comprendre la coercion de types
- Utiliser les opérateurs de base

## Prérequis

- [HTML & CSS - Bases](../../html-css/balises-html/structure-essentielles.md)
- Notions de programmation (optionnel)

Ressource complémentaire : [JavaScript.pdf](/ressources/JavaScript.pdf)

---

## Déclaration de variables

JavaScript propose 3 façons de déclarer des variables : `var`, `let`, et `const`.

### var (ancienne syntaxe, à éviter)

```javascript
var name = "Alice";
var age = 25;

// Redéclaration possible (dangereux)
var name = "Bob"; // OK mais problématique

// Function scope (pas block scope)
if (true) {
  var x = 10;
}
console.log(x); // 10 (accessible en dehors du if)

// Hoisting (remontée)
console.log(y); // undefined (pas d'erreur)
var y = 5;
```

⚠️ **Problèmes avec `var` :**
- Pas de block scope (seulement function scope)
- Hoisting (déclaration remontée, valeur non)
- Redéclaration possible → bugs difficiles à détecter

### let (moderne, préféré)

```javascript
let name = "Alice";
let age = 25;

// Redéclaration impossible
// let name = "Bob"; // ❌ SyntaxError

// Réassignation possible
name = "Bob"; // ✅ OK
age = 26;

// Block scope
if (true) {
  let x = 10;
  console.log(x); // 10
}
// console.log(x); // ❌ ReferenceError: x is not defined

// Pas de hoisting utilisable
// console.log(y); // ❌ ReferenceError
let y = 5;
```

### const (constante, recommandé par défaut)

```javascript
const PI = 3.14159;
const MAX_USERS = 100;

// Réassignation impossible
// PI = 3.14; // ❌ TypeError: Assignment to constant variable

// Déclaration et initialisation obligatoires
// const x; // ❌ SyntaxError: Missing initializer

// Block scope
if (true) {
  const API_URL = "https://api.example.com";
  console.log(API_URL); // OK
}
// console.log(API_URL); // ❌ ReferenceError

// ⚠️ Pour les objets/tableaux : la référence est constante, pas le contenu
const user = { name: "Alice" };
user.name = "Bob"; // ✅ OK (modification de propriété)
user.age = 25;     // ✅ OK (ajout de propriété)
// user = {};      // ❌ TypeError (réassignation impossible)

const numbers = [1, 2, 3];
numbers.push(4);   // ✅ OK (modification du contenu)
numbers[0] = 10;   // ✅ OK
// numbers = [];   // ❌ TypeError
```

### Quelle déclaration utiliser ?

**Règle d'or :**
1. **Par défaut** : `const` (sauf si besoin de réassigner)
2. **Si réassignation nécessaire** : `let`
3. **Jamais** : `var` (sauf code legacy)

```javascript
// ✅ Bon
const userName = "Alice";
const MAX_LENGTH = 50;
let counter = 0;
counter++;

// ❌ Mauvais
var userName = "Alice"; // Utiliser const ou let
let MAX_LENGTH = 50;    // Constante → utiliser const
const counter = 0;      // Besoin de modifier → utiliser let
```

---

## Types primitifs

JavaScript a **7 types primitifs** + objets.

### 1. String (chaîne de caractères)

```javascript
// Simple quotes, doubles quotes, ou backticks
const name1 = 'Alice';
const name2 = "Bob";
const name3 = `Charlie`;

// Template literals (backticks) : interpolation
const firstName = "Alice";
const age = 25;
const message = `Bonjour, je suis ${firstName} et j'ai ${age} ans.`;
console.log(message); // "Bonjour, je suis Alice et j'ai 25 ans."

// Multi-lignes avec backticks
const html = `
  <div>
    <h1>Titre</h1>
    <p>Contenu</p>
  </div>
`;

// Échappement
const quote = "Il a dit : \"Bonjour\"";
const quote2 = 'C\'est génial';
const path = "C:\\Users\\Documents";

// Longueur
console.log("Hello".length); // 5

// Immuabilité
let str = "Hello";
str[0] = "h"; // N'a aucun effet
console.log(str); // "Hello" (inchangé)
```

### 2. Number (nombre)

JavaScript a UN SEUL type numérique (64-bit float).

```javascript
// Entiers
const integer = 42;
const negative = -100;

// Décimaux
const decimal = 3.14;
const scientific = 2.5e6; // 2,500,000

// Opérations
const sum = 10 + 5;       // 15
const diff = 10 - 5;      // 5
const product = 10 * 5;   // 50
const quotient = 10 / 5;  // 2
const remainder = 10 % 3; // 1 (modulo)
const power = 2 ** 3;     // 8 (exponentiation)

// Valeurs spéciales
const infinity = Infinity;
const negInfinity = -Infinity;
const notANumber = NaN; // Not a Number

// Division par zéro
console.log(5 / 0);  // Infinity
console.log(-5 / 0); // -Infinity
console.log(0 / 0);  // NaN

// NaN (résultat d'opération invalide)
console.log("hello" * 5);     // NaN
console.log(parseInt("abc")); // NaN
console.log(NaN === NaN);     // false (NaN n'est jamais égal à lui-même)
console.log(isNaN(NaN));      // true (fonction pour tester)
console.log(Number.isNaN(NaN)); // true (méthode moderne, plus fiable)

// Précision limitée (float 64-bit)
console.log(0.1 + 0.2);        // 0.30000000000000004 (!)
console.log(0.1 + 0.2 === 0.3); // false

// Solutions pour la précision
const a = 0.1 * 10;
const b = 0.2 * 10;
const result = (a + b) / 10; // 0.3

// Ou utiliser Number.EPSILON
function areEqual(x, y) {
  return Math.abs(x - y) < Number.EPSILON;
}
console.log(areEqual(0.1 + 0.2, 0.3)); // true

// Limites
console.log(Number.MAX_VALUE);  // ~1.79e+308
console.log(Number.MIN_VALUE);  // ~5e-324
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
```

### 3. BigInt (grand entier)

Pour les entiers au-delà de `Number.MAX_SAFE_INTEGER`.

```javascript
// Syntaxe avec 'n'
const bigNumber = 9007199254740991n;
const huge = 123456789123456789123456789n;

// Ou avec BigInt()
const big = BigInt("9007199254740991");

// Opérations
const a = 10n;
const b = 20n;
console.log(a + b);  // 30n
console.log(a * b);  // 200n
console.log(b / a);  // 2n (division entière)

// ⚠️ Ne pas mélanger BigInt et Number
// console.log(10n + 5); // ❌ TypeError

// Conversion explicite nécessaire
console.log(10n + BigInt(5)); // 15n
console.log(Number(10n) + 5); // 15
```

### 4. Boolean (booléen)

Deux valeurs : `true` ou `false`.

```javascript
const isActive = true;
const isCompleted = false;

// Résultat de comparaisons
const isEqual = (5 === 5);      // true
const isGreater = (10 > 5);     // true
const isLess = (3 < 2);         // false
const isNotEqual = (5 !== 10);  // true

// Opérateurs logiques
const and = true && false;  // false
const or = true || false;   // true
const not = !true;          // false

// Short-circuit evaluation
const result = false && expensiveFunction(); // expensiveFunction pas appelée
const result2 = true || expensiveFunction(); // expensiveFunction pas appelée

// Valeurs "truthy" et "falsy"
// Falsy : false, 0, "", null, undefined, NaN
// Tout le reste est truthy
if ("hello") { console.log("truthy"); } // Exécuté
if (0) { console.log("falsy"); }        // Pas exécuté
```

### 5. undefined

Variable déclarée mais non initialisée, ou propriété inexistante.

```javascript
let x;
console.log(x); // undefined

function test() {
  // Pas de return
}
console.log(test()); // undefined

const obj = { name: "Alice" };
console.log(obj.age); // undefined (propriété inexistante)

// typeof
console.log(typeof undefined); // "undefined"
```

### 6. null

Absence intentionnelle de valeur.

```javascript
let user = null; // Pas d'utilisateur

// Différence avec undefined
let a;           // undefined (non initialisé)
let b = null;    // null (absence intentionnelle)

// typeof null → "object" (bug historique de JS)
console.log(typeof null); // "object" (bizarre mais c'est comme ça)

// Comparaison
console.log(null == undefined);  // true (égalité faible)
console.log(null === undefined); // false (égalité stricte)
```

### 7. Symbol (unique)

Identifiant unique et immuable (rare en pratique).

```javascript
// Créer des symboles
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description");

// Chaque symbole est unique
console.log(sym2 === sym3); // false

// Usage : propriétés d'objet privées
const SECRET_KEY = Symbol("secret");
const user = {
  name: "Alice",
  [SECRET_KEY]: "password123"
};

console.log(user.name);        // "Alice"
console.log(user[SECRET_KEY]); // "password123"
console.log(Object.keys(user)); // ["name"] (symbole non énumérable)
```

---

## Vérification de types

### typeof

```javascript
console.log(typeof "hello");      // "string"
console.log(typeof 42);           // "number"
console.log(typeof 42n);          // "bigint"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (bug historique)
console.log(typeof Symbol());     // "symbol"
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"
```

### Vérifications avancées

```javascript
// Vérifier null
const isNull = (value) => value === null;

// Vérifier array
const isArray = (value) => Array.isArray(value);

// Vérifier objet (pas null ni array)
const isObject = (value) => 
  typeof value === "object" && value !== null && !Array.isArray(value);

// Exemples
console.log(isNull(null));       // true
console.log(isArray([1, 2, 3])); // true
console.log(isObject({ a: 1 })); // true
console.log(isObject(null));     // false
console.log(isObject([1, 2]));   // false
```

---

## Conversion de types

### Conversion implicite (coercion)

JavaScript convertit automatiquement les types dans certains contextes.

```javascript
// String + Number → String (concaténation)
console.log("5" + 5);    // "55"
console.log("Hello" + 3); // "Hello3"

// Number + Boolean → Number
console.log(5 + true);   // 6 (true → 1)
console.log(10 - false); // 10 (false → 0)

// Comparaison faible (==)
console.log(5 == "5");   // true (conversion)
console.log(0 == false); // true
console.log("" == false); // true
console.log(null == undefined); // true

// Comparaison stricte (===) - PAS de conversion
console.log(5 === "5");   // false
console.log(0 === false); // false
console.log("" === false); // false
console.log(null === undefined); // false

// ✅ Toujours utiliser === et !== (stricte)
```

### Conversion explicite

```javascript
// String → Number
console.log(Number("42"));      // 42
console.log(Number("3.14"));    // 3.14
console.log(Number("hello"));   // NaN
console.log(parseInt("42"));    // 42
console.log(parseInt("42.7"));  // 42 (troncature)
console.log(parseFloat("3.14")); // 3.14
console.log(+"42");             // 42 (opérateur unaire +)

// Number → String
console.log(String(42));        // "42"
console.log((42).toString());   // "42"
console.log(42 + "");           // "42"

// Boolean → autres
console.log(Number(true));      // 1
console.log(Number(false));     // 0
console.log(String(true));      // "true"

// Autres → Boolean
console.log(Boolean(1));        // true
console.log(Boolean(0));        // false
console.log(Boolean("hello"));  // true
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(undefined)); // false
console.log(!!value);           // Conversion rapide (double négation)
```

---

## Opérateurs utiles

### Opérateur ternaire

```javascript
const age = 18;
const status = age >= 18 ? "adulte" : "mineur";
console.log(status); // "adulte"

// Équivalent à :
let status2;
if (age >= 18) {
  status2 = "adulte";
} else {
  status2 = "mineur";
}
```

### Opérateurs d'assignation

```javascript
let x = 10;

x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
x /= 4;  // x = x / 4 → 6
x %= 4;  // x = x % 4 → 2
x **= 3; // x = x ** 3 → 8

// Incrémentation/Décrémentation
let y = 5;
y++;     // y = 6 (post-incrémentation)
++y;     // y = 7 (pré-incrémentation)
y--;     // y = 6
--y;     // y = 5

// Différence pré/post
let a = 5;
let b = a++; // b = 5, puis a = 6
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // c = 6, puis d = 6
console.log(c, d); // 6, 6
```

### Opérateurs de comparaison

```javascript
// Égalité
5 == "5"   // true (conversion)
5 === "5"  // false (stricte, recommandé)

5 != "5"   // false
5 !== "5"  // true (recommandé)

// Comparaison
10 > 5     // true
10 >= 10   // true
5 < 10     // true
5 <= 5     // true

// Chaînes (ordre lexicographique)
"abc" < "abd"  // true
"apple" < "banana" // true
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// Utiliser const par défaut
const API_URL = "https://api.example.com";
const user = { name: "Alice" };

// let seulement si réassignation
let counter = 0;
counter++;

// Égalité stricte (===)
if (value === 10) { }

// Nommage descriptif
const maxUserCount = 100;
const isAuthenticated = true;

// Vérification de type explicite
if (typeof value === "string") { }
if (Array.isArray(data)) { }
```

### ❌ À éviter

```javascript
// var (obsolète)
var x = 10;

// Égalité faible (==)
if (value == 10) { } // Peut causer des bugs

// Noms courts/cryptiques
const x = 100;
const flg = true;

// Conversion implicite dangereuse
const result = "5" * "5"; // 25 (risqué)
```

---

## Erreurs courantes

| Erreur | Exemple | Solution |
|--------|---------|----------|
| Utiliser `var` | `var x = 1;` | Utiliser `let` ou `const` |
| `==` au lieu de `===` | `5 == "5"` (true) | Toujours `===` pour comparaison stricte |
| Réassigner une `const` | `const x = 1; x = 2;` | Utiliser `let` si réassignation nécessaire |
| Confusion `null`/`undefined` | Vérification incorrecte | `value == null` vérifie les deux |

---

## Exercice pratique

Créez un fichier `types-exercise.js` et :

1. Déclarez des variables pour stocker votre nom, âge, et si vous êtes étudiant
2. Créez une fonction qui affiche le type de chaque variable
3. Testez la coercion : que donne `"10" + 5` vs `"10" - 5` ?

<details>
<summary>Voir la solution</summary>

```javascript
const name = "Alice";
let age = 25;
const isStudent = true;

console.log(typeof name);      // "string"
console.log(typeof age);       // "number"
console.log(typeof isStudent); // "boolean"

// Coercion
console.log("10" + 5);  // "105" (concaténation string)
console.log("10" - 5);  // 5 (conversion en nombre)
```
</details>

---

## Quiz de vérification

:::quiz
Q: Quelle déclaration empêche la réassignation ?
- [ ] `var`
- [ ] `let`
- [x] `const`
> `const` crée une variable qui ne peut pas être réassignée (mais les objets/tableaux restent mutables).

Q: Quel est le résultat de `typeof null` ?
- [ ] `"null"`
- [ ] `"undefined"`
- [x] `"object"`
> C'est un bug historique de JavaScript qui persiste pour des raisons de compatibilité.

Q: Que retourne `5 === "5"` ?
- [ ] `true`
- [x] `false`
- [ ] `undefined`
> L'opérateur `===` compare valeur ET type. Ici, number !== string.

Q: Quelle est la bonne pratique par défaut ?
- [ ] Utiliser `var`
- [ ] Utiliser `let`
- [x] Utiliser `const` et `let` si nécessaire
> Préférez `const` par défaut, utilisez `let` uniquement si la variable doit être réassignée.
:::

---

## Prochaine étape

Découvrez les [Types Complexes & Scope](./types-complexes-scope.md).
