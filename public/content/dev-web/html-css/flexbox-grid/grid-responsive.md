# CSS Grid & Design Responsive

Maîtrisez CSS Grid pour créer des layouts 2D complexes et apprenez les techniques modernes de design responsive.

---

## Ce que vous allez apprendre

- Comprendre le système de grille 2D (lignes et colonnes)
- Définir des templates de colonnes et de lignes
- Utiliser les grid areas pour des layouts lisibles
- Appliquer les media queries pour le responsive
- Combiner Grid et Flexbox efficacement

## Prérequis

- [Flexbox](./flexbox.md)
- [Sélecteurs CSS](../selecteurs-css/selecteurs-base.md)

---

## Introduction à CSS Grid

**CSS Grid** est un système de layout bidimensionnel (lignes ET colonnes) pour créer des interfaces complexes.

### Grid vs Flexbox

| Critère | Flexbox | Grid |
|---------|---------|------|
| Dimension | 1D (ligne OU colonne) | 2D (lignes ET colonnes) |
| Usage | Composants, navigation | Layouts de page |
| Alignement | Sur un axe | Sur deux axes |
| Complexité | Simple | Plus puissant |

**Quand utiliser quoi ?**
- **Flexbox** : Navigation, cards, composants simples
- **Grid** : Page layouts, grilles complexes, dashboards

---

## Concepts de base

```
┌─────────────────────────────────┐
│  Grid Container                 │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │  1  │ │  2  │ │  3  │      │ ← Row 1
│  └─────┘ └─────┘ └─────┘      │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │  4  │ │  5  │ │  6  │      │ ← Row 2
│  └─────┘ └─────┘ └─────┘      │
│    ↑       ↑       ↑           │
│  Col 1   Col 2   Col 3         │
└─────────────────────────────────┘
```

### Ressource incontournable
- **CSS Grid Garden** : [Le jeu pour apprendre Grid](https://cssgridgarden.com/)

### Activation

```css
.container {
  display: grid; /* ou inline-grid */
}
```

---

## Propriétés du conteneur

### grid-template-columns / rows

Définit les colonnes et lignes.

```css
.container {
  display: grid;
  
  /* 3 colonnes de 200px */
  grid-template-columns: 200px 200px 200px;
  
  /* 2 lignes de 100px */
  grid-template-rows: 100px 100px;
}
```

**Unités :**

```css
/* Pixels fixes */
grid-template-columns: 200px 300px 400px;

/* Pourcentages */
grid-template-columns: 25% 50% 25%;

/* Fractions (fr) - espace flexible */
grid-template-columns: 1fr 2fr 1fr; /* 25% 50% 25% */

/* Auto - selon le contenu */
grid-template-columns: auto 1fr auto;

/* Min/Max */
grid-template-columns: minmax(200px, 1fr) 1fr 1fr;

/* Repeat */
grid-template-columns: repeat(3, 1fr); /* 3 colonnes égales */
grid-template-columns: repeat(4, 200px);
```

**Exemples pratiques :**

```css
/* Sidebar fixe + content flexible */
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
}

/* 3 colonnes égales */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Auto-fill - colonnes automatiques */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

### gap (espacement)

```css
.container {
  display: grid;
  gap: 20px; /* row + column */
  
  /* Ou séparément */
  row-gap: 20px;
  column-gap: 10px;
  
  /* Ou l'ancienne syntaxe */
  grid-gap: 20px;
}
```

### grid-template-areas

Layout nommé (très lisible !).

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header  header"
    "sidebar content ads"
    "footer footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.ads     { grid-area: ads; }
.footer  { grid-area: footer; }
```

**Responsive avec areas :**

```css
/* Desktop */
.layout {
  grid-template-areas:
    "header header header"
    "sidebar content ads"
    "footer footer footer";
}

/* Mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "content"
      "sidebar"
      "ads"
      "footer";
  }
}
```

### justify-items / align-items

Aligne les items dans leurs cellules.

```css
.container {
  /* Horizontal (axe en ligne) */
  justify-items: start;   /* Gauche */
  justify-items: end;     /* Droite */
  justify-items: center;  /* Centré */
  justify-items: stretch; /* Étire (défaut) */
  
  /* Vertical (axe en colonne) */
  align-items: start;     /* Haut */
  align-items: end;       /* Bas */
  align-items: center;    /* Centré */
  align-items: stretch;   /* Étire (défaut) */
  
  /* Raccourci */
  place-items: center; /* center center */
}
```

### justify-content / align-content

Aligne la grille entière dans le conteneur.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  width: 800px; /* Plus large que 600px (3×200) */
  
  /* Horizontal */
  justify-content: start;         /* Gauche */
  justify-content: end;           /* Droite */
  justify-content: center;        /* Centré */
  justify-content: space-between; /* Espacé */
  justify-content: space-around;  
  justify-content: space-evenly;  
  
  /* Vertical */
  align-content: start;
  align-content: center;
  align-content: space-between;
  
  /* Raccourci */
  place-content: center; /* center center */
}
```

### grid-auto-flow

Direction de placement automatique.

```css
.container {
  display: grid;
  grid-auto-flow: row;    /* Par défaut - rempli ligne par ligne */
  grid-auto-flow: column; /* Rempli colonne par colonne */
  grid-auto-flow: dense;  /* Comble les trous */
}
```

### grid-auto-columns / rows

Taille des colonnes/lignes implicites.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  
  /* Si un item dépasse, les lignes implicites font 100px */
  grid-auto-rows: 100px;
  
  /* Colonnes implicites */
  grid-auto-columns: 200px;
}
```

---

## Propriétés des items

### grid-column / grid-row

Positionne un item sur la grille.

```css
/* Syntaxe longue */
.item {
  grid-column-start: 1;
  grid-column-end: 3;   /* Occupe colonnes 1 et 2 */
  
  grid-row-start: 1;
  grid-row-end: 2;      /* Occupe ligne 1 */
}

/* Raccourci */
.item {
  grid-column: 1 / 3;  /* start / end */
  grid-row: 1 / 2;
}

/* Span (étendue) */
.item {
  grid-column: 1 / span 2;  /* Commence à 1, occupe 2 colonnes */
  grid-row: span 2;          /* Occupe 2 lignes */
}

/* Raccourci ultime */
.item {
  grid-area: 1 / 1 / 2 / 3; /* row-start / col-start / row-end / col-end */
}
```

**Exemples pratiques :**

```css
/* Header full-width */
.header {
  grid-column: 1 / -1; /* Du début à la fin */
}

/* Item qui occupe 2x2 */
.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Chevauchement */
.overlay {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  z-index: 10;
}
```

### justify-self / align-self

Override de l'alignement pour un item.

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
  
  /* Raccourci */
  place-self: center; /* center center */
}
```

---

## Layouts courants

### Holy Grail Layout

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header {
  grid-column: 1 / -1;
  background: #333;
  color: white;
  padding: 1rem;
}

.sidebar-left {
  background: #f0f0f0;
}

.content {
  padding: 2rem;
}

.sidebar-right {
  background: #f0f0f0;
}

.footer {
  grid-column: 1 / -1;
  background: #333;
  color: white;
  padding: 1rem;
}
```

### Card Grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
}

/* Featured card (2x taille) */
.card.featured {
  grid-column: span 2;
  grid-row: span 2;
}
```

### Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 1rem;
}

.widget-large {
  grid-column: span 8;
  grid-row: span 2;
}

.widget-medium {
  grid-column: span 4;
  grid-row: span 2;
}

.widget-small {
  grid-column: span 4;
  grid-row: span 1;
}
```

### Pinterest-style Masonry

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px; /* Petite unité */
  gap: 1rem;
}

.item {
  /* Hauteur dynamique avec JS ou span */
  grid-row: span var(--row-span);
}
```

```javascript
// Calculer le span selon la hauteur
items.forEach(item => {
  const height = item.offsetHeight;
  const rowSpan = Math.ceil(height / 10);
  item.style.setProperty('--row-span', rowSpan);
});
```

---

## Design Responsive

### Media Queries

```css
/* Mobile First */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 colonne */
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* 4 colonnes */
  }
}
```

### Auto-responsive Grid

```css
/* S'adapte automatiquement ! */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* auto-fit vs auto-fill */
/* auto-fit : étire les items si espace disponible */
/* auto-fill : crée des colonnes vides */
```

### Container Queries (moderne)

```css
/* Layout qui s'adapte à son conteneur, pas au viewport */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

@container (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}
```

### Unités responsives

```css
.grid {
  display: grid;
  
  /* Clamp - valeur flexible entre min et max */
  grid-template-columns: repeat(auto-fit, minmax(
    clamp(250px, 30vw, 400px), 
    1fr
  ));
  
  /* Gap responsive */
  gap: clamp(1rem, 3vw, 3rem);
}
```

### Breakpoints communs

```css
/* Extra Small (Mobile) */
@media (max-width: 575px) { }

/* Small (Tablets) */
@media (min-width: 576px) { }

/* Medium (Tablets landscape) */
@media (min-width: 768px) { }

/* Large (Desktops) */
@media (min-width: 992px) { }

/* Extra Large (Large desktops) */
@media (min-width: 1200px) { }

/* XXL (Very large screens) */
@media (min-width: 1400px) { }
```

### Mobile-first vs Desktop-first

```css
/* Mobile-first (recommandé) */
.grid {
  grid-template-columns: 1fr; /* Base : mobile */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Amélioration progressive */
  }
}

/* Desktop-first */
.grid {
  grid-template-columns: repeat(4, 1fr); /* Base : desktop */
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr; /* Dégradation */
  }
}
```

---

## Techniques avancées

### Subgrid

Hérite de la grille parent.

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.child {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid; /* Hérite des colonnes du parent */
}
```

### Aspect Ratio

```css
.card {
  aspect-ratio: 16 / 9; /* Ratio 16:9 */
  aspect-ratio: 1; /* Carré */
  aspect-ratio: 4 / 3;
}

/* Combiné avec Grid */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.gallery img {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
}
```

### Grid + Flexbox combinés

```css
/* Layout global avec Grid */
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Navigation avec Flexbox */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Cards Grid */
.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Card interne avec Flexbox */
.card {
  display: flex;
  flex-direction: column;
}
```

---

## Outils et ressources

### DevTools

**Chrome/Firefox :**
- Inspecteur de grille
- Overlay visuel des lignes
- Numéros de lignes
- Noms des areas

### Générateurs en ligne

- **CSS Grid Generator** : https://cssgrid-generator.netlify.app/
- **Grid by Example** : https://gridbyexample.com/
- **CSS Tricks - Complete Guide** : https://css-tricks.com/snippets/css/complete-guide-grid/

### Jeux d'apprentissage

- [Grid Garden](https://cssgridgarden.com/) - Indispensable pour pratiquer

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Confusion `auto-fit` vs `auto-fill` | Colonnes vides inattendues | `auto-fit` étire les items |
| Oublier `min-height` | Grille écrasée | `min-height: 100vh` sur le conteneur |
| Grid areas mal définies | Layout cassé | Vérifier les noms et le nombre de colonnes |
| Pas de fallback | Vieux navigateurs cassés | Prévoir `@supports` ou alternatives |

---

## Quiz de vérification

1. Quelle propriété définit les colonnes d'une grille ?
   - A) `grid-columns`
   - B) `grid-template-columns` ✅
   - C) `columns`

2. Que signifie `1fr` ?
   - A) 1 pixel fixe
   - B) Une fraction de l'espace disponible ✅
   - C) 1% de la largeur

3. Comment faire une grille responsive automatiquement ?
   - A) `repeat(auto-fit, minmax(250px, 1fr))` ✅
   - B) `repeat(3, 1fr)`
   - C) `grid-auto-columns: auto`

4. Quelle propriété fait occuper plusieurs colonnes à un item ?
   - A) `grid-width: 2`
   - B) `grid-column: span 2` ✅
   - C) `column-span: 2`

---

## Prochaine étape

Passez à [JavaScript - Variables et Types](../../javascript/variables-types/declaration-types-primitifs.md) pour commencer la programmation.
