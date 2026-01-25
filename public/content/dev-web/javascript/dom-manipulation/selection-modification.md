# Sélection & Modification du DOM

Maîtrisez la sélection d'éléments et la manipulation du DOM avec JavaScript moderne pour créer des interfaces dynamiques et interactives.

---

## Ce que vous allez apprendre

- Comprendre la structure du DOM
- Sélectionner des éléments avec `querySelector` et `querySelectorAll`
- Modifier le contenu, les attributs et les styles
- Créer, cloner et supprimer des éléments

## Prérequis

- [JavaScript - Fonctions](../fonctions/bases-fonctions.md)
- [HTML - Structure](../../html-css/balises-html/structure-essentielles.md)

---

## Qu'est-ce que le DOM ?

Le **DOM** (Document Object Model) est une représentation arborescente du document HTML. JavaScript peut le manipuler pour modifier la page dynamiquement.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Ma page</title>
  </head>
  <body>
    <div id="app">
      <h1 class="title">Titre</h1>
      <p>Paragraphe</p>
    </div>
  </body>
</html>
```

**Arbre DOM :**
```
document
└── html
    ├── head
    │   └── title
    │       └── "Ma page"
    └── body
        └── div#app
            ├── h1.title
            │   └── "Titre"
            └── p
                └── "Paragraphe"
```

---

## Sélection d'éléments

### querySelector (moderne, recommandé)

Sélectionne le **premier** élément qui correspond au sélecteur CSS.

```javascript
// Par ID
const app = document.querySelector('#app');

// Par classe
const title = document.querySelector('.title');

// Par balise
const paragraph = document.querySelector('p');

// Sélecteurs complexes
const firstLink = document.querySelector('nav a');
const activeButton = document.querySelector('button.active');
const dataItem = document.querySelector('[data-id="123"]');

// Si aucun élément trouvé → null
const notFound = document.querySelector('.does-not-exist');
console.log(notFound); // null

// ⚠️ Vérifier avant d'utiliser
if (notFound) {
  notFound.textContent = "Hello"; // Ne sera pas exécuté
}
```

### querySelectorAll

Sélectionne **tous** les éléments qui correspondent (retourne une **NodeList**).

```javascript
// Tous les paragraphes
const paragraphs = document.querySelectorAll('p');
console.log(paragraphs.length); // Nombre de <p>

// Toutes les classes .item
const items = document.querySelectorAll('.item');

// NodeList → peut être itérée
items.forEach((item, index) => {
  console.log(`Item ${index}:`, item.textContent);
});

// Convertir en tableau pour méthodes avancées
const itemsArray = Array.from(items);
const itemsArray2 = [...items]; // Spread operator

// Sélecteur complexe
const activeLinks = document.querySelectorAll('nav a.active');
const dataItems = document.querySelectorAll('[data-category="electronics"]');
```

### Méthodes anciennes (moins recommandées)

```javascript
// getElementById (ID uniquement, pas de #)
const app = document.getElementById('app');

// getElementsByClassName (retourne HTMLCollection, pas NodeList)
const titles = document.getElementsByClassName('title');

// getElementsByTagName
const divs = document.getElementsByTagName('div');

// ⚠️ HTMLCollection vs NodeList
// HTMLCollection : "live" (se met à jour automatiquement)
// NodeList : généralement statique (sauf certains cas)

const list = document.getElementsByClassName('item'); // HTMLCollection
console.log(list.length); // 3

// Ajouter un élément avec la classe 'item' dans le DOM
// list.length devient automatiquement 4 (live)

const list2 = document.querySelectorAll('.item'); // NodeList
// list2.length reste 3 (statique)

// ✅ Préférer querySelector/querySelectorAll (plus flexible)
```

### Sélection relative

```javascript
// Depuis un élément spécifique
const container = document.querySelector('#container');

// Chercher à l'intérieur de container
const button = container.querySelector('button');
const allButtons = container.querySelectorAll('button');

// Parent
const parent = button.parentElement;
const parentNode = button.parentNode; // Similaire mais inclut les text nodes

// Enfants
const firstChild = container.firstElementChild;
const lastChild = container.lastElementChild;
const children = container.children; // HTMLCollection

// Siblings (frères/sœurs)
const nextSibling = button.nextElementSibling;
const prevSibling = button.previousElementSibling;

// Ancêtre le plus proche qui correspond
const form = button.closest('form');
const section = button.closest('.section');
```

---

## Modification du contenu

### textContent

Modifie le texte brut (sans HTML).

```javascript
const title = document.querySelector('h1');

// Lire
console.log(title.textContent); // "Titre actuel"

// Modifier
title.textContent = "Nouveau titre";

// ⚠️ Échappe le HTML
title.textContent = "<strong>Bold</strong>"; // Affiché littéralement (pas interprété)
```

### innerHTML

Modifie le contenu HTML (⚠️ risque XSS).

```javascript
const container = document.querySelector('#container');

// Lire
console.log(container.innerHTML);
// "<h1>Titre</h1><p>Paragraphe</p>"

// Modifier
container.innerHTML = "<h2>Nouveau titre</h2><p>Nouveau contenu</p>";

// Ajouter du contenu
container.innerHTML += "<div>Nouvel élément</div>";

// ⚠️ Attention XSS si contenu vient de l'utilisateur
const userInput = "<img src=x onerror=alert('XSS')>";
// container.innerHTML = userInput; // ❌ Dangereux !

// ✅ Solution : échapper ou utiliser textContent
container.textContent = userInput; // Affiché littéralement (sûr)
```

### innerText vs textContent

```javascript
const element = document.querySelector('.element');

// textContent : retourne tout le texte (y compris caché)
console.log(element.textContent);

// innerText : respecte le rendu CSS (ignore display:none)
console.log(element.innerText);

// ✅ Préférer textContent (plus rapide et prévisible)
```

### outerHTML

Remplace l'élément entier (y compris la balise).

```javascript
const div = document.querySelector('.box');

console.log(div.outerHTML);
// "<div class="box">Contenu</div>"

div.outerHTML = "<section class='section'>Nouveau</section>";
// L'élément <div> est remplacé par <section>
```

---

## Modification des attributs

### getAttribute / setAttribute

```javascript
const link = document.querySelector('a');

// Lire un attribut
const href = link.getAttribute('href');
console.log(href); // "https://example.com"

// Modifier un attribut
link.setAttribute('href', 'https://newurl.com');
link.setAttribute('target', '_blank');

// Supprimer un attribut
link.removeAttribute('target');

// Vérifier l'existence
if (link.hasAttribute('target')) {
  console.log("A un attribut target");
}
```

### Propriétés directes (raccourcis)

```javascript
const input = document.querySelector('input');

// Propriétés courantes
console.log(input.value);     // Valeur du champ
console.log(input.type);      // Type (text, email, etc.)
console.log(input.name);      // Nom
console.log(input.placeholder);

input.value = "Nouvelle valeur";
input.disabled = true;
input.checked = true; // Pour checkboxes/radios

const img = document.querySelector('img');
console.log(img.src);  // URL absolue
console.log(img.alt);

img.src = "new-image.jpg";
img.alt = "Description";
```

### data-* attributes

```javascript
// HTML: <div data-user-id="123" data-role="admin">

const element = document.querySelector('.user');

// Accès via dataset (camelCase)
console.log(element.dataset.userId); // "123"
console.log(element.dataset.role);   // "admin"

// Modification
element.dataset.userId = "456";
element.dataset.newProp = "value";

// getAttribute/setAttribute fonctionnent aussi
const id = element.getAttribute('data-user-id');
element.setAttribute('data-status', 'active');
```

---

## Modification des classes

### classList (moderne, recommandé)

```javascript
const element = document.querySelector('.box');

// Ajouter une classe
element.classList.add('active');
element.classList.add('highlight', 'visible'); // Plusieurs à la fois

// Retirer une classe
element.classList.remove('active');
element.classList.remove('highlight', 'visible');

// Toggle (ajouter si absent, retirer si présent)
element.classList.toggle('active');

// Vérifier la présence
if (element.classList.contains('active')) {
  console.log("Element is active");
}

// Remplacer
element.classList.replace('old-class', 'new-class');

// Liste des classes
console.log(element.classList); // DOMTokenList ["box", "active"]
console.log(element.classList.length); // 2
```

### className (ancienne méthode)

```javascript
const element = document.querySelector('.box');

// Lire
console.log(element.className); // "box active"

// Modifier (écrase toutes les classes)
element.className = "new-class another-class";

// ⚠️ Moins pratique que classList
// Pour ajouter sans écraser :
element.className += " new-class"; // Attention à l'espace

// ✅ Préférer classList
```

---

## Modification des styles

### style (inline styles)

```javascript
const element = document.querySelector('.box');

// Lire
console.log(element.style.color); // "" si pas défini en inline

// Modifier (propriétés CSS en camelCase)
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.fontSize = "20px";
element.style.border = "2px solid black";

// Plusieurs propriétés
element.style.cssText = "color: red; font-size: 20px; padding: 10px;";

// Retirer un style
element.style.color = "";

// ⚠️ style ne lit que les styles inline (pas CSS externe)
// ✅ Pour lire : utiliser getComputedStyle
```

### getComputedStyle

Lire les styles calculés (CSS + inline).

```javascript
const element = document.querySelector('.box');

const styles = getComputedStyle(element);

console.log(styles.color);           // "rgb(255, 0, 0)"
console.log(styles.fontSize);        // "20px"
console.log(styles.backgroundColor); // "rgb(0, 0, 255)"

// Propriétés spécifiques
const width = styles.width;
const height = styles.height;

// ⚠️ En lecture seule (pour modifier, utiliser .style)
```

### Bonnes pratiques : classes > inline styles

```javascript
// ❌ Mauvais : styles inline
element.style.color = "red";
element.style.fontSize = "20px";
element.style.padding = "10px";

// ✅ Bon : classes CSS
element.classList.add('highlight');

/* CSS */
.highlight {
  color: red;
  font-size: 20px;
  padding: 10px;
}
```

---

## Création et insertion d'éléments

### createElement

```javascript
// Créer un élément
const div = document.createElement('div');
const p = document.createElement('p');
const button = document.createElement('button');

// Configurer l'élément
div.textContent = "Nouveau contenu";
div.className = "box";
div.id = "new-box";

button.textContent = "Cliquer";
button.classList.add('btn', 'btn-primary');
button.setAttribute('data-action', 'submit');

// L'élément est créé mais pas encore dans le DOM
```

### Insertion dans le DOM

```javascript
const container = document.querySelector('#container');
const newElement = document.createElement('div');
newElement.textContent = "Nouvel élément";

// 1. appendChild (à la fin)
container.appendChild(newElement);

// 2. insertBefore (avant un élément spécifique)
const referenceElement = container.firstElementChild;
container.insertBefore(newElement, referenceElement);

// 3. append (moderne, plusieurs éléments + texte)
container.append(newElement, "Texte", anotherElement);

// 4. prepend (au début)
container.prepend(newElement);

// 5. insertAdjacentElement (position spécifique)
const target = document.querySelector('.target');

target.insertAdjacentElement('beforebegin', newElement); // Avant target
target.insertAdjacentElement('afterbegin', newElement);  // Premier enfant
target.insertAdjacentElement('beforeend', newElement);   // Dernier enfant
target.insertAdjacentElement('afterend', newElement);    // Après target

// 6. insertAdjacentHTML (HTML string)
target.insertAdjacentHTML('beforeend', '<p>Nouveau</p>');
```

### Exemple complet

```javascript
// Créer une carte produit
function createProductCard(product) {
  // Conteneur
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  
  // Image
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  
  // Titre
  const title = document.createElement('h3');
  title.textContent = product.name;
  
  // Prix
  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `$${product.price}`;
  
  // Bouton
  const button = document.createElement('button');
  button.textContent = "Ajouter au panier";
  button.classList.add('btn', 'btn-primary');
  
  // Assembler
  card.append(img, title, price, button);
  
  return card;
}

// Utilisation
const product = {
  id: 1,
  name: "Laptop",
  price: 999,
  image: "laptop.jpg"
};

const card = createProductCard(product);
document.querySelector('#products').appendChild(card);
```

---

## Suppression d'éléments

```javascript
const element = document.querySelector('.to-remove');

// 1. remove (moderne)
element.remove();

// 2. removeChild (ancienne méthode)
const parent = element.parentElement;
parent.removeChild(element);

// Supprimer tous les enfants
const container = document.querySelector('#container');

// Méthode 1 : innerHTML
container.innerHTML = "";

// Méthode 2 : boucle
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Méthode 3 : replaceChildren (moderne)
container.replaceChildren();
```

---

## Clonage d'éléments

```javascript
const original = document.querySelector('.template');

// Clone superficiel (sans enfants)
const clone1 = original.cloneNode(false);

// Clone profond (avec enfants et événements)
const clone2 = original.cloneNode(true);

// Modifier le clone
clone2.textContent = "Clone modifié";

// Insérer
document.querySelector('#container').appendChild(clone2);
```

---

## Bonnes pratiques

### ✅ À faire

```javascript
// 1. Vérifier l'existence avant manipulation
const element = document.querySelector('.item');
if (element) {
  element.textContent = "Nouveau";
}

// 2. Utiliser querySelector pour sélections complexes
const activeButton = document.querySelector('button.active[data-action="submit"]');

// 3. classList pour les classes
element.classList.add('active');

// 4. Créer puis insérer (éviter innerHTML répété)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  fragment.appendChild(item);
}
document.querySelector('ul').appendChild(fragment); // Une seule insertion

// 5. Échapper le contenu utilisateur
element.textContent = userInput; // Pas innerHTML
```

### ❌ À éviter

```javascript
// 1. innerHTML dans les boucles (lent)
for (let i = 0; i < 100; i++) {
  container.innerHTML += `<li>Item ${i}</li>`; // ❌ Reparse tout le HTML à chaque fois
}

// 2. Modifier le style inline pour tout
element.style.color = "red"; // ❌ Préférer classes CSS

// 3. getElementById pour tout
const element = document.getElementById('id'); // OK mais querySelector plus flexible

// 4. Ne pas vérifier null
const element = document.querySelector('.not-exist');
element.textContent = "Text"; // ❌ TypeError si null
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Ne pas vérifier `null` | `querySelector` retourne `null` si non trouvé | Toujours vérifier avant manipulation |
| `innerHTML` pour contenu utilisateur | Faille XSS | Utiliser `textContent` |
| `innerHTML` dans boucle | Très lent (reparse complet) | Utiliser `DocumentFragment` |
| Style inline partout | Difficile à maintenir | Utiliser `classList` |

---

## Quiz de vérification

1. Quelle méthode sélectionne tous les éléments correspondants ?
   - A) `querySelector`
   - B) `querySelectorAll` ✅
   - C) `getElementById`

2. Comment modifier le texte d'un élément en sécurité ?
   - A) `element.innerHTML = userInput`
   - B) `element.textContent = userInput` ✅
   - C) `element.innerText = userInput`

3. Comment ajouter une classe sans écraser les autres ?
   - A) `element.className = "new"`
   - B) `element.classList.add("new")` ✅
   - C) `element.class = "new"`

4. Que retourne `querySelector` si aucun élément n'est trouvé ?
   - A) `undefined`
   - B) `null` ✅
   - C) Une erreur

---

## Prochaine étape

Découvrez les [Événements](./evenements.md) pour rendre vos pages interactives.
