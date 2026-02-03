# IndexedDB - Les bases

Maîtrisez **IndexedDB**, la base de données côté client pour stocker de **grandes quantités de données** structurées.

---

## Qu'est-ce qu'IndexedDB ?

**IndexedDB** est une API de base de données **NoSQL** intégrée au navigateur :
- Stockage **illimité** (selon quota du navigateur)
- Support des **transactions** ACID
- Organisation en **object stores** (comme des tables)
- **Index** pour recherches rapides
- **Asynchrone** (promesses)
- Persistant entre les sessions

### Cas d'usage

✅ Applications **offline-first**  
✅ Cache de données **volumineuses**  
✅ Stockage de **fichiers** (images, vidéos)  
✅ Applications **PWA**  
✅ Synchronisation **en arrière-plan**

### LocalStorage vs IndexedDB

| LocalStorage | IndexedDB |
|--------------|-----------|
| ❌ ~5 MB max | ✅ GB de données |
| ❌ Synchrone (bloque l'UI) | ✅ Asynchrone |
| ❌ Strings uniquement | ✅ Objets JavaScript |
| ❌ Pas d'index | ✅ Index multiples |
| ✅ API simple | ⚠️ API complexe |

---

## Concepts clés

### 1. Database (Base de données)

Conteneur principal.

```javascript
const request = indexedDB.open('MaDatabase', 1);
//                               ↑ nom      ↑ version
```

### 2. Object Store (Magasin d'objets)

Équivalent d'une **table SQL**.

```javascript
db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
//                     ↑ nom     ↑ clé primaire
```

### 3. Transaction

Opérations groupées (lecture/écriture).

```javascript
const transaction = db.transaction(['users'], 'readwrite');
const store = transaction.objectStore('users');
```

### 4. Index

Pour rechercher par autre chose que la clé primaire.

```javascript
store.createIndex('email', 'email', { unique: true });
```

---

## Ouvrir une base de données

```javascript
const request = indexedDB.open('MyApp', 1);

request.onerror = (event) => {
  console.error('Erreur:', event.target.error);
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('✅ Base de données ouverte');
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Créer un object store
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true
    });
    
    // Créer des index
    store.createIndex('email', 'email', { unique: true });
    store.createIndex('name', 'name', { unique: false });
  }
};
```

---

## Wrapper avec Promesses

L'API IndexedDB native utilise des callbacks. Créons un wrapper moderne :

```javascript
class IndexedDBHelper {
  constructor(dbName, version, storeSchema) {
    this.dbName = dbName;
    this.version = version;
    this.storeSchema = storeSchema;
    this.db = null;
  }
  
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Créer les stores selon le schéma
        for (const [storeName, options] of Object.entries(this.storeSchema)) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, options.keyPath ? options : { keyPath: 'id', autoIncrement: true });
            
            // Créer les index
            if (options.indexes) {
              options.indexes.forEach(([name, keyPath, unique]) => {
                store.createIndex(name, keyPath, { unique });
              });
            }
          }
        }
      };
    });
  }
  
  async add(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async get(storeName, key) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAll(storeName) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async update(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async delete(storeName, key) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async clear(storeName) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
```

---

## Utilisation du wrapper

```javascript
const db = new IndexedDBHelper('MyApp', 1, {
  users: {
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      ['email', 'email', true],
      ['name', 'name', false]
    ]
  },
  posts: {
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      ['userId', 'userId', false]
    ]
  }
});

// Ouvrir la base
await db.open();

// Ajouter un utilisateur
const userId = await db.add('users', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});
console.log('User ID:', userId);

// Récupérer un utilisateur
const user = await db.get('users', userId);
console.log(user);

// Récupérer tous les utilisateurs
const allUsers = await db.getAll('users');
console.log(allUsers);

// Modifier un utilisateur
await db.update('users', {
  id: userId,
  name: 'Alice Updated',
  email: 'alice@example.com',
  age: 26
});

// Supprimer un utilisateur
await db.delete('users', userId);
```

---

## Transactions

Les transactions garantissent l'intégrité des données.

### Modes de transaction

```javascript
// Lecture seule (multiple concurrent)
const tx = db.transaction(['users'], 'readonly');

// Lecture/Écriture (exclusive)
const tx = db.transaction(['users'], 'readwrite');

// Transaction sur plusieurs stores
const tx = db.transaction(['users', 'posts'], 'readwrite');
```

### Gestion des transactions

```javascript
async function transferData() {
  const tx = db.transaction(['users', 'posts'], 'readwrite');
  
  try {
    const usersStore = tx.objectStore('users');
    const postsStore = tx.objectStore('posts');
    
    // Opération 1
    await new Promise((resolve, reject) => {
      const req = usersStore.put({ id: 1, name: 'Alice' });
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    
    // Opération 2
    await new Promise((resolve, reject) => {
      const req = postsStore.add({ userId: 1, title: 'Mon post' });
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    
    // Si tout réussit, la transaction est commitée automatiquement
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    
    console.log('✅ Transaction réussie');
  } catch (error) {
    console.error('❌ Transaction échouée:', error);
    // La transaction est automatiquement rollback
  }
}
```

---

## Bibliothèque idb (Google)

**idb** simplifie IndexedDB avec des promesses natives.

### Installation

```bash
npm install idb
```

### Utilisation

```javascript
import { openDB } from 'idb';

const db = await openDB('MyApp', 1, {
  upgrade(db) {
    const store = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true
    });
    
    store.createIndex('email', 'email', { unique: true });
  }
});

// Ajouter
await db.add('users', { name: 'Alice', email: 'alice@example.com' });

// Récupérer
const user = await db.get('users', 1);

// Récupérer tous
const allUsers = await db.getAll('users');

// Modifier
await db.put('users', { id: 1, name: 'Alice Updated', email: 'alice@example.com' });

// Supprimer
await db.delete('users', 1);

// Transaction
const tx = db.transaction('users', 'readwrite');
await tx.store.add({ name: 'Bob' });
await tx.store.add({ name: 'Charlie' });
await tx.done;
```

---

## Recherche par index

```javascript
async function searchByEmail(email) {
  const tx = db.transaction(['users'], 'readonly');
  const store = tx.objectStore('users');
  const index = store.index('email');
  
  return new Promise((resolve, reject) => {
    const request = index.get(email);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Utilisation
const user = await searchByEmail('alice@example.com');
console.log(user);
```

### Recherche avec curseur

```javascript
async function searchByNamePrefix(prefix) {
  const tx = db.transaction(['users'], 'readonly');
  const store = tx.objectStore('users');
  const index = store.index('name');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    const request = index.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        if (cursor.value.name.startsWith(prefix)) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Utilisation
const users = await searchByNamePrefix('Ali');
console.log(users); // [{ name: 'Alice', ... }, { name: 'Alicia', ... }]
```

---

## Stockage de fichiers

```javascript
async function saveFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  await db.add('files', {
    name: file.name,
    type: file.type,
    size: file.size,
    data: arrayBuffer,
    createdAt: new Date()
  });
}

async function getFile(id) {
  const fileData = await db.get('files', id);
  
  if (!fileData) return null;
  
  const blob = new Blob([fileData.data], { type: fileData.type });
  return new File([blob], fileData.name, { type: fileData.type });
}

// Utilisation
const input = document.getElementById('file-input');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  await saveFile(file);
  console.log('✅ Fichier sauvegardé');
});
```

---

## Gestion des versions

```javascript
const request = indexedDB.open('MyApp', 2); // Version 2

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const oldVersion = event.oldVersion;
  
  // Migration de v1 à v2
  if (oldVersion < 2) {
    // Ajouter un nouvel object store
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
    }
    
    // Modifier un object store existant
    const tx = event.target.transaction;
    const usersStore = tx.objectStore('users');
    
    // Ajouter un nouvel index
    if (!usersStore.indexNames.contains('age')) {
      usersStore.createIndex('age', 'age', { unique: false });
    }
  }
};
```

---

## Exercice pratique

Créez une **application de notes offline** avec IndexedDB :
- Object store `notes` avec `id`, `title`, `content`, `createdAt`
- Index sur `title`
- Fonctions : ajouter, modifier, supprimer, rechercher
- Interface avec liste des notes
- Stockage de fichiers attachés

**Bonus** : Utilisez la bibliothèque **idb** !

---

**Prochaine étape** : [IndexedDB CRUD](./indexeddb-crud.md) pour les opérations avancées !
