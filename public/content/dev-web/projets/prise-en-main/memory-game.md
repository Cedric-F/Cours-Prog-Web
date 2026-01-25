# Projet - Memory Game (Jeu de Mémoire)

## Objectif

Créer un jeu de mémoire interactif (Memory Game) en utilisant **HTML, CSS et JavaScript Vanilla**. Ce projet vous permettra de maîtriser la manipulation du DOM, la gestion des événements et la logique de jeu.

## Description du Projet

Le Memory Game est un jeu classique où le joueur doit retrouver des paires de cartes identiques. Les cartes sont disposées face cachée, et le joueur retourne deux cartes à la fois. Si elles sont identiques, elles restent visibles ; sinon, elles se retournent à nouveau.

---
| | | | |
|---|---|---|---|
| 🍎 | 🍌 | 🥝 | 🍇 |
| 🍓 | 🍒 | 🍉 | 🥝 |
| 🍌 | 🍓 | 🍎 | 🍑 |
| 🍒 | 🍉 | 🍇 | 🍑 |

---

Time: 00:12  
Score: ⭐⭐⭐  
[Rejouer !]

---

## Règles du Jeu

1. Toutes les cartes sont disposées face cachée au début
2. Le joueur clique sur une première carte pour la retourner
3. Le joueur clique sur une deuxième carte
4. **Si les deux cartes sont identiques** :
   - Elles restent visibles (face découverte)
   - Le score augmente
5. **Si les deux cartes sont différentes** :
   - Elles se retournent face cachée après un court délai (1-2 secondes)
   - Le nombre de coups augmente
6. Le jeu se termine quand toutes les paires ont été trouvées
7. Affichage du score final : nombre de coups utilisés et temps écoulé

## Contraintes Techniques

### Obligatoire
- **HTML5** : Structure de la grille de cartes
- **CSS3** : Stylisation et animations (flip des cartes)
- **JavaScript Vanilla** : Logique du jeu, manipulation DOM, gestion des événements
- **Pas de framework** : Ni React, ni Vue, ni jQuery

### Technologies Autorisées
- HTML5
- CSS3 (animations, transitions, transforms)
- JavaScript ES6+

## Fonctionnalités Minimum Attendues

### Fonctionnalités de Base
1. **Grille de cartes** : 16 cartes (8 paires) disposées en grille 4x4
2. **Retournement de carte** : Animation de flip au clic
3. **Détection de paire** : Vérification si deux cartes retournées sont identiques
4. **Compteur de coups** : Affichage du nombre de tentatives
5. **Chronomètre** : Affichage du temps écoulé depuis le début de la partie
6. **Fin de partie** : Message de victoire avec statistiques (coups, temps)
7. **Bouton Restart** : Permet de recommencer une nouvelle partie

### Fonctionnalités Bonus (Optionnelles)
- **Niveaux de difficulté** : Facile (3x4), Moyen (4x4), Difficile (6x6)
- **Système de score** : Calcul basé sur le temps et le nombre de coups
- **Meilleur score** : Sauvegarde dans localStorage
- **Effets sonores** : Sons au flip, à la réussite, à l'échec
- **Thèmes de cartes** : Émojis, images, icônes Font Awesome
- **Mode multijoueur** : Deux joueurs tour par tour
- **Tableau des scores** : Top 5 des meilleurs performances
- **Animations** : Particules à la victoire, shake lors d'une erreur

## Suggestions et Pistes

### Structure HTML

```html
<div class="game-container">
  <div class="header">
    <h1>Memory Game</h1>
    <div class="stats">
      <span>Coups: <span id="moves">0</span></span>
      <span>Temps: <span id="timer">00:00</span></span>
    </div>
    <button id="restart">Nouvelle Partie</button>
  </div>
  
  <div class="game-board" id="game-board">
    <!-- Les cartes seront générées dynamiquement en JS -->
  </div>
  
  <div class="modal" id="victory-modal" style="display: none;">
    <!-- Message de victoire -->
  </div>
</div>
```

### Stylisation CSS

**Carte avec effet Flip :**
```css
.card {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

### Logique JavaScript

**Pistes pour la structure du code :**

1. **Initialisation du jeu**
   - Créer un tableau de paires de cartes
   - Mélanger les cartes (algorithme de Fisher-Yates)
   - Générer les éléments DOM dynamiquement

2. **Gestion des événements**
   - Écouter les clics sur les cartes
   - Empêcher le clic sur une carte déjà retournée
   - Limiter à deux cartes retournées à la fois

3. **Vérification des paires**
   - Comparer les deux cartes retournées
   - Si match : les garder visibles, incrémenter le score
   - Si pas match : les cacher après un délai

4. **Chronomètre**
   - Démarrer au premier clic
   - Mettre à jour chaque seconde avec `setInterval`
   - Arrêter à la fin de la partie

5. **Fin de partie**
   - Détecter quand toutes les paires sont trouvées
   - Afficher la modale de victoire
   - Proposer de recommencer

**Exemple de structure de données :**

```javascript
const cardValues = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍑', '🥝'];
const cards = [...cardValues, ...cardValues]; // Doubler pour les paires

// Mélanger (Fisher-Yates Shuffle)
function shuffle(array) {
  // À implémenter
}

// État du jeu
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
```

## 🚀 Étapes Suggérées

1. **HTML de base**
   - Créer la structure du conteneur
   - Ajouter les éléments de statistiques et boutons

2. **CSS**
   - Créer la grille de cartes avec CSS Grid ou Flexbox
   - Implémenter l'animation de flip en 3D
   - Styliser les cartes (face avant/arrière)

3. **JavaScript - Génération**
   - Créer le tableau de cartes
   - Mélanger les cartes
   - Générer les éléments DOM dynamiquement

4. **JavaScript - Logique de jeu**
   - Gérer le clic sur une carte
   - Implémenter la vérification des paires
   - Gérer les états (cartes retournées, bloquées)

5. **JavaScript - Statistiques**
   - Implémenter le compteur de coups
   - Implémenter le chronomètre
   - Détecter la fin de partie

6. **Finitions**
   - Ajouter la modale de victoire
   - Implémenter le bouton restart
   - Ajouter des animations et transitions

7. **Bonus**
   - Ajouter le localStorage pour les meilleurs scores
   - Implémenter différents niveaux de difficulté
   - Ajouter des effets sonores

## Critères d'Évaluation

- **Fonctionnalité** : Le jeu fonctionne correctement sans bugs
- **Manipulation DOM** : Génération dynamique propre et efficace
- **Gestion d'événements** : Écouteurs bien implémentés
- **Logique de jeu** : Algorithme de vérification correct
- **Animation CSS** : Effet flip fluide et esthétique
- **Code JavaScript** : Propre, commenté, organisé
- **UX/UI** : Interface intuitive et attrayante
- **Responsive** : Adaptation aux différentes tailles d'écran

## Compétences Travaillées

- **Manipulation du DOM** : `querySelector`, `createElement`, `appendChild`
- **Gestion d'événements** : `addEventListener`, délégation d'événements
- **Logique algorithmique** : Shuffle, vérification de paires
- **Timers JavaScript** : `setTimeout`, `setInterval`
- **Animations CSS** : `transform`, `transition`, `backface-visibility`
- **CSS Grid/Flexbox** : Mise en page de la grille
- **localStorage** : Sauvegarde des scores (bonus)
- **États et conditions** : Gestion des états du jeu

## Ressources Utiles

- [MDN - Introduction aux événements](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Building_blocks/Events)
- [MDN - Manipulation du DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model)
- [CSS-Tricks - Card Flip Effect](https://css-tricks.com/almanac/properties/b/backface-visibility/)
- [Fisher-Yates Shuffle Algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [MDN - setTimeout et setInterval](https://developer.mozilla.org/fr/docs/Web/API/setTimeout)

---
