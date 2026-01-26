# Learning Space - Application d'Apprentissage Web

Une application web moderne d'apprentissage interactive construite avec **Next.js 14+**, **TypeScript**, et **Tailwind CSS**.

## Fonctionnalités

- ✅ **Navigation hiérarchique** : Structure Axes > Chapitres > Sections avec accordéons interactifs
- ✅ **Contenu Markdown** : Parsing de fichiers .md avec support du code syntax highlighting
- ✅ **Détection de lecture** : Détecte automatiquement quand vous avez terminé une section
- ✅ **Navigation intelligente** : Flèches précédent/suivant apparaissant après lecture
- ✅ **Suivi de progression** : Marque les sections lues et affiche la progression globale
- ✅ **Interface responsive** : Design adaptatif pour mobile et desktop
- ✅ **Routes dynamiques** : URLs propres pour chaque section
- ✅ **Persistance locale** : Sauvegarde de la progression avec localStorage

## Prérequis

- **Node.js** 18.0 ou supérieur
- **npm** ou **yarn**

## Installation

### 1. Cloner ou télécharger le projet

```bash
cd ProgWeb
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installera :
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- react-markdown (parsing Markdown)
- react-syntax-highlighter (coloration syntaxique)
- remark-gfm (support GitHub Flavored Markdown)

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

## Structure du projet

```
ProgWeb/
├── public/
│   └── content/                    # Fichiers Markdown
│       └── dev-web/
│           ├── fondamentaux/
│           │   ├── introduction.md
│           │   └── histoire.md
│           ├── html-css/
│           │   ├── balises-html.md
│           │   ├── selecteurs-css.md
│           │   └── flexbox-grid.md
│           └── javascript/
│               ├── variables-types.md
│               ├── fonctions.md
│               └── dom-manipulation.md
├── src/
│   ├── app/
│   │   ├── [axis]/
│   │   │   └── [chapter]/
│   │   │       └── [section]/
│   │   │           └── page.tsx    # Page dynamique de section
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Page d'accueil
│   │   └── globals.css             # Styles globaux
│   ├── components/
│   │   ├── Sidebar.tsx             # Navigation hiérarchique
│   │   ├── ContentDisplay.tsx      # Affichage du Markdown
│   │   └── NavigationArrows.tsx    # Flèches de navigation
│   ├── data/
│   │   └── structure.json          # Structure de navigation
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   └── utils/
│       └── navigation.ts           # Utilitaires de navigation
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Architecture

### Navigation dynamique

La structure de navigation est définie dans `src/data/structure.json` :

```json
{
  "axes": [
    {
      "id": "dev-web",
      "name": "Développement Web",
      "chapters": [
        {
          "id": "fondamentaux",
          "name": "Fondamentaux",
          "sections": [
            {
              "id": "introduction",
              "name": "Introduction",
              "file": "dev-web/fondamentaux/introduction.md"
            }
          ]
        }
      ]
    }
  ]
}
```

### Routes dynamiques

Next.js génère automatiquement les routes :
- `/dev-web/fondamentaux/introduction`
- `/dev-web/html-css/balises-html`
- etc.

### Détection de lecture

Un `IntersectionObserver` détecte quand l'utilisateur atteint le bas de la page :

```typescript
const observerRef = new IntersectionObserver((entries) => {
  if (entry.isIntersecting) {
    markSectionAsRead();
    showNavigationArrows();
  }
});
```

### Persistance

La progression est sauvegardée dans `localStorage` :

```typescript
localStorage.setItem('read_axe_chapter_section', 'true');
```

## Utilisation

### 1. Navigation

- Cliquez sur un **axe** pour dévoiler ses chapitres
- Cliquez sur un **chapitre** pour voir ses sections
- Cliquez sur une **section** pour afficher son contenu

### 2. Lecture

- Lisez le contenu Markdown affiché
- Scrollez jusqu'au bas de la page
- Les flèches de navigation apparaissent automatiquement
- La section est marquée comme lue ✓

### 3. Progression

- Consultez votre progression en haut de la sidebar
- Les sections lues ont une icône verte ✓
- Le pourcentage global est calculé automatiquement

## ➕ Ajouter du contenu

### Créer une nouvelle section

1. **Ajoutez l'entrée dans `structure.json`** :

```json
{
  "id": "nouvelle-section",
  "name": "Nouvelle Section",
  "file": "dev-web/chapitre/nouvelle-section.md"
}
```

2. **Créez le fichier Markdown** :

```bash
# public/content/dev-web/chapitre/nouvelle-section.md
```

3. **Écrivez votre contenu** :

```markdown
# Titre de la section

Votre contenu ici...

## Sous-titre

\`\`\`javascript
// Code avec coloration syntaxique
const exemple = "Automatique !";
\`\`\`
```

### Markdown supporté

- Titres (`#`, `##`, `###`, etc.)
- **Gras** et *italique*
- Listes (ordonnées et non ordonnées)
- Liens `[texte](url)`
- Images `![alt](url)`
- Citations `>`
- Tableaux
- Code inline `` `code` ``
- Blocs de code avec highlighting

```javascript
// JavaScript
function hello() {
  console.log("Hello World!");
}
```

```python
# Python
def hello():
    print("Hello World!")
```

## Déploiement

### Build de production

```bash
npm run build
npm start
```

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Déploiement sur Netlify

1. Connectez votre repository GitHub
2. Configuration :
   - Build command: `npm run build`
   - Publish directory: `.next`

## Configuration

### Modifier le thème

Éditez `tailwind.config.ts` :

```typescript
theme: {
  extend: {
    colors: {
      primary: '#yourcolor',
    },
  },
},
```

### Ajouter des extensions Markdown

Installez un plugin remark/rehype et ajoutez-le dans `ContentDisplay.tsx` :

```bash
npm install remark-math rehype-katex
```

```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
```

## Scripts disponibles

- `npm run dev` : Lancer en mode développement
- `npm run build` : Créer un build de production
- `npm start` : Lancer le serveur de production
- `npm run lint` : Vérifier le code avec ESLint

## Dépannage

### Les styles Tailwind ne s'appliquent pas

Vérifiez que `globals.css` est bien importé dans `layout.tsx`.

### Les fichiers Markdown ne se chargent pas

- Vérifiez que les fichiers sont dans `public/content/`
- Vérifiez les chemins dans `structure.json`
- Consultez la console du navigateur pour les erreurs

## Extensions futures

- **Statistiques** : Graphiques de progression détaillés
- **Authentification** : Comptes utilisateurs
- **Multilingue** : Support i18n

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Licence

Ce projet est open source et disponible sous licence MIT.