# IndexedDB - CRUD et Requêtes

Maîtrisez les **opérations CRUD** (Create, Read, Update, Delete) et les **requêtes avancées** dans IndexedDB.

---

## Opérations CRUD complètes

### Create (Ajouter)

```javascript
class DatabaseManager {
  constructor(db) {
    this.db = db;
  }
  
  // Ajouter un élément
  async add(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      
      request.onsuccess = () => {
        console.log('✅ Ajouté avec ID:', request.result);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('❌ Erreur:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Ajouter plusieurs éléments
  async addMany(storeName, dataArray) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    const ids = [];
    
    for (const data of dataArray) {
      const id = await new Promise((resolve, reject) => {
        const request = store.add(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      ids.push(id);
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    
    console.log(`✅ ${ids.length} éléments ajoutés`);
    return ids;
  }
}

// Utilisation
const dbManager = new DatabaseManager(db);

// Ajouter un utilisateur
const userId = await dbManager.add('users', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});

// Ajouter plusieurs utilisateurs
const userIds = await dbManager.addMany('users', [
  { name: 'Bob', email: 'bob@example.com', age: 30 },
  { name: 'Charlie', email: 'charlie@example.com', age: 35 }
]);
```

### Read (Lire)

```javascript
class DatabaseManager {
  // Récupérer par clé primaire
  async get(storeName, key) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Récupérer tous les éléments
  async getAll(storeName, query = null, count = undefined) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll(query, count);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Récupérer toutes les clés
  async getAllKeys(storeName) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Compter les éléments
  async count(storeName, query = undefined) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.count(query);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
const user = await dbManager.get('users', 1);
const allUsers = await dbManager.getAll('users');
const first5Users = await dbManager.getAll('users', null, 5);
const userCount = await dbManager.count('users');
```

### Update (Modifier)

```javascript
class DatabaseManager {
  // Modifier un élément (put remplace complètement)
  async update(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => {
        console.log('✅ Modifié:', request.result);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  // Modifier partiellement (merge)
  async patch(storeName, key, partialData) {
    const existing = await this.get(storeName, key);
    
    if (!existing) {
      throw new Error(`Élément ${key} non trouvé`);
    }
    
    const updated = { ...existing, ...partialData };
    return this.update(storeName, updated);
  }
  
  // Modifier plusieurs éléments
  async updateMany(storeName, dataArray) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const data of dataArray) {
      await new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = resolve;
        request.onerror = reject;
      });
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    
    console.log(`✅ ${dataArray.length} éléments modifiés`);
  }
}

// Utilisation
await dbManager.update('users', {
  id: 1,
  name: 'Alice Updated',
  email: 'alice@example.com',
  age: 26
});

await dbManager.patch('users', 1, { age: 27 }); // Modifie seulement l'âge
```

### Delete (Supprimer)

```javascript
class DatabaseManager {
  // Supprimer par clé
  async delete(storeName, key) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => {
        console.log('✅ Supprimé:', key);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  // Supprimer plusieurs éléments
  async deleteMany(storeName, keys) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const key of keys) {
      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = resolve;
        request.onerror = reject;
      });
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    
    console.log(`✅ ${keys.length} éléments supprimés`);
  }
  
  // Vider complètement un store
  async clear(storeName) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        console.log('✅ Store vidé');
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
await dbManager.delete('users', 1);
await dbManager.deleteMany('users', [2, 3, 4]);
await dbManager.clear('users');
```

---

## Requêtes avec Index

### Recherche exacte

```javascript
class DatabaseManager {
  // Rechercher par index
  async getByIndex(storeName, indexName, value) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    
    return new Promise((resolve, reject) => {
      const request = index.get(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Récupérer tous par index
  async getAllByIndex(storeName, indexName, value = null) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    
    return new Promise((resolve, reject) => {
      const request = value ? index.getAll(value) : index.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
const user = await dbManager.getByIndex('users', 'email', 'alice@example.com');
const usersNamedAlice = await dbManager.getAllByIndex('users', 'name', 'Alice');
```

### Recherche par plage (IDBKeyRange)

```javascript
class DatabaseManager {
  // Recherche dans une plage
  async getRange(storeName, indexName, lowerBound, upperBound, lowerOpen = false, upperOpen = false) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    
    const range = IDBKeyRange.bound(lowerBound, upperBound, lowerOpen, upperOpen);
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Plus grand que
  async getGreaterThan(storeName, indexName, value, open = false) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    
    const range = IDBKeyRange.lowerBound(value, open);
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Plus petit que
  async getLessThan(storeName, indexName, value, open = false) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    
    const range = IDBKeyRange.upperBound(value, open);
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
// Utilisateurs entre 20 et 30 ans (inclus)
const users = await dbManager.getRange('users', 'age', 20, 30);

// Utilisateurs de 21 à 29 ans (exclus)
const users2 = await dbManager.getRange('users', 'age', 20, 30, true, true);

// Utilisateurs de 25 ans et plus
const olderUsers = await dbManager.getGreaterThan('users', 'age', 25);

// Utilisateurs de moins de 30 ans
const youngerUsers = await dbManager.getLessThan('users', 'age', 30);
```

---

## Curseurs (pour requêtes complexes)

```javascript
class DatabaseManager {
  // Itérer avec curseur
  async forEach(storeName, callback, indexName = null) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const source = indexName ? store.index(indexName) : store;
    
    return new Promise((resolve, reject) => {
      const request = source.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          callback(cursor.value, cursor.key);
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Filtrer avec curseur
  async filter(storeName, predicate, indexName = null) {
    const results = [];
    
    await this.forEach(storeName, (value) => {
      if (predicate(value)) {
        results.push(value);
      }
    }, indexName);
    
    return results;
  }
  
  // Mapper avec curseur
  async map(storeName, mapper, indexName = null) {
    const results = [];
    
    await this.forEach(storeName, (value) => {
      results.push(mapper(value));
    }, indexName);
    
    return results;
  }
  
  // Modifier avec curseur
  async updateWhere(storeName, predicate, updater) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      let count = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          if (predicate(cursor.value)) {
            const updated = updater(cursor.value);
            cursor.update(updated);
            count++;
          }
          cursor.continue();
        } else {
          console.log(`✅ ${count} éléments modifiés`);
          resolve(count);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Supprimer avec curseur
  async deleteWhere(storeName, predicate) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      let count = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          if (predicate(cursor.value)) {
            cursor.delete();
            count++;
          }
          cursor.continue();
        } else {
          console.log(`✅ ${count} éléments supprimés`);
          resolve(count);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
// Itérer sur tous les utilisateurs
await dbManager.forEach('users', (user) => {
  console.log(user.name);
});

// Filtrer les utilisateurs de plus de 25 ans
const adults = await dbManager.filter('users', user => user.age > 25);

// Mapper pour ne garder que les noms
const names = await dbManager.map('users', user => user.name);

// Augmenter l'âge de tous les utilisateurs de plus de 30 ans
await dbManager.updateWhere('users',
  user => user.age > 30,
  user => ({ ...user, age: user.age + 1 })
);

// Supprimer les utilisateurs inactifs
await dbManager.deleteWhere('users', user => !user.active);
```

---

## Pagination

```javascript
class DatabaseManager {
  async paginate(storeName, page = 1, pageSize = 10, indexName = null) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const source = indexName ? store.index(indexName) : store;
    
    const skip = (page - 1) * pageSize;
    const results = [];
    
    return new Promise((resolve, reject) => {
      const request = source.openCursor();
      let index = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor && results.length < pageSize) {
          if (index >= skip) {
            results.push(cursor.value);
          }
          index++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
const page1 = await dbManager.paginate('users', 1, 10); // 10 premiers
const page2 = await dbManager.paginate('users', 2, 10); // 10 suivants
```

---

## Exemple complet : Gestionnaire de tâches

```javascript
class TodoDatabase {
  constructor() {
    this.dbName = 'TodoApp';
    this.version = 1;
    this.db = null;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        const store = db.createObjectStore('todos', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('priority', 'priority', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      };
    });
  }
  
  async addTodo(title, priority = 'medium') {
    const todo = {
      title,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    const tx = this.db.transaction(['todos'], 'readwrite');
    const store = tx.objectStore('todos');
    
    return new Promise((resolve, reject) => {
      const request = store.add(todo);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTodos(status = null) {
    const tx = this.db.transaction(['todos'], 'readonly');
    const store = tx.objectStore('todos');
    
    if (status) {
      const index = store.index('status');
      return new Promise((resolve, reject) => {
        const request = index.getAll(status);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } else {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  async completeTodo(id) {
    const tx = this.db.transaction(['todos'], 'readwrite');
    const store = tx.objectStore(todos');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const todo = getRequest.result;
        
        if (todo) {
          todo.status = 'completed';
          todo.completedAt = new Date().toISOString();
          
          const updateRequest = store.put(todo);
          updateRequest.onsuccess = () => resolve(todo);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Todo non trouvé'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
  
  async deleteTodo(id) {
    const tx = this.db.transaction(['todos'], 'readwrite');
    const store = tx.objectStore('todos');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async getStats() {
    const todos = await this.getTodos();
    
    return {
      total: todos.length,
      pending: todos.filter(t => t.status === 'pending').length,
      completed: todos.filter(t => t.status === 'completed').length,
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length
    };
  }
}

// Utilisation
const todoDB = new TodoDatabase();
await todoDB.init();

await todoDB.addTodo('Faire les courses', 'high');
await todoDB.addTodo('Appeler le dentiste', 'medium');

const pendingTodos = await todoDB.getTodos('pending');
console.log('Tâches en attente:', pendingTodos);

await todoDB.completeTodo(1);

const stats = await todoDB.getStats();
console.log('Statistiques:', stats);
```

---

## Exercice pratique

Créez un **gestionnaire de contacts** avec :
- CRUD complet (ajouter, lire, modifier, supprimer)
- Index sur `name`, `email`, `company`
- Recherche par nom (startsWith)
- Filtrage par company
- Pagination (10 contacts par page)
- Statistiques (total, par company)

**Bonus** : Export/Import JSON !

---

**Prochaine étape** : [IndexedDB Avancé](./indexeddb-avance.md) pour les techniques expertes ! 🚀
