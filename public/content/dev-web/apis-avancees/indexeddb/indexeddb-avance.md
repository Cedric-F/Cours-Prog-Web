# IndexedDB Avancé

Maîtrisez les **techniques avancées** d'IndexedDB : cursors avancés, compound keys, migrations, synchronisation et optimisations.

---

## Index composés (Compound Keys)

### Créer un index composé

```javascript
const request = indexedDB.open('ECommerceDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  const ordersStore = db.createObjectStore('orders', {
    keyPath: 'id',
    autoIncrement: true
  });
  
  // Index composé : [userId, status]
  ordersStore.createIndex('userStatus', ['userId', 'status'], { unique: false });
  
  // Index composé : [category, price]
  ordersStore.createIndex('categoryPrice', ['category', 'price'], { unique: false });
};
```

### Utiliser un index composé

```javascript
async function getOrdersByUserAndStatus(userId, status) {
  const tx = db.transaction(['orders'], 'readonly');
  const store = tx.objectStore('orders');
  const index = store.index('userStatus');
  
  const range = IDBKeyRange.only([userId, status]);
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(range);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Utilisation
const userPendingOrders = await getOrdersByUserAndStatus(123, 'pending');
```

---

## Cursors avancés

### Direction du cursor

```javascript
async function getUsersSortedByAge(ascending = true) {
  const tx = db.transaction(['users'], 'readonly');
  const store = tx.objectStore('users');
  const index = store.index('age');
  
  const direction = ascending ? 'next' : 'prev';
  const results = [];
  
  return new Promise((resolve, reject) => {
    const request = index.openCursor(null, direction);
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Utilisation
const usersAsc = await getUsersSortedByAge(true);   // Plus jeune → plus vieux
const usersDesc = await getUsersSortedByAge(false); // Plus vieux → plus jeune
```

### Cursors uniques (sans doublons)

```javascript
async function getUniqueCategories() {
  const tx = db.transaction(['products'], 'readonly');
  const store = tx.objectStore('products');
  const index = store.index('category');
  
  const categories = [];
  
  return new Promise((resolve, reject) => {
    // 'nextunique' saute les doublons
    const request = index.openKeyCursor(null, 'nextunique');
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        categories.push(cursor.key);
        cursor.continue();
      } else {
        resolve(categories);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Résultat : ['Electronics', 'Clothing', 'Food'] (sans doublons)
```

### Advance (sauter des éléments)

```javascript
async function getEveryNthUser(n) {
  const tx = db.transaction(['users'], 'readonly');
  const store = tx.objectStore('users');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    const request = store.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        results.push(cursor.value);
        cursor.advance(n); // Sauter n éléments
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Utilisation : récupérer 1 utilisateur sur 5
const users = await getEveryNthUser(5);
```

---

## Migrations de schéma

### Gérer les versions

```javascript
const DB_NAME = 'MyApp';
const DB_VERSION = 3; // Nouvelle version

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const oldVersion = event.oldVersion;
  const transaction = event.target.transaction;
  
  console.log(`Migration de v${oldVersion} vers v${DB_VERSION}`);
  
  // Migration v0 → v1
  if (oldVersion < 1) {
    const usersStore = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true
    });
    
    usersStore.createIndex('email', 'email', { unique: true });
  }
  
  // Migration v1 → v2
  if (oldVersion < 2) {
    const usersStore = transaction.objectStore('users');
    
    // Ajouter un index
    usersStore.createIndex('age', 'age', { unique: false });
    
    // Créer un nouveau store
    const postsStore = db.createObjectStore('posts', {
      keyPath: 'id',
      autoIncrement: true
    });
    
    postsStore.createIndex('userId', 'userId', { unique: false });
  }
  
  // Migration v2 → v3
  if (oldVersion < 3) {
    // Supprimer un ancien store
    if (db.objectStoreNames.contains('oldStore')) {
      db.deleteObjectStore('oldStore');
    }
    
    // Migrer les données
    const usersStore = transaction.objectStore('users');
    const request = usersStore.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        const user = cursor.value;
        
        // Ajouter un nouveau champ
        if (!user.createdAt) {
          user.createdAt = new Date().toISOString();
          cursor.update(user);
        }
        
        cursor.continue();
      }
    };
  }
};
```

---

## Transactions complexes

### Transaction multi-stores

```javascript
async function transferData(fromUserId, toUserId, amount) {
  const tx = db.transaction(['users', 'transactions'], 'readwrite');
  const usersStore = tx.objectStore('users');
  const transactionsStore = tx.objectStore('transactions');
  
  try {
    // 1. Récupérer les utilisateurs
    const fromUser = await new Promise((resolve, reject) => {
      const req = usersStore.get(fromUserId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    
    const toUser = await new Promise((resolve, reject) => {
      const req = usersStore.get(toUserId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    
    // 2. Vérifier le solde
    if (fromUser.balance < amount) {
      throw new Error('Solde insuffisant');
    }
    
    // 3. Mettre à jour les soldes
    fromUser.balance -= amount;
    toUser.balance += amount;
    
    await new Promise((resolve, reject) => {
      const req = usersStore.put(fromUser);
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    
    await new Promise((resolve, reject) => {
      const req = usersStore.put(toUser);
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    
    // 4. Créer une transaction
    await new Promise((resolve, reject) => {
      const req = transactionsStore.add({
        fromUserId,
        toUserId,
        amount,
        timestamp: new Date().toISOString()
      });
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    
    // 5. Commit
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
      tx.onabort = reject;
    });
    
    console.log('✅ Transfert réussi');
    return true;
  } catch (error) {
    console.error('❌ Transfert échoué:', error);
    tx.abort(); // Rollback
    return false;
  }
}
```

---

## Synchronisation avec le serveur

```javascript
class SyncManager {
  constructor(db) {
    this.db = db;
    this.syncInProgress = false;
  }
  
  async syncToServer() {
    if (this.syncInProgress) {
      console.log('⏳ Sync déjà en cours');
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      // 1. Récupérer les données modifiées localement
      const pendingChanges = await this.getPendingChanges();
      
      if (pendingChanges.length === 0) {
        console.log('✅ Aucune modification à synchroniser');
        return;
      }
      
      // 2. Envoyer au serveur
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: pendingChanges })
      });
      
      const result = await response.json();
      
      // 3. Mettre à jour avec les données du serveur
      await this.applyServerChanges(result.serverData);
      
      // 4. Marquer comme synchronisé
      await this.markAsSynced(pendingChanges);
      
      console.log('✅ Synchronisation réussie');
    } catch (error) {
      console.error('❌ Erreur de synchronisation:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  async getPendingChanges() {
    const tx = this.db.transaction(['users'], 'readonly');
    const store = tx.objectStore('users');
    
    const changes = [];
    
    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          const user = cursor.value;
          
          if (user._pendingSync) {
            changes.push({
              id: user.id,
              data: user,
              action: user._action || 'update'
            });
          }
          
          cursor.continue();
        } else {
          resolve(changes);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async applyServerChanges(serverData) {
    const tx = this.db.transaction(['users'], 'readwrite');
    const store = tx.objectStore('users');
    
    for (const item of serverData) {
      await new Promise((resolve, reject) => {
        const req = store.put(item);
        req.onsuccess = resolve;
        req.onerror = reject;
      });
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  }
  
  async markAsSynced(changes) {
    const tx = this.db.transaction(['users'], 'readwrite');
    const store = tx.objectStore('users');
    
    for (const change of changes) {
      const user = await new Promise((resolve, reject) => {
        const req = store.get(change.id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      
      if (user) {
        delete user._pendingSync;
        delete user._action;
        
        await new Promise((resolve, reject) => {
          const req = store.put(user);
          req.onsuccess = resolve;
          req.onerror = reject;
        });
      }
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  }
  
  // Synchronisation automatique toutes les 5 minutes
  startAutoSync(intervalMs = 5 * 60 * 1000) {
    setInterval(() => {
      if (navigator.onLine) {
        this.syncToServer();
      }
    }, intervalMs);
  }
}

// Utilisation
const syncManager = new SyncManager(db);
syncManager.startAutoSync();

// Marquer un utilisateur comme modifié
async function updateUser(id, data) {
  const tx = db.transaction(['users'], 'readwrite');
  const store = tx.objectStore('users');
  
  const user = await new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  
  Object.assign(user, data);
  user._pendingSync = true;
  user._action = 'update';
  user._modifiedAt = new Date().toISOString();
  
  await new Promise((resolve, reject) => {
    const req = store.put(user);
    req.onsuccess = resolve;
    req.onerror = reject;
  });
}
```

---

## Optimisations

### Batch operations

```javascript
async function addManyOptimized(storeName, items, batchSize = 100) {
  const batches = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const item of batch) {
      store.add(item);
    }
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  }
  
  console.log(`✅ ${items.length} éléments ajoutés`);
}

// Ajouter 10 000 éléments rapidement
const items = Array.from({ length: 10000 }, (_, i) => ({
  name: `User ${i}`,
  email: `user${i}@example.com`
}));

await addManyOptimized('users', items);
```

### Cache en mémoire

```javascript
class CachedDatabase {
  constructor(db) {
    this.db = db;
    this.cache = new Map();
  }
  
  async get(storeName, key) {
    const cacheKey = `${storeName}:${key}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('✅ Cache hit');
      return this.cache.get(cacheKey);
    }
    
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    const result = await new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  async put(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    const key = await new Promise((resolve, reject) => {
      const req = store.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    
    // Mettre à jour le cache
    const cacheKey = `${storeName}:${key}`;
    this.cache.set(cacheKey, data);
    
    return key;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

---

## Export / Import

```javascript
class DatabaseExporter {
  constructor(db) {
    this.db = db;
  }
  
  async exportToJSON() {
    const data = {};
    
    for (const storeName of this.db.objectStoreNames) {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      
      data[storeName] = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    
    return JSON.stringify(data, null, 2);
  }
  
  async importFromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    
    for (const [storeName, items] of Object.entries(data)) {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      
      // Vider le store
      await new Promise((resolve, reject) => {
        const req = store.clear();
        req.onsuccess = resolve;
        req.onerror = reject;
      });
      
      // Ajouter les données
      for (const item of items) {
        await new Promise((resolve, reject) => {
          const req = store.add(item);
          req.onsuccess = resolve;
          req.onerror = reject;
        });
      }
      
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    }
    
    console.log('✅ Import terminé');
  }
  
  async downloadBackup() {
    const json = await this.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  async loadBackup(file) {
    const text = await file.text();
    await this.importFromJSON(text);
  }
}

// Utilisation
const exporter = new DatabaseExporter(db);

// Export
await exporter.downloadBackup();

// Import
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  await exporter.loadBackup(file);
});
```

---

## Bonnes pratiques

1. ✅ **Transactions courtes** : Minimiser la durée
2. ✅ **Batch operations** : Grouper les opérations
3. ✅ **Index pertinents** : Créer seulement les index nécessaires
4. ✅ **Gestion d'erreurs** : Try/catch sur toutes les opérations
5. ✅ **Migrations** : Gérer les versions proprement
6. ✅ **Synchronisation** : Background Sync API
7. ✅ **Cache** : Éviter les lectures répétées
8. ✅ **Cleanup** : Supprimer les données anciennes

---

## Exercice final

Créez une **application de blog offline-first** avec :
- Posts, comments, users (3 object stores)
- Index composé `[userId, status]` sur posts
- Synchronisation avec serveur
- Export/Import JSON
- Cache en mémoire
- Migrations de v1 à v2
- Cursors pour pagination

**Bonus** : Service Worker + IndexedDB pour mode offline complet !

---

🎉 **Félicitations** ! Vous maîtrisez IndexedDB ! 🚀

**Prochaine étape** : [Web Vitals](../performance/metriques-optimisation/web-vitals.md) pour la performance !
