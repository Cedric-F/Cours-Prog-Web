# Projet - Jeu de Taquin (Sliding Puzzle)

## Objectif

Créer un jeu de taquin (puzzle à glissement) interactif en utilisant **HTML, CSS et JavaScript Vanilla**. Ce projet renforce la manipulation du DOM, la gestion d'événements et la logique algorithmique.

## Description du Projet

Le jeu de taquin est un puzzle classique composé de cases numérotées qui glissent dans une grille. Une case est vide, permettant aux cases adjacentes de se déplacer. L'objectif est de remettre toutes les cases dans l'ordre en effectuant le minimum de mouvements.

## Règles du Jeu

1. Le plateau est une grille **3x3** (ou 4x4 pour plus de difficulté) avec 8 cases numérotées (1 à 8) et 1 case vide
2. L'ordre initial est **mélangé** de manière aléatoire
3. Le joueur peut **cliquer sur une case adjacente à la case vide** pour la faire glisser
4. Les cases ne peuvent se déplacer que **verticalement ou horizontalement** (pas en diagonale)
5. Le jeu est gagné quand les cases sont dans l'ordre : 
   ```
   1  2  3
   4  5  6
   7  8  [ ]
   ```
6. Affichage du nombre de coups et du temps écoulé

## Contraintes Techniques

### Obligatoire
- **HTML5** : Structure de la grille
- **CSS3** : Stylisation et animations de glissement
- **JavaScript Vanilla** : Logique du jeu, déplacement des cases, détection de victoire
- **Pas de framework** : Code JavaScript pur

### Technologies Autorisées
- HTML5
- CSS3 (transitions, animations)
- JavaScript ES6+

## Fonctionnalités Minimum Attendues

### Fonctionnalités de Base
1. **Grille de jeu** : 3x3 (8 cases + 1 vide)
2. **Mélange initial** : Cases mélangées de manière résolvable
3. **Déplacement des cases** : 
   - Clic sur une case adjacente à la case vide
   - Animation de glissement fluide
4. **Compteur de coups** : Nombre de mouvements effectués
5. **Chronomètre** : Temps écoulé depuis le début
6. **Détection de victoire** : Vérification si l'ordre est correct
7. **Bouton Shuffle** : Mélange pour recommencer

### Fonctionnalités Bonus (Optionnelles)
- **Contrôles clavier** : Flèches directionnelles pour déplacer les cases
- **Tailles de grille variables** : 3x3, 4x4, 5x5
- **Images au lieu de numéros** : Reconstituer une image
- **Algorithme de résolution** : Bouton "Résoudre automatiquement"
- **Meilleur score** : Sauvegarde dans localStorage
- **Historique des mouvements** : Possibilité d'annuler (undo)
- **Mode chronomètre inversé** : Temps limite pour résoudre
- **Animations avancées** : Effets 3D, particules à la victoire

## Suggestions et Pistes

### Structure HTML

```html
<div class="game-container">
  <div class="header">
    <h1>Jeu de Taquin</h1>
    <div class="stats">
      <span>Coups: <span id="moves">0</span></span>
      <span>Temps: <span id="timer">00:00</span></span>
    </div>
  </div>
  
  <div class="puzzle-board" id="puzzle-board">
    <!-- Cases générées dynamiquement -->
  </div>
  
  <div class="controls">
    <button id="shuffle">Mélanger</button>
    <button id="solve">Résoudre</button>
  </div>
  
  <div class="modal" id="victory-modal">
    <!-- Message de victoire -->
  </div>
</div>
```

### Stylisation CSS

**Grille et Cases :**
```css
.puzzle-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  background: #34495e;
  padding: 5px;
  border-radius: 10px;
}

.tile {
  background: linear-gradient(145deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.tile:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.tile.empty {
  background: transparent;
  cursor: default;
}

.tile.moveable {
  cursor: pointer;
}
```

### Logique JavaScript

**Pistes pour la structure du code :**

1. **Représentation de l'état**
   ```javascript
   // Représentation de la grille (0 = case vide)
   let board = [
     [1, 2, 3],
     [4, 5, 6],
     [7, 8, 0]
   ];
   
   // Ou en tableau unidimensionnel
   let board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
   ```

2. **Détection des cases adjacentes**
   - Trouver la position de la case vide
   - Vérifier si la case cliquée est adjacente (même ligne/colonne, distance 1)
   - Échanger les positions

3. **Algorithme de mélange**
   - ⚠️ **Attention** : Un mélange aléatoire peut créer une configuration non résolvable
   - **Solution** : Effectuer N mouvements aléatoires valides à partir de la position gagnante
   - Ou utiliser un algorithme de vérification de résolvabilité (inversions)

4. **Détection de victoire**
   ```javascript
   function isWinningState(board) {
     const winningState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
     return board.every((val, idx) => val === winningState[idx]);
   }
   ```

5. **Animation de déplacement**
   - Calculer la position source et destination
   - Utiliser CSS transitions ou animations JavaScript
   - Attendre la fin de l'animation avant d'autoriser un nouveau mouvement

**Exemple de structure :**

```javascript
class SlidingPuzzle {
  constructor(size = 3) {
    this.size = size;
    this.board = this.createSolvedBoard();
    this.emptyPos = { row: size - 1, col: size - 1 };
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
  }

  createSolvedBoard() {
    // Créer la grille résolue
  }

  shuffle() {
    // Mélanger la grille de manière résolvable
  }

  isMoveable(row, col) {
    // Vérifier si la case peut bouger
  }

  moveTile(row, col) {
    // Déplacer la case si possible
  }

  checkWin() {
    // Vérifier si le puzzle est résolu
  }

  render() {
    // Afficher la grille dans le DOM
  }
}
```

## Étapes Suggérées

1. **Structure HTML/CSS**
   - Créer la grille avec CSS Grid
   - Styliser les cases
   - Ajouter les éléments de statistiques

2. **JavaScript - Initialisation**
   - Créer la représentation de la grille (tableau 2D ou 1D)
   - Générer les éléments DOM des cases
   - Afficher la grille résolue initialement

3. **JavaScript - Déplacement**
   - Détecter le clic sur une case
   - Vérifier si la case est adjacente à la case vide
   - Échanger les positions
   - Animer le déplacement

4. **JavaScript - Mélange**
   - Implémenter l'algorithme de mélange résolvable
   - Effectuer N mouvements aléatoires valides
   - Tester que la configuration est jouable

5. **JavaScript - Détection de victoire**
   - Vérifier après chaque mouvement si le puzzle est résolu
   - Afficher la modale de victoire
   - Arrêter le chronomètre

6. **Statistiques**
   - Compteur de coups
   - Chronomètre
   - Meilleur score (localStorage)

7. **Bonus**
   - Contrôles clavier
   - Différentes tailles de grille
   - Images à la place des numéros
   - Algorithme de résolution automatique (complexe)

## Critères d'Évaluation

- **Fonctionnalité** : Le jeu fonctionne sans bugs, déplacements corrects
- **Algorithme de mélange** : Configuration toujours résolvable
- **Animations** : Transitions fluides lors des déplacements
- **Détection de victoire** : Précise et fiable
- **Code JavaScript** : Propre, modulaire, commenté
- **UX/UI** : Interface claire et intuitive
- **Responsive** : Adaptation aux différents écrans
- **Performance** : Pas de lag lors des animations

## Compétences Travaillées

- **Structures de données** : Tableaux 2D, représentation de grille
- **Algorithmes** : Déplacement, mélange, détection adjacence
- **Manipulation DOM** : Génération dynamique, mise à jour
- **Événements** : Clics souris, touches clavier
- **Animations CSS/JS** : Transitions fluides
- **Logique de jeu** : États, règles, conditions de victoire
- **Optimisation** : Éviter les configurations non résolvables
- **Math** : Calculs de positions, coordonnées

## Ressources Utiles

- [MDN - CSS Grid Layout](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout)
- [MDN - CSS Transitions](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Transitions)
- [Fisher-Yates Shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [Keyboard Event Handling](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent)

## Défis Algorithmiques

### Vérification de résolvabilité
Pour une grille 3x3 ou 4x4, toutes les configurations ne sont pas résolvables. Il existe un critère mathématique basé sur le nombre d'inversions.

**Piste** : Comptez le nombre de paires de cases où la case de gauche a une valeur supérieure à celle de droite (en ignorant la case vide). Si ce nombre est pair, le puzzle est résolvable.

### Résolution automatique (Très difficile)
Implémenter un solveur automatique nécessite un algorithme de recherche comme :
- **A\* (A-star)** : Recherche de chemin avec heuristique
- **BFS (Breadth-First Search)** : Recherche en largeur
- **Manhattan Distance** : Heuristique pour estimer la distance à la solution

Ceci est un bonus très avancé !

---
