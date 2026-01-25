# Projet - Todo App avec React

## Objectif

Créer une application de gestion de tâches (Todo List) en utilisant **React**. Ce projet vous permettra de maîtriser les concepts fondamentaux de React : composants, props, state, hooks, et gestion d'événements.

## Description du Projet

Une Todo App est une application classique permettant de créer, afficher, modifier et supprimer des tâches. C'est le projet parfait pour apprendre React car il couvre la plupart des concepts de base tout en restant simple à comprendre.

## Contraintes Techniques

### Obligatoire
- **React 18+** : Utilisation de composants fonctionnels
- **Hooks** : `useState`, `useEffect` au minimum
- **Props** : Communication entre composants
- **Pas de librairie de state management** : Gérez l'état avec les hooks React natifs
- **CSS** : Stylisation au choix (CSS modules, styled-components, ou CSS classique)

### Technologies Autorisées
- React (Create React App ou Vite)
- CSS / CSS Modules / Styled Components / Sass
- localStorage pour la persistance (recommandé)

### Technologies Interdites pour ce Projet
- Redux, MobX, Zustand (trop avancé pour ce projet)
- Librairies de composants (Material-UI, Ant Design) : créez vos propres composants

## Fonctionnalités Minimum Attendues

### Fonctionnalités de Base (Obligatoires)
1. **Ajouter une tâche**
   - Input pour saisir le titre de la tâche
   - Bouton ou touche "Entrée" pour ajouter
   - Validation : ne pas accepter les tâches vides

2. **Afficher la liste des tâches**
   - Chaque tâche affiche son titre
   - Affichage d'un message si aucune tâche

3. **Marquer une tâche comme complétée**
   - Checkbox pour basculer l'état (complétée/non complétée)
   - Style différent pour les tâches complétées (texte barré, couleur grisée)

4. **Supprimer une tâche**
   - Bouton de suppression sur chaque tâche
   - Suppression immédiate (ou avec confirmation optionnelle)

5. **Compteur de tâches**
   - Affichage du nombre total de tâches
   - Affichage du nombre de tâches restantes (non complétées)

### Fonctionnalités Bonus (Optionnelles)
- **Persistance** : Sauvegarde dans localStorage (recommandé)
- **Édition de tâche** : Double-clic pour modifier le titre
- **Filtres** : Afficher toutes / actives / complétées
- **Supprimer toutes les tâches complétées** : Bouton "Clear completed"
- **Priorités** : Haute, moyenne, basse (avec couleurs)
- **Date d'échéance** : Ajouter une date limite
- **Catégories/Tags** : Organiser par catégories
- **Recherche** : Filtrer les tâches par mot-clé
- **Drag & Drop** : Réorganiser les tâches par glisser-déposer
- **Mode sombre/clair** : Toggle pour changer le thème
- **Animations** : Transitions lors de l'ajout/suppression

## Suggestions et Pistes

### Structure de Composants

Décomposez votre application en composants réutilisables :

```
App
├── Header
├── TodoForm (input + bouton)
├── TodoList
│   └── TodoItem (répété pour chaque tâche)
│       ├── Checkbox
│       ├── Title
│       └── DeleteButton
└── Footer
    ├── TodoCounter
    └── FilterButtons (optionnel)
```

### Structure de Données

**État de la Todo :**
```javascript
const todo = {
  id: 1,
  title: "Apprendre React",
  completed: false,
  createdAt: "2026-01-25T10:30:00Z"
  // Bonus: priority, dueDate, category...
};
```

**État global de l'application :**
```javascript
const [todos, setTodos] = useState([]);
```

### Exemple de Code (Pistes)

**App.jsx :**
```javascript
import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);

  // Charger depuis localStorage au montage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title) => {
    // À implémenter : créer une nouvelle todo
  };

  const toggleTodo = (id) => {
    // À implémenter : basculer completed
  };

  const deleteTodo = (id) => {
    // À implémenter : supprimer la todo
  };

  return (
    <div className="app">
      <h1>Ma Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

export default App;
```

### Gestion de l'État

**Ajouter une todo :**
```javascript
const addTodo = (title) => {
  const newTodo = {
    id: Date.now(), // ou crypto.randomUUID()
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  setTodos([...todos, newTodo]);
  // ou setTodos(prevTodos => [...prevTodos, newTodo]);
};
```

**Basculer une todo :**
```javascript
const toggleTodo = (id) => {
  setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
};
```

**Supprimer une todo :**
```javascript
const deleteTodo = (id) => {
  setTodos(todos.filter(todo => todo.id !== id));
};
```

### Stylisation (Exemple CSS)

```css
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.todo-item:hover {
  background-color: #f5f5f5;
}

.todo-item button {
  margin-left: auto;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.2rem;
}
```

## Étapes Suggérées

1. **Setup du projet**
   - Créer un projet React avec Vite : `npm create vite@latest my-todo-app -- --template react`
   - Ou Create React App : `npx create-react-app my-todo-app`
   - Installer les dépendances et lancer le dev server

2. **Composants de base**
   - Créer la structure de dossiers (`components/`)
   - Créer les composants : App, TodoForm, TodoList, TodoItem
   - Afficher du contenu statique pour tester

3. **État et logique**
   - Ajouter `useState` pour gérer le tableau de todos
   - Implémenter `addTodo`
   - Implémenter `toggleTodo`
   - Implémenter `deleteTodo`

4. **Communication entre composants**
   - Passer les props du parent aux enfants
   - Passer les fonctions de callback pour remonter les événements
   - Tester chaque fonctionnalité

5. **Persistance (localStorage)**
   - Utiliser `useEffect` pour charger au montage
   - Utiliser `useEffect` pour sauvegarder à chaque modification

6. **Stylisation**
   - Créer un design propre et moderne
   - Ajouter des transitions et animations CSS
   - Rendre responsive (mobile-friendly)

7. **Fonctionnalités bonus**
   - Ajouter les filtres (All / Active / Completed)
   - Ajouter l'édition de tâches
   - Ajouter un thème sombre
   - etc.

## Critères d'Évaluation

- **Fonctionnalités** : Toutes les fonctions de base fonctionnent
- **Composants** : Bonne décomposition, réutilisabilité
- **Props & State** : Utilisation correcte, flux de données unidirectionnel
- **Hooks** : `useState` et `useEffect` bien utilisés
- **Code React** : Propre, idiomatique, commenté si nécessaire
- **UX/UI** : Interface intuitive et esthétique
- **Responsive** : Fonctionne sur mobile et desktop
- **Persistance** : Les données survivent au rechargement

## Compétences Travaillées

- **Composants React** : Création et composition
- **Props** : Passage de données parent → enfant
- **State** : Gestion de l'état local avec `useState`
- **Hooks** : `useState`, `useEffect`
- **Événements** : `onClick`, `onChange`, `onSubmit`
- **Listes et clés** : Rendu de listes avec `map()` et `key`
- **Formulaires contrôlés** : Gestion d'inputs
- **localStorage** : Persistance des données
- **CSS en React** : Stylisation de composants
- **Immuabilité** : Mise à jour d'état sans mutation

## Ressources Utiles

- [React Documentation Officielle](https://react.dev/)
- [React Hooks - useState](https://react.dev/reference/react/useState)
- [React Hooks - useEffect](https://react.dev/reference/react/useEffect)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Lists and Keys](https://react.dev/learn/rendering-lists)
- [MDN - localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)

## Conseils

- **Commencez simple** : Implémentez d'abord les fonctions de base, ajoutez les bonus après
- **Pensez composants** : Décomposez en petits composants réutilisables
- **Testez fréquemment** : Vérifiez chaque fonctionnalité au fur et à mesure
- **Console.log est votre ami** : Débuggez en affichant vos states
- **React DevTools** : Installez l'extension pour inspecter vos composants
- **Pas de mutation** : Toujours créer de nouveaux tableaux/objets lors de la mise à jour du state

---
