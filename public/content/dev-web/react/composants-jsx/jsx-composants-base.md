# JSX & Composants de Base

Découvrez les fondamentaux de React : JSX, composants fonctionnels, et les bases de la création d'interfaces utilisateur avec React.

---

## Ce que vous allez apprendre

- Comprendre ce qu'est React et pourquoi l'utiliser
- Écrire du JSX et comprendre sa syntaxe
- Créer des composants fonctionnels
- Structurer une application React

## Prérequis

- [JavaScript - Fonctions](../../javascript/fonctions/bases-fonctions.md)
- [JavaScript - DOM](../../javascript/dom-manipulation/selection-modification.md)
- [ES6+ (arrow functions, destructuring)](../../javascript/fonctions/concepts-avances.md)

---

## Introduction à React

**React** est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur de manière **déclarative** et **composée**.

### Pourquoi React ?

```jsx
// ✅ Avantages de React

// 1. Composants réutilisables
// Créer des blocs UI modulaires et maintenables

// 2. Virtual DOM
// Mises à jour optimisées automatiquement

// 3. Flux de données unidirectionnel
// Prévisible et facile à débugger

// 4. Écosystème riche
// Bibliothèques, outils, communauté massive

// 5. JSX
// Syntaxe intuitive HTML-dans-JS
```

### Installation et Configuration

```bash
# Avec Vite (recommandé - rapide et moderne)
npm create vite@latest mon-app -- --template react
cd mon-app
npm install
npm run dev

# Avec Create React App (classique)
npx create-react-app mon-app
cd mon-app
npm start

# Avec Next.js (full-stack)
npx create-next-app@latest mon-app
```

### Structure du projet

```
mon-app/
├── public/
│   └── index.html          # Point d'entrée HTML
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   └── Card.jsx
│   ├── App.jsx             # Composant racine
│   ├── main.jsx            # Point d'entrée React
│   └── index.css           # Styles globaux
├── package.json
└── vite.config.js
```

**main.jsx** : Point d'entrée

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## JSX : JavaScript XML

**JSX** est une extension syntaxique de JavaScript qui ressemble à HTML mais reste du JavaScript.

### Syntaxe de base

```jsx
// JSX simple
const element = <h1>Bonjour, React !</h1>;

// JSX avec expressions JavaScript
const name = 'Alice';
const greeting = <h1>Bonjour, {name} !</h1>;

// JSX multiligne (avec parenthèses)
const card = (
  <div className="card">
    <h2>Titre</h2>
    <p>Description</p>
  </div>
);
```

**Règles importantes** :
- `className` au lieu de `class` (mot-clé JS réservé)
- `htmlFor` au lieu de `for` (labels de formulaire)
- Toutes les balises doivent être fermées : `<img />`, `<input />`
- Un seul élément racine (ou utiliser des fragments)

### Expressions JavaScript dans JSX

```jsx
function Welcome() {
  const user = {
    firstName: 'Alice',
    lastName: 'Martin',
    age: 28
  };

  const imageUrl = '/avatar.jpg';

  return (
    <div className="profile">
      {/* Variables */}
      <h1>{user.firstName} {user.lastName}</h1>
      
      {/* Opérations mathématiques */}
      <p>Dans 10 ans : {user.age + 10} ans</p>
      
      {/* Appels de fonction */}
      <p>{formatName(user)}</p>
      
      {/* Ternaires (conditions) */}
      <p>Statut: {user.age >= 18 ? 'Majeur' : 'Mineur'}</p>
      
      {/* Méthodes sur strings */}
      <p>{user.firstName.toUpperCase()}</p>
      
      {/* Attributs dynamiques */}
      <img src={imageUrl} alt={user.firstName} />
      
      {/* Arrays */}
      <p>Chiffres : {[1, 2, 3, 4, 5].join(', ')}</p>
    </div>
  );
}

function formatName(user) {
  return `${user.firstName} ${user.lastName}`.toUpperCase();
}
```

### Attributs dans JSX

```jsx
function AttributesDemo() {
  const imageUrl = 'https://example.com/photo.jpg';
  const isActive = true;
  const inputType = 'email';

  return (
    <div>
      {/* className (pas class) */}
      <div className="container">
        
        {/* htmlFor (pas for) */}
        <label htmlFor="username">Nom :</label>
        <input id="username" type="text" />
        
        {/* Attributs dynamiques */}
        <img src={imageUrl} alt="Photo" />
        <input type={inputType} />
        
        {/* Booléens */}
        <input type="checkbox" checked={isActive} />
        <button disabled={!isActive}>Envoyer</button>
        
        {/* Styles inline (objet JS) */}
        <div style={{
          color: 'red',
          fontSize: '20px',
          backgroundColor: '#f0f0f0',
          padding: '10px'
        }}>
          Texte stylé
        </div>
        
        {/* Data attributes */}
        <button data-id="123" data-action="delete">
          Supprimer
        </button>
      </div>
    </div>
  );
}
```

**Note** : Les styles inline utilisent **camelCase** (`backgroundColor`) au lieu de kebab-case (`background-color`).

### Fragments

Les **fragments** permettent de grouper des éléments sans ajouter de nœud DOM.

```jsx
import { Fragment } from 'react';

// Syntaxe longue
function LongSyntax() {
  return (
    <Fragment>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </Fragment>
  );
}

// Syntaxe courte (recommandée)
function ShortSyntax() {
  return (
    <>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </>
  );
}

// Cas d'usage : Composants retournant plusieurs éléments
function Columns() {
  return (
    <>
      <td>Colonne 1</td>
      <td>Colonne 2</td>
      <td>Colonne 3</td>
    </>
  );
}

function Table() {
  return (
    <table>
      <tbody>
        <tr>
          <Columns />
        </tr>
      </tbody>
    </table>
  );
}
```

**Avec keys** (pour listes) :

```jsx
function ListWithKeys() {
  const items = ['Pomme', 'Banane', 'Orange'];
  
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={index}>
          <h3>{item}</h3>
          <p>Description de {item}</p>
        </Fragment>
      ))}
    </>
  );
}
```

### Commentaires dans JSX

```jsx
function CommentsDemo() {
  return (
    <div>
      {/* Commentaire JSX sur une ligne */}
      <h1>Titre</h1>

      {/* 
        Commentaire
        multiligne
        en JSX
      */}
      <p>Paragraphe</p>

      {/* Commentaire après un élément */}
      <button>Cliquez</button> {/* Bouton d'action */}
    </div>
  );
}
```

---

## Composants Fonctionnels

Les **composants fonctionnels** sont des fonctions JavaScript qui retournent du JSX.

### Composant simple

```jsx
// Déclaration de fonction (classique)
function Welcome() {
  return <h1>Bienvenue sur React !</h1>;
}

// Arrow function (moderne)
const Welcome = () => {
  return <h1>Bienvenue sur React !</h1>;
};

// Retour implicite (une ligne)
const Welcome = () => <h1>Bienvenue sur React !</h1>;
```

### Utilisation des composants

```jsx
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}

// Rendu dans le DOM
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### Convention de nommage

```jsx
// ✅ BON : PascalCase pour les composants
function UserProfile() {
  return <div>Profile</div>;
}

function TodoList() {
  return <ul>...</ul>;
}

// ❌ MAUVAIS : camelCase (React ne le reconnaît pas comme composant)
function userProfile() {
  return <div>Profile</div>;
}

// ✅ BON : camelCase pour les fonctions helper
function formatDate(date) {
  return date.toLocaleDateString();
}
```

### Composants avec logique

```jsx
function Greeting() {
  // Variables locales
  const name = 'Alice';
  const time = new Date().getHours();
  
  // Logique
  let message;
  if (time < 12) {
    message = 'Bonjour';
  } else if (time < 18) {
    message = 'Bon après-midi';
  } else {
    message = 'Bonsoir';
  }

  // Retour JSX
  return (
    <div>
      <h1>{message}, {name} !</h1>
      <p>Il est {time}h</p>
    </div>
  );
}
```

### Décomposer en plusieurs composants

```jsx
// ✅ BON : Composants séparés et réutilisables
function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
    </header>
  );
}

function Logo() {
  return <h1>Mon Site</h1>;
}

function Navigation() {
  return (
    <nav>
      <a href="#home">Accueil</a>
      <a href="#about">À propos</a>
      <a href="#contact">Contact</a>
    </nav>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <h2>Contenu principal</h2>
      </main>
    </div>
  );
}
```

```jsx
// ❌ MAUVAIS : Tout dans un seul composant
function App() {
  return (
    <div>
      <header>
        <h1>Mon Site</h1>
        <nav>
          <a href="#home">Accueil</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main>
        <h2>Contenu principal</h2>
      </main>
    </div>
  );
}
```

---

## Styles dans React

### CSS Externe

```jsx
// Button.jsx
import './Button.css';

function Button() {
  return <button className="btn btn-primary">Cliquez-moi</button>;
}
```

```css
/* Button.css */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}
```

### Styles Inline

```jsx
function StyledComponent() {
  const boxStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={boxStyle}>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>
        Titre
      </h2>
      <p>Contenu</p>
    </div>
  );
}
```

### CSS Modules (recommandé)

```css
/* Card.module.css */
.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}
```

```jsx
// Card.jsx
import styles from './Card.module.css';

function Card() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Titre</h2>
      <p>Contenu</p>
    </div>
  );
}
```

### Classes conditionnelles

```jsx
function Button({ primary, large, disabled }) {
  // Méthode 1 : Template string
  const className = `btn ${primary ? 'btn-primary' : 'btn-secondary'} ${large ? 'btn-large' : ''} ${disabled ? 'btn-disabled' : ''}`;

  // Méthode 2 : Array + filter + join (plus propre)
  const classes = [
    'btn',
    primary && 'btn-primary',
    large && 'btn-large',
    disabled && 'btn-disabled'
  ].filter(Boolean).join(' ');

  return <button className={classes}>Bouton</button>;
}
```

---

## Exemple complet : Carte utilisateur

```jsx
// UserCard.jsx
import './UserCard.css';

function UserCard() {
  const user = {
    name: 'Alice Martin',
    role: 'Développeuse',
    avatar: '/alice.jpg',
    isOnline: true,
    skills: ['React', 'TypeScript', 'Node.js']
  };

  return (
    <div className="user-card">
      <div className="user-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <span className={`status ${user.isOnline ? 'online' : 'offline'}`} />
      </div>
      
      <div className="user-info">
        <h2>{user.name}</h2>
        <p className="role">{user.role}</p>
      </div>
      
      <div className="user-skills">
        {user.skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
      
      <button className="btn-primary">Voir le profil</button>
    </div>
  );
}

export default UserCard;
```

---

## Bonnes pratiques

### ✅ Un composant par fichier

```jsx
// ✅ BON : Button.jsx
function Button() {
  return <button>Cliquez</button>;
}

export default Button;

// ✅ BON : Card.jsx
function Card() {
  return <div className="card">...</div>;
}

export default Card;
```

### ✅ Nommage explicite

```jsx
// ✅ BON
function UserProfileCard() { }
function ProductList() { }
function ShoppingCartButton() { }

// ❌ MAUVAIS
function Component1() { }
function MyComponent() { }
function Thing() { }
```

### ✅ Composants petits et focalisés

```jsx
// ✅ BON : Chaque composant a une responsabilité unique
function ProductCard({ product }) {
  return (
    <div className="card">
      <ProductImage src={product.image} />
      <ProductInfo product={product} />
      <ProductActions product={product} />
    </div>
  );
}

// ❌ MAUVAIS : Trop de responsabilités
function ProductCard({ product }) {
  return (
    <div>
      {/* 200 lignes de JSX complexe */}
    </div>
  );
}
```

### ✅ Extraire la logique complexe

```jsx
// ✅ BON : Logique extraite
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function ProductCard({ product }) {
  return <p>{formatPrice(product.price)}</p>;
}
```

---

## Erreurs courantes

| Erreur | Exemple | Solution |
|--------|---------|----------|
| Retourner plusieurs éléments | `return <p>A</p><p>B</p>` | Wrapper avec `<>...</>` ou `<div>` |
| Oublier `className` | `<div class="box">` | `<div className="box">` |
| Oublier de fermer les balises | `<img src="...">` | `<img src="..." />` |
| `if` dans JSX | `{if (x) return <A/>}` | Ternaire ou `&&` |

---

## Quiz de vérification

:::quiz
Q: Quelle est la bonne syntaxe pour une classe CSS en JSX ?
- [ ] `class="container"`
- [x] `className="container"`
- [ ] `cssClass="container"`
> En JSX, on utilise `className` car `class` est un mot réservé en JavaScript.

Q: Comment afficher une variable dans JSX ?
- [ ] `${variable}`
- [x] `{variable}`
- [ ] `{{variable}}`
> Les accolades simples `{}` permettent d'insérer des expressions JavaScript dans le JSX.

Q: Que doit retourner un composant React ?
- [ ] Une chaîne
- [x] Un seul élément (ou fragment)
- [ ] Un tableau
> Un composant doit retourner un seul élément racine. Utilisez `<>...</>` (Fragment) pour grouper plusieurs éléments.

Q: Quelle commande crée un projet React avec Vite ?
- [x] `npm create vite@latest -- --template react`
- [ ] `npm install react`
- [ ] `npx react-app`
> Vite est l'outil recommandé pour créer un nouveau projet React, plus rapide que Create React App.
:::

---

## Exercice pratique

Créez un **Composant Blog** avec :
- Un composant `BlogPost` affichant titre, auteur, date et contenu
- Un composant `BlogList` affichant plusieurs articles
- Un composant `AuthorBadge` réutilisable
- Au moins 3 articles différents

<details>
<summary>Indice</summary>

```jsx
function BlogPost({ title, author, date, content }) {
  return (
    <article>
      <h2>{title}</h2>
      <AuthorBadge name={author} />
      <time>{date}</time>
      <p>{content}</p>
    </article>
  );
}
```
</details>

---

## Prochaine étape

Découvrez [Props & Composition](./props-composition.md) pour rendre vos composants dynamiques.
