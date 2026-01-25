# MongoDB - Les Bases

MongoDB est une base de données NoSQL orientée documents. Apprenez à l'utiliser avec Node.js via Mongoose, l'ODM le plus populaire.

---

## Ce que vous allez apprendre

- Comprendre la structure document/collection de MongoDB
- Installer et configurer MongoDB (local ou Atlas)
- Définir des schémas avec Mongoose
- Créer des modèles et effectuer des opérations CRUD

## Prérequis

- [Node.js - Express Base](../express/express-base.md)
- [JavaScript - Async/Await](../../javascript/fonctions/concepts-avances.md)

---

## Qu'est-ce que MongoDB ?

MongoDB stocke les données sous forme de **documents JSON** (techniquement BSON) dans des **collections**.

### Concepts clés

| SQL | MongoDB | Description |
|-----|---------|-------------|
| Database | Database | Conteneur de collections |
| Table | Collection | Groupe de documents |
| Row | Document | Enregistrement individuel |
| Column | Field | Attribut d'un document |
| Primary Key | `_id` | Identifiant unique |
| JOIN | `$lookup` / Populate | Références entre documents |

### Structure d'un document

```javascript
// Document MongoDB
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),  // ID unique auto-généré
  "name": "Alice",
  "email": "alice@example.com",
  "age": 28,
  "address": {                    // Document imbriqué
    "street": "123 Rue de Paris",
    "city": "Paris",
    "zipCode": "75001"
  },
  "hobbies": ["lecture", "voyage", "code"],  // Tableau
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## Installation

### MongoDB local

```bash
# Windows (avec Chocolatey)
choco install mongodb

# Mac (avec Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Démarrer le service
brew services start mongodb-community
```

### MongoDB Atlas (Cloud - Recommandé)

1. Créez un compte sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit (M0)
3. Configurez l'accès réseau (0.0.0.0/0 pour dev)
4. Créez un utilisateur
5. Récupérez la connection string

```
mongodb+srv://username:password@cluster.mongodb.net/myapp
```

### Installation de Mongoose

```bash
npm install mongoose
```

---

## Connexion à MongoDB

### Configuration de base

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Options recommandées (par défaut dans Mongoose 6+)
    });
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connexion à la BDD
connectDB();

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
```

```env
# .env
MONGODB_URI=mongodb://localhost:27017/myapp
# ou pour Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/myapp
```

### Gestion des événements de connexion

```javascript
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connecté');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose déconnecté');
});

// Fermeture propre
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connexion fermée');
  process.exit(0);
});
```

---

## Schémas et Modèles

### Définir un schéma

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Champ simple
  name: String,
  
  // Champ avec options
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  
  // Nombre avec contraintes
  age: {
    type: Number,
    min: [0, 'L\'âge doit être positif'],
    max: [150, 'Âge invalide']
  },
  
  // Énumération
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  
  // Booléen avec défaut
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Document imbriqué
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: { type: String, default: 'France' }
  },
  
  // Tableau de strings
  hobbies: [String],
  
  // Tableau de documents
  socialLinks: [{
    platform: String,
    url: String
  }],
  
  // Référence à un autre modèle
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  // Options du schéma
  timestamps: true,  // Ajoute createdAt et updatedAt
  versionKey: false  // Désactive __v
});

// Créer le modèle
const User = mongoose.model('User', userSchema);

module.exports = User;
```

### Types de données disponibles

| Type | Description | Exemple |
|------|-------------|---------|
| `String` | Chaîne de caractères | `"Alice"` |
| `Number` | Nombre (int ou float) | `42`, `3.14` |
| `Boolean` | Booléen | `true`, `false` |
| `Date` | Date | `new Date()` |
| `Buffer` | Données binaires | Images, fichiers |
| `ObjectId` | ID MongoDB | `ObjectId("...")` |
| `Array` | Tableau | `[1, 2, 3]` |
| `Mixed` | Tout type | `Schema.Types.Mixed` |
| `Map` | Clé-valeur | `new Map()` |

### Options de validation

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Maximum 10 tags autorisés'
    }
  }
});
```

---

## Méthodes du Schéma

### Méthodes d'instance

```javascript
// Méthode disponible sur chaque document
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.isAdult = function() {
  return this.age >= 18;
};

// Utilisation
const user = await User.findById(id);
console.log(user.getFullName()); // "Alice Dupont"
console.log(user.isAdult());     // true
```

### Méthodes statiques

```javascript
// Méthode disponible sur le modèle
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findAdmins = function() {
  return this.find({ role: 'admin' });
};

// Utilisation
const user = await User.findByEmail('alice@example.com');
const admins = await User.findAdmins();
```

### Virtuals

```javascript
// Propriétés calculées (non stockées en BDD)
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('fullName').set(function(name) {
  const [firstName, lastName] = name.split(' ');
  this.firstName = firstName;
  this.lastName = lastName;
});

// Inclure les virtuals dans JSON
userSchema.set('toJSON', { virtuals: true });

// Utilisation
const user = await User.findById(id);
console.log(user.fullName); // "Alice Dupont"
```

---

## Middleware (Hooks)

### Pre-save

```javascript
// Exécuté AVANT la sauvegarde
userSchema.pre('save', async function(next) {
  // Hash du mot de passe avant sauvegarde
  if (this.isModified('password')) {
    const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Mise à jour de la date de modification
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
```

### Post-save

```javascript
// Exécuté APRÈS la sauvegarde
userSchema.post('save', function(doc) {
  console.log(`Utilisateur ${doc.name} sauvegardé`);
  // Envoyer un email de bienvenue, etc.
});
```

### Middleware de requête

```javascript
// Exécuté pour find, findOne, etc.
userSchema.pre('find', function() {
  // Exclure automatiquement les utilisateurs supprimés
  this.where({ isDeleted: { $ne: true } });
});

userSchema.pre('findOne', function() {
  this.where({ isDeleted: { $ne: true } });
});
```

---

## Indexation

### Créer des index

```javascript
// Index simple
userSchema.index({ email: 1 });

// Index unique
userSchema.index({ username: 1 }, { unique: true });

// Index composé
userSchema.index({ lastName: 1, firstName: 1 });

// Index de recherche textuelle
userSchema.index({ name: 'text', bio: 'text' });

// Index avec TTL (expiration automatique)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

### Pourquoi indexer ?

```javascript
// Sans index : MongoDB scanne TOUS les documents
// Avec index : recherche optimisée (comme un index de livre)

// Vérifier les index utilisés
const explanation = await User.find({ email: 'test@example.com' }).explain();
console.log(explanation.queryPlanner.winningPlan);
```

---

## Exemple Complet

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    minlength: 2
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 8,
    select: false  // Non retourné par défaut dans les requêtes
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index
userSchema.index({ email: 1 });
userSchema.index({ lastName: 1, firstName: 1 });

// Middleware - Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode d'instance - Vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode statique - Trouver par email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Inclure virtuals dans JSON
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Connexion échouée | URL incorrecte ou MongoDB arrêté | Vérifier MONGO_URI et le service |
| Validation échouée | Champ requis manquant | Vérifier les données envoyées |
| Cast error | ID invalide | Valider le format ObjectId |
| Duplicate key | Email/username déjà existant | Gérer l'erreur code 11000 |

---

## Quiz de vérification

1. Quel est l'équivalent d'une table SQL en MongoDB ?
   - A) Document
   - B) Collection ✅
   - C) Schema

2. Quel package est utilisé pour interagir avec MongoDB en Node.js ?
   - A) mongodb-driver
   - B) mongoose ✅
   - C) mongo-client

3. Quelle méthode trouve un document par ID ?
   - A) `find(id)`
   - B) `findById(id)` ✅
   - C) `get(id)`

4. Comment définir un champ requis dans un schéma ?
   - A) `{ type: String, required: true }` ✅
   - B) `{ type: String, mandatory: true }`
   - C) `{ type: String, notNull: true }`

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| Document | Enregistrement JSON dans MongoDB |
| Collection | Groupe de documents (≈ table SQL) |
| Schema | Structure et validation des documents |
| Model | Interface pour interagir avec la collection |
| Virtual | Propriété calculée non stockée |
| Middleware | Hooks pre/post pour les opérations |
| Index | Optimisation des requêtes |

---

## Ressources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (GUI)

---

## Prochaine étape

Découvrez les [Requêtes et CRUD avancés](./queries-crud.md) pour maîtriser les opérations MongoDB.
