# SQL et PostgreSQL

Découvrez les bases de données relationnelles comme alternative à MongoDB.

---

## Ce que vous allez apprendre

- Comprendre le modèle relationnel
- Écrire des requêtes SQL
- Utiliser PostgreSQL avec Node.js
- Comparer SQL vs NoSQL

## ⚠️ Prérequis

- [Introduction aux BDD](./introduction-bdd)
- [Express.js - Base](../express/express-base)

---

## SQL vs NoSQL (récap)

### Quand choisir SQL ?

| SQL (PostgreSQL) | NoSQL (MongoDB) |
|------------------|-----------------|
| Relations complexes | Documents flexibles |
| Transactions ACID | Scalabilité horizontale |
| Schéma strict | Schéma flexible |
| Requêtes complexes (JOIN) | Requêtes simples |
| E-commerce, finance | CMS, temps réel |

### Exemple concret

```
E-Commerce : SQL ✅
─────────────────────────────────────────
Users ←──── Orders ────→ Products
                ↓
           OrderItems

Chaque commande référence un user ET plusieurs produits.
Les transactions garantissent la cohérence du stock.
```

```
Blog : NoSQL ✅
─────────────────────────────────────────
{
  title: "Mon article",
  content: "...",
  author: { name: "John", avatar: "..." },
  comments: [
    { user: "Jane", text: "Super !" }
  ]
}

Tout est dans un seul document.
Pas besoin de JOIN.
```

---

## PostgreSQL - Installation

### Local

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Télécharger depuis postgresql.org
```

### Docker (recommandé)

```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d postgres:16
```

### Cloud (production)

- **Render** : PostgreSQL gratuit
- **Railway** : PostgreSQL inclus
- **Supabase** : PostgreSQL + API REST gratuite
- **Neon** : PostgreSQL serverless

---

## Concepts SQL

### Tables et colonnes

```sql
-- Créer une table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,          -- Auto-increment
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer une table avec relations
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Types de données courants

| Type | Description | Exemple |
|------|-------------|---------|
| `SERIAL` | Auto-increment | ID |
| `INTEGER` | Entier | stock, quantity |
| `DECIMAL(10,2)` | Décimal précis | price |
| `VARCHAR(n)` | Texte limité | email, name |
| `TEXT` | Texte illimité | description |
| `BOOLEAN` | Vrai/Faux | is_active |
| `TIMESTAMP` | Date + heure | created_at |
| `UUID` | Identifiant unique | id alternatif |
| `JSONB` | JSON binaire | metadata |

### Relations

```sql
-- One-to-Many : Un user a plusieurs orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-Many : Orders <-> Products (via table de jonction)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

---

## CRUD SQL

### CREATE (INSERT)

```sql
-- Insérer un enregistrement
INSERT INTO users (email, password, name)
VALUES ('john@example.com', 'hashed_password', 'John Doe');

-- Insérer et retourner l'ID
INSERT INTO users (email, password, name)
VALUES ('jane@example.com', 'hashed_password', 'Jane Doe')
RETURNING id, email, name;

-- Insérer plusieurs
INSERT INTO products (name, price, stock) VALUES
  ('Laptop', 999.99, 10),
  ('Phone', 699.99, 25),
  ('Tablet', 499.99, 15);
```

### READ (SELECT)

```sql
-- Sélectionner tout
SELECT * FROM users;

-- Sélectionner des colonnes
SELECT id, email, name FROM users;

-- Filtrer
SELECT * FROM products WHERE price > 500;
SELECT * FROM products WHERE stock > 0 AND category_id = 1;
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Trier
SELECT * FROM products ORDER BY price DESC;
SELECT * FROM products ORDER BY name ASC, price DESC;

-- Limiter (pagination)
SELECT * FROM products LIMIT 10 OFFSET 20;

-- Compter
SELECT COUNT(*) FROM products WHERE stock > 0;

-- Agréger
SELECT category_id, AVG(price) as avg_price
FROM products
GROUP BY category_id;
```

### UPDATE

```sql
-- Mettre à jour
UPDATE users 
SET name = 'John Smith', role = 'admin'
WHERE id = 1;

-- Mettre à jour et retourner
UPDATE products 
SET stock = stock - 1 
WHERE id = 5
RETURNING *;

-- Mettre à jour plusieurs
UPDATE products
SET price = price * 0.9
WHERE category_id = 2;
```

### DELETE

```sql
-- Supprimer
DELETE FROM users WHERE id = 5;

-- Supprimer avec condition
DELETE FROM products WHERE stock = 0;

-- Supprimer tout (attention !)
DELETE FROM logs WHERE created_at < '2024-01-01';
```

---

## JOINs (Relations)

### Types de JOIN

```sql
-- INNER JOIN : Seulement les correspondances
SELECT orders.id, users.name, orders.total
FROM orders
INNER JOIN users ON orders.user_id = users.id;

-- LEFT JOIN : Tous les orders, même sans user
SELECT orders.id, users.name
FROM orders
LEFT JOIN users ON orders.user_id = users.id;

-- Exemple complet : Commande avec détails
SELECT 
  o.id as order_id,
  u.name as customer,
  p.name as product,
  oi.quantity,
  oi.price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE o.id = 1;
```

---

## Node.js avec postgresql

### Installation

```bash
npm install postgres
```

### Connexion

```javascript
// config/database.js
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);

(async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connection OK", result[0].now);
  } catch (err) {
    console.error("Connection NOK", err);
  }
})()

module.exports = sql;
```

### Requêtes basiques

Les requêtes doivent être écrites dans un `template literal` (délimité par un backtick (`) et non les quotes habituelles (' et ")).

```javascript
const sql = require('../config/database');

// SELECT
async function allUsers(user) {
  try {
    const result = await sql`SELECT * FROM users`;
    return result;
  } catch (err) {
    console.error("Error fetching users from database:", err);
  }
}

// INSERT
async function createUser(user) {
  try {
    const result = await sql`INSERT INTO users (email, password, name) VALUES (${user.email}, ${user.password}, ${user.name}) RETURNING *`;
    return result[0];
  } catch (err) {
    console.error("Error creating user in database:", err);
  }
}

// UPDATE
async function updateUser(req) {
  try {
    const result = await sql(`UPDATE users SET password = ${user.password} WHERE id = ${user.id} RETURNING *`);
    if (result.length === 0) {
      return console.error("Not found");
    }
    return result[0];
  } catch (err) {
    console.error("Error updating user in database:", err);
  }
}

// DELETE
async function deleteUser(id) {
  try {
    const result = await sql(`DELETE FROM users WHERE id = ${id} RETURNING *`); // RETURNING est nécessaire pour vérifier que l'enregistrement a bien été supprimé.
    if (result.length === 0) {
      console.error("Not found");
    }
    return result[0]
  } catch (err) {
    console.error("Error deleting user from database:", err);
  }
}
```

---

## Transactions

```javascript
// Pour les opérations qui doivent réussir ensemble
const [user, account] = await sql.begin(async sql => {
  const [user] = await sql`
    insert into users (
      name
    ) values (
      'Murray'
    )
    returning *
  `

  const [account] = await sql`
    insert into accounts (
      user_id
    ) values (
      ${ user.user_id }
    )
    returning *
  `

  return [user, account]
})
```

---

## Prisma (ORM moderne)

### Installation

```bash
npm install prisma @prisma/client
npx prisma init
```

### Schéma

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("user")
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id         Int         @id @default(autoincrement())
  name       String
  price      Decimal     @db.Decimal(10, 2)
  stock      Int         @default(0)
  orderItems OrderItem[]
  createdAt  DateTime    @default(now())
}

model Order {
  id        Int         @id @default(autoincrement())
  user      User        @relation(fields: [userId], references: [id])
  userId    Int
  total     Decimal     @db.Decimal(10, 2)
  status    String      @default("pending")
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}
```

### Migrations

```bash
# Créer la migration
npx prisma migrate dev --name init

# Appliquer en production
npx prisma migrate deploy
```

### Utilisation

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    password: 'hashed',
    name: 'John'
  }
});

// READ
const users = await prisma.user.findMany({
  where: { role: 'user' },
  orderBy: { createdAt: 'desc' },
  take: 10
});

// READ avec relations
const orders = await prisma.order.findMany({
  include: {
    user: true,
    items: {
      include: { product: true }
    }
  }
});

// UPDATE
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'John Smith' }
});

// DELETE
await prisma.user.delete({
  where: { id: 1 }
});

// Transaction
const [order, ...updates] = await prisma.$transaction([
  prisma.order.create({ data: { userId: 1, total: 100 } }),
  prisma.product.update({ where: { id: 1 }, data: { stock: { decrement: 1 } } })
]);
```

---

## Migration de MongoDB vers PostgreSQL

### Équivalences

| MongoDB | PostgreSQL |
|---------|------------|
| Collection | Table |
| Document | Row |
| Field | Column |
| `_id` (ObjectId) | `id` (SERIAL) |
| Embedded document | Table liée (JOIN) |
| `find()` | `SELECT` |
| `insertOne()` | `INSERT` |
| `updateOne()` | `UPDATE` |
| `deleteOne()` | `DELETE` |

### Exemple de migration

```javascript
// MongoDB
const user = await User.findOne({ email }).populate('orders');

// PostgreSQL (Prisma)
const user = await prisma.user.findUnique({
  where: { email },
  include: { orders: true }
});

// PostgreSQL (pg)
const { rows } = await pool.query(`
  SELECT u.*, json_agg(o.*) as orders
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  WHERE u.email = $1
  GROUP BY u.id
`, [email]);
```

---

## ❌ Erreurs Courantes

### 1. Oublier les index

```sql
-- ❌ Requête lente sur grande table
SELECT * FROM products WHERE category_id = 5;

-- ✅ Ajouter un index
CREATE INDEX idx_products_category ON products(category_id);
```

### 2. N+1 queries

```javascript
// ❌ N+1 : 1 requête + N requêtes pour les relations
const orders = await pool.query('SELECT * FROM orders');
for (const order of orders.rows) {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
}

// ✅ Un seul JOIN
const { rows } = await pool.query(`
  SELECT o.*, u.name as user_name
  FROM orders o
  JOIN users u ON o.user_id = u.id
`);
```

---

## Quiz Rapide

:::quiz
Q: Quel type pour un prix en SQL ?
- [ ] `FLOAT`
- [x] `DECIMAL(10,2)`
- [ ] `INTEGER`

Q: Que fait `RETURNING *` ?
- [ ] Annule la requête
- [x] Retourne les lignes affectées
- [ ] Commit la transaction
:::

---

## Pour aller plus loin

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [Module NPM Postgres](https://www.npmjs.com/package/postgre)

---

## Prochaine étape

Découvrez l'[authentification](../auth/auth-concepts) pour sécuriser votre application.
