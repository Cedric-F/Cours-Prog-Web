# Événements & Rendu

Rendez vos composants interactifs avec les **événements** et contrôlez l'affichage avec le **rendu conditionnel** et les **listes**.

---

## Gérer les événements

Les événements React utilisent une syntaxe **camelCase** et passent des objets **SyntheticEvent**.

### Événements de base

```jsx
function EventsDemo() {
  const handleClick = () => {
    alert('Bouton cliqué !');
  };

  const handleDoubleClick = () => {
    console.log('Double-clic');
  };

  const handleMouseEnter = () => {
    console.log('Souris entrée');
  };

  return (
    <div>
      <button onClick={handleClick}>Cliquez-moi</button>
      <button onDoubleClick={handleDoubleClick}>Double-clic</button>
      <div onMouseEnter={handleMouseEnter}>Survolez-moi</div>
    </div>
  );
}

// Inline (pour logique simple)
function InlineEvents() {
  return (
    <button onClick={() => console.log('Cliqué')}>
      Cliquez
    </button>
  );
}
```

### Événement object (SyntheticEvent)

```jsx
function EventObject() {
  const handleClick = (e) => {
    console.log('Type:', e.type);           // "click"
    console.log('Target:', e.target);       // L'élément cliqué
    console.log('CurrentTarget:', e.currentTarget);
    console.log('ClientX:', e.clientX);     // Position X de la souris
    console.log('ClientY:', e.clientY);     // Position Y
  };

  const handleKeyDown = (e) => {
    console.log('Key:', e.key);             // Touche pressée
    console.log('Code:', e.code);           // Code de la touche
    console.log('Shift:', e.shiftKey);      // Shift pressé ?
    console.log('Ctrl:', e.ctrlKey);        // Ctrl pressé ?
  };

  return (
    <div>
      <button onClick={handleClick}>Cliquez</button>
      <input type="text" onKeyDown={handleKeyDown} placeholder="Tapez..." />
    </div>
  );
}
```

### Événements de formulaire

```jsx
function FormEvents() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log('Formulaire soumis');
  };

  const handleChange = (e) => {
    console.log('Valeur:', e.target.value);
  };

  const handleFocus = () => {
    console.log('Input focusé');
  };

  const handleBlur = () => {
    console.log('Input perdu le focus');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Nom..."
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Passer des arguments

```jsx
function ArgumentsExample() {
  const handleDelete = (id, name) => {
    console.log(`Supprimer ${name} (${id})`);
  };

  const items = [
    { id: 1, name: 'Pomme' },
    { id: 2, name: 'Banane' },
    { id: 3, name: 'Orange' }
  ];

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          {/* Arrow function pour passer des arguments */}
          <button onClick={() => handleDelete(item.id, item.name)}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Événements avec event ET arguments

```jsx
function EventAndArgs() {
  const handleClick = (id, e) => {
    console.log('ID:', id);
    console.log('Event:', e.target);
  };

  return (
    <button onClick={(e) => handleClick(123, e)}>
      Cliquez
    </button>
  );
}
```

---

## Événements courants

### Souris

```jsx
function MouseEvents() {
  return (
    <div>
      <button onClick={() => console.log('Click')}>Click</button>
      <button onDoubleClick={() => console.log('Double')}>Double</button>
      <div onMouseEnter={() => console.log('Enter')}>Mouse Enter</div>
      <div onMouseLeave={() => console.log('Leave')}>Mouse Leave</div>
      <div onMouseMove={(e) => console.log(e.clientX, e.clientY)}>
        Mouse Move
      </div>
      <div onContextMenu={(e) => {
        e.preventDefault();
        console.log('Right click');
      }}>
        Right Click
      </div>
    </div>
  );
}
```

### Clavier

```jsx
import { useState } from 'react';

function KeyboardEvents() {
  const [keys, setKeys] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressé');
    }
    
    if (e.key === 'Escape') {
      console.log('Escape pressé');
    }

    // Navigation avec flèches
    if (e.key === 'ArrowUp') {
      console.log('Haut');
    }
    
    // Combinaisons
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault(); // Empêche Ctrl+S natif
      console.log('Sauvegarde');
    }

    setKeys([...keys, e.key]);
  };

  return (
    <input
      type="text"
      onKeyDown={handleKeyDown}
      placeholder="Tapez quelque chose..."
    />
  );
}
```

### Formulaires

```jsx
import { useState } from 'react';

function FormExample() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Nom d'utilisateur"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

## Rendu conditionnel

Contrôlez ce qui s'affiche avec des conditions.

### If/Else classique

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Bienvenue !</h1>;
  }
  return <h1>Veuillez vous connecter</h1>;
}
```

### Ternaire (dans JSX)

```jsx
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Bienvenue !</h1>
      ) : (
        <h1>Veuillez vous connecter</h1>
      )}
    </div>
  );
}
```

### Opérateur && (affichage conditionnel)

```jsx
function Notifications({ count }) {
  return (
    <div>
      <h1>Messages</h1>
      {count > 0 && (
        <p>Vous avez {count} nouveaux messages</p>
      )}
    </div>
  );
}
```

### Variables conditionnelles

```jsx
function UserDashboard({ user }) {
  let content;
  
  if (!user) {
    content = <p>Chargement...</p>;
  } else if (user.role === 'admin') {
    content = <AdminPanel user={user} />;
  } else {
    content = <UserPanel user={user} />;
  }

  return <div>{content}</div>;
}
```

### Switch case pattern

```jsx
function StatusBadge({ status }) {
  const getContent = () => {
    switch (status) {
      case 'pending':
        return <span className="badge yellow">En attente</span>;
      case 'approved':
        return <span className="badge green">Approuvé</span>;
      case 'rejected':
        return <span className="badge red">Rejeté</span>;
      default:
        return <span className="badge gray">Inconnu</span>;
    }
  };

  return <div>{getContent()}</div>;
}
```

### Rendu de null

```jsx
function ConditionalComponent({ show }) {
  if (!show) {
    return null; // Ne rien afficher
  }

  return <div>Contenu visible</div>;
}
```

---

## Listes et Keys

Affichez des listes d'éléments avec `.map()`.

### Liste simple

```jsx
function TodoList() {
  const todos = ['Apprendre React', 'Créer une app', 'Déployer'];

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
```

### Liste avec objets

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 32 },
    { id: 3, name: 'Charlie', age: 25 }
  ];

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.age} ans
        </li>
      ))}
    </ul>
  );
}
```

### Keys : importance

```jsx
// ❌ MAUVAIS : Index comme key (si liste mutable)
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}

// ✅ BON : ID unique comme key
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}

// ⚠️ Acceptable : Index comme key (si liste statique)
{['React', 'Vue', 'Angular'].map((item, i) => (
  <li key={i}>{item}</li>
))}
```

**Pourquoi les keys ?** React utilise les keys pour identifier les éléments modifiés, ajoutés ou supprimés. Sans keys appropriées, les performances sont dégradées et des bugs peuvent apparaître.

### Composants dans des listes

```jsx
function TodoItem({ todo, onDelete }) {
  return (
    <li>
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Supprimer</button>
    </li>
  );
}

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Apprendre React' },
    { id: 2, text: 'Créer une app' }
  ]);

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### Filtres et tri

```jsx
import { useState } from 'react';

function ProductList() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    { id: 1, name: 'Laptop', price: 1000, category: 'tech' },
    { id: 2, name: 'Phone', price: 500, category: 'tech' },
    { id: 3, name: 'Shirt', price: 30, category: 'clothing' },
    { id: 4, name: 'Book', price: 15, category: 'books' }
  ];

  // Filtrer
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  // Trier
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.price - b.price;
  });

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tous</option>
        <option value="tech">Tech</option>
        <option value="clothing">Vêtements</option>
        <option value="books">Livres</option>
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Nom</option>
        <option value="price">Prix</option>
      </select>

      <ul>
        {sorted.map(product => (
          <li key={product.id}>
            {product.name} - {product.price}€
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Exemple complet : Liste de tâches interactive

```jsx
import { useState } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Apprendre React', done: false },
    { id: 2, text: 'Créer une app', done: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      done: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length
  };

  return (
    <div className="todo-app">
      <h1>📋 Ma Todo List</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nouvelle tâche..."
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Toutes ({stats.total})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Actives ({stats.active})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Complétées ({stats.completed})
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty">Aucune tâche</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoApp;
```

---

## Bonnes pratiques

### ✅ Handlers nommés

```jsx
// ✅ BON : Handler nommé et explicite
function Button() {
  const handleClick = () => {
    console.log('Cliqué');
  };
  
  return <button onClick={handleClick}>Cliquez</button>;
}

// ❌ MAUVAIS : Inline complexe
function Button() {
  return (
    <button onClick={() => {
      // 20 lignes de logique...
    }}>
      Cliquez
    </button>
  );
}
```

### ✅ Keys uniques et stables

```jsx
// ✅ BON : ID de la base de données
{users.map(user => <li key={user.id}>{user.name}</li>)}

// ⚠️ Acceptable : Index si liste statique
{['A', 'B', 'C'].map((item, i) => <li key={i}>{item}</li>)}

// ❌ MAUVAIS : Valeurs aléatoires
{items.map(item => <li key={Math.random()}>{item}</li>)}
```

### ✅ Conditions simples et lisibles

```jsx
// ✅ BON : Ternaire simple
{isLoggedIn ? <Dashboard /> : <Login />}

// ✅ BON : && pour affichage conditionnel
{error && <ErrorMessage error={error} />}

// ❌ MAUVAIS : Ternaires imbriqués
{isLoggedIn ? (isAdmin ? <AdminPanel /> : <UserPanel />) : <Login />}

// ✅ BON : Variable ou fonction
function Panel({ user }) {
  const getPanelComponent = () => {
    if (!user) return <Login />;
    if (user.isAdmin) return <AdminPanel />;
    return <UserPanel />;
  };

  return getPanelComponent();
}
```

---

## Exercice pratique

Créez une **App de Gestion de Produits** avec :
- Liste de produits affichée dynamiquement
- Ajout de produits via formulaire
- Suppression de produits
- Filtres par catégorie
- Tri par nom ou prix
- Recherche par nom
- Affichage conditionnel (vide, chargement, erreur)
- Statistiques (total, moyenne des prix)

**Bonus** : Ajoutez la modification inline et la sauvegarde en localStorage !

---

**Chapitre suivant** : [Hooks de Base](../hooks/hooks-base.md) pour gérer l'état ! 🪝
