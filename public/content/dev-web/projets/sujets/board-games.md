# Projet Final - Jeux de Plateau en Ligne

## Objectif

Développer une **plateforme de jeux de plateau multijoueur en ligne** permettant de jouer à un ou plusieurs jeux classiques (échecs, dames, morpion, puissance 4, etc.) en temps réel contre d'autres joueurs. Ce projet combine logique de jeu complexe, temps réel avec WebSockets, et interface utilisateur interactive.

## 🎮 Description du Projet

Une application web permettant de créer des parties, rejoindre des salles de jeu, jouer en temps réel contre d'autres joueurs connectés, avec système de chat, historique des coups, et classement des joueurs. Le projet met l'accent sur la logique de jeu, la synchronisation temps réel et l'expérience multijoueur.

## Stack Technologique Suggérée

### Frontend
- **React** ou **Vue.js**
- **Socket.io-client** : Communication temps réel
- **Canvas** ou **SVG** : Rendu du plateau de jeu
- **State Management** : Redux, Zustand, ou Context API
- **CSS** : Tailwind CSS, Styled Components, ou CSS Modules
- **Drag & Drop** : react-dnd ou HTML5 Drag & Drop API

### Backend
- **Node.js** + **Express.js**
- **Socket.io** : Gestion des parties multijoueur
- **Base de données** : MongoDB (Mongoose) ou PostgreSQL
- **Authentification** : JWT
- **Game Logic** : Validation des coups côté serveur

### Optionnel
- **Redis** : Stockage des parties en cours (cache)
- **ELO Rating System** : Système de classement
- **AI Bot** : Intelligence artificielle pour jouer contre l'ordinateur (Minimax, Alpha-Beta)
- **Replay** : Rejeu des parties passées
- **Spectateur** : Observer des parties en cours

## Fonctionnalités Attendues

### Jeux à Implémenter

**Choisissez AU MINIMUM 2 jeux parmi** :

1. **Morpion (Tic-Tac-Toe)** - Simple, bon pour commencer
   - Grille 3x3
   - 2 joueurs
   - Détection victoire (ligne, colonne, diagonale)

2. **Puissance 4 (Connect Four)** - Difficulté moyenne
   - Grille 7x6
   - 2 joueurs
   - Gravité (pièces tombent en bas)
   - Détection alignement de 4

3. **Dames (Checkers)** - Complexe
   - Plateau 8x8
   - Mouvements diagonaux
   - Captures obligatoires
   - Promotion en "dame"

4. **Échecs (Chess)** - Très complexe
   - Plateau 8x8
   - 6 types de pièces avec règles différentes
   - Échec, échec et mat, pat
   - Roque, prise en passant

5. **Othello/Reversi** - Moyenne
   - Plateau 8x8
   - Retournement de pièces
   - Calcul du score

**Pour la soutenance, 2 jeux bien implémentés valent mieux que 4 jeux buggés.**

### Frontend - Interface

#### 1. Page d'Accueil
- Liste des jeux disponibles
- Bouton "Jouer" pour chaque jeu
- Classement général (leaderboard)
- Parties en cours (spectateur, bonus)

#### 2. Lobby du Jeu
- **Créer une partie** :
  - Choix du jeu
  - Nom de la partie (optionnel)
  - Mot de passe (partie privée, optionnel)
- **Rejoindre une partie** :
  - Liste des parties en attente
  - Filtre par jeu
  - Bouton "Rejoindre"
- **Matchmaking** (bonus) :
  - Bouton "Partie rapide"
  - Matchmaking automatique avec joueur de niveau similaire

#### 3. Salle de Jeu
- **Plateau de jeu** :
  - Rendu graphique du plateau
  - Pièces/jetons interactifs (click ou drag & drop)
  - Mise en évidence des coups possibles
  - Animation des mouvements
- **Informations** :
  - Noms des joueurs
  - Avatar
  - Score (si applicable)
  - Tour actuel (avec indicateur visuel)
  - Chronomètre par joueur (optionnel)
- **Actions** :
  - Bouton "Abandonner"
  - Bouton "Proposer match nul" (bonus)
  - Bouton "Annuler le coup" (si autorisé, bonus)
- **Chat** :
  - Zone de chat textuel entre joueurs
  - Historique des messages
- **Historique des coups** :
  - Liste des mouvements effectués
  - Notation standard (ex: pour échecs, notation algébrique)

#### 4. Fin de Partie
- Message de victoire/défaite/match nul
- Statistiques de la partie (temps, nombre de coups, etc.)
- Bouton "Rejouer" (contre le même adversaire)
- Bouton "Menu principal"
- Mise à jour du classement

#### 5. Profil Utilisateur
- Statistiques personnelles :
  - Nombre de parties jouées
  - Victoires / Défaites / Nuls
  - Ratio de victoire
  - Classement ELO (bonus)
- Historique des parties
- Replay de parties passées (bonus)

### Backend - API REST

#### Endpoints Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `GET /api/auth/me` : Profil

#### Endpoints Parties
- `GET /api/games` : Liste des jeux disponibles
- `GET /api/games/:gameType/rooms` : Salles en attente pour un jeu
- `POST /api/games/:gameType/rooms` : Créer une salle
- `GET /api/games/history` : Historique des parties d'un joueur
- `GET /api/games/:id` : Détail d'une partie passée

#### Endpoints Classement
- `GET /api/leaderboard/:gameType` : Classement pour un jeu
- `GET /api/leaderboard/global` : Classement global

### Backend - WebSocket (Socket.io)

#### Événements Client → Serveur
- `create-room` : Créer une salle de jeu
- `join-room` : Rejoindre une salle
- `leave-room` : Quitter une salle
- `make-move` : Effectuer un coup
- `chat-message` : Envoyer un message chat
- `resign` : Abandonner
- `offer-draw` : Proposer match nul
- `accept-draw` / `decline-draw` : Répondre à proposition
- `disconnect` : Déconnexion

#### Événements Serveur → Client
- `room-created` : Salle créée avec succès
- `player-joined` : Un joueur a rejoint
- `game-start` : La partie commence
- `move-made` : Un coup a été joué (avec état du plateau)
- `invalid-move` : Coup invalide
- `game-over` : Fin de partie (victoire, défaite, nul)
- `opponent-disconnected` : Adversaire déconnecté
- `chat-message` : Nouveau message chat
- `draw-offered` : Proposition de match nul reçue
- `timer-update` : Mise à jour du chronomètre (si implémenté)

### Base de Données

#### Modèles Suggérés

**User**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashé),
  avatar: String,
  stats: {
    tictactoe: { played: Number, won: Number, lost: Number, draw: Number },
    connect4: { played: Number, won: Number, lost: Number, draw: Number },
    chess: { played: Number, won: Number, lost: Number, draw: Number, elo: Number }
  },
  createdAt: Date
}
```

**Game**
```javascript
{
  _id: ObjectId,
  type: String (enum: ['tictactoe', 'connect4', 'chess', 'checkers']),
  players: [
    {
      user: ObjectId (ref: 'User'),
      username: String,
      color: String (ex: 'white', 'black', 'red', 'yellow')
    }
  ],
  moves: [
    {
      player: String,
      move: Object, // Dépend du jeu (ex: {from: 'e2', to: 'e4'})
      timestamp: Date
    }
  ],
  state: Object, // État actuel du plateau
  status: String (enum: ['waiting', 'ongoing', 'finished']),
  winner: ObjectId (ref: 'User'), // null si nul
  result: String (enum: ['win', 'draw', 'abandoned']),
  startedAt: Date,
  finishedAt: Date,
  createdAt: Date
}
```

**Room** (optionnel, pour parties en attente)
```javascript
{
  _id: ObjectId,
  gameType: String,
  name: String,
  creator: ObjectId (ref: 'User'),
  password: String, // hashé si partie privée
  maxPlayers: Number (2 pour la plupart),
  currentPlayers: [ObjectId] (ref: 'User'),
  status: String (enum: ['waiting', 'full']),
  createdAt: Date
}
```

## Compétences Évaluées

### Frontend
- **Canvas/SVG** : Rendu graphique du plateau
- **Drag & Drop** : Déplacer des pièces
- **WebSocket** : Synchronisation temps réel
- **State Management** : État du jeu complexe
- **Animations** : Mouvements fluides

### Backend
- **Logique de jeu** : Algorithmes de validation
- **WebSocket** : Gestion de salles multiples
- **Stockage d'état** : Parties en cours (RAM ou Redis)
- **Sécurité** : Validation côté serveur (anti-triche)

### Algorithmes
- **Détection de victoire** : Patterns, conditions
- **IA** (bonus) : Minimax, évaluation de positions
- **ELO** (bonus) : Calcul de classement

## Fonctionnalités Bonus

- **IA / Bot** : Jouer contre l'ordinateur (algorithme Minimax)
- **Chronomètres** : Temps limité par coup ou par partie
- **Spectateurs** : Observer des parties en cours
- **Replay** : Rejouer une partie coup par coup
- **Tournois** : Système de tournoi à élimination
- **Classement ELO** : Système de ranking sophistiqué
- **Thèmes** : Différents styles visuels de plateau
- **Hints** : Suggestions de coups (pour débutants)
- **Analyse** : Analyse post-partie (pour échecs, avec stockage)
- **Mobile** : Version responsive tactile

## Conseils de Réalisation

### Phase 1 : Un Jeu Simple (Morpion)
- Logique de jeu côté serveur
- Interface de plateau basique
- WebSocket pour 2 joueurs
- Tester jusqu'à ce que ça fonctionne parfaitement

### Phase 2 : Fonctionnalités Multijoueur
- Création/rejoindre des salles
- Lobby avec liste des parties
- Chat
- Déconnexion gracieuse

### Phase 3 : Deuxième Jeu
- Implémenter un jeu plus complexe (Puissance 4 ou Dames)
- Réutiliser l'infrastructure existante
- Adapter la logique de validation

### Phase 4 : Polish & Bonus
- Améliorations UX (animations, sons)
- Système de classement
- IA (si temps)
- Optimisations

## ⚠️ Points d'Attention

- **Validation côté serveur** : TOUJOURS valider les coups côté serveur (anti-triche)
- **Synchronisation** : Le serveur est la source de vérité (single source of truth)
- **Déconnexion** : Gérer les déconnexions (timeout, reconnexion)
- **Performance** : Optimiser le rendu du plateau (React.memo, Virtual DOM)
- **Complexité** : Ne sous-estimez pas la logique des échecs/dames

## Ressources Utiles

- [Chess.js](https://github.com/jhlywa/chess.js) : Librairie pour logique échecs (si vous choisissez échecs)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Socket.io Rooms](https://socket.io/docs/v4/rooms/)
- [ELO Rating System](https://en.wikipedia.org/wiki/Elo_rating_system)

---
