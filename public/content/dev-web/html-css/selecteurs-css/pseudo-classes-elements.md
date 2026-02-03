# Pseudo-classes & Pseudo-éléments

Exploitez la puissance des pseudo-classes pour cibler des états dynamiques et des pseudo-éléments pour créer du contenu CSS sans toucher au HTML.

---

## Pseudo-classes d'interaction

Les pseudo-classes ciblent des états spécifiques des éléments.

### :hover

Déclenché quand la souris survole un élément.

```css
/* Bouton au survol */
button:hover {
  background: #0056b3;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Lien au survol */
a:hover {
  color: #ff6b6b;
  text-decoration: underline;
}

/* Card interactive */
.card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

/* Image zoom au survol */
.gallery img:hover {
  transform: scale(1.1);
  cursor: zoom-in;
}
```

### :active

Déclenché pendant le clic (entre mousedown et mouseup).

```css
button:active {
  transform: scale(0.95);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

a:active {
  color: #c0392b;
}
```

### :focus

Déclenché quand l'élément a le focus (clavier, clic).

```css
/* Input avec focus */
input:focus {
  outline: none;
  border: 2px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
}

/* Textarea avec focus */
textarea:focus {
  border-color: #28a745;
  background: #f8fff9;
}

/* Bouton avec focus (accessibilité) */
button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

### :focus-visible

Focus visible uniquement pour la navigation au clavier (pas au clic).

```css
/* Focus clavier uniquement */
button:focus-visible {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Pas d'outline au clic, mais au clavier oui */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### :focus-within

Cible un élément dont un descendant a le focus.

```css
/* Form avec un champ actif */
form:focus-within {
  background: #f8f9fa;
  border: 2px solid #007bff;
  padding: 20px;
}

/* Navigation contenant un lien actif */
nav:focus-within {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

---

## Pseudo-classes de formulaire

### :checked

Cible les checkboxes et radios cochés.

```css
/* Checkbox cochée */
input[type="checkbox"]:checked {
  background: #28a745;
  border-color: #28a745;
}

/* Label suivant un checkbox coché */
input[type="checkbox"]:checked + label {
  font-weight: bold;
  color: #28a745;
}

/* Radio coché */
input[type="radio"]:checked + label::before {
  content: "✓ ";
  color: green;
}
```

**Exemple : Toggle Switch**
```html
<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>
```

```css
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider::before {
  transform: translateX(26px);
}
```

### :disabled

Cible les éléments désactivés.

```css
input:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}

button:disabled:hover {
  background: #ccc; /* Pas de hover */
}
```

### :enabled

Cible les éléments activés (par défaut).

```css
input:enabled {
  border: 1px solid #ced4da;
}

input:enabled:focus {
  border-color: #007bff;
}
```

### :valid et :invalid

Validation HTML5 automatique.

```css
/* Input valide */
input:valid {
  border-color: #28a745;
}

input:valid::after {
  content: "✓";
  color: green;
}

/* Input invalide */
input:invalid {
  border-color: #dc3545;
}

input:invalid:focus {
  box-shadow: 0 0 0 3px rgba(220,53,69,0.25);
}

/* Email invalide */
input[type="email"]:invalid {
  background-image: url('error-icon.svg');
  background-position: right 10px center;
  background-repeat: no-repeat;
}
```

### :required et :optional

```css
/* Champs requis */
input:required {
  border-left: 3px solid #dc3545;
}

/* Champs optionnels */
input:optional {
  border-left: 3px solid #6c757d;
}

/* Label des champs requis */
input:required + label::after {
  content: " *";
  color: red;
}
```

### :placeholder-shown

Quand le placeholder est visible (input vide).

```css
input:placeholder-shown {
  border-color: #ccc;
}

input:not(:placeholder-shown) {
  border-color: #007bff;
}
```

---

## Pseudo-classes structurelles

### :first-child et :last-child

```css
/* Premier élément */
li:first-child {
  font-weight: bold;
  margin-top: 0;
}

/* Dernier élément */
li:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

/* Premier paragraphe d'un article */
article p:first-child {
  font-size: 1.2em;
  font-weight: 500;
}
```

### :nth-child()

Cible des éléments selon leur position.

```css
/* Éléments pairs */
li:nth-child(even) {
  background: #f8f9fa;
}

/* Éléments impairs */
li:nth-child(odd) {
  background: white;
}

/* Tous les 3 éléments */
li:nth-child(3n) {
  border-left: 3px solid #007bff;
}

/* Les 5 premiers */
li:nth-child(-n+5) {
  font-weight: bold;
}

/* À partir du 3ème */
li:nth-child(n+3) {
  color: #666;
}

/* Le 4ème élément */
li:nth-child(4) {
  background: yellow;
}
```

**Exemples pratiques :**
```css
/* Zebra striping (tableau) */
tr:nth-child(even) {
  background: #f2f2f2;
}

/* Grille 3 colonnes - dernier item de chaque ligne */
.grid-item:nth-child(3n) {
  margin-right: 0;
}

/* Colonnes colorées alternées */
.col:nth-child(4n+1) { background: #ff6b6b; }
.col:nth-child(4n+2) { background: #4ecdc4; }
.col:nth-child(4n+3) { background: #45b7d1; }
.col:nth-child(4n+4) { background: #f9ca24; }
```

### :nth-of-type()

Similaire à nth-child, mais compte uniquement les éléments du même type.

```css
/* Tous les <p> pairs */
p:nth-of-type(even) {
  background: #f0f0f0;
}

/* Le 2ème <h2> */
h2:nth-of-type(2) {
  color: red;
}

/* Différence avec nth-child */
```

**HTML :**
```html
<div>
  <h2>Titre</h2>
  <p>Paragraphe 1</p>
  <p>Paragraphe 2</p>
  <p>Paragraphe 3</p>
</div>
```

```css
/* Cible le 2ème enfant (p:Paragraphe 1) */
p:nth-child(2) { color: blue; }

/* Cible le 2ème <p> (Paragraphe 2) */
p:nth-of-type(2) { color: red; }
```

### :only-child

Cible un élément qui est le seul enfant.

```css
/* Paragraphe unique dans un div */
div p:only-child {
  text-align: center;
  font-style: italic;
}

/* Item unique dans une liste */
li:only-child {
  list-style: none;
  padding-left: 0;
}
```

### :empty

Cible les éléments vides (sans texte ni enfants).

```css
/* Masquer les divs vides */
div:empty {
  display: none;
}

/* Placeholder pour contenus vides */
.content:empty::before {
  content: "Aucun contenu disponible";
  color: #999;
  font-style: italic;
}
```

---

## Pseudo-classes de lien

### :link et :visited

```css
/* Lien non visité */
a:link {
  color: #007bff;
}

/* Lien déjà visité */
a:visited {
  color: #6c757d;
}

/* Ordre recommandé : LVHA */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }
```

### :any-link

Cible tous les liens (visités ou non).

```css
a:any-link {
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
```

---

## Pseudo-éléments

Les pseudo-éléments créent des éléments virtuels.

### ::before et ::after

Insèrent du contenu avant/après un élément.

```css
/* Citation */
blockquote::before {
  content: "« ";
  font-size: 2em;
  color: #999;
}

blockquote::after {
  content: " »";
  font-size: 2em;
  color: #999;
}

/* Badge "New" */
.new-item::after {
  content: "NEW";
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7em;
  margin-left: 10px;
}

/* Icône de lien externe */
a[target="_blank"]::after {
  content: " ↗";
  font-size: 0.8em;
  vertical-align: super;
}

/* Clearfix */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

**Flèche de tooltip :**
```css
.tooltip::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #333;
}
```

### ::first-letter

Style la première lettre.

```css
/* Lettrine */
p::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  margin-right: 5px;
  line-height: 1;
  color: #007bff;
}

/* Magazine style */
article p:first-of-type::first-letter {
  font-size: 4em;
  font-family: Georgia, serif;
  color: #c0392b;
  float: left;
  margin: 0 10px 0 0;
}
```

### ::first-line

Style la première ligne.

```css
p::first-line {
  font-weight: bold;
  font-variant: small-caps;
  color: #333;
}

article p::first-line {
  font-size: 1.1em;
  letter-spacing: 1px;
}
```

### ::selection

Style le texte sélectionné.

```css
::selection {
  background: #007bff;
  color: white;
}

::-moz-selection {
  background: #007bff;
  color: white;
}

/* Par élément */
code::selection {
  background: #ffe066;
  color: #000;
}
```

### ::placeholder

Style le placeholder des inputs.

```css
input::placeholder {
  color: #999;
  opacity: 1;
  font-style: italic;
}

textarea::placeholder {
  color: #aaa;
  font-size: 0.9em;
}
```

---

## Exemples avancés

### Menu déroulant

```css
.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  background: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  min-width: 200px;
  z-index: 1;
}

/* Afficher au hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Flèche indicatrice */
.dropdown > button::after {
  content: " ▼";
  font-size: 0.8em;
  margin-left: 5px;
}

/* Items du menu */
.dropdown-content a {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
}

.dropdown-content a:hover {
  background: #f1f1f1;
}
```

### Cards avec états

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

/* Hover */
.card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

/* Badge "Premium" */
.card.premium::before {
  content: "⭐ Premium";
  position: absolute;
  top: 10px;
  right: 10px;
  background: gold;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
}

/* Première card en vedette */
.card:first-child {
  border: 2px solid #007bff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## Exercice pratique

### Créez un formulaire avec validations visuelles

Créez `form-validation.html` avec :

1. **Champs** :
   - Email (requis)
   - Mot de passe (requis)
   - Accepter les CGV (checkbox)

2. **Styles requis** :
   - Bordure rouge pour champs invalides
   - Bordure verte pour champs valides
   - Icône ✓ après les champs valides (::after)
   - Placeholder stylisé
   - Focus visible avec box-shadow
   - Checkbox coché change le label
   - Bouton désactivé tant que checkbox non cochée

---

**Prochaine section** : Spécificité CSS et sélecteurs avancés !
