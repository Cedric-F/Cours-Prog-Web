# Consignes Générales - Projets

## Objectif Pédagogique

L'objectif de cette section est de vous permettre de mettre en pratique l'ensemble des compétences acquises tout au long de ce cours. Chaque projet est conçu pour consolider vos connaissances et développer votre autonomie en tant que développeur web.

## Organisation du Travail

### Progression Libre

**Chaque groupe peut avancer à son propre rythme.** Vous êtes libres de sauter des sections du cours si vous vous sentez suffisamment autonomes sur certains sujets. Cependant, gardez à l'esprit que **tout ce dont vous avez besoin pour mener à bien le projet final se trouve normalement dans ce cours**.

### L'Importance de la Curiosité

**La curiosité est votre meilleur atout.** Vous avez **le droit et même l'encouragement** d'aller chercher d'autres ressources pédagogiques : 
- Documentation officielle (MDN, React Docs, Node.js Docs...)
- Tutoriels en ligne
- Stack Overflow et forums de développeurs
- Livres techniques
- Vidéos YouTube

**Apprendre à apprendre** et à chercher de l'information est une compétence essentielle pour un ~~développeur~~ ingénieur.

## Types de Projets

### Projets d'Entraînement (Prise en Main & Intermédiaire)

Les projets des sections **"Prise en main"** et **"Intermédiaire"** sont :
- **Facultatifs** : vous n'êtes pas obligés de tous les faire
- **Pédagogiques** : ils servent à vous entraîner sur des concepts spécifiques
- **Non notés** : ils ne comptent pas dans votre évaluation finale
- **Recommandés** : ils vous préparent efficacement au projet final

**Conseil** : Faites au moins 1-2 projets d'entraînement pour vous familiariser avec les technologies avant d'attaquer le projet final.

### Projet Final (Noté)

**Seul le projet final sera évalué et noté.**

Chaque groupe choisit **UN projet parmi ceux listés dans la section "Sujets"**. Ce projet doit être réalisé en groupe et constitue l'évaluation principale de ce cours.

## Livrables du Projet Final

Le projet final nécessite **4 livrables obligatoires** :

### Document de Recueil du Besoin

**Objectif** : Poser les bases du projet et définir l'organisation du groupe.

**Contenu attendu** :
- **Description du projet** : Nature, objectifs, public cible
- **Organisation du groupe** :
  - Membres de l'équipe
  - Répartition des rôles (chef de projet, dev frontend, dev backend, designer, etc.)
  - Répartition des tâches entre les membres
- **Méthodologie de travail** : Agile/Scrum, Kanban, organisation des réunions, outils utilisés (Trello, Jira, Discord...)
- **Anticipation de la complexité** :
  - Évaluation de la difficulté du projet
  - Identification des points techniques complexes
  - Appréciation au regard des compétences actuelles de chacun
  - Planning prévisionnel

**Format** : Document PDF ou Markdown (5-10 pages)

### 2 Spécifications Fonctionnelles Détaillées (SFD)

**Objectif** : Documenter les choix techniques et l'architecture du projet.

**Contenu attendu** :
- **Choix techniques** :
  - Stack technologique (React, Vue, Angular ? Node.js, Express ? MongoDB, PostgreSQL ?)
  - **Justification de chaque choix** lorsque plusieurs options existent
    - Exemple : "Nous avons choisi Vue.js au lieu de React car..."
  - Bibliothèques et frameworks utilisés
- **Architecture du projet** :
  - Architecture frontend (composants, routing, gestion d'état)
  - Architecture backend (API REST, microservices, monolithe)
  - Diagramme d'architecture globale
- **Services tiers** :
  - APIs externes utilisées (Google Maps, OpenWeatherMap, Stripe...)
  - Services créés en interne pour combler des besoins spécifiques
- **Modélisation des données** :
  - Schémas de base de données (diagrammes ER ou équivalents)
  - Modèles de données (structures JSON, interfaces TypeScript...)
- **Interfaces utilisateur** :
  - Wireframes ou maquettes (Figma, Adobe XD, dessins à la main scannés...)
  - Croquis des principales vues de l'application
  - Parcours utilisateur (user flows)
- **Sécurité** :
  - Gestion de l'authentification (JWT, sessions, OAuth...)
  - Protection contre les failles (XSS, CSRF, SQL injection...)
- **Performance** :
  - Stratégies d'optimisation envisagées
  - Gestion du cache, lazy loading...

**Format** : Document PDF ou Markdown (10-20 pages) avec schémas et diagrammes

### 3 Rapport Final du Projet

**Objectif** : Faire l'auto-critique du projet et comparer les prévisions aux réalisations.

**Contenu attendu** :
- **Gestion des délais** :
  - Respect du planning initial
  - Retards rencontrés et leurs causes
  - Ajustements effectués
- **Organisation** :
  - Turnover des rôles (si applicable)
  - Qualité de la communication dans l'équipe
  - Problèmes organisationnels rencontrés et solutions apportées
- **Points de blocage** :
  - Difficultés techniques rencontrées
  - Comment elles ont été résolues (ou non)
  - Leçons apprises
- **Appréciation de la complexité** :
  - Complexité technique réelle vs. anticipée
  - Complexité organisationnelle réelle vs. anticipée
  - Ce qui a été plus facile/difficile que prévu
- **Présentation des fonctionnalités** :
  - Description des fonctionnalités principales implémentées
  - **Captures d'écran** de l'application
  - Explication du fonctionnement des features les plus intéressantes
  - Code snippets illustrant des solutions techniques particulières
- **Bilan personnel** :
  - Ce que chaque membre a appris
  - Points forts et axes d'amélioration individuels et collectifs

**Format** : Document PDF ou Markdown (10-15 pages) avec captures d'écran

### 4 Code Source et Historique Git

**Objectif** : Démontrer la progression du projet et la qualité du code.

**Contenu attendu** :
- **Dépôt Git** (GitHub, GitLab, Bitbucket...) :
  - Commits réguliers tout au long du projet
  - Messages de commit clairs et descriptifs
  - Historique permettant de voir l'évolution du projet dans le temps
  - Branches pour les différentes features (si applicable)
- **README.md complet** :
  - Description du projet
  - Instructions d'installation
  - Instructions de lancement (dev et production)
  - Technologies utilisées
  - Structure du projet
- **Code de qualité** :
  - Code commenté quand nécessaire
  - Conventions de nommage respectées
  - Structure de fichiers cohérente
  - Pas de code mort ou commenté en masse

**⚠️ Important** : Le dépôt Git doit être **envoyé en amont de la soutenance** (au moins 48h avant).

## 🎤 Soutenance du Projet

### Support de Présentation

Préparez une **présentation (slides)** qui couvre :
1. **Introduction** : Présentation du groupe et du projet choisi
2. **Besoin** : Problème résolu, public cible, objectifs
3. **Organisation** : Méthodologie, répartition des rôles et tâches
4. **Architecture** : Stack technique, schémas d'architecture, modélisation
5. **Difficultés rencontrées** : Blocages techniques et solutions
6. **Bilan** : Ce qui a bien fonctionné, ce qui pourrait être amélioré
7. **Démo Live** : Présentation en direct de l'application fonctionnelle

### Durée

- **Présentation** : 15-20 minutes
- **Démo Live** : 10-15 minutes
- **Questions/Réponses** : 10 minutes

### Conseils pour la Démo

- **Testez votre démo en amont** : Assurez-vous que tout fonctionne
- **Préparez un scénario** : Définissez ce que vous allez montrer
- **Ayez un plan B** : Vidéo de backup si problème technique
- **Montrez les features clés** : Concentrez-vous sur l'essentiel
- **Expliquez pendant la démo** : Commentez ce que vous faites

## Critères d'Évaluation

Votre projet sera évalué sur :

### Technique (40%)
- Qualité du code (propreté, organisation, conventions)
- Complexité technique et maîtrise des technologies
- Architecture et choix techniques justifiés
- Fonctionnalités implémentées et leur robustesse
- Gestion des erreurs et des cas limites

### Documentation (30%)
- Qualité des livrables (clarté, exhaustivité, pertinence)
- Justification des choix techniques
- Réflexion sur la complexité et l'organisation
- README et documentation du code

### Travail d'Équipe (15%)
- Organisation et répartition des tâches
- Qualité de la collaboration (historique Git)
- Gestion de projet (méthodologie, suivi)

### Présentation et Démo (15%)
- Clarté de la présentation
- Qualité de la démo live
- Réponses aux questions
- Professionnalisme

## Conseils pour Réussir

1. **Commencez tôt** : Ne sous-estimez pas le temps nécessaire
2. **Itérez** : Faites un MVP (Minimum Viable Product) puis améliorez
3. **Communiquez** : Réunions régulières, outils de suivi de tâches
4. **Documentez au fur et à mesure** : N'attendez pas la fin
5. **Testez régulièrement** : Évitez de tout tester à la fin
6. **Demandez de l'aide** : Vos formateurs sont là pour vous aider
7. **Soyez réalistes** : Mieux vaut un projet simple bien fait qu'un projet ambitieux inachevé
8. **Versionnez tout** : Commits réguliers dès le début
9. **Préparez la soutenance** : Répétez votre présentation
10. **Ayez du recul** : L'auto-critique est valorisée

## Questions Fréquentes

**Q : Combien de personnes par groupe ?**  
R : 2 à 3 personnes recommandées. Adaptez l'ambition du projet à la taille du groupe.

**Q : Peut-on utiliser des templates/boilerplates ?**  
R : Oui, mais vous devez le mentionner et justifier ce choix dans vos livrables.

**Q : Peut-on utiliser des librairies externes ?**  
R : Oui, c'est même encouragé. Documentez-les dans vos SFD.

**Q : Peut-on utiliser une IA générative ?**  
R : À vos risques et périls. Si utilisée sans mention directe dans le livrable final et lors de la soutenance → sanction. Si utilisée de manière abusive → sanction. Le but est d'être en mesure de réaliser un projet, et de le comprendre. Si vous utilisez l'IA, attendez-vous à des questions très pointues. Cela peut se retourner contre vous.

**Q : Que faire si on n'arrive pas à finir toutes les fonctionnalités ?**  
R : Concentrez-vous sur un MVP fonctionnel. Mieux vaut moins de features qui marchent bien que beaucoup de features buggées.

**Q : Peut-on changer de sujet en cours de route ?**  
R : Possible mais déconseillé. Consultez vos formateurs avant.

**Q : Les projets d'entraînement sont-ils vraiment facultatifs ?**  
R : Oui, mais ils sont **fortement recommandés** pour vous préparer au projet final.

---

**Bon courage et bon développement !**
