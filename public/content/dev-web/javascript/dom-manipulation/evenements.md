# Événements

Maîtrisez la gestion des événements DOM pour créer des interactions utilisateur fluides : clics, saisie clavier, soumission de formulaires, et bien plus.

---

## Ce que vous allez apprendre

- Attacher des écouteurs d'événements avec `addEventListener`
- Comprendre l'objet `event` et ses propriétés
- Gérer la propagation (bubbling, capturing)
- Appliquer la délégation d'événements

## Prérequis

- [DOM - Sélection et modification](./selection-modification.md)
- [JavaScript - Fonctions](../fonctions/bases-fonctions.md)

---

## Qu'est-ce qu'un événement ?

Un **événement** est une action ou occurrence détectée par le navigateur : clic, saisie clavier, chargement de page, scroll, etc.

```javascript
// Réagir à un clic
const button = document.querySelector('button');

button.addEventListener('click', function() {
  console.log("Bouton cliqué !");
});
```

---

## addEventListener (méthode moderne)

### Syntaxe

```javascript
element.addEventListener(eventType, callback, options);

// eventType : "click", "keydown", "submit", etc.
// callback : fonction exécutée quand l'événement se produit
// options : objet de configuration (optionnel)
```

### Exemples basiques

```javascript
const button = document.querySelector('button');

// Clic
button.addEventListener('click', function(event) {
  console.log("Clicked!", event);
});

// Avec arrow function
button.addEventListener('click', (event) => {
  console.log("Clicked!", event);
});

// Fonction nommée (réutilisable)
function handleClick(event) {
  console.log("Clicked!", event);
}

button.addEventListener('click', handleClick);
```

---

## Objet Event

L'objet **event** contient des informations sur l'événement.

```javascript
button.addEventListener('click', (event) => {
  console.log(event.type);        // "click"
  console.log(event.target);      // Élément qui a déclenché l'événement
  console.log(event.currentTarget); // Élément sur lequel l'écouteur est attaché
  console.log(event.timeStamp);   // Timestamp
});

// Propriétés utiles
document.addEventListener('click', (e) => {
  console.log(e.clientX, e.clientY); // Position de la souris (viewport)
  console.log(e.pageX, e.pageY);     // Position (document entier)
  console.log(e.shiftKey);           // true si Shift enfoncée
  console.log(e.ctrlKey);            // true si Ctrl enfoncée
  console.log(e.altKey);             // true si Alt enfoncée
});
```

---

## Événements de souris

### click

```javascript
button.addEventListener('click', (e) => {
  console.log("Cliqué!");
  console.log("Position:", e.clientX, e.clientY);
});
```

### dblclick (double-clic)

```javascript
element.addEventListener('dblclick', () => {
  console.log("Double-cliqué!");
});
```

### mousedown / mouseup

```javascript
button.addEventListener('mousedown', () => {
  console.log("Bouton de souris enfoncé");
});

button.addEventListener('mouseup', () => {
  console.log("Bouton de souris relâché");
});
```

### mouseenter / mouseleave

```javascript
// mouseenter : entre dans l'élément (ne bulle pas)
element.addEventListener('mouseenter', () => {
  console.log("Souris entrée");
});

// mouseleave : quitte l'élément (ne bulle pas)
element.addEventListener('mouseleave', () => {
  console.log("Souris sortie");
});

// mouseover / mouseout : bulle (déclenché aussi pour les enfants)
element.addEventListener('mouseover', () => {
  console.log("Mouse over");
});
```

### mousemove

```javascript
// Déclenché à chaque mouvement de souris
element.addEventListener('mousemove', (e) => {
  console.log("Position:", e.clientX, e.clientY);
});

// Exemple : curseur personnalisé
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
```

---

## Événements de clavier

### keydown / keyup

```javascript
// keydown : touche enfoncée
document.addEventListener('keydown', (e) => {
  console.log("Touche:", e.key);        // "a", "Enter", "ArrowUp"
  console.log("Code:", e.code);         // "KeyA", "Enter", "ArrowUp"
  console.log("Shift:", e.shiftKey);    // true si Shift enfoncée
});

// keyup : touche relâchée
document.addEventListener('keyup', (e) => {
  console.log("Touche relâchée:", e.key);
});

// Exemple : navigation avec flèches
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    console.log("Haut");
  } else if (e.key === 'ArrowDown') {
    console.log("Bas");
  } else if (e.key === 'Enter') {
    console.log("Entrée");
  }
});
```

### input (champ de saisie)

```javascript
const input = document.querySelector('input');

// Déclenché à chaque changement de valeur
input.addEventListener('input', (e) => {
  console.log("Valeur:", e.target.value);
});

// Exemple : recherche en temps réel
input.addEventListener('input', (e) => {
  const query = e.target.value;
  console.log(`Recherche: ${query}`);
  // Appel API...
});
```

### change

```javascript
// Déclenché quand l'élément perd le focus ET que la valeur a changé
input.addEventListener('change', (e) => {
  console.log("Valeur finale:", e.target.value);
});

// Pour select
const select = document.querySelector('select');
select.addEventListener('change', (e) => {
  console.log("Option sélectionnée:", e.target.value);
});

// Pour checkbox
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', (e) => {
  console.log("Coché:", e.target.checked);
});
```

---

## Événements de formulaire

### submit

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Empêcher le rechargement de la page
  
  // Récupérer les valeurs
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  
  console.log("Soumis:", name, email);
  
  // Validation
  if (!name || !email) {
    alert("Remplir tous les champs");
    return;
  }
  
  // Traitement...
});
```

### focus / blur

```javascript
const input = document.querySelector('input');

// focus : élément reçoit le focus
input.addEventListener('focus', () => {
  console.log("Input focused");
  input.style.borderColor = "blue";
});

// blur : élément perd le focus
input.addEventListener('blur', () => {
  console.log("Input blurred");
  input.style.borderColor = "";
});
```

---

## Événements de document

### DOMContentLoaded

```javascript
// DOM prêt (HTML parsé, sans attendre images/CSS)
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM ready!");
  // Initialisation de l'app
});

// load : tout chargé (images, CSS, etc.)
window.addEventListener('load', () => {
  console.log("Page fully loaded");
});
```

### scroll

```javascript
// Déclenché au scroll
window.addEventListener('scroll', () => {
  console.log("Scroll position:", window.scrollY);
});

// Exemple : afficher un bouton "Retour en haut"
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});
```

### resize

```javascript
// Déclenché au redimensionnement
window.addEventListener('resize', () => {
  console.log("Width:", window.innerWidth);
  console.log("Height:", window.innerHeight);
});
```

---

## Propagation des événements

### Bubbling (remontée)

Par défaut, les événements **remontent** dans le DOM (de l'enfant vers le parent).

```javascript
// HTML : <div id="parent"><button id="child">Cliquer</button></div>

const parent = document.querySelector('#parent');
const child = document.querySelector('#child');

parent.addEventListener('click', () => {
  console.log("Parent cliqué");
});

child.addEventListener('click', () => {
  console.log("Child cliqué");
});

// Clic sur child affiche :
// "Child cliqué"
// "Parent cliqué" (bubbling)
```

### stopPropagation

```javascript
child.addEventListener('click', (e) => {
  e.stopPropagation(); // Arrête la propagation
  console.log("Child cliqué");
});

// Clic sur child affiche seulement :
// "Child cliqué"
```

### Capturing (descente)

Phase de capture (de la racine vers la cible).

```javascript
// Option { capture: true }
parent.addEventListener('click', () => {
  console.log("Parent (capturing)");
}, { capture: true });

child.addEventListener('click', () => {
  console.log("Child");
});

// Clic sur child affiche :
// "Parent (capturing)" (descente)
// "Child"
```

### event.target vs event.currentTarget

```javascript
parent.addEventListener('click', (e) => {
  console.log("target:", e.target);         // Élément cliqué (child)
  console.log("currentTarget:", e.currentTarget); // Élément avec écouteur (parent)
});
```

---

## Délégation d'événements

Attacher un seul écouteur sur un parent pour gérer plusieurs enfants.

### Problème

```javascript
// ❌ Inefficace : beaucoup d'écouteurs
const buttons = document.querySelectorAll('.item button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    console.log("Clicked");
  });
});

// Si 1000 boutons → 1000 écouteurs
```

### Solution : délégation

```javascript
// ✅ Un seul écouteur sur le parent
const list = document.querySelector('#list');

list.addEventListener('click', (e) => {
  // Vérifier si l'élément cliqué est un bouton
  if (e.target.matches('button.delete')) {
    const item = e.target.closest('.item');
    item.remove();
  }
});

// Avantages :
// - Un seul écouteur
// - Fonctionne pour les éléments ajoutés dynamiquement
```

### Exemple complet

```javascript
const todoList = document.querySelector('#todoList');

todoList.addEventListener('click', (e) => {
  const target = e.target;
  
  // Supprimer
  if (target.matches('.delete-btn')) {
    target.closest('.todo-item').remove();
  }
  
  // Toggle completed
  if (target.matches('.toggle-btn')) {
    target.closest('.todo-item').classList.toggle('completed');
  }
  
  // Éditer
  if (target.matches('.edit-btn')) {
    const item = target.closest('.todo-item');
    const text = item.querySelector('.text');
    // Logique d'édition...
  }
});
```

---

## Retirer un écouteur

### removeEventListener

```javascript
function handleClick() {
  console.log("Clicked");
}

// Ajouter
button.addEventListener('click', handleClick);

// Retirer (fonction identique requise)
button.removeEventListener('click', handleClick);

// ⚠️ Ne fonctionne PAS avec des fonctions anonymes
button.addEventListener('click', function() {
  console.log("Clicked");
});

// button.removeEventListener('click', ???); // Impossible
```

### Option { once: true }

```javascript
// Écouteur exécuté une seule fois puis retiré automatiquement
button.addEventListener('click', () => {
  console.log("Cliqué une fois");
}, { once: true });
```

---

## Prévenir le comportement par défaut

### preventDefault

```javascript
// Empêcher la soumission de formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log("Formulaire non soumis");
});

// Empêcher le clic droit
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log("Clic droit désactivé");
});

// Empêcher le clic sur un lien
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("Lien non suivi");
});
```

---

## Options avancées

```javascript
element.addEventListener('click', callback, {
  capture: false,   // Phase de capture (false = bubbling)
  once: false,      // Retirer après la première exécution
  passive: false    // Ne jamais appeler preventDefault (optimisation)
});

// Exemple : scroll optimisé
window.addEventListener('scroll', handleScroll, { passive: true });
// passive: true = garantit que preventDefault ne sera pas appelé
// → navigateur peut optimiser le scroll
```

---

## Événements personnalisés

### CustomEvent

```javascript
// Créer un événement personnalisé
const event = new CustomEvent('user:login', {
  detail: { username: "Alice", time: Date.now() }
});

// Écouter
document.addEventListener('user:login', (e) => {
  console.log("User logged in:", e.detail.username);
});

// Déclencher
document.dispatchEvent(event);

// Exemple : communication entre composants
function loginUser(username) {
  // Logique de connexion...
  
  // Notifier l'application
  const event = new CustomEvent('user:login', {
    detail: { username }
  });
  document.dispatchEvent(event);
}

// Autre partie de l'app écoute
document.addEventListener('user:login', (e) => {
  updateUI(e.detail.username);
});
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. Délégation d'événements
list.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    // ...
  }
});

// 2. preventDefault pour formulaires
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Traitement personnalisé
});

// 3. Fonction nommée pour retirer l'écouteur
function handleClick() { /* ... */ }
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// 4. Vérifier l'existence
const button = document.querySelector('button');
if (button) {
  button.addEventListener('click', handleClick);
}

// 5. Passive pour scroll/touch
window.addEventListener('scroll', handler, { passive: true });
```

### ❌ À éviter

```javascript
// 1. onclick inline (difficile à maintenir)
// <button onclick="handleClick()">Click</button> ❌

// 2. Propriété onclick (un seul écouteur)
button.onclick = function() { }; // ❌ Écrase les autres

// 3. Trop d'écouteurs sur des éléments dynamiques
buttons.forEach(btn => {
  btn.addEventListener('click', handler); // ❌ Utiliser délégation
});

// 4. Fonctions anonymes si besoin de removeEventListener
button.addEventListener('click', () => { }); // ❌ Impossible à retirer
```

---

## Exercice pratique

### 🎯 Application interactive

Créez `events-exercise.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Events Exercise</title>
  <style>
    .card { padding: 20px; margin: 10px; border: 1px solid #ccc; cursor: pointer; }
    .card.active { background: lightblue; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>Exercice Événements</h1>
  
  <input type="text" id="search" placeholder="Rechercher...">
  <div id="results"></div>
  
  <form id="userForm">
    <input type="text" name="name" placeholder="Nom" required>
    <input type="email" name="email" placeholder="Email" required>
    <button type="submit">Soumettre</button>
  </form>
  
  <div id="cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
  
  <button id="addCard">Ajouter une carte</button>
  
  <div id="info" class="hidden">
    <p>Position: <span id="position"></span></p>
    <p>Touche: <span id="key"></span></p>
  </div>
  
  <script src="events-exercise.js"></script>
</body>
</html>
```

**Implémenter :**

1. **Recherche en temps réel** : Afficher la valeur du champ dans `#results`
2. **Formulaire** : Valider et afficher les données sans recharger
3. **Cartes** : Clic pour toggle `.active`, délégation d'événements
4. **Ajouter carte** : Créer une nouvelle carte dynamiquement
5. **Info souris** : Afficher position et dernière touche
6. **Touches flèches** : Logger "Haut", "Bas", "Gauche", "Droite"

```javascript
// Solution partielle
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const form = document.querySelector('#userForm');
const cards = document.querySelector('#cards');
const addCardBtn = document.querySelector('#addCard');
const info = document.querySelector('#info');
const position = document.querySelector('#position');
const keyEl = document.querySelector('#key');

// 1. Recherche en temps réel
search.addEventListener('input', (e) => {
  results.textContent = `Recherche: "${e.target.value}"`;
});

// 2. Formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  
  alert(`Utilisateur: ${name} (${email})`);
  form.reset();
});

// 3. Cartes (délégation)
let cardCount = 3;

cards.addEventListener('click', (e) => {
  if (e.target.matches('.card')) {
    e.target.classList.toggle('active');
  }
});

// 4. Ajouter carte
addCardBtn.addEventListener('click', () => {
  cardCount++;
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = `Card ${cardCount}`;
  cards.appendChild(card);
});

// 5. Info souris et clavier
document.addEventListener('mousemove', (e) => {
  info.classList.remove('hidden');
  position.textContent = `${e.clientX}, ${e.clientY}`;
});

document.addEventListener('keydown', (e) => {
  keyEl.textContent = e.key;
  
  // 6. Flèches
  if (e.key.startsWith('Arrow')) {
    const direction = e.key.replace('Arrow', '');
    console.log(direction);
  }
});
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier `preventDefault()` | Formulaire se soumet | Appeler `e.preventDefault()` |
| Listener sur élément dynamique | Ne fonctionne pas | Utiliser la délégation |
| `this` incorrect | undefined ou window | Utiliser `e.target` ou `e.currentTarget` |
| Listener non retiré | Memory leak | Appeler `removeEventListener` |

---

## Quiz de vérification

1. Quelle méthode ajoute un écouteur d'événement ?
   - A) `onclick`
   - B) `addEventListener` ✅
   - C) `attachEvent`

2. Comment empêcher le comportement par défaut ?
   - A) `e.stopPropagation()`
   - B) `e.preventDefault()` ✅
   - C) `return false`

3. Qu'est-ce que le bubbling ?
   - A) L'événement descend du parent aux enfants
   - B) L'événement remonte des enfants au parent ✅
   - C) L'événement reste sur l'élément

4. Pourquoi utiliser la délégation ?
   - A) Pour améliorer les performances avec beaucoup d'éléments ✅
   - B) Pour accélérer le rendu
   - C) Pour empêcher les erreurs

---

## Prochaine étape

Découvrez les [APIs Modernes](../apis-modernes/fetch-api.md) pour communiquer avec des serveurs.
