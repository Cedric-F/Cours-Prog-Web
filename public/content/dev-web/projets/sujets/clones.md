# Projet Final - Clones d'Applications

## Concept

Reproduire les fonctionnalités essentielles d'une application connue. L'objectif n'est pas de faire une copie parfaite, mais d'implémenter le **cœur de l'expérience utilisateur**.

Quelques idées de projets intéressants (liste non exhaustive, vous pouvez en proposer d'autres !!!).

---

## Applications proposées

### Trello

**Fonctionnalités core** :
- Boards avec colonnes personnalisables
- Cartes déplaçables entre colonnes (drag & drop)
- Création/édition/suppression de cartes
- Labels et dates limites
- Membres assignés aux cartes
- Réactivité temps-réel multi-utilisateurs, checklists dans les cartes, archives

**Tech suggérée** : react-beautiful-dnd ou @dnd-kit, WebSockets pour le temps réel

---

### Airbnb

**Fonctionnalités core** :
- Annonces avec photos, description, prix/nuit
- Recherche par lieu et dates
- Calendrier de disponibilité
- Système de réservation
- Profils hôtes et voyageurs
- Messagerie
- Reviews
- Carte interactive (Mapbox/Leaflet)

**Tech suggérée** : Date picker, gestion de calendrier, upload multi-images

---

### Notion

**Fonctionnalités core** :
- Pages avec blocs (texte, titres, listes, code)
- Éditeur WYSIWYG ou Markdown
- Hiérarchie de pages (pages dans pages)
- Sidebar de navigation
- Partage de pages

**Bonus** : Blocs database (tables), templates, collaboration temps réel

**Tech suggérée** : TipTap ou Slate.js pour l'éditeur, structure récursive

---

### Twitch

**Fonctionnalités core** :
- Streaming vidéo en direct
- Chat en temps réel par stream
- Système de chaînes
- Catégories/jeux
- Followers

**Bonus** : Clips, VODs, emotes personnalisées, dons

**Tech suggérée** : WebRTC ou service tiers (Mux, Agora), Socket.io pour chat