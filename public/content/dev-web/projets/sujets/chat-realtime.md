# Projet Final - Application de Chat en Temps Réel

## Objectif

Développer une **application de messagerie instantanée** permettant aux utilisateurs de communiquer en temps réel. Ce projet fullstack met l'accent sur les **WebSockets** (Socket.io), la gestion d'état complexe et la communication bidirectionnelle client-serveur.

## Description du Projet

Une plateforme de chat moderne avec conversations privées, salons de discussion, notifications en temps réel, et fonctionnalités avancées comme le statut en ligne, les indicateurs de frappe, et l'historique des messages. Le projet couvre frontend, backend et communication temps réel.

## Stack Technologique Suggérée

### Frontend
- **React** ou **Vue.js** ou **Next.js**
- **Socket.io-client** : Communication WebSocket
- **State Management** : Redux, Zustand, ou Context API
- **CSS** : Tailwind CSS, Styled Components, ou CSS Modules
- **Date/Time** : date-fns ou day.js pour formater les dates

### Backend
- **Node.js** + **Express.js**
- **Socket.io** : Gestion des WebSockets
- **Base de données** : MongoDB (Mongoose) pour flexibilité des messages
- **Authentification** : JWT
- **Redis** (optionnel) : Pour gérer les sessions et la scalabilité

### Optionnel
- **Upload** : Cloudinary ou Multer pour partage de fichiers/images
- **Emoji Picker** : Librairie pour émojis
- **Notifications** : Web Notifications API
- **Encryption** : Chiffrement end-to-end (avancé)
- **Voice/Video** : WebRTC pour appels audio/vidéo (très avancé)

## Fonctionnalités Attendues

### Frontend - Authentification

#### 1. Inscription / Connexion
- Formulaire d'inscription (pseudo, email, mot de passe)
- Formulaire de connexion
- Validation des champs
- Redirection vers l'interface de chat après login

#### 2. Profil Utilisateur
- Avatar (upload ou URL)
- Pseudo (modifiable)
- Statut personnalisé ("Disponible", "Occupé", "Absent"...)
- Bio (optionnel)

### Frontend - Interface de Chat

#### 3. Liste des Conversations
- **Sidebar gauche** :
  - Liste de tous les contacts/conversations
  - Recherche de contacts
  - Indication de messages non lus (badge)
  - Dernier message et timestamp
  - Statut en ligne (vert) / hors ligne (gris)
- **Bouton** : Nouvelle conversation

#### 4. Fenêtre de Conversation
- **En-tête** :
  - Nom du contact ou salon
  - Statut (en ligne, hors ligne, "est en train d'écrire...")
  - Options (info, muet, rechercher, quitter)
- **Corps** :
  - Affichage des messages (bulles alignées gauche/droite)
  - Horodatage des messages
  - Indicateur "vu" (double check)
  - Scroll automatique au nouveau message
  - Chargement de l'historique au scroll vers le haut (lazy loading)
- **Zone de saisie** :
  - Input texte
  - Bouton émojis
  - Bouton pièce jointe (image, fichier)
  - Bouton envoyer
  - Indicateur "est en train d'écrire" visible pour l'autre

#### 5. Salons de Discussion (Rooms)
- Création de salon public ou privé
- Invitation de membres
- Liste des membres dans le salon
- Permissions (admin peut kick/ban)
- Quitter un salon

#### 6. Notifications
- Notification desktop quand nouveau message reçu (Web Notifications API)
- Badge de compteur sur l'onglet du navigateur
- Son de notification (optionnel, désactivable)

### Backend - API REST

#### Endpoints Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion (retourne JWT)
- `GET /api/auth/me` : Profil utilisateur

#### Endpoints Utilisateurs
- `GET /api/users` : Liste des utilisateurs (recherche)
- `GET /api/users/:id` : Profil d'un utilisateur
- `PUT /api/users/:id` : Modifier son profil

#### Endpoints Conversations
- `GET /api/conversations` : Mes conversations
- `GET /api/conversations/:id` : Détail conversation avec messages
- `POST /api/conversations` : Créer une conversation
- `DELETE /api/conversations/:id` : Supprimer conversation

#### Endpoints Messages
- `GET /api/messages/:conversationId` : Historique (avec pagination)
- `POST /api/messages` : Envoyer un message (fallback si WebSocket down)
- `PUT /api/messages/:id` : Modifier un message (édition)
- `DELETE /api/messages/:id` : Supprimer un message

### Backend - WebSocket (Socket.io)

#### Événements Client → Serveur
- `join-conversation` : Rejoindre une room de conversation
- `leave-conversation` : Quitter une room
- `send-message` : Envoyer un message
- `typing` : Utilisateur en train d'écrire
- `stop-typing` : Utilisateur a arrêté d'écrire
- `message-read` : Marquer message comme lu
- `disconnect` : Déconnexion

#### Événements Serveur → Client
- `new-message` : Nouveau message reçu
- `message-sent` : Confirmation d'envoi
- `user-typing` : Quelqu'un est en train d'écrire
- `user-stop-typing` : Arrêt de frappe
- `user-online` : Utilisateur vient de se connecter
- `user-offline` : Utilisateur s'est déconnecté
- `message-read` : Message a été lu
- `error` : Erreur

### Base de Données

#### Modèles Suggérés

**User**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashé),
  avatar: String, // URL
  bio: String,
  status: String (enum: ['online', 'offline', 'away']),
  customStatus: String,
  lastSeen: Date,
  createdAt: Date
}
```

**Conversation**
```javascript
{
  _id: ObjectId,
  type: String (enum: ['private', 'group']),
  participants: [ObjectId] (ref: 'User'),
  name: String, // Pour les groupes
  admin: ObjectId (ref: 'User'), // Pour les groupes
  lastMessage: {
    text: String,
    sender: ObjectId,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Message**
```javascript
{
  _id: ObjectId,
  conversation: ObjectId (ref: 'Conversation'),
  sender: ObjectId (ref: 'User'),
  text: String,
  type: String (enum: ['text', 'image', 'file']),
  fileUrl: String, // Si type image/file
  readBy: [ObjectId] (ref: 'User'),
  edited: Boolean,
  deleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Compétences Évaluées

### Frontend
- **WebSockets** : Socket.io-client, gestion des événements
- **State Management** : État complexe, messages temps réel
- **UX** : Interface de chat fluide, responsive
- **Optimisation** : Lazy loading historique, virtual scrolling (bonus)

### Backend
- **WebSockets** : Socket.io, rooms, broadcast
- **Authentification** : JWT avec WebSocket
- **Base de données** : Requêtes optimisées, indexation
- **Scalabilité** : Gestion de multiples connexions simultanées

### Temps Réel
- **Synchronisation** : Messages instantanés
- **Présence** : Statut en ligne/hors ligne
- **Notifications** : Événements temps réel

## Fonctionnalités Bonus

- **Partage de fichiers** : Images, documents (Cloudinary + Multer)
- **Emojis** : Picker d'émojis (emoji-picker-react)
- **Édition/Suppression** : Modifier ou supprimer ses messages
- **Recherche** : Rechercher dans l'historique
- **Commandes slash** : `/giphy`, `/poll` (intégration Giphy API)
- **Voice Messages** : Enregistrer des messages vocaux
- **Appels vidéo/audio** : WebRTC (très avancé)
- **Chiffrement** : E2E encryption (très avancé)
- **Read receipts** : Double check bleu quand lu
- **Réactions** : Émojis de réaction sur messages
- **Threads** : Réponses à des messages spécifiques
- **Mentions** : @username dans les groupes
- **Bots** : Intégration de bots (météo, news...)

## Conseils de Réalisation

### Phase 1 : Planification
- Wireframes de l'interface de chat
- Architecture WebSocket (diagramme de flux)
- Définir les événements Socket.io

### Phase 2 : Backend
- Setup Express + Socket.io
- Authentification JWT
- Modèles de données
- Endpoints REST de base
- Implémentation des événements Socket.io

### Phase 3 : Frontend
- Interface de chat (HTML/CSS)
- Intégration Socket.io-client
- Gestion des événements
- Liste des conversations
- Affichage des messages

### Phase 4 : Fonctionnalités Temps Réel
- Envoi/réception de messages
- Indicateur de frappe
- Statut en ligne/hors ligne
- Notifications

### Phase 5 : Optimisation
- Lazy loading de l'historique
- Gestion des erreurs
- Reconnexion automatique
- Performance

## ⚠️ Points d'Attention

- **Gestion de la reconnexion** : Si WebSocket se déconnecte, reconnecter automatiquement
- **Synchronisation** : Gérer l'ordre des messages (timestamp côté serveur)
- **Scalabilité** : Utiliser Redis si besoin de scaling horizontal
- **Sécurité** : Valider toutes les données côté serveur
- **Performance** : Limiter le nombre de messages chargés (pagination)

## Ressources Utiles

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [WebRTC Tutorial](https://webrtc.org/getting-started/overview)
- [Redis for Socket.io](https://socket.io/docs/v4/using-multiple-nodes/)

---
