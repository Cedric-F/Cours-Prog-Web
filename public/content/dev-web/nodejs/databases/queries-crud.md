# Requêtes & Opérations CRUD

Maîtrisez les opérations CRUD (Create, Read, Update, Delete) avec Mongoose pour manipuler efficacement vos données MongoDB.

---

## Ce que vous allez apprendre

- Créer des documents (create, save, insertMany)
- Lire et filtrer les données (find, findById)
- Mettre à jour (updateOne, findByIdAndUpdate)
- Supprimer (deleteOne, findByIdAndDelete)
- Utiliser populate et aggregation

## Prérequis

- [MongoDB - Les Bases](./mongodb-base.md)
- [Express - API REST](../express/api-rest.md)

---

## Create - Créer des Documents

### Méthode 1 : `new Model()` + `save()`

```javascript
const User = require('./models/User');

// Créer une instance
const user = new User({
  name: 'Alice',
  email: 'alice@example.com',
  age: 28
});

// Sauvegarder en BDD
await user.save();

console.log(user._id);  // ObjectId généré
console.log(user.createdAt);  // Si timestamps: true
```

### Méthode 2 : `Model.create()`

```javascript
// Créer et sauvegarder en une étape
const user = await User.create({
  name: 'Bob',
  email: 'bob@example.com',
  age: 32
});

// Créer plusieurs documents
const users = await User.create([
  { name: 'Charlie', email: 'charlie@example.com' },
  { name: 'Diana', email: 'diana@example.com' }
]);
```

### Méthode 3 : `insertMany()`

```javascript
// Insertion en masse (plus performant)
const users = await User.insertMany([
  { name: 'User1', email: 'user1@example.com' },
  { name: 'User2', email: 'user2@example.com' },
  { name: 'User3', email: 'user3@example.com' }
]);

// Avec options
await User.insertMany(users, { 
  ordered: false  // Continue même si un document échoue
});
```

### Gestion des erreurs de validation

```javascript
try {
  const user = await User.create({
    name: 'A',  // Trop court
    email: 'invalid-email'  // Format invalide
  });
} catch (error) {
  if (error.name === 'ValidationError') {
    // Erreurs de validation Mongoose
    const errors = Object.values(error.errors).map(e => e.message);
    console.log(errors);
    // ['Le nom doit faire au moins 2 caractères', 'Email invalide']
  } else if (error.code === 11000) {
    // Erreur de duplicata (unique)
    console.log('Cet email existe déjà');
  }
}
```

---

## Read - Lire des Documents

### Trouver tous les documents

```javascript
// Tous les utilisateurs
const users = await User.find();

// Avec un filtre
const activeUsers = await User.find({ isActive: true });

// Avec plusieurs conditions
const results = await User.find({
  age: { $gte: 18 },
  role: 'user',
  isActive: true
});
```

### Trouver un document

```javascript
// Par ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Par critère (premier trouvé)
const user = await User.findOne({ email: 'alice@example.com' });

// Vérification
if (!user) {
  throw new Error('Utilisateur non trouvé');
}
```

### Opérateurs de comparaison

```javascript
// $eq : égal (par défaut)
await User.find({ age: 25 });
await User.find({ age: { $eq: 25 } });

// $ne : différent
await User.find({ role: { $ne: 'admin' } });

// $gt, $gte : supérieur, supérieur ou égal
await User.find({ age: { $gt: 18 } });   // > 18
await User.find({ age: { $gte: 18 } });  // >= 18

// $lt, $lte : inférieur, inférieur ou égal
await User.find({ age: { $lt: 65 } });   // < 65
await User.find({ price: { $lte: 100 } });

// Combinaison (range)
await User.find({ age: { $gte: 18, $lte: 65 } });

// $in : dans une liste
await User.find({ role: { $in: ['admin', 'moderator'] } });

// $nin : pas dans une liste
await User.find({ status: { $nin: ['banned', 'suspended'] } });
```

### Opérateurs logiques

```javascript
// $and (implicite avec plusieurs conditions)
await User.find({
  age: { $gte: 18 },
  isActive: true
});

// $and explicite
await User.find({
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
});

// $or : l'une des conditions
await User.find({
  $or: [
    { role: 'admin' },
    { permissions: 'manage_users' }
  ]
});

// $not : négation
await User.find({
  age: { $not: { $lt: 18 } }
});

// Combinaison complexe
await User.find({
  isActive: true,
  $or: [
    { role: 'admin' },
    { age: { $gte: 21 } }
  ]
});
```

### Requêtes sur les tableaux

```javascript
// Contient une valeur
await User.find({ hobbies: 'lecture' });

// Contient toutes les valeurs
await User.find({ hobbies: { $all: ['lecture', 'code'] } });

// Taille du tableau
await User.find({ hobbies: { $size: 3 } });

// Au moins N éléments
await User.find({ 'hobbies.2': { $exists: true } }); // Au moins 3

// Élément à un index
await User.find({ 'hobbies.0': 'sport' }); // Premier = sport

// $elemMatch : conditions sur les éléments
await User.find({
  orders: {
    $elemMatch: {
      status: 'completed',
      total: { $gte: 100 }
    }
  }
});
```

### Requêtes sur les documents imbriqués

```javascript
// Notation pointée
await User.find({ 'address.city': 'Paris' });
await User.find({ 'address.zipCode': { $regex: /^75/ } });

// Plusieurs champs imbriqués
await User.find({
  'address.city': 'Paris',
  'address.country': 'France'
});
```

### Expressions régulières

```javascript
// Recherche insensible à la casse
await User.find({ name: { $regex: /alice/i } });

// Commence par
await User.find({ name: { $regex: /^A/ } });

// Contient
await User.find({ email: { $regex: /@gmail\.com$/ } });

// Avec options séparées
await User.find({ 
  name: { $regex: 'alice', $options: 'i' } 
});
```

### Projection (sélection des champs)

```javascript
// Inclure seulement certains champs
const users = await User.find()
  .select('name email');  // Uniquement name et email

// Exclure des champs
const users = await User.find()
  .select('-password -__v');  // Tout sauf password et __v

// Notation objet
const users = await User.find({}, { 
  name: 1, 
  email: 1, 
  _id: 0  // Exclure _id explicitement
});
```

### Tri

```javascript
// Tri ascendant
const users = await User.find().sort({ name: 1 });

// Tri descendant
const users = await User.find().sort({ createdAt: -1 });

// Tri multiple
const users = await User.find().sort({ role: 1, name: 1 });

// Notation string
const users = await User.find().sort('name -createdAt');
```

### Pagination

```javascript
// Skip et Limit
const page = 2;
const limit = 10;
const skip = (page - 1) * limit;

const users = await User.find()
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

// Fonction de pagination réutilisable
async function paginate(Model, query = {}, options = {}) {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    Model.find(query)
      .skip(skip)
      .limit(limit)
      .sort(options.sort || { createdAt: -1 }),
    Model.countDocuments(query)
  ]);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
}

// Utilisation
const result = await paginate(User, { isActive: true }, { page: 2, limit: 20 });
```

### Comptage

```javascript
// Nombre total de documents
const count = await User.countDocuments();

// Avec filtre
const activeCount = await User.countDocuments({ isActive: true });

// Estimation (plus rapide pour grandes collections)
const estimate = await User.estimatedDocumentCount();
```

---

## Update - Modifier des Documents

### updateOne / updateMany

```javascript
// Modifier un document
await User.updateOne(
  { email: 'alice@example.com' },  // Filtre
  { $set: { isActive: false } }    // Modification
);

// Modifier plusieurs documents
await User.updateMany(
  { role: 'user' },
  { $set: { newsletter: true } }
);
```

### findByIdAndUpdate / findOneAndUpdate

```javascript
// Retourne le document modifié
const user = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { $set: { name: 'Alice Updated' } },
  { 
    new: true,           // Retourner le document APRÈS modification
    runValidators: true  // Exécuter les validations
  }
);

// Avec findOneAndUpdate
const user = await User.findOneAndUpdate(
  { email: 'alice@example.com' },
  { $inc: { loginCount: 1 } },
  { new: true }
);
```

### Opérateurs de mise à jour

```javascript
// $set : définir des valeurs
await User.updateOne({ _id: id }, {
  $set: {
    name: 'Nouveau nom',
    'address.city': 'Lyon'  // Champ imbriqué
  }
});

// $unset : supprimer des champs
await User.updateOne({ _id: id }, {
  $unset: { temporaryField: '' }
});

// $inc : incrémenter
await User.updateOne({ _id: id }, {
  $inc: { 
    loginCount: 1,      // +1
    credits: -10        // -10
  }
});

// $mul : multiplier
await Product.updateOne({ _id: id }, {
  $mul: { price: 1.1 }  // +10%
});

// $min / $max : mettre à jour si plus petit/grand
await User.updateOne({ _id: id }, {
  $min: { lowScore: 50 },   // Met à jour si 50 < actuel
  $max: { highScore: 100 }  // Met à jour si 100 > actuel
});

// $rename : renommer un champ
await User.updateMany({}, {
  $rename: { 'oldField': 'newField' }
});

// $currentDate : date actuelle
await User.updateOne({ _id: id }, {
  $currentDate: { lastModified: true }
});
```

### Opérateurs sur les tableaux

```javascript
// $push : ajouter un élément
await User.updateOne({ _id: id }, {
  $push: { hobbies: 'natation' }
});

// $push avec modificateurs
await User.updateOne({ _id: id }, {
  $push: {
    scores: {
      $each: [85, 90, 95],  // Plusieurs éléments
      $sort: -1,             // Trier (desc)
      $slice: 10             // Garder les 10 premiers
    }
  }
});

// $addToSet : ajouter si n'existe pas
await User.updateOne({ _id: id }, {
  $addToSet: { hobbies: 'lecture' }  // Ignore si déjà présent
});

// $pop : retirer premier ou dernier
await User.updateOne({ _id: id }, {
  $pop: { hobbies: 1 }   // Dernier
  // $pop: { hobbies: -1 }  // Premier
});

// $pull : retirer par valeur
await User.updateOne({ _id: id }, {
  $pull: { hobbies: 'lecture' }
});

// $pull avec condition
await User.updateOne({ _id: id }, {
  $pull: { 
    orders: { status: 'cancelled' }
  }
});

// $pullAll : retirer plusieurs valeurs
await User.updateOne({ _id: id }, {
  $pullAll: { hobbies: ['lecture', 'sport'] }
});

// $ : modifier un élément trouvé
await User.updateOne(
  { _id: id, 'items.productId': productId },
  { $set: { 'items.$.quantity': 5 } }
);
```

### Upsert (Update or Insert)

```javascript
// Créer si n'existe pas
await User.updateOne(
  { email: 'new@example.com' },
  { 
    $set: { name: 'New User' },
    $setOnInsert: { createdAt: new Date(), role: 'user' }
  },
  { upsert: true }
);

// findOneAndUpdate avec upsert
const user = await User.findOneAndUpdate(
  { email: 'new@example.com' },
  { $set: { lastSeen: new Date() } },
  { upsert: true, new: true }
);
```

---

## Delete - Supprimer des Documents

### deleteOne / deleteMany

```javascript
// Supprimer un document
await User.deleteOne({ email: 'alice@example.com' });

// Supprimer plusieurs documents
await User.deleteMany({ isActive: false });

// Supprimer tous les documents
await User.deleteMany({});
```

### findByIdAndDelete / findOneAndDelete

```javascript
// Retourne le document supprimé
const deletedUser = await User.findByIdAndDelete('507f1f77bcf86cd799439011');

if (!deletedUser) {
  throw new Error('Utilisateur non trouvé');
}

console.log(`${deletedUser.name} a été supprimé`);

// Avec findOneAndDelete
const deleted = await User.findOneAndDelete({ 
  email: 'alice@example.com' 
});
```

### Soft Delete (suppression logique)

```javascript
// Schéma avec soft delete
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

// Middleware pour exclure automatiquement
userSchema.pre(/^find/, function() {
  this.where({ isDeleted: { $ne: true } });
});

// Méthode de soft delete
userSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Utilisation
await user.softDelete();

// Restaurer
await User.updateOne(
  { _id: id },
  { $set: { isDeleted: false }, $unset: { deletedAt: '' } }
);
```

---

## Populate (Jointures)

### Relations entre modèles

```javascript
// models/Post.js
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Référence au modèle User
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});
```

### Utiliser populate

```javascript
// Peupler une référence
const post = await Post.findById(id)
  .populate('author');

console.log(post.author.name);  // Accès aux données User

// Sélectionner des champs
const post = await Post.findById(id)
  .populate('author', 'name email');  // Seulement name et email

// Populate multiple
const post = await Post.findById(id)
  .populate('author')
  .populate('comments');

// Populate imbriqué
const post = await Post.findById(id)
  .populate({
    path: 'comments',
    populate: {
      path: 'author',
      select: 'name avatar'
    }
  });

// Populate avec conditions
const post = await Post.findById(id)
  .populate({
    path: 'comments',
    match: { isApproved: true },
    options: { sort: { createdAt: -1 }, limit: 5 }
  });
```

### Virtual populate

```javascript
// Dans le schéma User
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});

// Activer les virtuals dans les requêtes
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

// Utilisation
const user = await User.findById(id).populate('posts');
console.log(user.posts);  // Tous les posts de l'utilisateur
```

---

## Agrégation

```javascript
// Pipeline d'agrégation
const stats = await Order.aggregate([
  // Étape 1 : Filtrer
  { $match: { status: 'completed' } },
  
  // Étape 2 : Grouper et calculer
  { $group: {
    _id: '$customerId',
    totalOrders: { $sum: 1 },
    totalSpent: { $sum: '$total' },
    avgOrder: { $avg: '$total' }
  }},
  
  // Étape 3 : Trier
  { $sort: { totalSpent: -1 } },
  
  // Étape 4 : Limiter
  { $limit: 10 }
]);

// Exemple : statistiques mensuelles
const monthlyStats = await Order.aggregate([
  { $match: { 
    createdAt: { $gte: new Date('2024-01-01') } 
  }},
  { $group: {
    _id: { 
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' }
    },
    revenue: { $sum: '$total' },
    orders: { $sum: 1 }
  }},
  { $sort: { '_id.year': 1, '_id.month': 1 } }
]);
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| ID invalide | CastError | Valider le format ObjectId |
| Document null | findById sans résultat | Gérer le cas null |
| Update sans `new: true` | Retourne l'ancien document | Ajouter `{ new: true }` |
| Populate échoué | Référence non trouvée | Vérifier le modèle référencé |

---

## Quiz de vérification

:::quiz
Q: Quelle méthode trouve un document par ID ?
- [ ] `find(id)`
- [x] `findById(id)`
- [ ] `get(id)`
> `findById()` est la méthode Mongoose dédiée à la recherche par identifiant MongoDB.

Q: Comment retourner le document après mise à jour ?
- [ ] `{ updated: true }`
- [x] `{ new: true }`
- [ ] `{ return: true }`
> L'option `{ new: true }` fait retourner le document modifié au lieu de l'original.

Q: Quelle méthode est plus performante pour insertions en masse ?
- [ ] Boucle avec `save()`
- [x] `insertMany()`
- [ ] `create()` multiple
> `insertMany()` effectue une seule opération bulk, beaucoup plus efficace que des insertions individuelles.

Q: Que fait `populate()` ?
- [ ] Ajoute des données
- [x] Résout les références vers d'autres documents
- [ ] Supprime les doublons
> `populate()` remplace les ObjectId par les documents référencés (jointure MongoDB).
:::

---

## Récapitulatif

| Opération | Méthode | Retour |
|-----------|---------|--------|
| Create | `create()`, `save()`, `insertMany()` | Document(s) créé(s) |
| Read one | `findById()`, `findOne()` | Document ou null |
| Read many | `find()` | Tableau de documents |
| Update | `updateOne()`, `updateMany()` | Résultat de modification |
| Update + Return | `findByIdAndUpdate()` | Document modifié |
| Delete | `deleteOne()`, `deleteMany()` | Résultat de suppression |
| Delete + Return | `findByIdAndDelete()` | Document supprimé |
| Count | `countDocuments()` | Nombre |
| Populate | `.populate()` | Documents avec références |

---

## Ressources

- [Mongoose Queries](https://mongoosejs.com/docs/queries.html)
- [MongoDB Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)
- [MongoDB Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/aggregation/)

---

## Prochaine étape

Découvrez [SQL avec PostgreSQL](./sql-postgresql.md) pour une alternative relationnelle à MongoDB.
