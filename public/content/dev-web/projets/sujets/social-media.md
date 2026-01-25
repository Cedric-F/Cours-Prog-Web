# Projet Final - Réseau Social Basique

## Objectif

Développer une **plateforme de réseau social** permettant aux utilisateurs de créer un profil, publier des posts, interagir (likes, commentaires), suivre d'autres utilisateurs et consulter un fil d'actualité personnalisé. Ce projet fullstack couvre l'ensemble des aspects d'une application web moderne.

## Stack Technologique Suggérée

### Frontend
- **React** ou **Vue.js** ou **Next.js**
- **React Router** / Vue Router
- **State Management** : Redux Toolkit, Zustand, ou Context API
- **CSS** : Tailwind CSS, Styled Components, Material-UI
- **Infinite Scroll** : react-infinite-scroll-component ou équivalent

### Backend
- **Node.js** + **Express.js**
- **Base de données** : MongoDB (Mongoose) pour flexibilité
- **Authentification** : JWT + refresh tokens
- **Upload** : Multer + Cloudinary pour les images
- **Validation** : Joi ou express-validator

### Optionnel
- **Socket.io** : Notifications en temps réel
- **Redis** : Cache pour le fil d'actualité
- **Elasticsearch** : Recherche avancée d'utilisateurs/posts
- **AWS S3** : Stockage d'images (alternative à Cloudinary)
- **Email** : Nodemailer pour notifications par email

## Fonctionnalités Attendues

### Frontend - Authentification

#### 1. Inscription
- Formulaire : username, email, mot de passe, confirmation
- Validation côté client (format email, force mdp...)
- Avatar par défaut ou upload
- Redirection vers login après inscription

#### 2. Connexion
- Formulaire : email/username + mot de passe
- "Se souvenir de moi" (refresh token)
- Lien "Mot de passe oublié" (bonus)
- Redirection vers le fil d'actualité après login

#### 3. Profil Utilisateur
- **Voir son profil** :
  - Avatar, bannière (cover photo)
  - Username, bio, localisation, lien web
  - Nombre de followers / following
  - Liste de ses posts
  - Date d'inscription
- **Modifier son profil** :
  - Changer avatar/bannière
  - Modifier bio, localisation, lien
  - Changer mot de passe

### Frontend - Publications (Posts)

#### 4. Créer un Post
- Zone de saisie type "Quoi de neuf ?"
- **Support** :
  - Texte (max 280 caractères comme X, ou plus)
  - Image (upload)
  - Émojis
- Bouton "Publier"
- Validation : post non vide

#### 5. Fil d'Actualité (Feed)
- **Affichage** :
  - Liste des posts des utilisateurs suivis + ses propres posts
  - Tri par date (plus récent en haut)
  - Infinite scroll ou pagination
- **Chaque post affiche** :
  - Avatar et username de l'auteur
  - Contenu (texte + image si présente)
  - Horodatage (ex: "il y a 2h")
  - Nombre de likes et commentaires
  - Boutons : Like, Commenter, Partager (bonus)
  - Options : Modifier/Supprimer (si auteur)

#### 6. Page Post Détail
- Affichage complet du post
- Liste de tous les commentaires
- Formulaire pour ajouter un commentaire

#### 7. Likes
- Bouton like (cœur vide/plein)
- Compteur de likes
- Mise à jour en temps réel
- Liste des utilisateurs ayant liké (modal, bonus)

#### 8. Commentaires
- Formulaire sous chaque post
- Liste des commentaires avec avatar et username
- Possibilité de supprimer son commentaire
- Nombre de commentaires affiché

### Frontend - Social

#### 9. Recherche d'Utilisateurs
- Barre de recherche
- Résultats en temps réel (debounce)
- Affichage : avatar, username, bio
- Bouton "Suivre" directement depuis les résultats

#### 10. Profil d'un Autre Utilisateur
- Voir le profil public
- Bouton "Suivre" / "Ne plus suivre"
- Liste de ses posts
- Liste de ses followers / following (bonus)

#### 11. Liste Followers / Following
- Page "Abonnements" : utilisateurs suivis
- Page "Abonnés" : utilisateurs qui me suivent
- Bouton "Suivre" / "Ne plus suivre" sur chaque

### Frontend - Notifications (Bonus)

#### 12. Centre de Notifications
- Icône avec badge (nombre de notifications non lues)
- Dropdown ou page dédiée
- **Types de notifications** :
  - X a aimé votre post
  - X a commenté votre post
  - X a commencé à vous suivre
  - X a mentionné votre nom (avec @username)
- Marquer comme lues
- Temps réel avec Socket.io (bonus avancé)

### Backend - API REST

#### Endpoints Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion (retourne access + refresh token)
- `POST /api/auth/refresh` : Rafraîchir le token
- `POST /api/auth/logout` : Déconnexion
- `GET /api/auth/me` : Profil utilisateur connecté

#### Endpoints Utilisateurs
- `GET /api/users` : Recherche d'utilisateurs (query: search)
- `GET /api/users/:id` : Profil public d'un utilisateur
- `PUT /api/users/:id` : Modifier son profil (protégé)
- `POST /api/users/:id/follow` : Suivre un utilisateur
- `DELETE /api/users/:id/unfollow` : Ne plus suivre
- `GET /api/users/:id/followers` : Liste des abonnés
- `GET /api/users/:id/following` : Liste des abonnements
- `POST /api/users/avatar` : Upload avatar

#### Endpoints Posts
- `GET /api/posts` : Fil d'actualité (posts des utilisateurs suivis)
- `GET /api/posts/:id` : Détail d'un post
- `POST /api/posts` : Créer un post
- `PUT /api/posts/:id` : Modifier son post
- `DELETE /api/posts/:id` : Supprimer son post
- `GET /api/posts/user/:userId` : Posts d'un utilisateur
- `POST /api/posts/:id/like` : Liker un post
- `DELETE /api/posts/:id/unlike` : Retirer le like

#### Endpoints Commentaires
- `GET /api/posts/:postId/comments` : Commentaires d'un post
- `POST /api/posts/:postId/comments` : Ajouter un commentaire
- `DELETE /api/comments/:id` : Supprimer un commentaire

#### Endpoints Notifications (Bonus)
- `GET /api/notifications` : Mes notifications
- `PUT /api/notifications/:id/read` : Marquer comme lue
- `PUT /api/notifications/read-all` : Tout marquer comme lu

### Base de Données

#### Modèles Suggérés

**User**
```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String (hashé bcrypt),
  avatar: String, // URL Cloudinary
  coverPhoto: String,
  bio: String,
  location: String,
  website: String,
  followers: [ObjectId] (ref: 'User'),
  following: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Post**
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: 'User'),
  content: String,
  image: String, // URL Cloudinary (optionnel)
  likes: [ObjectId] (ref: 'User'),
  comments: [ObjectId] (ref: 'Comment'),
  createdAt: Date,
  updatedAt: Date
}
```

**Comment**
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: 'Post'),
  author: ObjectId (ref: 'User'),
  content: String,
  createdAt: Date
}
```

**Notification** (Bonus)
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: 'User'),
  sender: ObjectId (ref: 'User'),
  type: String (enum: ['like', 'comment', 'follow', 'mention']),
  post: ObjectId (ref: 'Post'), // Si type like ou comment
  read: Boolean,
  createdAt: Date
}
```

## Exemples d'Implémentation

### Frontend - Composant Post

```javascript
function Post({ post, currentUserId }) {
  const [liked, setLiked] = useState(post.likes.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`/api/posts/${post._id}/unlike`);
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await axios.post(`/api/posts/${post._id}/like`);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.author.avatar} alt={post.author.username} />
        <div>
          <h3>{post.author.username}</h3>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post" />}
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={liked ? 'liked' : ''}>
          ❤️ {likesCount}
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length}
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post._id} comments={post.comments} />
      )}
    </div>
  );
}
```

## 🎓 Compétences Évaluées

### Frontend
- **State Management** : Gestion d'état complexe (posts, likes, follows)
- **Infinite Scroll** : Chargement progressif du feed
- **Upload d'images** : Preview + envoi
- **UX/UI** : Interface moderne type réseau social
- **Optimistic Updates** : Mise à jour UI avant réponse serveur

### Backend
- **Relations complexes** : Users, Posts, Comments, Followers
- **Requêtes optimisées** : Populate, indexation
- **Upload de fichiers** : Multer + Cloudinary
- **Authentification** : JWT + refresh tokens
- **Notifications** : Système de notifications (bonus)

### Architecture
- **Scalabilité** : Pagination, cache (Redis)
- **Sécurité** : Protection des routes, validation
- **Performance** : Indexation DB, optimisation requêtes

## Fonctionnalités Bonus

- **Hashtags** : Système de tags dans les posts
- **Mentions** : @username dans les posts/commentaires
- **Partage de posts** : Retweet/Share
- **Messages privés** : DM entre utilisateurs (Socket.io)
- **Stories** : Contenu éphémère 24h (type Instagram)
- **Groupes** : Créer et rejoindre des groupes
- **Live** : Streaming vidéo en direct (très avancé)
- **Vérification de compte** : Badge vérifié
- **Statistiques** : Vues, impressions, analytics
- **Mode sombre**
- **Multi-langue**

## Conseils de Réalisation

### Phase 1 : Authentification & Profils
- Système d'inscription/connexion
- CRUD profil utilisateur
- Upload avatar

### Phase 2 : Posts
- Création/affichage de posts
- Upload d'images
- Fil d'actualité basique

### Phase 3 : Interactions
- Système de likes
- Commentaires
- Follow/Unfollow

### Phase 4 : Fil Personnalisé
- Feed basé sur les followings
- Pagination/Infinite scroll
- Optimisation requêtes

### Phase 5 : Bonus
- Notifications
- Recherche avancée
- Hashtags/Mentions

## ⚠️ Points d'Attention

- **Performance du feed** : Requête complexe, utiliser indexation + cache
- **Upload d'images** : Validation (taille, format), compression
- **Sécurité** : Ne pas exposer d'infos sensibles (email, mdp hashé...)

## Ressources Utiles

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [MongoDB Indexing](https://docs.mongodb.com/manual/indexes/)

---
