# Tailwind CSS : Techniques avancées

Après les bases, découvrons les fonctionnalités avancées de Tailwind pour des designs plus sophistiqués.

## Animations et transitions

### Transitions de base

```html
<!-- Transition sur toutes les propriétés -->
<button class="transition hover:bg-blue-600">
  Transition douce
</button>

<!-- Transition spécifique -->
<div class="transition-colors duration-300">Couleurs</div>
<div class="transition-opacity duration-500">Opacité</div>
<div class="transition-transform duration-200">Transform</div>

<!-- Durées -->
<div class="duration-75">75ms</div>
<div class="duration-150">150ms</div>
<div class="duration-300">300ms</div>
<div class="duration-500">500ms</div>

<!-- Easing -->
<div class="ease-linear">Linéaire</div>
<div class="ease-in">Accélère</div>
<div class="ease-out">Décélère</div>
<div class="ease-in-out">Les deux</div>
```

### Animations prédéfinies

```html
<!-- Spin (rotation infinie) -->
<svg class="animate-spin h-5 w-5">...</svg>

<!-- Ping (effet radar) -->
<span class="animate-ping inline-flex h-3 w-3 rounded-full bg-sky-400"></span>

<!-- Pulse (pulsation) -->
<div class="animate-pulse bg-gray-300 h-4 rounded"></div>

<!-- Bounce (rebond) -->
<svg class="animate-bounce">↓</svg>
```

### Skeleton loading avec animate-pulse

```html
<div class="animate-pulse flex space-x-4">
  <div class="rounded-full bg-gray-300 h-12 w-12"></div>
  <div class="flex-1 space-y-4 py-1">
    <div class="h-4 bg-gray-300 rounded w-3/4"></div>
    <div class="space-y-2">
      <div class="h-4 bg-gray-300 rounded"></div>
      <div class="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
</div>
```

### Animations personnalisées

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
}
```

```html
<div class="animate-fade-in">Apparition en fondu</div>
<div class="animate-slide-up">Glissement vers le haut</div>
<button class="animate-wiggle">🔔 Notification</button>
```

---

## Transforms

```html
<!-- Échelle -->
<div class="scale-90">90%</div>
<div class="scale-100">100%</div>
<div class="scale-110">110%</div>
<div class="hover:scale-105 transition-transform">Zoom au hover</div>

<!-- Rotation -->
<div class="rotate-45">45°</div>
<div class="rotate-90">90°</div>
<div class="-rotate-12">-12°</div>

<!-- Translation -->
<div class="translate-x-4">Droite</div>
<div class="-translate-y-2">Haut</div>
<div class="hover:-translate-y-1 transition-transform">Lévitation</div>

<!-- Skew -->
<div class="skew-x-12">Incliné</div>

<!-- Origin -->
<div class="origin-center">Centre</div>
<div class="origin-top-left">Coin supérieur gauche</div>
```

### Carte avec effet 3D

```html
<div class="group perspective">
  <div class="transition-transform duration-500 group-hover:rotate-y-12 
              bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-bold">Carte 3D</h3>
    <p>Survolez pour voir l'effet</p>
  </div>
</div>
```

---

## Gradients

```html
<!-- Direction -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">→ Droite</div>
<div class="bg-gradient-to-b from-blue-500 to-purple-500">↓ Bas</div>
<div class="bg-gradient-to-br from-blue-500 to-purple-500">↘ Diagonale</div>

<!-- 3 couleurs -->
<div class="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
  Dégradé 3 couleurs
</div>

<!-- Position des stops -->
<div class="bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-emerald-500">
  Positions personnalisées
</div>

<!-- Gradient sur texte -->
<h1 class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-4xl">
  Texte dégradé
</h1>
```

---

## Ombres avancées

```html
<!-- Ombres standard -->
<div class="shadow-sm">Petite</div>
<div class="shadow">Normale</div>
<div class="shadow-md">Moyenne</div>
<div class="shadow-lg">Grande</div>
<div class="shadow-xl">Très grande</div>
<div class="shadow-2xl">Énorme</div>
<div class="shadow-inner">Intérieure</div>
<div class="shadow-none">Aucune</div>

<!-- Ombres colorées -->
<div class="shadow-lg shadow-blue-500/50">
  Ombre bleue semi-transparente
</div>

<button class="bg-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow">
  Bouton avec ombre colorée
</button>
```

### Ombres personnalisées

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon': '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0ff, 0 0 40px #0ff',
      },
    },
  },
}
```

---

## Plugins officiels

### @tailwindcss/typography

Style automatique pour le contenu riche (Markdown) :

```bash
npm install @tailwindcss/typography
```

```javascript
// tailwind.config.js
plugins: [require('@tailwindcss/typography')]
```

```html
<article class="prose dark:prose-invert lg:prose-xl">
  <h1>Mon article</h1>
  <p>Le texte est automatiquement stylé...</p>
  <ul>
    <li>Listes</li>
    <li>Formatées</li>
  </ul>
  <pre><code>// Code aussi</code></pre>
</article>
```

### @tailwindcss/forms

Styles de base pour les formulaires :

```bash
npm install @tailwindcss/forms
```

```html
<input type="text" class="rounded-md border-gray-300 shadow-sm 
  focus:border-blue-500 focus:ring-blue-500">

<select class="rounded-md border-gray-300">
  <option>Option 1</option>
</select>
```

### @tailwindcss/aspect-ratio

Ratios d'aspect (avant CSS `aspect-ratio`) :

```html
<div class="aspect-w-16 aspect-h-9">
  <iframe src="..." class="w-full h-full"></iframe>
</div>
```

### @tailwindcss/container-queries

Container queries (styles basés sur le parent) :

```html
<div class="@container">
  <div class="@lg:flex @lg:gap-4">
    <!-- Responsive basé sur le container, pas le viewport -->
  </div>
</div>
```

---

## Personnalisation du thème

### Étendre vs remplacer

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // REMPLACE toutes les couleurs (pas recommandé)
    colors: {
      primary: '#3490dc',
    },
    
    // ÉTEND le thème existant (recommandé)
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        brand: '#FF5733',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
}
```

### Variables CSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
}
```

```css
/* globals.css */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
}

.dark {
  --color-primary: #60a5fa;
  --color-secondary: #34d399;
}
```

---

## Composants complexes

### Modal

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <!-- Modal -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 
              animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <h3 class="text-lg font-semibold">Titre du modal</h3>
      <button class="text-gray-400 hover:text-gray-600">✕</button>
    </div>
    
    <!-- Body -->
    <div class="p-4">
      <p>Contenu du modal...</p>
    </div>
    
    <!-- Footer -->
    <div class="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
        Annuler
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Confirmer
      </button>
    </div>
  </div>
</div>
```

### Toast notification

```html
<div class="fixed bottom-4 right-4 flex flex-col gap-2">
  <!-- Toast success -->
  <div class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 
              text-green-800 rounded-lg shadow-lg animate-slide-up">
    <span class="text-green-500">✓</span>
    <p>Sauvegarde réussie !</p>
    <button class="ml-auto text-green-400 hover:text-green-600">✕</button>
  </div>
  
  <!-- Toast error -->
  <div class="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 
              text-red-800 rounded-lg shadow-lg">
    <span class="text-red-500">✗</span>
    <p>Une erreur est survenue</p>
    <button class="ml-auto text-red-400 hover:text-red-600">✕</button>
  </div>
</div>
```

---

## Bibliothèques de composants

### shadcn/ui

Composants copiables (pas une dépendance) :

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
```

```tsx
import { Button } from "@/components/ui/button"

<Button variant="outline">Click me</Button>
```

### Headless UI

Composants accessibles et non stylés :

```bash
npm install @headlessui/react
```

```tsx
import { Menu } from '@headlessui/react'

<Menu>
  <Menu.Button className="bg-blue-500 px-4 py-2 rounded">Options</Menu.Button>
  <Menu.Items className="absolute bg-white shadow-lg rounded mt-2">
    <Menu.Item>
      {({ active }) => (
        <a className={`${active && 'bg-blue-100'} block px-4 py-2`}>
          Profile
        </a>
      )}
    </Menu.Item>
  </Menu.Items>
</Menu>
```

### DaisyUI

Composants préstylés :

```bash
npm install daisyui
```

```javascript
// tailwind.config.js
plugins: [require('daisyui')]
```

```html
<button class="btn btn-primary">Bouton DaisyUI</button>
<input type="checkbox" class="toggle toggle-primary" />
```

---

## Bonnes pratiques

### 1. Ordre des classes

Suivez un ordre cohérent :
1. Layout (flex, grid, position)
2. Box model (width, padding, margin)
3. Typographie
4. Visuel (background, border, shadow)
5. États (hover, focus)

```html
<div class="flex items-center justify-between 
            w-full p-4 
            text-lg font-bold 
            bg-white rounded-lg shadow 
            hover:shadow-lg">
```

### 2. Extraire les composants

Si vous répétez les mêmes classes, créez un composant :

```tsx
// ❌ Répétition
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">A</button>
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">B</button>

// ✅ Composant
const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    {children}
  </button>
);
```

### 3. Utiliser cn() ou clsx()

Pour les classes conditionnelles :

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

<button className={cn(
  "px-4 py-2 rounded",
  variant === "primary" && "bg-blue-500 text-white",
  variant === "outline" && "border border-gray-300",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

---

## Ressources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/) - Playground en ligne
- [Tailwind Components](https://tailwindcomponents.com/) - Composants gratuits
- [Hypercolor](https://hypercolor.dev/) - Générateur de gradients
