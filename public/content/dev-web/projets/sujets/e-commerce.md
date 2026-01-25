# Projet Final - Site E-Commerce

## Objectif

Développer une **application e-commerce complète** permettant aux utilisateurs de parcourir des produits, les ajouter au panier, et finaliser une commande. Ce projet fullstack met en œuvre l'ensemble des compétences acquises durant la formation.

## Description du Projet

Une plateforme de vente en ligne fonctionnelle avec gestion de catalogue produits, panier d'achat, processus de commande, et espace administrateur pour la gestion. Le projet doit couvrir à la fois le frontend (interface utilisateur) et le backend (API, base de données).

## Stack Technologique Suggérée

### Frontend
- **React** ou **Vue.js** ou **Next.js**
- **React Router** / Vue Router (navigation)
- **CSS Framework** : Tailwind CSS, Material-UI, ou CSS custom
- **State Management** : Context API, Redux, Zustand, ou Pinia (Vue)

### Backend
- **Node.js** + **Express.js**
- **Base de données** : MongoDB (Mongoose) ou PostgreSQL (Sequelize/Prisma)
- **Authentification** : JWT (JSON Web Tokens)
- **Validation** : Joi ou express-validator

### Optionnel
- **Payment** : Stripe API (mode test) pour les paiements
- **Upload** : Cloudinary ou Multer pour les images
- **Email** : Nodemailer pour les confirmations de commande
- **Deployment** : Vercel/Netlify (frontend), Render/Railway (backend)

## Fonctionnalités Attendues

### Frontend - Partie Publique

#### 1. Page d'Accueil
- Affichage des produits en vedette/nouveautés
- Catégories principales
- Barre de recherche
- Bannière promotionnelle

#### 2. Catalogue Produits
- Liste de tous les produits avec pagination
- Filtres :
  - Par catégorie
  - Par fourchette de prix
  - Par note/avis (bonus)
  - Par disponibilité
- Tri : Prix croissant/décroissant, Nouveautés, Popularité
- Vue grille ou liste

#### 3. Page Produit (Détail)
- Images du produit (avec galerie si plusieurs)
- Nom, prix, description détaillée
- Quantité en stock
- Sélecteur de quantité
- Bouton "Ajouter au panier"
- Caractéristiques techniques
- Avis clients (bonus)
- Produits similaires (bonus)

#### 4. Panier
- Liste des produits ajoutés
- Modification de quantité
- Suppression d'articles
- Calcul du sous-total, TVA, frais de livraison, total
- Bouton "Commander"
- Persistance du panier (localStorage ou session)

#### 5. Processus de Commande (Checkout)
- **Étape 1 : Authentification**
  - Login ou continuer en tant qu'invité
  - Inscription si nouveau client
- **Étape 2 : Adresse de livraison**
  - Formulaire adresse (nom, rue, ville, code postal, pays)
  - Validation des champs
- **Étape 3 : Mode de livraison**
  - Choix entre plusieurs options (standard, express...)
  - Calcul des frais selon l'option
- **Étape 4 : Paiement**
  - Formulaire de paiement (Stripe ou simulation)
  - Récapitulatif de la commande
- **Étape 5 : Confirmation**
  - Message de succès
  - Numéro de commande
  - Email de confirmation (bonus)

#### 6. Espace Client
- **Mon compte** : Informations personnelles (modification)
- **Mes commandes** : Historique avec statuts
- **Mes adresses** : Gestion des adresses de livraison
- **Déconnexion**

### Frontend - Partie Administrateur

#### 7. Dashboard Admin
- Vue d'ensemble : nombre de produits, commandes, utilisateurs
- Graphiques de ventes (bonus)
- Commandes récentes

#### 8. Gestion Produits
- **Liste** : Tous les produits avec boutons Modifier/Supprimer
- **Créer** : Formulaire d'ajout (nom, description, prix, stock, catégorie, images)
- **Modifier** : Édition des informations
- **Supprimer** : Avec confirmation

#### 9. Gestion Commandes
- Liste de toutes les commandes
- Détail d'une commande (produits, client, adresse, montant)
- Modification du statut (En attente, Expédiée, Livrée, Annulée)

#### 10. Gestion Utilisateurs
- Liste des utilisateurs
- Rôles (Client, Admin)
- Possibilité de bloquer un utilisateur (bonus)

### Backend - API REST

#### Endpoints Produits
- `GET /api/products` : Liste tous les produits (avec filtres et pagination)
- `GET /api/products/:id` : Détail d'un produit
- `POST /api/products` : Créer un produit (admin)
- `PUT /api/products/:id` : Modifier un produit (admin)
- `DELETE /api/products/:id` : Supprimer un produit (admin)

#### Endpoints Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion (retourne un JWT)
- `GET /api/auth/me` : Profil utilisateur (protégé)

#### Endpoints Commandes
- `POST /api/orders` : Créer une commande
- `GET /api/orders` : Mes commandes (client) ou toutes (admin)
- `GET /api/orders/:id` : Détail d'une commande
- `PUT /api/orders/:id` : Modifier statut (admin)

#### Endpoints Panier (optionnel si géré côté serveur)
- `GET /api/cart` : Récupérer le panier
- `POST /api/cart` : Ajouter au panier
- `PUT /api/cart/:itemId` : Modifier quantité
- `DELETE /api/cart/:itemId` : Supprimer du panier

#### Endpoints Utilisateurs (Admin)
- `GET /api/users` : Liste des utilisateurs
- `GET /api/users/:id` : Détail utilisateur
- `PUT /api/users/:id` : Modifier utilisateur
- `DELETE /api/users/:id` : Supprimer utilisateur

### Base de Données

#### Modèles Suggérés

**User**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashé avec bcrypt),
  role: String (enum: ['client', 'admin']),
  addresses: [AddressSchema],
  createdAt: Date,
  updatedAt: Date
}
```

**Product**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String], // URLs
  stock: Number,
  rating: Number,
  numReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Order**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  orderItems: [
    {
      product: ObjectId (ref: 'Product'),
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    status: String,
    update_time: Date,
    email_address: String
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  status: String (enum: ['pending', 'shipped', 'delivered', 'cancelled']),
  createdAt: Date
}
```

## Compétences Évaluées

### Frontend
- **React/Vue** : Composants, hooks, routing, state management
- **Formulaires** : Validation, gestion d'erreurs
- **UX/UI** : Interface intuitive, design responsive
- **Appels API** : Fetch/Axios, gestion async
- **Authentification** : JWT storage, routes protégées
- **Panier** : Logique complexe, calculs

### Backend
- **API REST** : Conception, endpoints RESTful
- **Authentification** : JWT, middleware de protection
- **Base de données** : Modélisation, relations, requêtes
- **Validation** : Données entrantes
- **Sécurité** : Hashage passwords, protection contre injections
- **Gestion d'erreurs** : Error handling centralisé

### DevOps
- **Git** : Commits réguliers, branches, merge
- **Déploiement** : Frontend et backend en production
- **Variables d'environnement** : Configuration sécurisée

## Fonctionnalités Bonus

- **Avis produits** : Système de reviews et ratings
- **Wishlist** : Liste de souhaits
- **Codes promo** : Système de coupons de réduction
- **Recommandations** : Produits similaires basés sur l'historique
- **Notifications** : Emails de confirmation (Nodemailer)
- **Export PDF** : Factures téléchargeables
- **Dashboard Analytics** : Graphiques de ventes (Chart.js)
- **Multi-langue** : i18n pour internationalisation
- **PWA** : Progressive Web App pour mobile
- **Chat support** : Chat en temps réel (Socket.io)
- **Stock alerts** : Notifications quand produit de retour en stock

## ⚠️ Points d'Attention

### Sécurité
- **Ne JAMAIS stocker les mots de passe en clair** : Utilisez bcrypt (par exemple)
- **Protéger les routes admin** : Middleware de vérification du rôle
- **Valider toutes les entrées** : Côté frontend ET backend
- **CORS** : De nombreux dev sont devenus fous à cause de ça !
- **Variables sensibles** : Utiliser .env, ne jamais commit les clés

### Performance
- **Pagination** : Ne pas charger tous les produits d'un coup
- **Images** : Optimiser la taille, utiliser lazy loading
- **Requêtes DB** : Indexer les champs fréquemment recherchés
- **Caching** : Mettre en cache les données peu changeantes

### UX
- **Feedback utilisateur** : Loaders, messages de succès/erreur
- **Responsive** : Tester sur mobile, tablette, desktop
- **Accessibilité** : Labels, alt text, navigation au clavier
- **Performance** : Temps de chargement < 3 secondes

## Ressources Utiles

- [Stripe API Docs](https://stripe.com/docs/api)
- [JWT.io](https://jwt.io/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React E-commerce Tutorial](https://www.youtube.com/results?search_query=react+ecommerce+tutorial)

---
