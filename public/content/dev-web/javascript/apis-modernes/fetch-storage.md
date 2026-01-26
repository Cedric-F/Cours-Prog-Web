# Fetch API & Storage

Maîtrisez les appels HTTP avec Fetch API et la persistance de données avec localStorage et sessionStorage pour créer des applications web complètes.

---

## Ce que vous allez apprendre

- Effectuer des requêtes HTTP (GET, POST, PUT, DELETE)
- Gérer les erreurs réseau et les réponses
- Persister des données avec localStorage/sessionStorage
- Combiner Fetch et Storage pour des apps offline-capable

## Prérequis

- [JavaScript - Async/Await](../fonctions/concepts-avances.md)
- [JavaScript - Objets et JSON](../variables-types/objets-tableaux.md)

---

## Fetch API

L'API **Fetch** permet d'effectuer des requêtes HTTP (remplace XMLHttpRequest).

### GET Request

```javascript
// Syntaxe basique
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));

// Avec async/await (préféré)
async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

fetchUsers();
```

### Vérifier le statut de la réponse

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    // Fetch ne rejette QUE sur erreur réseau
    // Vérifier le statut HTTP manuellement
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}

// Utilisation
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error('Impossible de charger:', error));
```

### POST Request

```javascript
async function createUser(userData) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('User created:', data);
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Utilisation
const newUser = {
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
};

createUser(newUser);
```

### PUT Request (mise à jour complète)

```javascript
async function updateUser(id, userData) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('User updated:', data);
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

updateUser(1, {
  name: 'Alice Updated',
  email: 'alice.updated@example.com'
});
```

### PATCH Request (mise à jour partielle)

```javascript
async function patchUser(id, updates) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Modifier seulement l'email
patchUser(1, { email: 'newemail@example.com' });
```

### DELETE Request

```javascript
async function deleteUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('User deleted');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
}

deleteUser(1);
```

### Headers personnalisés

```javascript
async function fetchWithAuth(url, token) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Custom-Header': 'value'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
fetchWithAuth('https://api.example.com/protected', token);
```

### Upload de fichiers

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Mon fichier');
  
  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData
      // Pas de Content-Type (géré automatiquement par le navigateur)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Upload success:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Utilisation avec input file
document.querySelector('#fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadFile(file);
  }
});
```

### Timeout

```javascript
// Fetch n'a pas de timeout natif
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Utilisation
async function getData() {
  try {
    const response = await fetchWithTimeout('https://api.example.com/data', {}, 3000);
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message === 'Request timeout') {
      console.error('La requête a pris trop de temps');
    } else {
      console.error('Erreur:', error);
    }
  }
}
```

### Annulation avec AbortController

```javascript
const controller = new AbortController();
const signal = controller.signal;

// Annuler après 5 secondes
setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://api.example.com/data', { signal });
  const data = await response.json();
  console.log(data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Requête annulée');
  } else {
    console.error('Erreur:', error);
  }
}

// Exemple : annulation au clic
const abortBtn = document.querySelector('#cancelBtn');
abortBtn.addEventListener('click', () => {
  controller.abort();
  console.log('Requête annulée par l\'utilisateur');
});
```

---

## API Client réutilisable

```javascript
class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Vérifier si la réponse a du contenu
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
  
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
}

// Utilisation
const api = new APIClient('https://jsonplaceholder.typicode.com');

async function demo() {
  try {
    // GET
    const users = await api.get('/users');
    console.log('Users:', users);
    
    // GET avec paramètres
    const filtered = await api.get('/posts', { userId: 1 });
    console.log('Posts:', filtered);
    
    // POST
    const newUser = await api.post('/users', {
      name: 'Alice',
      email: 'alice@example.com'
    });
    console.log('Created:', newUser);
    
    // PATCH
    const updated = await api.patch('/users/1', {
      email: 'newemail@example.com'
    });
    console.log('Updated:', updated);
    
    // DELETE
    await api.delete('/users/1');
    console.log('Deleted');
    
    // Authentification
    api.setAuthToken('my-secret-token');
    const protected = await api.get('/protected');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

demo();
```

---

## localStorage

Stockage persistant (survit aux fermetures du navigateur).

### Méthodes de base

```javascript
// Sauvegarder (clé-valeur, TOUJOURS en string)
localStorage.setItem('username', 'Alice');
localStorage.setItem('userId', '123');

// Lire
const username = localStorage.getItem('username');
console.log(username); // "Alice"

// Supprimer une clé
localStorage.removeItem('username');

// Tout supprimer
localStorage.clear();

// Vérifier l'existence
if (localStorage.getItem('username')) {
  console.log('Username exists');
}

// Nombre d'entrées
console.log(localStorage.length);

// Itérer
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}
```

### Stocker des objets (JSON)

```javascript
// Sauvegarder un objet
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  preferences: {
    theme: 'dark',
    language: 'fr'
  }
};

localStorage.setItem('user', JSON.stringify(user));

// Lire un objet
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // "Alice"
console.log(storedUser.preferences.theme); // "dark"

// Sauvegarder un tableau
const todos = [
  { id: 1, text: 'Tâche 1', completed: false },
  { id: 2, text: 'Tâche 2', completed: true }
];

localStorage.setItem('todos', JSON.stringify(todos));

// Lire le tableau
const storedTodos = JSON.parse(localStorage.getItem('todos'));
console.log(storedTodos[0].text); // "Tâche 1"
```

### Helper functions

```javascript
// Utilitaires localStorage
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  },
  
  has(key) {
    return localStorage.getItem(key) !== null;
  }
};

// Utilisation
storage.set('user', { name: 'Alice', age: 25 });
const user = storage.get('user');
console.log(user.name); // "Alice"

storage.set('settings', { theme: 'dark', notifications: true });
const settings = storage.get('settings', { theme: 'light' }); // Valeur par défaut
```

### Exemple : Panier d'achat

```javascript
class ShoppingCart {
  constructor() {
    this.items = this.load();
  }
  
  load() {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.save();
  }
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  }
  
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.save();
      }
    }
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  
  clear() {
    this.items = [];
    this.save();
  }
}

// Utilisation
const cart = new ShoppingCart();

cart.addItem({ id: 1, name: 'Laptop', price: 999 });
cart.addItem({ id: 2, name: 'Mouse', price: 25 });
cart.addItem({ id: 1, name: 'Laptop', price: 999 }); // Quantity++

console.log('Total:', cart.getTotal()); // 2023
console.log('Items:', cart.items);

cart.updateQuantity(1, 1);
console.log('Updated total:', cart.getTotal()); // 1024
```

---

## sessionStorage

Identique à localStorage mais les données sont effacées à la fermeture de l'onglet.

```javascript
// API identique à localStorage
sessionStorage.setItem('tempData', 'value');
const data = sessionStorage.getItem('tempData');
sessionStorage.removeItem('tempData');
sessionStorage.clear();

// Exemple : données de formulaire temporaires
const formData = {
  step: 2,
  email: 'user@example.com',
  preferences: { newsletter: true }
};

sessionStorage.setItem('formProgress', JSON.stringify(formData));

// Restaurer au rechargement de page
window.addEventListener('load', () => {
  const saved = sessionStorage.getItem('formProgress');
  if (saved) {
    const data = JSON.parse(saved);
    console.log('Restauration de la progression:', data);
    // Remplir le formulaire...
  }
});
```

---

## Événement storage

Détecter les changements de localStorage (dans d'autres onglets).

```javascript
// Écouter les changements
window.addEventListener('storage', (e) => {
  console.log('Storage changed:');
  console.log('Key:', e.key);
  console.log('Old value:', e.oldValue);
  console.log('New value:', e.newValue);
  console.log('URL:', e.url);
  
  // Réagir au changement
  if (e.key === 'user') {
    const newUser = JSON.parse(e.newValue);
    console.log('User updated in another tab:', newUser);
    // Mettre à jour l'UI...
  }
});

// ⚠️ L'événement ne se déclenche QUE dans les autres onglets
// Pas dans l'onglet qui a fait la modification
```

---

## Limites et bonnes pratiques

### Limites

```javascript
// localStorage : ~5-10 MB par domaine (varie selon le navigateur)
// sessionStorage : même limite

// Tester la capacité
function getStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
}

console.log('Storage size:', getStorageSize());

// Gérer le dépassement
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
      // Nettoyer les anciennes données ou notifier l'utilisateur
      return false;
    }
    throw e;
  }
}
```

### Bonnes pratiques

```javascript
// ✅ 1. Préfixer les clés (éviter conflits)
const APP_PREFIX = 'myapp_';

function setItem(key, value) {
  localStorage.setItem(APP_PREFIX + key, JSON.stringify(value));
}

function getItem(key) {
  const item = localStorage.getItem(APP_PREFIX + key);
  return item ? JSON.parse(item) : null;
}

// ✅ 2. Versioning (migration de données)
const STORAGE_VERSION = 2;

function migrateStorage() {
  const version = parseInt(localStorage.getItem('storageVersion') || '0');
  
  if (version < STORAGE_VERSION) {
    console.log('Migrating storage from v' + version);
    
    // Migration...
    if (version < 1) {
      // Changements v0 → v1
    }
    if (version < 2) {
      // Changements v1 → v2
    }
    
    localStorage.setItem('storageVersion', STORAGE_VERSION.toString());
  }
}

// ✅ 3. Ne PAS stocker de données sensibles
// ❌ Mauvais
localStorage.setItem('password', '123456');
localStorage.setItem('creditCard', '1234-5678-9012-3456');

// ✅ Bon : stocker seulement des tokens (avec expiration)
const tokenData = {
  token: 'jwt_token_here',
  expiresAt: Date.now() + 3600000 // 1 heure
};
localStorage.setItem('auth', JSON.stringify(tokenData));

// ✅ 4. Vérifier l'expiration
function getAuthToken() {
  const stored = localStorage.getItem('auth');
  if (!stored) return null;
  
  const { token, expiresAt } = JSON.parse(stored);
  
  if (Date.now() > expiresAt) {
    localStorage.removeItem('auth');
    return null;
  }
  
  return token;
}

// ✅ 5. Compression pour grandes données (optionnel)
// Utiliser LZ-string ou pako pour compression
```

---

## Exercice pratique

### 🎯 Application Notes avec API et Storage

Créez une app qui :
1. **Charge** les notes depuis une API (jsonplaceholder)
2. **Sauvegarde** localement avec localStorage
3. **CRUD complet** : créer, lire, modifier, supprimer
4. **Synchronisation** : bouton pour re-sync avec API
5. **Offline-first** : afficher localStorage si API échoue

```javascript
class NotesApp {
  constructor() {
    this.api = new APIClient('https://jsonplaceholder.typicode.com');
    this.notes = this.loadFromStorage();
  }
  
  loadFromStorage() {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  }
  
  saveToStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  
  async fetchFromAPI() {
    try {
      const posts = await this.api.get('/posts', { _limit: 10 });
      this.notes = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.body
      }));
      this.saveToStorage();
      return this.notes;
    } catch (error) {
      console.error('Fetch error, using cached data');
      return this.notes;
    }
  }
  
  addNote(title, content) {
    const note = {
      id: Date.now(),
      title,
      content
    };
    this.notes.push(note);
    this.saveToStorage();
    return note;
  }
  
  updateNote(id, updates) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      Object.assign(note, updates);
      this.saveToStorage();
    }
  }
  
  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveToStorage();
  }
}

// Utilisation
const app = new NotesApp();

// Charger depuis API au démarrage
app.fetchFromAPI().then(notes => {
  console.log('Notes loaded:', notes);
});
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier `await` | Promise non résolue | Ajouter `await` ou `.then()` |
| Pas de try/catch | Erreurs non gérées | Toujours entourer de try/catch |
| `response.ok` ignoré | Erreurs HTTP non détectées | Vérifier `if (!response.ok)` |
| localStorage non parsé | "[object Object]" | `JSON.parse()` à la lecture |

---

## Quiz de vérification

:::quiz
Q: Quelle méthode convertit la réponse en JSON ?
   - [] `response.text()`
   - [x] `response.json()` ✅
   - [] `JSON.parse(response)`

Q: Quand `fetch()` rejette-t-il la Promise ?
   - [] Sur erreur HTTP (404, 500)
   - [x] Sur erreur réseau uniquement ✅
   - [] Jamais

Q: Quelle est la différence localStorage vs sessionStorage ?
   - [] localStorage est plus rapide
   - [x] sessionStorage expire à la fermeture du navigateur ✅
   - [] Aucune différence

Q: Comment envoyer du JSON avec POST ?
   - [] `body: data`
   - [x] `body: JSON.stringify(data)` avec header Content-Type ✅
   - [] `json: data`
:::

---

## Prochaine étape

Découvrez la [Programmation Asynchrone](./programmation-asynchrone.md) pour maîtriser Promises et async/await.
