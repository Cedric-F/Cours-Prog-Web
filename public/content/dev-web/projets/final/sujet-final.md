# Projet Prog Web (1re année) Full JS : "ServiceBoard" (mini CraigList de services)

## Objectif
Développer seul une application web complète permettant de publier et consulter des **annonces de services** :
- **Offre** : un utilisateur propose un service (disponibilités, tarif, modalités)
- **Demande** : un utilisateur recherche un service

La mise en relation se fait via une **messagerie interne**. Pas de paiement en ligne.

---

## Stack imposé (Full JavaScript / TypeScript autorisé)
### Back-end
- Node.js + Express
- Base de données : Choix libre (flat db, supabase, image docker avec script d'initialisation)

### Front-end
- SPA (React / Vue / Angular) consommant une API REST

### Authentification
- Sessions + cookies (express-session) ou JWT (si SPA)
- Mot de passe hashé avec bcrypt

---

## Contraintes générales
- Projet individuel ou duo, dépôt Git obligatoire (commits réguliers)
- Données persistées en base (pas de stockage en mémoire)
- Validation côté serveur obligatoire
- Contrôle d’accès obligatoire (interdire les actions sur les ressources d’autrui)

---

## Core features (obligatoires)

### 1) Comptes et authentification
- Inscription
- Connexion / déconnexion
- Page profil :
  - pseudo
  - ville
  - bio (texte court)
- Sécurité :
  - aucune donnée sensible en clair (ie: mot de passe)

### 2) Annonces de services (CRUD)
Une annonce contient :
- type : OFFER ou REQUEST
- titre
- description
- catégorie (liste fixe)
- ville
- disponibilité (texte libre)
- tarif :
  - FREE ou HOURLY ou FIXED
  - valeur numérique si HOURLY ou FIXED
- modalités : REMOTE, AT_PROVIDER, AT_CUSTOMER, etc.
- statut : DRAFT ou PUBLISHED (ou ACTIVE/INACTIVE si vous simplifiez)

Fonctions :
- créer une annonce
- modifier une annonce (auteur uniquement)
- supprimer une annonce (auteur uniquement)
- publier ou dépublier une annonce
- page détail d’une annonce

### 3) Listing, recherche, filtres
- Page liste des annonces publiées
- Recherche par mots-clés (titre + description)
- Filtres :
  - type (Offre/Demande)
  - catégorie
  - ville
- Tri :
  - plus récent
  - tarif croissant/décroissant (si applicable)

### 4) Messagerie interne
- Depuis une annonce, un utilisateur connecté peut envoyer un message à l’auteur
- Les messages sont regroupés en **conversation** liée à une annonce
- Boîte de réception : liste des conversations (avec dernier message et date)
- Consultation d’une conversation : affichage chronologique + envoi de nouveaux messages

Règles :
- Interdit de se contacter soi-même
- Une conversation n’est visible que par ses deux participants

### 5) Qualité minimale
- Gestion propre des erreurs :
  - 401/403/404 affichées correctement
- Validation des champs (back obligatoire, front conseillé)
- Protection contre :
  - modification/suppression d’annonces d’un autre utilisateur
  - accès non connecté aux pages privées (inbox, création annonce, profil)

---

## Bonus features (exemples)

### Favoris
- Ajouter/retirer une annonce en favoris
- Page "Mes favoris"

### Upload d’images
- 1 à 3 images par annonce
- Stockage au choix

### Tags
- Tags libres par annonce
- Filtre par tag

### Modération simple
- Bouton “signaler”
- Statut “FLAGGED”
- Page admin minimale (un seul compte admin) pour masquer/restaurer

### Notifications
- Badge “nouveau message”
- notifications persistées en base

### Etats avancés
- DRAFT, PUBLISHED, ARCHIVED
- Archivage automatique après N jours

### Reviews
- Système permettant aux utilisateurs de laisser un avis sur la page de profil d'une personne.
- Contrainte : uniquement si un marché a déjà été conclu entre les deux.

---

## Structure attendue (exemple)
### Back-end Express
- `src/app.js` (config Express)
- `src/routes/*` (routes)
- `src/controllers/*` (logique)
- `src/middlewares/*` (auth, validation, erreurs)
- `src/services/*` (accès DB, logique métier)
- `prisma/schema.prisma` (si Prisma)

---

## Livrables
1) Dépôt Git avec historique
2) `README.md` :
   - description du projet
   - installation (DB, migrations, env)
   - commande pour lancer back et front
   - 2 comptes de test (identifiants)
3) Schéma DB (image ou texte)
4) Liste des fonctionnalités core + bonus réellement faites

---

## Evaluation
- Core features
- Qualité du code et structure
- Base de données (relations, contraintes, cohérence)
- UX et robustesse
- Bonus : Selon qualité

---

## Pièges classiques
- Mot de passe stocké en clair
- Pas de contrôle d’accès (n’importe qui modifie tout)
- Pas de base de données
- Projet non lançable (README incomplet)
- API sans validation serveur
