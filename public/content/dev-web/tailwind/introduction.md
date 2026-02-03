# Introduction à Tailwind CSS

Tailwind CSS est un framework CSS "utility-first" qui a révolutionné la façon de styliser les applications web. Au lieu d'écrire du CSS personnalisé, vous appliquez des classes utilitaires directement dans votre HTML.

## Pourquoi Tailwind ?

### CSS traditionnel vs Tailwind

```html
<!-- CSS traditionnel -->
<style>
.card {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>

<div class="card">
  <h2 class="card-title">Mon titre</h2>
  <p>Contenu de la carte</p>
</div>
```

```html
<!-- Tailwind CSS -->
<div class="bg-white rounded-lg p-6 shadow-md">
  <h2 class="text-xl font-semibold mb-2">Mon titre</h2>
  <p>Contenu de la carte</p>
</div>
```

### Avantages

- ✅ **Pas de CSS à écrire** : Tout est dans le HTML
- ✅ **Design system intégré** : Espacements, couleurs, tailles cohérentes
- ✅ **Pas de conflits de noms** : Fini les `.card`, `.card2`, `.new-card`
- ✅ **Responsive natif** : `sm:`, `md:`, `lg:` préfixes
- ✅ **Mode sombre facile** : Préfixe `dark:`
- ✅ **Fichier CSS optimisé** : Seules les classes utilisées sont incluses

### Inconvénients

- ❌ HTML plus verbeux
- ❌ Courbe d'apprentissage des classes
- ❌ Peut sembler chaotique au début

---

## Installation

### Avec Next.js (recommandé)

```bash
npx create-next-app@latest mon-projet
# Répondre "Yes" à "Would you like to use Tailwind CSS?"
```

### Avec Vite

```bash
npm create vite@latest mon-projet -- --template react
cd mon-projet
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Les bases

### Espacements (margin, padding)

```html
<!-- Padding -->
<div class="p-4">Padding 16px tous les côtés</div>
<div class="px-4">Padding horizontal</div>
<div class="py-4">Padding vertical</div>
<div class="pt-4">Padding top</div>
<div class="pr-4 pb-4 pl-4">Padding right, bottom, left</div>

<!-- Margin -->
<div class="m-4">Margin 16px</div>
<div class="mx-auto">Centrer horizontalement</div>
<div class="mt-8 mb-4">Margin top 32px, bottom 16px</div>

<!-- Valeurs négatives -->
<div class="-mt-4">Margin top négatif</div>
```

#### Échelle des espacements

| Classe | Valeur |
|--------|--------|
| `p-0` | 0 |
| `p-1` | 4px (0.25rem) |
| `p-2` | 8px (0.5rem) |
| `p-4` | 16px (1rem) |
| `p-6` | 24px (1.5rem) |
| `p-8` | 32px (2rem) |
| `p-12` | 48px (3rem) |
| `p-16` | 64px (4rem) |

### Couleurs

```html
<!-- Texte -->
<p class="text-red-500">Rouge</p>
<p class="text-blue-600">Bleu foncé</p>
<p class="text-gray-900">Presque noir</p>

<!-- Background -->
<div class="bg-white">Fond blanc</div>
<div class="bg-gray-100">Gris clair</div>
<div class="bg-blue-500">Bleu</div>

<!-- Bordure -->
<div class="border border-gray-300">Bordure grise</div>

<!-- Opacité -->
<div class="bg-black/50">Noir 50% transparent</div>
<div class="bg-blue-500/75">Bleu 75% opacité</div>
```

#### Palette de couleurs

Chaque couleur a des variantes de 50 à 950 :
- `gray`, `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `purple`, `pink`
- Plus léger (50-300), standard (400-600), plus foncé (700-950)

### Typographie

```html
<!-- Taille -->
<p class="text-sm">Petit</p>
<p class="text-base">Normal (16px)</p>
<p class="text-lg">Grand</p>
<p class="text-xl">Très grand</p>
<p class="text-2xl">2x grand</p>
<p class="text-4xl">4x grand</p>

<!-- Graisse -->
<p class="font-light">Light</p>
<p class="font-normal">Normal</p>
<p class="font-medium">Medium</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>

<!-- Style -->
<p class="italic">Italique</p>
<p class="underline">Souligné</p>
<p class="line-through">Barré</p>
<p class="uppercase">MAJUSCULES</p>

<!-- Alignement -->
<p class="text-left">Gauche</p>
<p class="text-center">Centre</p>
<p class="text-right">Droite</p>
```

### Dimensions

```html
<!-- Largeur -->
<div class="w-full">100%</div>
<div class="w-1/2">50%</div>
<div class="w-1/3">33.33%</div>
<div class="w-64">256px</div>
<div class="w-screen">Largeur de l'écran</div>
<div class="max-w-md">Max 448px</div>
<div class="min-w-0">Min 0</div>

<!-- Hauteur -->
<div class="h-screen">100vh</div>
<div class="h-full">100%</div>
<div class="h-64">256px</div>
<div class="min-h-screen">Minimum 100vh</div>
```

---

## Flexbox

```html
<!-- Container flex -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Direction -->
<div class="flex flex-col">Colonne</div>
<div class="flex flex-row">Ligne (défaut)</div>
<div class="flex flex-row-reverse">Ligne inversée</div>

<!-- Alignement horizontal (justify) -->
<div class="flex justify-start">Début</div>
<div class="flex justify-center">Centre</div>
<div class="flex justify-end">Fin</div>
<div class="flex justify-between">Espace entre</div>
<div class="flex justify-around">Espace autour</div>

<!-- Alignement vertical (items) -->
<div class="flex items-start">Haut</div>
<div class="flex items-center">Centre vertical</div>
<div class="flex items-end">Bas</div>
<div class="flex items-stretch">Étirer</div>

<!-- Gap (espacement) -->
<div class="flex gap-4">Gap 16px</div>
<div class="flex gap-x-4 gap-y-2">Gap horizontal/vertical</div>

<!-- Wrapping -->
<div class="flex flex-wrap">Retour à la ligne</div>

<!-- Flex grow/shrink -->
<div class="flex-1">Prend l'espace disponible</div>
<div class="flex-none">Taille fixe</div>
<div class="flex-grow">Grandir</div>
<div class="flex-shrink-0">Ne pas rétrécir</div>
```

### Exemple : Navbar

```html
<nav class="flex justify-between items-center p-4 bg-white shadow">
  <a href="/" class="text-xl font-bold">Logo</a>
  
  <div class="flex gap-6">
    <a href="/about" class="hover:text-blue-600">À propos</a>
    <a href="/contact" class="hover:text-blue-600">Contact</a>
  </div>
  
  <button class="bg-blue-500 text-white px-4 py-2 rounded">
    Connexion
  </button>
</nav>
```

---

## Grid

```html
<!-- Grille basique -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Colonnes de tailles différentes -->
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-4">4 colonnes</div>
  <div class="col-span-8">8 colonnes</div>
</div>

<!-- Responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>
```

---

## États et pseudo-classes

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">Hover</button>

<!-- Focus -->
<input class="border focus:border-blue-500 focus:ring-2 focus:ring-blue-200">

<!-- Active -->
<button class="bg-blue-500 active:bg-blue-700">Click</button>

<!-- Disabled -->
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Désactivé
</button>

<!-- Focus visible (accessibilité) -->
<button class="focus-visible:ring-2">Focus clavier uniquement</button>

<!-- Group hover -->
<div class="group">
  <h3 class="group-hover:text-blue-600">Titre</h3>
  <p class="group-hover:underline">Sous-titre</p>
</div>

<!-- First/Last child -->
<ul>
  <li class="first:pt-0 last:pb-0 py-2">Item</li>
</ul>
```

---

## Responsive Design

### Breakpoints

| Préfixe | Largeur min | Cible |
|---------|-------------|-------|
| (aucun) | 0px | Mobile first |
| `sm:` | 640px | Petit mobile |
| `md:` | 768px | Tablette |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Grand écran |
| `2xl:` | 1536px | Très grand écran |

### Exemples

```html
<!-- Texte responsive -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  Titre responsive
</h1>

<!-- Layout responsive -->
<div class="flex flex-col md:flex-row gap-4">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Contenu</main>
</div>

<!-- Afficher/Masquer -->
<div class="hidden md:block">Visible sur tablette+</div>
<div class="md:hidden">Visible sur mobile</div>

<!-- Grille responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- 1 colonne mobile, 2 tablette, 4 desktop -->
</div>
```

---

## Dark Mode

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ou 'media' pour le système
  // ...
}
```

### Utilisation

```html
<!-- Ajouter la classe 'dark' sur html ou body -->
<html class="dark">

<!-- Styles conditionnels -->
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">Titre</h1>
  <p class="text-gray-600 dark:text-gray-300">Texte</p>
</div>

<!-- Toggle en React -->
<button onClick={() => document.documentElement.classList.toggle('dark')}>
  Toggle Dark Mode
</button>
```

---

## Composant réutilisable

### Avec @apply

```css
/* globals.css */
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  }
}
```

```html
<button class="btn btn-primary">Bouton</button>
<div class="card">Carte</div>
```

### Avec des composants React

```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

---

## Ressources

- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/) - Composants premium
- [Headless UI](https://headlessui.com/) - Composants accessibles
- [Heroicons](https://heroicons.com/) - Icônes par l'équipe Tailwind

---

## Exercice

Recréez cette carte avec Tailwind :

```
┌─────────────────────────────┐
│  [Image]                    │
├─────────────────────────────┤
│  Catégorie                  │
│  Titre de l'article         │
│  Description courte...      │
│                             │
│  👤 Auteur    📅 Date       │
└─────────────────────────────┘
```

<details>
<summary>✅ Solution</summary>

```html
<article class="max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
  <img 
    src="/image.jpg" 
    alt="Article" 
    class="w-full h-48 object-cover"
  />
  
  <div class="p-6">
    <span class="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase">
      Catégorie
    </span>
    
    <h2 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
      Titre de l'article
    </h2>
    
    <p class="mt-2 text-gray-600 dark:text-gray-300">
      Description courte de l'article qui donne envie de lire la suite...
    </p>
    
    <div class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1">
        <span>👤</span> Auteur
      </span>
      <span class="flex items-center gap-1">
        <span>📅</span> 15 Jan 2024
      </span>
    </div>
  </div>
</article>
```

</details>
