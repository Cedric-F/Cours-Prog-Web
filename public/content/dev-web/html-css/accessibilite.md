# Accessibilité Web (a11y)

Rendez votre site utilisable par tous, y compris les personnes en situation de handicap.

---

## Ce que vous allez apprendre

- Comprendre les principes WCAG
- Utiliser le HTML sémantique
- Implémenter les attributs ARIA
- Tester l'accessibilité

## Prérequis

- [Balises HTML](./balises-html/structure-essentielles.md)
- [Sélecteurs CSS](./selecteurs-css/selecteurs-base.md)

---

## Pourquoi l'accessibilité ?

### Qui est concerné ?

| Type de handicap | Population | Solutions |
|------------------|------------|-----------|
| Visuel | 2.2 milliards | Lecteurs d'écran, contraste |
| Moteur | 15% mondial | Navigation clavier |
| Auditif | 466 millions | Sous-titres, transcriptions |
| Cognitif | Variable | Contenu clair, structure |

### Bénéfices pour tous

- 📱 **Mobile** : Meilleure UX tactile
- 🔍 **SEO** : Meilleur référencement
- ⚡ **Performance** : HTML plus léger
- ⚖️ **Légal** : Obligation dans certains pays

---

## WCAG - Les 4 principes

### POUR : Perceivable, Operable, Understandable, Robust

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  PERCEIVABLE (Perceptible)                                  │
│  → Le contenu peut être perçu par tous les sens            │
│                                                              │
│  OPERABLE (Utilisable)                                      │
│  → L'interface peut être utilisée par tous                 │
│                                                              │
│  UNDERSTANDABLE (Compréhensible)                            │
│  → Le contenu et les fonctionnalités sont clairs           │
│                                                              │
│  ROBUST (Robuste)                                           │
│  → Compatible avec les technologies d'assistance            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Niveaux de conformité

| Niveau | Description | Exigence |
|--------|-------------|----------|
| **A** | Minimum | Bloquant si absent |
| **AA** | Standard | Recommandé |
| **AAA** | Optimal | Cas spécifiques |

---

## HTML Sémantique

### Structure de page

```html
<!-- ❌ Non sémantique -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="article">...</div>
  <div class="sidebar">...</div>
</div>
<div class="footer">...</div>

<!-- ✅ Sémantique -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

### Pourquoi c'est important

Les lecteurs d'écran utilisent ces balises pour naviguer :

```
- Navigation rapide : "Aller au contenu principal" → <main>
- Liste des régions : <header>, <nav>, <main>, <footer>
- Liste des titres : <h1>, <h2>, <h3>...
```

### Hiérarchie des titres

```html
<!-- ❌ Mauvaise hiérarchie -->
<h1>Mon Site</h1>
<h3>Article 1</h3>  <!-- Saute h2 ! -->
<h5>Section</h5>    <!-- Saute h4 ! -->

<!-- ✅ Bonne hiérarchie -->
<h1>Mon Site</h1>
<h2>Article 1</h2>
<h3>Section 1.1</h3>
<h3>Section 1.2</h3>
<h2>Article 2</h2>
```

---

## Images accessibles

### Alt text

```html
<!-- ❌ Pas d'alt ou alt inutile -->
<img src="logo.png">
<img src="logo.png" alt="image">
<img src="logo.png" alt="logo.png">

<!-- ✅ Alt descriptif -->
<img src="logo.png" alt="Logo de MonEntreprise">

<!-- ✅ Image décorative (alt vide) -->
<img src="decoration.png" alt="">

<!-- ✅ Image complexe (description longue) -->
<figure>
  <img src="graphique.png" alt="Graphique des ventes 2024">
  <figcaption>
    Les ventes ont augmenté de 25% au Q3, 
    principalement grâce au produit X.
  </figcaption>
</figure>
```

### Bonnes pratiques alt

| Type d'image | Alt |
|--------------|-----|
| Logo | Nom de l'entreprise |
| Produit | Description du produit |
| Décorative | `alt=""` (vide) |
| Graphique | Résumé des données |
| Icône avec texte | `alt=""` (le texte suffit) |
| Icône seule | Action ou signification |

---

## Formulaires accessibles

### Labels

```html
<!-- ❌ Pas de label -->
<input type="email" placeholder="Email">

<!-- ❌ Label non lié -->
<label>Email</label>
<input type="email">

<!-- ✅ Label lié avec for/id -->
<label for="email">Email</label>
<input type="email" id="email">

<!-- ✅ Label implicite -->
<label>
  Email
  <input type="email">
</label>
```

### Messages d'erreur

```html
<!-- ✅ Erreur associée au champ -->
<label for="password">Mot de passe</label>
<input 
  type="password" 
  id="password"
  aria-describedby="password-error"
  aria-invalid="true"
>
<span id="password-error" class="error">
  Le mot de passe doit contenir au moins 8 caractères
</span>
```

### Champs requis

```html
<label for="name">
  Nom <span aria-hidden="true">*</span>
  <span class="sr-only">(requis)</span>
</label>
<input type="text" id="name" required aria-required="true">
```

### Groupes de champs

```html
<fieldset>
  <legend>Adresse de livraison</legend>
  
  <label for="street">Rue</label>
  <input type="text" id="street">
  
  <label for="city">Ville</label>
  <input type="text" id="city">
</fieldset>
```

---

## Navigation au clavier

### Focus visible

```css
/* ❌ Ne jamais faire ça ! */
*:focus {
  outline: none;
}

/* ✅ Style de focus personnalisé */
:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* ✅ Focus visible uniquement au clavier */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

### Ordre de tabulation

```html
<!-- ❌ Ordre illogique -->
<input tabindex="3">
<input tabindex="1">
<input tabindex="2">

<!-- ✅ Ordre naturel (pas de tabindex positif) -->
<input>
<input>
<input>

<!-- Retirer du focus si nécessaire -->
<div tabindex="-1">Non focusable au clavier</div>
```

### Skip link

```html
<!-- Premier élément de la page -->
<a href="#main-content" class="skip-link">
  Aller au contenu principal
</a>

<!-- ... header, nav ... -->

<main id="main-content">
  <!-- Contenu -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## ARIA (Accessible Rich Internet Applications)

### Quand utiliser ARIA ?

> "No ARIA is better than bad ARIA"

1. **Préférer le HTML natif** quand possible
2. **ARIA** pour les widgets personnalisés
3. **Tester** avec un lecteur d'écran

### Rôles courants

```html
<!-- Navigation -->
<nav role="navigation" aria-label="Menu principal">

<!-- Région principale -->
<main role="main">

<!-- Alerte -->
<div role="alert">Erreur lors de la sauvegarde</div>

<!-- Bouton personnalisé -->
<div role="button" tabindex="0">Cliquer</div>
```

### États et propriétés

```html
<!-- Menu déroulant -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" aria-hidden="true">
  <li><a href="#">Option 1</a></li>
  <li><a href="#">Option 2</a></li>
</ul>

<!-- Chargement -->
<div aria-busy="true" aria-live="polite">
  Chargement en cours...
</div>

<!-- Onglets -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    Onglet 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2">
    Onglet 2
  </button>
</div>
<div role="tabpanel" id="panel1">Contenu 1</div>
<div role="tabpanel" id="panel2" hidden>Contenu 2</div>
```

### Live regions

```html
<!-- Annonces dynamiques -->
<div aria-live="polite">
  <!-- Le contenu ajouté ici sera lu par le lecteur d'écran -->
</div>

<div aria-live="assertive">
  <!-- Interrompt la lecture en cours (erreurs urgentes) -->
</div>

<!-- Exemple : notification de succès -->
<div aria-live="polite" class="notification">
  Produit ajouté au panier
</div>
```

---

## Contraste des couleurs

### Ratios minimums

| Élément | Niveau AA | Niveau AAA |
|---------|-----------|------------|
| Texte normal | 4.5:1 | 7:1 |
| Grand texte (18px+) | 3:1 | 4.5:1 |
| Éléments UI | 3:1 | 3:1 |

### Vérifier le contraste

```css
/* ❌ Contraste insuffisant (2.5:1) */
.text {
  color: #999;
  background: #fff;
}

/* ✅ Contraste suffisant (4.5:1) */
.text {
  color: #595959;
  background: #fff;
}
```

### Outils

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorable](https://colorable.jxnblk.com/)
- DevTools → Lighthouse

---

## Contenu multimédia

### Vidéos

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  
  <!-- Sous-titres -->
  <track 
    kind="captions" 
    src="captions-fr.vtt" 
    srclang="fr" 
    label="Français"
    default
  >
  
  <!-- Audio-description -->
  <track 
    kind="descriptions" 
    src="descriptions.vtt" 
    srclang="fr"
  >
</video>
```

### Audio

```html
<audio controls>
  <source src="podcast.mp3" type="audio/mp3">
</audio>

<!-- Transcription -->
<details>
  <summary>Transcription de l'épisode</summary>
  <p>Bienvenue dans ce podcast...</p>
</details>
```

---

## Tests d'accessibilité

### Automatiques

```bash
# Lighthouse (Chrome DevTools)
# F12 → Lighthouse → Accessibility

# axe DevTools (extension)
# npm
npm install @axe-core/cli -g
axe https://monsite.com
```

### Manuels

1. **Navigation clavier**
   - Tab à travers la page
   - Tous les éléments interactifs sont focusables ?
   - L'ordre est logique ?

2. **Lecteur d'écran**
   - Windows: NVDA (gratuit)
   - macOS: VoiceOver (Cmd + F5)
   - Tester la navigation et la lecture

3. **Zoom**
   - Zoomer à 200%
   - Le contenu reste utilisable ?

### Checklist rapide

```markdown
□ Structure sémantique (header, nav, main, footer)
□ Titres hiérarchiques (h1 → h2 → h3)
□ Alt sur toutes les images
□ Labels sur tous les champs
□ Contraste suffisant (4.5:1)
□ Focus visible
□ Navigation clavier possible
□ Skip link présent
□ Pas d'autoplay vidéo/audio
□ Texte redimensionnable (pas de px fixes)
```

---

## React et accessibilité

### jsx-a11y

```bash
npm install eslint-plugin-jsx-a11y
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['jsx-a11y'],
  extends: ['plugin:jsx-a11y/recommended']
};
```

### Composants accessibles

```jsx
// Bouton accessible
function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

// Modal accessible
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
```

### Focus trap

```jsx
// Pour les modales, garder le focus à l'intérieur
import { FocusTrap } from '@headlessui/react';

function Modal({ isOpen, children }) {
  return isOpen ? (
    <FocusTrap>
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </FocusTrap>
  ) : null;
}
```

---

## ❌ Erreurs Courantes

### 1. Outline supprimé sans alternative

```css
/* ❌ Inutilisable au clavier */
*:focus { outline: none; }

/* ✅ Alternative visible */
:focus-visible {
  outline: 2px solid blue;
}
```

### 2. Icônes sans texte

```html
<!-- ❌ Pas d'alternative textuelle -->
<button><i class="fa fa-trash"></i></button>

<!-- ✅ Avec aria-label -->
<button aria-label="Supprimer">
  <i class="fa fa-trash" aria-hidden="true"></i>
</button>

<!-- ✅ Ou texte masqué visuellement -->
<button>
  <i class="fa fa-trash" aria-hidden="true"></i>
  <span class="sr-only">Supprimer</span>
</button>
```

### 3. Div comme bouton

```html
<!-- ❌ Non accessible -->
<div class="button" onclick="submit()">Envoyer</div>

<!-- ✅ Utiliser button -->
<button onclick="submit()">Envoyer</button>

<!-- Si div obligatoire, ajouter les attributs -->
<div 
  role="button" 
  tabindex="0" 
  onclick="submit()"
  onkeypress="if(event.key==='Enter') submit()"
>
  Envoyer
</div>
```

---

## CSS utilitaires

```css
/* Masquer visuellement mais garder pour lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus visible uniquement au clavier */
.focus-visible:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Réduire les animations si préférence utilisateur */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🏋️ Exercice Pratique

**Objectif** : Auditer et corriger l'accessibilité d'une page

1. Lancer Lighthouse (onglet Accessibility)
2. Corriger les erreurs identifiées
3. Tester la navigation clavier
4. Vérifier avec un lecteur d'écran

<details>
<summary>Checklist de correction</summary>

- [ ] Ajouter les alt manquants
- [ ] Lier labels aux inputs
- [ ] Améliorer le contraste
- [ ] Ajouter les landmarks (header, main, nav)
- [ ] Vérifier la hiérarchie des titres
- [ ] Ajouter un skip link
</details>

---

## Quiz de vérification

:::quiz
Q: Quel ratio de contraste minimum pour le texte (AA) ?
- [ ] 3:1
- [x] 4.5:1
- [ ] 7:1
> Le niveau AA exige un ratio de 4.5:1 pour le texte normal et 3:1 pour le texte large.

Q: Comment lier un label à un input ?
- [x] `for` sur le label = `id` sur l'input
- [ ] `label-for` attribute
- [ ] CSS
> L'attribut `for` du label doit correspondre à l'`id` de l'input pour créer une association accessible.

Q: Quel attribut ARIA indique un menu ouvert ?
- [ ] `aria-open`
- [x] `aria-expanded`
- [ ] `aria-visible`
> `aria-expanded="true"` indique aux technologies d'assistance qu'un élément est déplié.
:::

---

## Pour aller plus loin

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

## Prochaine étape

Découvrez [Flexbox et Grid](./flexbox-grid/flexbox.md) pour créer des layouts accessibles et responsives.
