# Tests avec Jest

Écrivez des tests automatisés pour garantir la qualité de votre code.

---

## Ce que vous allez apprendre

- Comprendre l'importance des tests
- Écrire des tests unitaires avec Jest
- Tester une API Express
- Mocker les dépendances

## Prérequis

- [JavaScript - Fonctions](../../javascript/fonctions/bases-fonctions.md)
- [Express.js - API REST](../express/api-rest.md)

---

## Pourquoi tester ?

### Sans tests

```
1. Modifier du code
2. Tester manuellement... peut-être
3. Déployer
4. Bug en production 💥
5. Hotfix urgent à 3h du matin 😭
```

### Avec tests

```
1. Écrire des tests
2. Modifier du code
3. Lancer les tests automatiquement
4. ✅ Tests passent → Déployer en confiance
5. ❌ Tests échouent → Corriger avant déploiement
```

### Types de tests

| Type | Portée | Vitesse | Exemple |
|------|--------|---------|---------|
| **Unitaire** | Une fonction | ⚡ Très rapide | `sum(2, 3) === 5` |
| **Intégration** | Plusieurs modules | 🚀 Rapide | API + Base de données |
| **E2E** | Application entière | 🐢 Lent | Parcours utilisateur |

---

## Installation

```bash
# Jest pour Node.js
npm install -D jest

# Pour TypeScript
npm install -D jest @types/jest ts-jest

# Pour tester une API Express
npm install -D supertest @types/supertest
```

### Configuration

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  verbose: true
};
```

---

## Premier test

### Structure d'un test

```javascript
// math.js
function sum(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { sum, multiply };
```

```javascript
// math.test.js
const { sum, multiply } = require('./math');

// describe() groupe les tests liés
describe('Math functions', () => {
  
  // test() ou it() définit un test
  test('sum adds two numbers', () => {
    // expect() + matcher vérifie le résultat
    expect(sum(2, 3)).toBe(5);
  });
  
  test('sum handles negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
  
  it('multiply multiplies two numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });
  
});
```

### Lancer les tests

```bash
# Tous les tests
npm test

# Mode watch (relance à chaque modification)
npm run test:watch

# Avec couverture de code
npm run test:coverage

# Un fichier spécifique
npm test -- math.test.js
```

---

## Matchers courants

### Égalité

```javascript
// Égalité stricte (===)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Égalité profonde (objets/arrays)
expect({ name: 'John' }).toEqual({ name: 'John' });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// Pas égal
expect(1).not.toBe(2);
```

### Vérité

```javascript
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(value).toBeDefined();

expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();
```

### Nombres

```javascript
expect(10).toBeGreaterThan(5);
expect(10).toBeGreaterThanOrEqual(10);
expect(5).toBeLessThan(10);
expect(0.1 + 0.2).toBeCloseTo(0.3); // Pour les floats
```

### Strings

```javascript
expect('hello world').toMatch(/world/);
expect('hello world').toContain('world');
expect('hello').toHaveLength(5);
```

### Arrays et objets

```javascript
expect([1, 2, 3]).toContain(2);
expect(['apple', 'banana']).toContainEqual('banana');

expect({ name: 'John', age: 30 }).toHaveProperty('name');
expect({ name: 'John', age: 30 }).toHaveProperty('age', 30);
expect({ a: 1, b: 2 }).toMatchObject({ a: 1 });
```

### Exceptions

```javascript
function throwError() {
  throw new Error('Something went wrong');
}

expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow('Something went wrong');
expect(() => throwError()).toThrow(Error);
```

---

## Tests asynchrones

### Async/Await

```javascript
// userService.js
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// userService.test.js
test('getUser returns user data', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('John');
});
```

### Promises

```javascript
test('resolves to user', () => {
  return expect(getUser(1)).resolves.toHaveProperty('name');
});

test('rejects with error', () => {
  return expect(getUser(-1)).rejects.toThrow('User not found');
});
```

### Callbacks (ancien style)

```javascript
test('callback style', (done) => {
  fetchData((data) => {
    expect(data).toBe('expected');
    done(); // Indique que le test est terminé
  });
});
```

---

## Setup et Teardown

```javascript
describe('Database tests', () => {
  
  // Avant tous les tests du describe
  beforeAll(async () => {
    await database.connect();
  });
  
  // Après tous les tests
  afterAll(async () => {
    await database.disconnect();
  });
  
  // Avant chaque test
  beforeEach(async () => {
    await database.clear();
    await database.seed();
  });
  
  // Après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('can create user', async () => {
    // ...
  });
  
});
```

---

## Mocking

### Pourquoi mocker ?

```javascript
// ❌ Test lent et fragile (dépend de l'API externe)
test('fetches users', async () => {
  const users = await fetchUsersFromAPI();
  expect(users.length).toBeGreaterThan(0);
});

// ✅ Test rapide et isolé
test('fetches users', async () => {
  // On simule la réponse
  fetch.mockResolvedValue({ json: () => [{ id: 1 }] });
  const users = await fetchUsersFromAPI();
  expect(users.length).toBe(1);
});
```

### Mock de fonctions

```javascript
// Créer un mock
const mockFn = jest.fn();

// Définir le comportement
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);
mockFn.mockResolvedValue({ data: 'async result' });
mockFn.mockImplementation((x) => x * 2);

// Vérifier les appels
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(3);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('last arg');
```

### Mock de modules

```javascript
// emailService.js
const sendEmail = async (to, subject, body) => {
  // Envoie vraiment un email
};

// userController.test.js
jest.mock('./emailService');
const { sendEmail } = require('./emailService');

test('sends welcome email on registration', async () => {
  sendEmail.mockResolvedValue({ success: true });
  
  await registerUser('john@example.com', 'password');
  
  expect(sendEmail).toHaveBeenCalledWith(
    'john@example.com',
    'Bienvenue !',
    expect.stringContaining('Merci de vous être inscrit')
  );
});
```

### Mock partiel

```javascript
// Mocker seulement certaines fonctions
jest.mock('./database', () => ({
  ...jest.requireActual('./database'),
  connect: jest.fn().mockResolvedValue(true)
}));
```

---

## Tester une API Express

### Setup

```javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/users', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  res.status(201).json({ id: 1, email });
});

module.exports = app;
```

```javascript
// app.test.js
const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
  
  describe('GET /api/health', () => {
    test('returns status ok', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
  
  describe('POST /api/users', () => {
    test('creates user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'john@example.com', password: 'secret' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('john@example.com');
    });
    
    test('returns 400 without email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ password: 'secret' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/email/i);
    });
    
    test('returns 400 without password', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'john@example.com' });
      
      expect(response.status).toBe(400);
    });
  });
  
});
```

### Avec authentification

```javascript
describe('Protected routes', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login pour obtenir un token
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'admin@test.com', password: 'password' });
    
    authToken = response.body.token;
  });
  
  test('accesses protected route with token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
  });
  
  test('rejects without token', async () => {
    const response = await request(app)
      .get('/api/protected');
    
    expect(response.status).toBe(401);
  });
});
```

### Avec base de données (mocked)

```javascript
// Mocker Mongoose
jest.mock('../models/User');
const User = require('../models/User');

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('GET /api/users returns all users', async () => {
    const mockUsers = [
      { _id: '1', email: 'john@test.com' },
      { _id: '2', email: 'jane@test.com' }
    ];
    
    User.find.mockResolvedValue(mockUsers);
    
    const response = await request(app).get('/api/users');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(User.find).toHaveBeenCalledTimes(1);
  });
  
  test('POST /api/users creates user', async () => {
    const newUser = { _id: '1', email: 'new@test.com' };
    User.create.mockResolvedValue(newUser);
    
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'new@test.com', password: 'secret' });
    
    expect(response.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'new@test.com' })
    );
  });
});
```

---

## Couverture de code

```bash
npm run test:coverage
```

Résultat :
```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.71 |    75.00 |   80.00 |   85.71 |
 math.js  |   100   |   100    |   100   |   100   |
 user.js  |   66.67 |    50.00 |   50.00 |   66.67 |
----------|---------|----------|---------|---------|
```

### Objectifs raisonnables

| Métrique | Minimum | Bon | Excellent |
|----------|---------|-----|-----------|
| Statements | 60% | 80% | 90%+ |
| Branches | 50% | 70% | 85%+ |
| Functions | 60% | 80% | 90%+ |

---

## Organisation des tests

```
src/
├── controllers/
│   ├── userController.js
│   └── userController.test.js    # À côté du fichier
├── services/
│   └── emailService.js
└── models/
    └── User.js

tests/                             # Ou dans un dossier séparé
├── unit/
│   ├── userController.test.js
│   └── emailService.test.js
├── integration/
│   └── api.test.js
└── fixtures/
    └── users.json
```

---

## ❌ Erreurs Courantes

### 1. Oublier async/await

```javascript
// ❌ Test passe toujours (n'attend pas)
test('async test', () => {
  expect(fetchData()).resolves.toBe('data');
});

// ✅ Avec await ou return
test('async test', async () => {
  await expect(fetchData()).resolves.toBe('data');
});
```

### 2. Tests interdépendants

```javascript
// ❌ Test 2 dépend de test 1
let userId;
test('create user', async () => {
  const user = await createUser();
  userId = user.id;
});
test('get user', async () => {
  const user = await getUser(userId); // Échoue si test 1 échoue
});

// ✅ Tests indépendants avec setup
beforeEach(async () => {
  testUser = await createUser();
});
```

### 3. Tester l'implémentation au lieu du comportement

```javascript
// ❌ Teste comment c'est fait (fragile)
test('calls database', () => {
  getUser(1);
  expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = 1');
});

// ✅ Teste ce que ça fait (robuste)
test('returns user by id', async () => {
  const user = await getUser(1);
  expect(user.id).toBe(1);
});
```

---

## 🏋️ Exercice Pratique

**Objectif** : Tester une fonction de validation

```javascript
// Créez les tests pour cette fonction
function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email requis' };
  if (!email.includes('@')) return { valid: false, error: 'Email invalide' };
  return { valid: true };
}
```

<details>
<summary>💡 Solution</summary>

```javascript
describe('validateEmail', () => {
  test('returns valid for correct email', () => {
    expect(validateEmail('john@example.com')).toEqual({ valid: true });
  });
  
  test('returns error for empty email', () => {
    expect(validateEmail('')).toEqual({ 
      valid: false, 
      error: 'Email requis' 
    });
  });
  
  test('returns error for null', () => {
    expect(validateEmail(null).valid).toBe(false);
  });
  
  test('returns error for email without @', () => {
    expect(validateEmail('invalid')).toEqual({
      valid: false,
      error: 'Email invalide'
    });
  });
});
```
</details>

---

## Quiz de vérification

:::quiz
Q: Quel matcher pour comparer des objets ?
- [ ] `toBe()`
- [x] `toEqual()`
- [ ] `toMatch()`
> `toBe()` compare par référence, `toEqual()` compare la valeur en profondeur (idéal pour les objets).

Q: Comment mocker un module entier ?
- [ ] `jest.fn()`
- [x] `jest.mock('./module')`
- [ ] `jest.spy()`
> `jest.mock()` remplace automatiquement toutes les exports d'un module par des mocks.

Q: Quelle bibliothèque pour tester une API Express ?
- [ ] axios
- [x] supertest
- [ ] fetch
> Supertest permet de faire des requêtes HTTP sur une app Express sans démarrer un vrai serveur.
:::

---

## Pour aller plus loin

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/) (pour React)
- [Supertest](https://github.com/visionmedia/supertest)

---

## Prochaine étape

Découvrez [Docker](../docker/docker-basics.md) pour conteneuriser votre application.
