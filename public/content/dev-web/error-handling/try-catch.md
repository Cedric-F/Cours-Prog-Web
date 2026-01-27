# Try/Catch et gestion des exceptions

Les erreurs font partie du développement. Apprendre à les gérer proprement est essentiel pour créer des applications robustes.

## Types d'erreurs en JavaScript

### Erreurs de syntaxe (SyntaxError)

Détectées avant l'exécution :

```javascript
// ❌ Erreur de syntaxe - le code ne s'exécute pas
const user = {
  name: "Alice"
  age: 25  // Virgule manquante
};
```

### Erreurs d'exécution (Runtime errors)

Se produisent pendant l'exécution :

```javascript
// ❌ TypeError - user est undefined
const user = undefined;
console.log(user.name);

// ❌ ReferenceError - variable non définie
console.log(unknownVariable);

// ❌ RangeError - valeur hors limites
const arr = new Array(-1);
```

### Erreurs logiques

Le code s'exécute mais produit un résultat incorrect :

```javascript
// ❌ Bug logique - pas d'erreur levée
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) { // <= au lieu de <
    total += items[i].price; // undefined à la dernière itération
  }
  return total;
}
```

---

## Try/Catch basique

### Syntaxe

```javascript
try {
  // Code susceptible de lever une erreur
  const data = JSON.parse(invalidJson);
} catch (error) {
  // Gérer l'erreur
  console.error("Erreur de parsing:", error.message);
}
```

### L'objet Error

```javascript
try {
  throw new Error("Quelque chose a mal tourné");
} catch (error) {
  console.log(error.name);     // "Error"
  console.log(error.message);  // "Quelque chose a mal tourné"
  console.log(error.stack);    // Stack trace complet
}
```

### Finally

S'exécute toujours, qu'il y ait une erreur ou non :

```javascript
let connection;

try {
  connection = openDatabase();
  const data = connection.query("SELECT * FROM users");
  return data;
} catch (error) {
  console.error("Erreur de requête:", error);
  return null;
} finally {
  // Toujours exécuté - nettoyage
  if (connection) {
    connection.close();
  }
}
```

---

## Types d'erreurs spécifiques

### Erreurs natives

```javascript
try {
  // Différents types d'erreurs
  throw new TypeError("Type invalide");
  throw new RangeError("Valeur hors limites");
  throw new ReferenceError("Référence invalide");
  throw new SyntaxError("Syntaxe invalide");
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Erreur de type");
  } else if (error instanceof RangeError) {
    console.log("Erreur de plage");
  }
}
```

### Erreurs personnalisées

```javascript
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

// Utilisation
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("email", "Email requis");
  }
  if (!user.email.includes("@")) {
    throw new ValidationError("email", "Email invalide");
  }
}

try {
  validateUser({ name: "Alice" });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Champ ${error.field}: ${error.message}`);
  }
}
```

---

## Gestion des erreurs asynchrones

### Avec Promises

```javascript
// ❌ try/catch ne capture PAS les erreurs de Promises
try {
  fetch("/api/users")
    .then(response => response.json())
    .then(data => {
      throw new Error("Erreur dans le then");
    });
} catch (error) {
  // Ne sera jamais exécuté !
}

// ✅ Utiliser .catch()
fetch("/api/users")
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => {
    console.error("Erreur:", error);
  });
```

### Avec async/await

```javascript
// ✅ try/catch fonctionne avec async/await
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur de fetch:", error);
    return null;
  }
}
```

### Gestion centralisée

```javascript
// Wrapper pour la gestion d'erreurs
async function safeAsync(asyncFn) {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
}

// Utilisation
const [users, error] = await safeAsync(() => fetchUsers());

if (error) {
  console.error("Erreur:", error);
} else {
  console.log("Users:", users);
}
```

---

## Bonnes pratiques

### ✅ Être spécifique

```javascript
// ❌ Catch générique silencieux
try {
  doSomething();
} catch (e) {
  // Ignore l'erreur
}

// ✅ Logger et gérer spécifiquement
try {
  doSomething();
} catch (error) {
  if (error instanceof NetworkError) {
    showOfflineMessage();
  } else if (error instanceof ValidationError) {
    showValidationErrors(error.fields);
  } else {
    // Erreur inattendue - logger et remonter
    console.error("Erreur inattendue:", error);
    throw error;
  }
}
```

### ✅ Ne pas avaler les erreurs

```javascript
// ❌ L'erreur est perdue
async function saveUser(user) {
  try {
    await api.save(user);
  } catch (error) {
    console.log("Erreur");
    // On continue comme si de rien n'était
  }
  return true;
}

// ✅ Propager ou gérer correctement
async function saveUser(user) {
  try {
    await api.save(user);
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    return { success: false, error: error.message };
  }
}
```

### ✅ Fail fast

```javascript
// Valider tôt pour éviter les erreurs plus tard
function processOrder(order) {
  // Validation immédiate
  if (!order) {
    throw new Error("Order is required");
  }
  if (!order.items?.length) {
    throw new Error("Order must have items");
  }
  if (!order.customer?.id) {
    throw new Error("Customer ID is required");
  }
  
  // Logique métier en confiance
  return calculateTotal(order.items);
}
```

---

## Pattern : Result Type

Alternative au try/catch, inspiré de Rust/Go :

```javascript
class Result {
  constructor(value, error) {
    this.value = value;
    this.error = error;
  }
  
  static ok(value) {
    return new Result(value, null);
  }
  
  static err(error) {
    return new Result(null, error);
  }
  
  isOk() {
    return this.error === null;
  }
  
  isErr() {
    return this.error !== null;
  }
  
  unwrap() {
    if (this.error) throw this.error;
    return this.value;
  }
}

// Utilisation
function divide(a, b) {
  if (b === 0) {
    return Result.err(new Error("Division par zéro"));
  }
  return Result.ok(a / b);
}

const result = divide(10, 0);

if (result.isErr()) {
  console.error(result.error.message);
} else {
  console.log(result.value);
}
```

---

## Exercice pratique

Refactorez ce code pour gérer les erreurs proprement :

```javascript
// Code problématique
async function getUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  const posts = await fetch(`/api/users/${userId}/posts`);
  const postsData = await posts.json();
  return { user, posts: postsData };
}
```

<details>
<summary>✅ Solution</summary>

```javascript
class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

async function fetchJSON(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new APIError(
      response.status,
      `Erreur ${response.status} pour ${url}`
    );
  }
  
  return response.json();
}

async function getUserData(userId) {
  if (!userId) {
    throw new Error("userId est requis");
  }
  
  try {
    const [user, posts] = await Promise.all([
      fetchJSON(`/api/users/${userId}`),
      fetchJSON(`/api/users/${userId}/posts`)
    ]);
    
    return { user, posts, error: null };
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      return { user: null, posts: [], error: "Utilisateur non trouvé" };
    }
    
    console.error("Erreur getUserData:", error);
    throw error; // Re-throw les erreurs inattendues
  }
}
```

</details>

---

## Ressources

- [MDN - Error](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN - try...catch](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch)
