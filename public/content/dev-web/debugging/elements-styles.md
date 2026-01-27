# Elements & Styles : Inspecter le DOM

L'onglet Elements est votre meilleur ami pour comprendre et modifier le HTML/CSS en temps réel. Apprenez à l'utiliser efficacement.

## Ouvrir l'inspecteur

Plusieurs méthodes :

| Méthode | Action |
|---------|--------|
| Raccourci | `F12` puis onglet Elements |
| Clic droit | Sur un élément > "Inspecter" |
| Raccourci direct | `Ctrl + Shift + C` (mode sélection) |

---

## Navigation dans le DOM

### Panneau HTML (gauche)

L'arbre DOM complet de la page :

```html
▼ <html>
  ▼ <head>...</head>
  ▼ <body>
    ▼ <header class="navbar">
      ▼ <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
```

### Raccourcis de navigation

| Touche | Action |
|--------|--------|
| `↑` `↓` | Naviguer entre éléments |
| `←` | Replier l'élément / aller au parent |
| `→` | Déplier l'élément |
| `Enter` | Éditer l'élément |
| `H` | Masquer/afficher l'élément |
| `Delete` | Supprimer l'élément |

### Rechercher dans le DOM

`Ctrl + F` dans le panneau Elements :

```
// Par texte
Bienvenue

// Par sélecteur CSS
.navbar a

// Par XPath
//div[@class="container"]
```

---

## Modifier le HTML en live

### Éditer un élément

1. Double-cliquez sur le texte ou un attribut
2. Ou clic droit > "Edit as HTML"

```html
<!-- Avant -->
<button class="btn">Envoyer</button>

<!-- Après modification -->
<button class="btn btn-primary" disabled>Envoi en cours...</button>
```

Les changements sont instantanés (mais temporaires - rafraîchir = perdu).

### Ajouter/supprimer des attributs

Double-cliquez sur un attribut existant ou à côté de la balise :

```html
<div class="card">
     ↑ double-clic ici pour ajouter un attribut
```

### Déplacer des éléments

Glissez-déposez les éléments dans l'arbre pour les réorganiser.

### Dupliquer un élément

Clic droit > "Duplicate element"

---

## Panneau Styles (droite)

### Styles appliqués

Affiche les règles CSS qui s'appliquent à l'élément sélectionné :

```css
/* Styles inline */
element.style {
  color: red;
}

/* Règles des fichiers CSS */
.card {
  padding: 1rem;
  background: white;
}

/* Règles héritées */
body {
  font-family: Arial, sans-serif;
}
```

### Comprendre la cascade

Les styles sont affichés par ordre de priorité :
1. `element.style` (inline)
2. Sélecteurs par spécificité décroissante
3. Styles hérités (en gris)

Les propriétés barrées ~~`color: blue`~~ sont écrasées par une règle plus prioritaire.

---

## Modifier les styles en live

### Ajouter une propriété

Cliquez dans un bloc de règles et tapez :

```css
.card {
  padding: 1rem;
  /* Cliquez ici et tapez : */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Toggler une propriété

Cochez/décochez la case à gauche de chaque propriété pour l'activer/désactiver.

### Modifier une valeur

Cliquez sur la valeur et :
- Tapez une nouvelle valeur
- Utilisez `↑` `↓` pour incrémenter les nombres
- `Shift + ↑` pour incrémenter par 10
- `Alt + ↑` pour incrémenter par 0.1

### element.style

Ajoutez des styles inline temporaires en haut du panneau :

```css
element.style {
  background: yellow !important;
  border: 2px solid red;
}
```

Parfait pour tester rapidement.

---

## Outils visuels

### Color Picker

Cliquez sur le carré de couleur pour ouvrir le sélecteur :
- Pipette pour sélectionner une couleur sur la page
- Différents formats (hex, rgb, hsl)
- Palette de couleurs du site

### Box Model

En bas du panneau Styles, visualisez :

```
        ┌─ margin ─────────────┐
        │  ┌─ border ───────┐  │
        │  │  ┌─ padding ─┐ │  │
        │  │  │  content  │ │  │
        │  │  │  300×200  │ │  │
        │  │  └───────────┘ │  │
        │  └────────────────┘  │
        └──────────────────────┘
```

Double-cliquez sur les valeurs pour les modifier.

### Grid et Flexbox

Des badges apparaissent sur les conteneurs flex/grid :

```html
<div class="container">  [grid] [flex]
```

Cliquez dessus pour visualiser :
- Lignes et colonnes de la grille
- Axes flex et espacement

---

## Computed (styles calculés)

L'onglet **Computed** montre les valeurs finales après cascade :

```css
/* Même si vous avez écrit */
.card { font-size: 1.2rem; }

/* Computed affiche */
font-size: 19.2px
```

Cliquez sur une propriété pour voir d'où elle vient.

### Filter

Filtrez pour trouver une propriété spécifique :
```
padding
font
```

### Show all

Cochez pour voir TOUTES les propriétés CSS (même non définies).

---

## Forcer les états

Clic droit sur un élément > "Force state" :

- `:hover` - Simuler le survol
- `:active` - Simuler le clic
- `:focus` - Simuler le focus
- `:visited` - Lien visité

Ou cliquez sur `:hov` dans le panneau Styles.

Indispensable pour styler/debugger les états !

---

## Breakpoints DOM

Clic droit > "Break on..." :

| Option | Se déclenche quand |
|--------|---------------------|
| Subtree modifications | Un enfant est ajouté/supprimé |
| Attribute modifications | Un attribut change |
| Node removal | L'élément est supprimé |

Le debugger s'arrête avec la stack trace du code responsable.

---

## Accessibilité

L'onglet **Accessibility** dans le panneau latéral montre :

- L'arbre d'accessibilité
- Le rôle ARIA de l'élément
- Les labels et descriptions
- Le contraste des couleurs

### Vérifier le contraste

Le color picker indique si le contraste est suffisant :
- ✅ AAA (excellent)
- ✅ AA (acceptable)
- ⚠️ Contraste insuffisant

---

## Astuces avancées

### $0 dans la console

L'élément sélectionné est accessible via `$0` :

```javascript
$0.style.background = 'red';
$0.classList.add('highlighted');
$0.remove();
```

### Capture d'écran

Clic droit sur un élément > "Capture node screenshot"

Sauvegarde une image de l'élément uniquement.

### Scroll into view

Clic droit > "Scroll into view"

Scrolle la page pour afficher l'élément.

### Store as global variable

Clic droit > "Store as global variable"

L'élément devient accessible via `temp1`, `temp2`... dans la console.

---

## Exercice pratique

1. Inspectez un bouton sur votre site
2. Forcez l'état `:hover`
3. Modifiez les styles pour :
   - Changer la couleur de fond
   - Ajouter une ombre
   - Augmenter le padding
4. Copiez les styles modifiés dans votre CSS

---

## Raccourcis essentiels

| Action | Raccourci |
|--------|-----------|
| Mode sélection | `Ctrl + Shift + C` |
| Inspecter élément sélectionné | `F12` |
| Rechercher dans le DOM | `Ctrl + F` |
| Éditer comme HTML | `F2` |
| Masquer élément | `H` |
| Supprimer élément | `Delete` |
| Annuler | `Ctrl + Z` |

---

## Checklist inspection CSS

- [ ] L'élément a-t-il les bonnes classes ?
- [ ] Les styles sont-ils appliqués ? (pas barrés)
- [ ] Y a-t-il un conflit de spécificité ?
- [ ] Les valeurs computed sont-elles correctes ?
- [ ] Le box model est-il correct ?
- [ ] Les états (:hover, :focus) fonctionnent-ils ?
