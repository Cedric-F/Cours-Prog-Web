# Spécificité & Sélecteurs Avancés

Maîtrisez la spécificité CSS pour résoudre les conflits de styles et découvrez les sélecteurs avancés pour un contrôle total de vos mises en page.

---

## Comprendre la spécificité

La **spécificité** détermine quel style s'applique quand plusieurs règles ciblent le même élément.

### Calcul de la spécificité

La spécificité se calcule avec 4 valeurs : **(a, b, c, d)**

- **a** : Styles inline (`style=""`) → 1000 points
- **b** : IDs (`#id`) → 100 points
- **c** : Classes (`.class`), attributs (`[attr]`), pseudo-classes (`:hover`) → 10 points
- **d** : Éléments (`div`), pseudo-éléments (`::before`) → 1 point

```css
/* (0, 0, 0, 1) = 1 point */
p { color: blue; }

/* (0, 0, 1, 0) = 10 points */
.text { color: red; }

/* (0, 1, 0, 0) = 100 points */
#header { color: green; }

/* Style inline = 1000 points */
<p style="color: yellow;">Texte</p>
```

### Exemples de calcul

```css
/* (0, 0, 0, 1) = 1 */
div { }

/* (0, 0, 1, 1) = 11 */
div.container { }

/* (0, 0, 2, 1) = 21 */
div.container.active { }

/* (0, 1, 0, 0) = 100 */
#header { }

/* (0, 1, 1, 1) = 111 */
#header .logo img { }

/* (0, 0, 2, 2) = 22 */
ul li.active a { }

/* (0, 0, 3, 0) = 30 */
.nav .item:hover { }

/* (0, 1, 2, 3) = 123 */
#main div.content p.text { }
```

### Règles de priorité

1. **!important** > Tout (à éviter !)
2. **Style inline** (1000) > IDs (100) > Classes (10) > Éléments (1)
3. À spécificité égale, **le dernier** l'emporte
4. Les styles **plus spécifiques** l'emportent toujours

```css
/* Ordre croissant de spécificité */
p { color: blue; }                    /* 0,0,0,1 */
.text { color: red; }                 /* 0,0,1,0 - Gagne */
p.text { color: green; }              /* 0,0,1,1 - Gagne */
div p.text { color: orange; }         /* 0,0,1,2 - Gagne */
#container p.text { color: purple; }  /* 0,1,1,1 - Gagne */
```

### !important (à utiliser avec précaution)

```css
p { 
  color: blue !important; /* Force cette valeur */
}

#header p {
  color: red; /* Ne s'appliquera PAS */
}
```

⚠️ **Quand utiliser !important :**
- Override de styles de librairies tierces
- Utilities classes (Tailwind, Bootstrap)
- En **dernier recours** uniquement

❌ **Évitez !important pour :**
- Style général de votre application
- "Réparer" une mauvaise architecture CSS

---

## Sélecteurs avancés

### :not() - Négation

Cible tous les éléments **sauf** ceux spécifiés.

```css
/* Tous les <p> sauf ceux avec .intro */
p:not(.intro) {
  color: #666;
}

/* Tous les <li> sauf le premier */
li:not(:first-child) {
  margin-top: 10px;
}

/* Tous les inputs sauf checkbox et radio */
input:not([type="checkbox"]):not([type="radio"]) {
  width: 100%;
  padding: 8px;
}

/* Liens sans classe */
a:not([class]) {
  color: blue;
  text-decoration: underline;
}

/* Éléments non vides */
div:not(:empty) {
  border: 1px solid #ddd;
}
```

**Exemple pratique - Espacer tous sauf le dernier :**
```css
.card:not(:last-child) {
  margin-bottom: 20px;
}
```

### :is() - Correspondance

Simplifie les sélecteurs multiples (alias `:matches()`).

```css
/* Avant (répétitif) */
header a:hover,
main a:hover,
footer a:hover {
  color: red;
}

/* Après (simplifié avec :is()) */
:is(header, main, footer) a:hover {
  color: red;
}

/* Titres dans article ou aside */
:is(article, aside) :is(h1, h2, h3) {
  color: #333;
  font-weight: bold;
}

/* Equivalent à */
article h1, article h2, article h3,
aside h1, aside h2, aside h3 {
  color: #333;
  font-weight: bold;
}
```

**Spécificité de :is() :**
La spécificité de `:is()` est celle de son argument le **plus spécifique**.

```css
/* Spécificité = celle de #id (100) */
:is(#id, .class, div) { }
```

### :where() - Sans spécificité

Comme `:is()` mais avec spécificité **0** (facilite l'override).

```css
/* Spécificité = 0 */
:where(header, main, footer) a {
  color: blue;
}

/* Facile à override (spécificité 1) */
a {
  color: red; /* Gagne sur :where() */
}
```

**Cas d'usage :**
```css
/* Reset avec :where() (spécificité 0) */
:where(ul, ol) {
  list-style: none;
  padding: 0;
}

/* Facile à override */
.custom-list {
  list-style: disc;
  padding-left: 20px;
}
```

### :has() - Parent selector

Cible un élément qui **contient** un certain descendant.

```css
/* Carte contenant une image */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Form contenant une erreur */
form:has(.error) {
  border: 2px solid red;
}

/* Liste contenant des items cochés */
ul:has(input:checked) {
  background: #e8f5e9;
}

/* Article sans images */
article:not(:has(img)) {
  max-width: 600px;
}

/* Paragraphe suivi d'une image */
p:has(+ img) {
  margin-bottom: 5px;
}
```

**Exemple avancé - Formulaire avec états :**
```css
/* Form avec tous les champs valides */
form:has(input:invalid) button[type="submit"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Section contenant un titre */
section:has(h2) {
  padding-top: 40px;
}

/* Div contenant exactement 3 enfants */
div:has(> :nth-child(3)):not(:has(> :nth-child(4))) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

### :target

Cible l'élément dont l'ID correspond à l'ancre dans l'URL.

```css
/* URL: page.html#section1 */
#section1:target {
  background: yellow;
  border-left: 5px solid orange;
  padding-left: 15px;
}

/* Onglets CSS-only */
.tab-content {
  display: none;
}

.tab-content:target {
  display: block;
}
```

**HTML :**
```html
<nav>
  <a href="#tab1">Tab 1</a>
  <a href="#tab2">Tab 2</a>
</nav>

<div id="tab1" class="tab-content">Contenu 1</div>
<div id="tab2" class="tab-content">Contenu 2</div>
```

### :root

Cible l'élément racine (équivalent à `html` mais avec plus de spécificité).

```css
:root {
  /* Variables CSS (Custom Properties) */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size: 16px;
  --spacing: 1rem;
}

/* Utilisation */
button {
  background: var(--primary-color);
  padding: var(--spacing);
}
```

---

## Techniques avancées

### Cascade Layers (@layer)

Contrôlez l'ordre de priorité des styles.

```css
/* Définir des layers */
@layer reset, base, components, utilities;

/* Layer reset (priorité la plus basse) */
@layer reset {
  * {
    margin: 0;
    padding: 0;
  }
}

/* Layer base */
@layer base {
  body {
    font-family: Arial, sans-serif;
  }
}

/* Layer components */
@layer components {
  .button {
    padding: 10px 20px;
    background: blue;
  }
}

/* Layer utilities (priorité la plus haute) */
@layer utilities {
  .mt-0 { margin-top: 0 !important; }
}
```

### Sélecteur d'attribut case-insensitive

```css
/* Sensible à la casse par défaut */
a[href$=".PDF"] { }

/* Insensible à la casse (i) */
a[href$=".pdf" i] {
  background: url('pdf-icon.svg') no-repeat;
}

/* Fonctionne avec .PDF, .pdf, .Pdf, etc. */
```

### Combinaisons avancées

```css
/* Tous les paragraphes dans un article, sauf le premier */
article p:not(:first-child) {
  margin-top: 1em;
}

/* Items actifs ou avec focus */
.item:is(:active, :focus) {
  outline: 2px solid blue;
}

/* Liens externes (commence par http, pas le domaine actuel) */
a[href^="http"]:not([href*="monsite.com"]) {
  color: orange;
}

/* Premier de type, mais pas premier enfant */
p:first-of-type:not(:first-child) {
  margin-top: 2em;
}
```

---

## Stratégies CSS

### BEM (Block Element Modifier)

Méthodologie pour nommer les classes.

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--large { }
.card__header--primary { }
```

**Avantages :**
- ✅ Spécificité faible et constante
- ✅ Pas de conflits de noms
- ✅ Facile à comprendre et maintenir

### Utility-First (Tailwind style)

```css
/* Utilities avec faible spécificité */
.m-0 { margin: 0; }
.p-4 { padding: 1rem; }
.text-center { text-align: center; }
.flex { display: flex; }

/* Utilisation avec :where() pour spécificité 0 */
:where(.m-0) { margin: 0; }
:where(.p-4) { padding: 1rem; }
```

### ITCSS (Inverted Triangle CSS)

Organisation en couches de spécificité croissante.

```css
/* 1. Settings - Variables */
:root { --color: blue; }

/* 2. Tools - Mixins, fonctions */

/* 3. Generic - Reset, normalize */
* { box-sizing: border-box; }

/* 4. Elements - Éléments HTML */
h1 { font-size: 2rem; }

/* 5. Objects - Patterns */
.container { max-width: 1200px; }

/* 6. Components - UI Components */
.button { padding: 10px; }

/* 7. Utilities - Helpers */
.text-center { text-align: center; }
```

---

## Débogage de spécificité

### Outils navigateur

**Chrome/Firefox DevTools :**
1. Inspecter l'élément
2. Voir les styles appliqués (non barrés)
3. Voir les styles overridés (barrés)
4. Calculatrice de spécificité intégrée

### Techniques de débogage

```css
/* Ajouter temporairement un border pour identifier */
.problematic-element {
  border: 5px solid red !important;
}

/* Forcer l'override pour tester */
.test {
  color: lime !important;
}

/* Augmenter la spécificité proprement */
/* Avant */
.button { }

/* Après */
.container .button { }
/* ou */
.button.button { } /* Double la classe */
```

### Calculateur en ligne

- **Specificity Calculator** : https://specificity.keegan.st/

---

## Bonnes pratiques

### ✅ À faire

```css
/* Spécificité faible et constante */
.button { }
.button-primary { }

/* Utiliser :where() pour resets */
:where(ul, ol) { list-style: none; }

/* Éviter les sélecteurs trop profonds (max 3 niveaux) */
.header .nav .item { }

/* Utiliser des classes sémantiques */
.product-card { }
.user-profile { }
```

### ❌ À éviter

```css
/* IDs dans les styles */
#header #nav #item { }

/* Spécificité trop haute */
div#content div.wrapper div.container p.text { }

/* !important à outrance */
.button {
  color: red !important;
  background: blue !important;
  padding: 10px !important;
}

/* Sélecteurs trop spécifiques */
body div.container div.content article.post p.paragraph { }
```

---

**Prochaine section** : Flexbox pour des layouts modernes !
