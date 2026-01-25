# Introduction aux Bases de Données

Les bases de données sont essentielles pour persister les données de vos applications. Comprenez les différents types de bases de données et quand les utiliser.

---

## Qu'est-ce qu'une Base de Données ?

Une base de données est un système organisé pour stocker, gérer et récupérer des informations de manière efficace et sécurisée.

### Pourquoi utiliser une BDD ?

```javascript
// ❌ Sans base de données : données en mémoire
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Problèmes :
// - Données perdues au redémarrage du serveur
// - Pas de partage entre plusieurs instances
// - Pas de requêtes complexes
// - Pas de transactions
// - Pas de sécurité des données

// ✅ Avec une base de données
const user = await User.findById(1);
// - Persistance garantie
// - Accès concurrent sécurisé
// - Requêtes optimisées
// - Intégrité des données
```

---

## Types de Bases de Données

### Bases de données relationnelles (SQL)

Les données sont organisées en **tables** avec des **relations** entre elles.

```
┌─────────────────────────────────────────────────────────┐
│                    TABLE: users                          │
├────────┬──────────┬─────────────────────┬───────────────┤
│   id   │   name   │       email         │  created_at   │
├────────┼──────────┼─────────────────────┼───────────────┤
│   1    │  Alice   │  alice@example.com  │  2024-01-15   │
│   2    │  Bob     │  bob@example.com    │  2024-01-16   │
└────────┴──────────┴─────────────────────┴───────────────┘
         │
         │ user_id (clé étrangère)
         ▼
┌─────────────────────────────────────────────────────────┐
│                    TABLE: posts                          │
├────────┬──────────┬─────────────────────┬───────────────┤
│   id   │ user_id  │       title         │    content    │
├────────┼──────────┼─────────────────────┼───────────────┤
│   1    │    1     │  Mon premier post   │   Contenu...  │
│   2    │    1     │  Deuxième post      │   Contenu...  │
│   3    │    2     │  Hello World        │   Contenu...  │
└────────┴──────────┴─────────────────────┴───────────────┘
```

**Exemples** : PostgreSQL, MySQL, SQLite, MariaDB, SQL Server

**Caractéristiques** :
- Schéma fixe et structuré
- Relations entre tables (clés étrangères)
- Langage SQL standardisé
- Transactions ACID
- Intégrité référentielle

```sql
-- Exemple de requête SQL
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON users.id = posts.user_id
WHERE users.id = 1;
```

### Bases de données NoSQL

Les données sont stockées dans des formats plus flexibles.

#### Document (MongoDB, CouchDB)

```javascript
// Collection: users
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice",
  "email": "alice@example.com",
  "profile": {
    "age": 28,
    "city": "Paris"
  },
  "posts": [
    { "title": "Mon premier post", "content": "..." },
    { "title": "Deuxième post", "content": "..." }
  ]
}
```

#### Clé-Valeur (Redis, DynamoDB)

```
user:1 → { "name": "Alice", "email": "alice@example.com" }
user:2 → { "name": "Bob", "email": "bob@example.com" }
session:abc123 → { "userId": 1, "expires": "2024-12-31" }
```

#### Colonnes (Cassandra, HBase)

```
Row Key: user_1
├── profile:name → "Alice"
├── profile:email → "alice@example.com"
├── stats:posts_count → 42
└── stats:followers → 150
```

#### Graphe (Neo4j, ArangoDB)

```
(Alice)-[:FOLLOWS]->(Bob)
(Alice)-[:LIKES]->(Post1)
(Bob)-[:WROTE]->(Post1)
```

---

## SQL vs NoSQL : Comparaison

| Critère | SQL | NoSQL (Document) |
|---------|-----|------------------|
| **Schéma** | Fixe, défini à l'avance | Flexible, dynamique |
| **Relations** | Clés étrangères, JOIN | Imbrication, références |
| **Scalabilité** | Verticale (plus de puissance) | Horizontale (plus de serveurs) |
| **Transactions** | ACID complet | Éventuellement consistant |
| **Requêtes** | SQL standardisé | API spécifique |
| **Cas d'usage** | Données structurées, relations complexes | Données variables, haute performance |

### Quand utiliser SQL ?

- ✅ Relations complexes entre données
- ✅ Transactions critiques (banque, e-commerce)
- ✅ Données très structurées
- ✅ Reporting et analytics
- ✅ Intégrité des données primordiale

```javascript
// Exemple : système bancaire
// Transfert d'argent = transaction ACID obligatoire
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
// Soit les deux opérations réussissent, soit aucune
```

### Quand utiliser NoSQL ?

- ✅ Données à structure variable
- ✅ Grande quantité de données
- ✅ Haute disponibilité requise
- ✅ Développement rapide / prototypage
- ✅ Données temps réel (IoT, logs)

```javascript
// Exemple : profils utilisateurs avec champs optionnels
{
  "name": "Alice",
  "email": "alice@example.com",
  // Champs optionnels selon le type d'utilisateur
  "company": "TechCorp",        // Pro uniquement
  "githubProfile": "alice-dev", // Dev uniquement
  "portfolio": ["url1", "url2"] // Freelance uniquement
}
```

---

## ACID vs BASE

### ACID (SQL)

| Propriété | Description |
|-----------|-------------|
| **A**tomicity | Transaction complète ou annulée entièrement |
| **C**onsistency | Données toujours dans un état valide |
| **I**solation | Transactions indépendantes les unes des autres |
| **D**urability | Données persistées même après crash |

### BASE (NoSQL)

| Propriété | Description |
|-----------|-------------|
| **B**asically **A**vailable | Système toujours disponible |
| **S**oft state | L'état peut changer sans intervention |
| **E**ventual consistency | Cohérence atteinte à terme |

---

## ORM et ODM

Les ORMs (Object-Relational Mapping) et ODMs (Object-Document Mapping) permettent d'interagir avec la base de données en utilisant des objets JavaScript.

### ORM pour SQL

```javascript
// Avec Prisma (ORM moderne)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});

// Avec Sequelize
const user = await User.findByPk(1, {
  include: [Post]
});

// Équivalent SQL généré
// SELECT * FROM users WHERE id = 1;
// SELECT * FROM posts WHERE user_id = 1;
```

### ODM pour MongoDB

```javascript
// Avec Mongoose
const user = await User.findById('507f1f77bcf86cd799439011')
  .populate('posts');

// Avec le driver natif MongoDB
const user = await db.collection('users').findOne({ _id: objectId });
```

### Avantages des ORM/ODM

```javascript
// ❌ Sans ORM : requêtes SQL brutes
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true]
);
const user = result.rows[0];

// ✅ Avec ORM : code plus lisible et sécurisé
const user = await User.findOne({
  where: { email, active: true }
});

// Avantages :
// - Protection contre les injections SQL
// - Validation automatique
// - Migrations de schéma
// - Relations simplifiées
// - Portabilité entre BDD
```

---

## Bases de Données Populaires avec Node.js

### MongoDB (NoSQL - Document)

```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

// Connexion
await mongoose.connect('mongodb://localhost:27017/myapp');

// Définition du schéma
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
```

### PostgreSQL (SQL)

```bash
npm install pg
# ou avec Prisma
npm install prisma @prisma/client
```

```javascript
// Driver natif
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const result = await pool.query('SELECT * FROM users WHERE id = $1', [1]);

// Avec Prisma
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

### SQLite (SQL - Fichier local)

```bash
npm install better-sqlite3
```

```javascript
const Database = require('better-sqlite3');
const db = new Database('app.db');

const user = db.prepare('SELECT * FROM users WHERE id = ?').get(1);
```

### Redis (Clé-Valeur - Cache)

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

await client.set('user:1', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(await client.get('user:1'));
```

---

## Choix de la Base de Données

### Arbre de décision

```
Quel type de données ?
│
├─► Données très structurées, relations complexes
│   └─► SQL (PostgreSQL, MySQL)
│
├─► Données flexibles, documents imbriqués
│   └─► MongoDB
│
├─► Cache, sessions, données temporaires
│   └─► Redis
│
├─► Prototype rapide, fichier local
│   └─► SQLite
│
└─► Relations de type graphe (réseaux sociaux)
    └─► Neo4j
```

### Recommandations par projet

| Projet | BDD recommandée | Justification |
|--------|-----------------|---------------|
| Blog simple | SQLite ou MongoDB | Simplicité |
| E-commerce | PostgreSQL | Transactions, intégrité |
| Réseau social | MongoDB + Neo4j | Flexibilité + relations |
| Chat temps réel | MongoDB + Redis | Performance |
| Application bancaire | PostgreSQL | ACID obligatoire |
| IoT / Logs | MongoDB ou Cassandra | Volume, écriture rapide |

---

## Bonnes Pratiques

### 1. Variables d'environnement

```env
# .env
DATABASE_URL=mongodb://localhost:27017/myapp
# ou
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
```

```javascript
// Ne jamais hardcoder les credentials
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
```

### 2. Gestion des connexions

```javascript
// Connexion unique réutilisée
let connection = null;

async function getConnection() {
  if (!connection) {
    connection = await mongoose.connect(process.env.DATABASE_URL);
  }
  return connection;
}
```

### 3. Gestion des erreurs

```javascript
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  });

// Gestion de la déconnexion
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Déconnecté de MongoDB');
});
```

### 4. Indexation

```javascript
// MongoDB
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 'text' }); // Recherche full-text

// SQL
CREATE INDEX idx_users_email ON users(email);
```

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| SQL | Bases relationnelles avec schéma fixe |
| NoSQL | Bases flexibles (document, clé-valeur, graphe) |
| ACID | Garanties transactionnelles fortes |
| ORM/ODM | Abstraction objet pour la BDD |
| MongoDB | NoSQL document populaire |
| PostgreSQL | SQL robuste et complet |
| Redis | Cache et données temporaires |

---

## Ressources

- 📖 [MongoDB University](https://university.mongodb.com/)
- 📖 [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- 📖 [Prisma Documentation](https://www.prisma.io/docs)
- 📖 [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
