# Sélecteurs de Base & Combinateurs

Maîtrisez les fondamentaux des sélecteurs CSS pour cibler précisément les éléments HTML et créer des styles puissants et maintenables.

---

## Ce que vous allez apprendre

- Utiliser les sélecteurs simples (type, classe, ID)
- Combiner les sélecteurs (descendant, enfant, adjacent)
- Cibler par attributs
- Comprendre la spécificité

## Prérequis

- [HTML - Balises essentielles](../balises-html/structure-essentielles.md)
- Un éditeur de code ou [CodePen](https://codepen.io/pen/)

---

## Sélecteurs simples

### Sélecteur universel (*)

Cible **tous** les éléments de la page.

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

⚠️ **Attention** : Utiliser `*` peut impacter les performances sur de très grosses pages. Utilisez-le avec parcimonie.

### Sélecteur de type (balise)

Cible tous les éléments d'un type donné.

```css
/* Tous les paragraphes */
p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Tous les titres h2 */
h2 {
  color: #333;
  font-size: 2rem;
}

/* Toutes les images */
img {
  max-width: 100%;
  height: auto;
}
```

### Sélecteur de classe (.)

Cible les éléments ayant une classe spécifique.

```css
.button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}
```

**HTML :**
```html
<button class="button">Cliquez-moi</button>
<div class="alert alert-success">Opération réussie !</div>
```

### Sélecteur d'ID (#)

Cible un élément ayant un ID spécifique (unique sur la page).

```css
#header {
  background: #333;
  color: white;
  padding: 20px;
}

#main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

⚠️ **Bonne pratique** : Privilégiez les classes aux IDs pour le style. Réservez les IDs pour JavaScript et les ancres.

### Sélecteurs multiples (,)

Appliquez le même style à plusieurs sélecteurs.

```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.button, .link-button, input[type="submit"] {
  cursor: pointer;
  transition: all 0.3s ease;
}
```

---

## Combinateurs CSS

Les combinateurs définissent la relation entre les sélecteurs.

### Descendant (espace)

Cible les éléments qui sont des **descendants** (enfants, petits-enfants, etc.) d'un autre élément.

```css
/* Tous les <a> dans <nav> */
nav a {
  text-decoration: none;
  color: white;
}

/* Tous les <li> dans <ul> qui sont dans <div class="menu"> */
div.menu ul li {
  list-style: none;
  display: inline-block;
}

/* Tous les paragraphes dans des articles */
article p {
  text-align: justify;
}
```

**HTML :**
```html
<nav>
  <ul>
    <li><a href="/">Accueil</a></li>
    <li><a href="/about">À propos</a></li>
  </ul>
</nav>
```

### Enfant direct (>)

Cible uniquement les **enfants directs** (pas les petits-enfants).

```css
/* Uniquement les <li> enfants directs de <ul> */
ul > li {
  margin-bottom: 10px;
}

/* Uniquement les <p> enfants directs de <div class="content"> */
.content > p {
  font-size: 1.1rem;
}
```

**Différence avec le descendant :**
```html
<div class="parent">
  <p>Ce paragraphe sera ciblé par .parent > p</p>
  <div>
    <p>Ce paragraphe NE sera PAS ciblé par .parent > p</p>
    <p>Mais sera ciblé par .parent p (descendant)</p>
  </div>
</div>
```

```css
/* Cible les 3 paragraphes */
.parent p { color: blue; }

/* Cible uniquement le premier paragraphe */
.parent > p { color: red; }
```

### Frère adjacent (+)

Cible l'élément qui vient **immédiatement après** un autre (même parent).

```css
/* Le <p> qui suit directement un <h2> */
h2 + p {
  font-weight: bold;
  font-size: 1.2em;
}

/* Le premier <li> après un <li> actif */
.active + li {
  border-left: 3px solid blue;
}
```

**HTML :**
```html
<article>
  <h2>Titre</h2>
  <p>Ce paragraphe sera en gras (h2 + p)</p>
  <p>Ce paragraphe ne sera PAS affecté</p>
</article>
```

### Frères généraux (~)

Cible **tous** les éléments frères qui suivent (même parent).

```css
/* Tous les <p> qui suivent un <h2> */
h2 ~ p {
  color: #666;
}

/* Tous les checkbox cochés et leurs labels suivants */
input:checked ~ label {
  font-weight: bold;
  color: green;
}
```

**HTML :**
```html
<div>
  <h2>Titre</h2>
  <p>Paragraphe 1 (ciblé par h2 ~ p)</p>
  <p>Paragraphe 2 (ciblé par h2 ~ p)</p>
  <p>Paragraphe 3 (ciblé par h2 ~ p)</p>
</div>
```

---

## Sélecteurs d'attributs

Ciblez les éléments selon leurs attributs HTML.

### Attribut présent [attr]

```css
/* Tous les <a> avec un attribut title */
a[title] {
  border-bottom: 1px dotted;
}

/* Tous les inputs avec l'attribut required */
input[required] {
  border-left: 3px solid red;
}
```

### Valeur exacte [attr="value"]

```css
/* Liens externes uniquement */
a[target="_blank"] {
  padding-right: 18px;
  background: url('external-link.svg') no-repeat right center;
}

/* Inputs de type text */
input[type="text"] {
  border: 1px solid #ccc;
  padding: 8px;
}

/* Images avec alt vide */
img[alt=""] {
  border: 2px solid red; /* Accessibilité : alert */
}
```

### Commence par [attr^="value"]

```css
/* Tous les liens qui commencent par "https://" */
a[href^="https://"] {
  color: green;
}

/* Tous les liens qui commencent par "mailto:" */
a[href^="mailto:"] {
  color: blue;
  text-decoration: underline;
}

/* Classes qui commencent par "icon-" */
[class^="icon-"] {
  display: inline-block;
  width: 16px;
  height: 16px;
}
```

### Se termine par [attr$="value"]

```css
/* Liens vers des PDF */
a[href$=".pdf"] {
  padding-right: 20px;
  background: url('pdf-icon.svg') no-repeat right center;
}

/* Liens vers des images */
a[href$=".jpg"],
a[href$=".png"],
a[href$=".gif"] {
  display: inline-block;
  border: 1px solid #ddd;
}
```

### Contient [attr*="value"]

```css
/* Liens contenant "google" */
a[href*="google"] {
  color: #4285f4;
}

/* Classes contenant "btn" */
[class*="btn"] {
  cursor: pointer;
  padding: 10px 15px;
}
```

### Valeur dans une liste [attr~="value"]

Cible les attributs dont la valeur est une liste de mots séparés par des espaces.

```css
/* Éléments avec class="important" (même s'il y a d'autres classes) */
[class~="important"] {
  font-weight: bold;
  color: red;
}
```

**HTML :**
```html
<p class="text important large">Texte important</p>
<!-- Ciblé par [class~="important"] -->
```

### Commence par ou séparé par tiret [attr|="value"]

Utile pour les langues (lang attribute).

```css
/* Tous les éléments en français */
[lang|="fr"] {
  quotes: "«" "»" "‹" "›";
}
```

**HTML :**
```html
<p lang="fr">Français</p>
<p lang="fr-FR">Français de France</p>
<p lang="fr-CA">Français canadien</p>
<!-- Tous ciblés par [lang|="fr"] -->
```

---

## Exemples pratiques

### Navigation avec états

```css
/* Navigation de base */
nav a {
  display: inline-block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

/* Lien actif */
nav a.active {
  background: #007bff;
  color: white;
  border-radius: 5px;
}

/* Au survol */
nav a:hover {
  background: #0056b3;
  color: white;
}

/* Lien avec icône externe */
nav a[target="_blank"]::after {
  content: " ↗";
  font-size: 0.8em;
}
```

### Formulaire stylisé

```css
/* Tous les inputs et textarea */
input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

/* Inputs requis */
input[required] {
  border-left: 3px solid #ff6b6b;
}

/* Inputs de type email */
input[type="email"] {
  background-image: url('email-icon.svg');
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 35px;
}

/* Checkbox et radio */
input[type="checkbox"],
input[type="radio"] {
  width: auto;
  margin-right: 5px;
}

/* Bouton de soumission */
input[type="submit"] {
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

input[type="submit"]:hover {
  background: #218838;
}
```

### Card component avec combinateurs

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Image de la card (enfant direct) */
.card > img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Contenu de la card */
.card .card-body {
  padding: 20px;
}

/* Titre dans le body */
.card-body > h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

/* Tous les paragraphes dans le body */
.card-body p {
  color: #666;
  line-height: 1.6;
}

/* Bouton dans la card */
.card-body .btn {
  display: inline-block;
  margin-top: 10px;
}

/* Hover sur toute la card */
.card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(-2px);
  transition: all 0.3s;
}
```

### Liste de liens stylisée

```css
/* Liste de base */
.link-list {
  list-style: none;
  padding: 0;
}

/* Chaque item de la liste */
.link-list > li {
  border-bottom: 1px solid #eee;
}

/* Dernier item sans bordure */
.link-list > li:last-child {
  border-bottom: none;
}

/* Liens dans la liste */
.link-list li a {
  display: block;
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

/* Hover sur les liens */
.link-list li a:hover {
  background: #f8f9fa;
  padding-left: 25px;
}

/* Icône pour liens externes */
.link-list a[href^="http"]::before {
  content: "🔗 ";
  margin-right: 8px;
}

/* Icône pour fichiers PDF */
.link-list a[href$=".pdf"]::before {
  content: "📄 ";
  margin-right: 8px;
}
```

---

## Bonnes pratiques

### ✅ À faire

```css
/* Utiliser des classes descriptives */
.button-primary { }
.card-header { }

/* Combiner intelligemment */
.menu > li { }
article > h2 + p { }

/* Sélecteurs d'attributs pour les états */
input[type="email"] { }
a[target="_blank"] { }
```

### ❌ À éviter

```css
/* Trop spécifique */
div#content div.wrapper div.container p.text { }

/* Utilisation excessive de l'universel */
* * * { }

/* IDs pour le style (préférer les classes) */
#button1 { }
#text-red { }
```

---

## Erreurs courantes

| Erreur | Exemple | Solution |
|--------|---------|----------|
| Sélecteurs trop spécifiques | `div#id .class p span` | Simplifier, utiliser des classes |
| IDs pour le style | `#button { }` | Préférer `.button { }` |
| `*` abusif | `* * { }` | Cibler précisément |
| Oublier la cascade | Styles écrasés | Vérifier la spécificité |

---

## Quiz de vérification

:::quiz
Q: Quel sélecteur cible les enfants directs ?
- [] `parent child`
- [x] `parent > child` ✅
- [] `parent + child`

Q: Que sélectionne `.card.active` ?
- [] `.card` puis `.active`
- [x] Éléments avec les deux classes ✅
- [] `.active` dans `.card`

Q: Quel sélecteur est le plus spécifique ?
- [] `.button`
- [x] `#submit` ✅
- [] `button.primary`
> `#` représente un ID unique tandis que le `.` est une classe qui peut être attribuée à plusieurs éléments !

Q: Que fait `input[type="email"]` ?
- [] Tous les inputs
- [x] Inputs de type email ✅
- [] Erreur de syntaxe
:::

---

## Exercice pratique

Créez une barre de navigation avec :
- Style de base pour tous les liens
- Style différent pour le lien actif
- Hover effect avec transition
- Utilisez au moins 3 combinateurs différents

<details>
<summary>Structure HTML</summary>

```html
<nav class="navbar">
  <ul>
    <li><a href="#" class="active">Accueil</a></li>
    <li><a href="#">Produits</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```
</details>

---

## Prochaine étape

Découvrez les [pseudo-classes et pseudo-éléments](./pseudo-classes-elements.md) pour des sélecteurs plus puissants.
