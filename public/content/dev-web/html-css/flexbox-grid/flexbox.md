# Flexbox - Layouts Flexibles

Maîtrisez Flexbox pour créer des layouts modernes, responsives et flexibles en une dimension (ligne ou colonne).

---

## Ce que vous allez apprendre

- Comprendre le modèle Flexbox (conteneur et items)
- Aligner et distribuer les éléments
- Créer des layouts responsives
- Résoudre les problèmes courants de mise en page

## Prérequis

- [CSS - Sélecteurs](../selecteurs-css/selecteurs-base.md)
- Notions de box model CSS

Ressource incontournable : [Flexbox Froggy](https://flexboxfroggy.com/) - Le jeu pour apprendre Flexbox

---

## Introduction à Flexbox

**Flexbox** (Flexible Box Layout) permet de distribuer l'espace et d'aligner des éléments dans un conteneur, même quand leur taille est inconnue ou dynamique.

### Concepts clés

- **Conteneur flex** (`display: flex`) : Parent
- **Items flex** : Enfants directs du conteneur
- **Axe principal** (main axis) : Direction des items
- **Axe secondaire** (cross axis) : Perpendiculaire à l'axe principal

```
┌─────────────────────────────────┐
│  Conteneur (display: flex)      │
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Item 1│ │Item 2│ │Item 3│   │ ← Axe principal (main axis)
│  └──────┘ └──────┘ └──────┘   │
│          ↕                      │
│    Axe secondaire              │
│    (cross axis)                │
└─────────────────────────────────┘
```

### Ressource incontournable
- **Flexbox froggy** : [Le jeu pour apprendre flexbox](https://flexboxfroggy.com/)

### Activation de Flexbox

```css
.container {
  display: flex; /* ou inline-flex */
}
```

---

## Propriétés du conteneur

### flex-direction

Définit la direction de l'axe principal.

```css
.container {
  display: flex;
  flex-direction: row; /* Par défaut */
}
```

**Valeurs possibles :**

```css
flex-direction: row;            /* → Horizontal, gauche à droite */
flex-direction: row-reverse;    /* ← Horizontal, droite à gauche */
flex-direction: column;         /* ↓ Vertical, haut en bas */
flex-direction: column-reverse; /* ↑ Vertical, bas en haut */
```

**Exemples :**

```css
/* Navigation horizontale */
.navbar {
  display: flex;
  flex-direction: row;
}

/* Sidebar verticale */
.sidebar {
  display: flex;
  flex-direction: column;
}
```

### flex-wrap

Contrôle si les items passent à la ligne.

```css
flex-wrap: nowrap;       /* Par défaut - une seule ligne */
flex-wrap: wrap;         /* Multi-lignes si nécessaire */
flex-wrap: wrap-reverse; /* Multi-lignes, ordre inversé */
```

**Exemple :**

```css
/* Grille responsive */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* Min 300px, wrap si moins */
}
```

### flex-flow (raccourci)

Combine `flex-direction` et `flex-wrap`.

```css
/* Équivalent à flex-direction: row; flex-wrap: wrap; */
.container {
  display: flex;
  flex-flow: row wrap;
}

/* Column avec wrap */
.container {
  flex-flow: column wrap;
}
```

### justify-content

Aligne les items sur l'**axe principal**.

```css
justify-content: flex-start;    /* Par défaut - début */
justify-content: flex-end;      /* Fin */
justify-content: center;        /* Centré */
justify-content: space-between; /* Espace entre */
justify-content: space-around;  /* Espace autour */
justify-content: space-evenly;  /* Espace égal */
```

**Visualisation :**

```css
/* flex-start */
[■][■][■]___________

/* flex-end */
___________[■][■][■]

/* center */
_____[■][■][■]______

/* space-between */
[■]______[■]______[■]

/* space-around */
__[■]____[■]____[■]__

/* space-evenly */
___[■]___[■]___[■]___
```

**Exemples pratiques :**

```css
/* Header avec logo à gauche, menu au centre, user à droite */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Boutons centrés */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Navigation avec espacement égal */
.nav {
  display: flex;
  justify-content: space-evenly;
}
```

### align-items

Aligne les items sur l'**axe secondaire** (perpendiculaire).

```css
align-items: stretch;    /* Par défaut - étire à la hauteur */
align-items: flex-start; /* Début de l'axe cross */
align-items: flex-end;   /* Fin de l'axe cross */
align-items: center;     /* Centré verticalement */
align-items: baseline;   /* Ligne de base du texte */
```

**Exemples :**

```css
/* Card avec contenu centré verticalement */
.card {
  display: flex;
  align-items: center;
  min-height: 200px;
}

/* Navigation avec items alignés au bas */
.footer-nav {
  display: flex;
  align-items: flex-end;
}
```

### align-content

Aligne les **lignes** quand il y a du wrap (plusieurs lignes).

```css
align-content: stretch;       /* Par défaut */
align-content: flex-start;    
align-content: flex-end;      
align-content: center;        
align-content: space-between; 
align-content: space-around;  
```

⚠️ **N'a d'effet que si `flex-wrap: wrap` et plusieurs lignes !**

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; /* Lignes serrées en haut */
  height: 600px;
}
```

### gap (espacement)

Ajoute de l'espace entre les items.

```css
/* Espacement horizontal et vertical */
.container {
  display: flex;
  gap: 20px;
}

/* Espacement différent */
.container {
  gap: 20px 10px; /* row-gap column-gap */
}

/* Ou séparément */
.container {
  row-gap: 20px;
  column-gap: 10px;
}
```

**Avant `gap` (ancienne méthode) :**

```css
.container {
  display: flex;
}

.item {
  margin-right: 20px;
}

.item:last-child {
  margin-right: 0;
}
```

**Avec `gap` (moderne) :**

```css
.container {
  display: flex;
  gap: 20px; /* Plus simple ! */
}
```

---

## Propriétés des items

### flex-grow

Définit la capacité d'un item à **grandir**.

```css
.item {
  flex-grow: 0; /* Par défaut - ne grandit pas */
  flex-grow: 1; /* Grandit pour remplir l'espace */
  flex-grow: 2; /* Grandit 2x plus que flex-grow: 1 */
}
```

**Exemple :**

```html
<div class="container">
  <div class="item">Sidebar (fixe)</div>
  <div class="item grow">Content (flexible)</div>
  <div class="item">Ads (fixe)</div>
</div>
```

```css
.container {
  display: flex;
}

.item {
  flex-grow: 0; /* Ne grandit pas */
  width: 200px;
}

.grow {
  flex-grow: 1; /* Prend l'espace restant */
  width: auto;
}
```

### flex-shrink

Définit la capacité d'un item à **rétrécir**.

```css
.item {
  flex-shrink: 1; /* Par défaut - peut rétrécir */
  flex-shrink: 0; /* Ne rétrécit jamais */
  flex-shrink: 2; /* Rétrécit 2x plus */
}
```

**Exemple :**

```css
/* Logo qui ne rétrécit jamais */
.logo {
  flex-shrink: 0;
  width: 150px;
}

/* Navigation qui peut rétrécir */
.nav {
  flex-shrink: 1;
}
```

### flex-basis

Taille de base de l'item **avant** distribution de l'espace.

```css
.item {
  flex-basis: auto;   /* Par défaut - selon contenu */
  flex-basis: 200px;  /* Taille de base 200px */
  flex-basis: 50%;    /* 50% du conteneur */
  flex-basis: 0;      /* Ignore la taille du contenu */
}
```

**Différence avec width :**

```css
/* width = taille fixe (sauf flex-grow/shrink) */
.item {
  width: 200px;
}

/* flex-basis = taille de base flexible */
.item {
  flex-basis: 200px;
  flex-grow: 1; /* Peut grandir au-delà de 200px */
}
```

### flex (raccourci)

Combine `flex-grow`, `flex-shrink`, et `flex-basis`.

```css
/* Syntaxe complète */
.item {
  flex: 1 1 200px; /* grow shrink basis */
}

/* Raccourcis courants */
.item {
  flex: 1;      /* 1 1 0% - flexible, répartition égale */
  flex: auto;   /* 1 1 auto - flexible, selon contenu */
  flex: none;   /* 0 0 auto - fixe, ne change pas */
  flex: 2;      /* 2 1 0% - prend 2x plus d'espace */
}
```

**Exemples pratiques :**

```css
/* Layout avec sidebar fixe et content flexible */
.sidebar {
  flex: 0 0 250px; /* Ne grandit ni rétrécit, 250px */
}

.content {
  flex: 1; /* Prend l'espace restant */
}

/* 3 colonnes égales */
.col {
  flex: 1; /* Chaque col prend 1/3 */
}

/* Colonne centrale 2x plus large */
.col-center {
  flex: 2; /* Prend 2x plus d'espace */
}
```

### align-self

Override `align-items` pour un item spécifique.

```css
.item {
  align-self: auto;       /* Par défaut - hérite d'align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
```

**Exemple :**

```css
.container {
  display: flex;
  align-items: flex-start; /* Tous en haut */
}

.special-item {
  align-self: flex-end; /* Celui-ci en bas */
}
```

### order

Change l'ordre visuel des items (sans toucher au HTML).

```css
.item {
  order: 0; /* Par défaut */
}

.first {
  order: -1; /* Apparaît en premier */
}

.last {
  order: 1; /* Apparaît en dernier */
}
```

**Exemple - Responsive :**

```css
/* Mobile : sidebar en bas */
@media (max-width: 768px) {
  .sidebar {
    order: 2;
  }
  
  .content {
    order: 1;
  }
}
```

---

## Exemples de layouts courants

### Navigation horizontale

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #333;
  color: white;
}

.navbar-brand {
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.navbar-actions {
  display: flex;
  gap: 1rem;
}
```

### Holy Grail Layout

```html
<div class="container">
  <header class="header">Header</header>
  <div class="body">
    <aside class="sidebar-left">Left</aside>
    <main class="content">Content</main>
    <aside class="sidebar-right">Right</aside>
  </div>
  <footer class="footer">Footer</footer>
</div>
```

```css
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header,
.footer {
  flex: 0 0 auto;
  padding: 1rem;
  background: #333;
  color: white;
}

.body {
  display: flex;
  flex: 1;
  gap: 1rem;
}

.sidebar-left,
.sidebar-right {
  flex: 0 0 200px;
  background: #f0f0f0;
}

.content {
  flex: 1;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .body {
    flex-direction: column;
  }
  
  .sidebar-left,
  .sidebar-right {
    flex: 0 0 auto;
  }
}
```

### Card Grid

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  flex: 1 1 calc(33.333% - 2rem); /* 3 colonnes */
  min-width: 250px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 992px) {
  .card {
    flex: 1 1 calc(50% - 2rem); /* 2 colonnes */
  }
}

@media (max-width: 576px) {
  .card {
    flex: 1 1 100%; /* 1 colonne */
  }
}
```

### Centering (centrage parfait)

```css
/* Horizontal et vertical */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Vertical seulement */
.vertical-center {
  display: flex;
  align-items: center;
}

/* Horizontal seulement */
.horizontal-center {
  display: flex;
  justify-content: center;
}
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| `flex` sur les enfants seulement | Items ne s'alignent pas | `display: flex` sur le parent |
| Oublier `flex-wrap` | Items débordent | Ajouter `flex-wrap: wrap` |
| Confusion axes | Mauvais alignement | `justify-content` = axe principal, `align-items` = axe secondaire |
| `flex: 1` sans `min-width` | Items trop petits | Ajouter `min-width: 0` ou valeur |

---

## Quiz de vérification

1. Quelle propriété aligne sur l'axe principal ?
   - A) `align-items`
   - B) `justify-content` ✅
   - C) `align-content`

2. Que fait `flex: 1` ?
   - A) Fixe la largeur à 1px
   - B) L'élément prend l'espace disponible ✅
   - C) Définit l'ordre

3. Comment centrer verticalement et horizontalement ?
   - A) `text-align: center`
   - B) `justify-content: center; align-items: center` ✅
   - C) `margin: auto`

4. Quelle propriété permet aux items de passer à la ligne ?
   - A) `flex-direction: wrap`
   - B) `flex-wrap: wrap` ✅
   - C) `flex-flow: wrap`

---

## Prochaine étape

Découvrez [CSS Grid](./grid-responsive.md) pour des layouts 2D encore plus puissants.
