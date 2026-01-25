# Pratique & Performance

Créez des applications DOM performantes avec des patterns avancés, optimisations et projets concrets pour consolider vos compétences.

---

## Optimisation des manipulations DOM

### 1. Minimiser les reflows et repaints

Le **reflow** (recalcul de layout) et le **repaint** (redessin visuel) sont coûteux.

```javascript
// ❌ Mauvais : 3 reflows
const element = document.querySelector('.box');
element.style.width = '100px';  // Reflow
element.style.height = '100px'; // Reflow
element.style.margin = '10px';  // Reflow

// ✅ Bon : 1 seul reflow
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';

// ✅ Ou avec classes CSS
element.classList.add('resized');

/* CSS */
.resized {
  width: 100px;
  height: 100px;
  margin: 10px;
}
```

### 2. Batch DOM updates

```javascript
// ❌ Mauvais : plusieurs manipulations séparées
const list = document.querySelector('ul');

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li); // 100 insertions → 100 reflows
}

// ✅ Bon : utiliser DocumentFragment
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li); // Pas de reflow
}

list.appendChild(fragment); // 1 seul reflow

// ✅ Alternative : innerHTML (si pas de XSS)
const items = Array.from({ length: 100 }, (_, i) => `<li>Item ${i}</li>`);
list.innerHTML = items.join('');
```

### 3. Lectures et écritures groupées

```javascript
// ❌ Mauvais : lecture/écriture entrelacées (force layout)
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');

box1.style.width = '100px';
const width1 = box1.offsetWidth; // Force reflow

box2.style.width = '200px';
const width2 = box2.offsetWidth; // Force reflow

// ✅ Bon : grouper lectures puis écritures
// Lectures
const width1 = box1.offsetWidth;
const width2 = box2.offsetWidth;

// Écritures
box1.style.width = '100px';
box2.style.width = '200px';
```

### 4. Cacher pendant les modifications

```javascript
// Pour modifications massives
const list = document.querySelector('ul');

// Cacher (pas de reflow pendant les modifications)
list.style.display = 'none';

// Modifications...
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li);
}

// Réafficher
list.style.display = '';

// Alternative : cloner, modifier, remplacer
const clone = list.cloneNode(false);
// ... modifications sur clone ...
list.parentNode.replaceChild(clone, list);
```

---

## Debounce et Throttle pour événements

### Debounce (recherche, resize)

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Recherche optimisée
const searchInput = document.querySelector('#search');

const performSearch = (query) => {
  console.log('Searching for:', query);
  // Appel API...
};

const debouncedSearch = debounce(performSearch, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Resize optimisé
const handleResize = () => {
  console.log('Resized:', window.innerWidth);
};

window.addEventListener('resize', debounce(handleResize, 250));
```

### Throttle (scroll, mousemove)

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Scroll optimisé
const handleScroll = () => {
  const scrollY = window.scrollY;
  console.log('Scroll position:', scrollY);
  
  // Afficher/cacher navbar
  const navbar = document.querySelector('.navbar');
  if (scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', throttle(handleScroll, 100));

// Mousemove optimisé (parallax, curseur)
document.addEventListener('mousemove', throttle((e) => {
  const x = e.clientX;
  const y = e.clientY;
  console.log(`Position: ${x}, ${y}`);
}, 50));
```

---

## IntersectionObserver (lazy loading, animations)

Observer quand un élément entre/sort du viewport (performant).

### Lazy loading d'images

```javascript
// HTML: <img data-src="image.jpg" class="lazy" alt="...">

const lazyImages = document.querySelectorAll('img.lazy');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img); // Arrêter d'observer
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

### Animations au scroll

```javascript
// HTML: <div class="fade-in">Contenu</div>

const elements = document.querySelectorAll('.fade-in');

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1 // 10% visible
});

elements.forEach(el => animationObserver.observe(el));

/* CSS */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Infinite scroll

```javascript
const container = document.querySelector('#posts');
const sentinel = document.querySelector('#sentinel'); // Élément à la fin

let page = 1;
let loading = false;

const loadMorePosts = async () => {
  if (loading) return;
  loading = true;
  
  console.log('Loading page', page);
  
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const posts = Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i,
    title: `Post ${page * 10 + i}`
  }));
  
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.textContent = post.title;
    container.insertBefore(div, sentinel);
  });
  
  page++;
  loading = false;
};

const scrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMorePosts();
  }
});

scrollObserver.observe(sentinel);
```

---

## Patterns avancés

### 1. Virtual Scrolling

Afficher seulement les éléments visibles (pour grandes listes).

```javascript
class VirtualScroller {
  constructor(container, items, itemHeight, renderItem) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 1;
    this.startIndex = 0;
    
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';
    this.container.style.height = `${container.clientHeight}px`;
    
    this.contentHeight = items.length * itemHeight;
    
    this.render();
    this.container.addEventListener('scroll', () => this.onScroll());
  }
  
  onScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight);
    
    if (newStartIndex !== this.startIndex) {
      this.startIndex = newStartIndex;
      this.render();
    }
  }
  
  render() {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );
    
    const visibleItems = this.items.slice(this.startIndex, endIndex);
    
    const html = `
      <div style="height: ${this.startIndex * this.itemHeight}px;"></div>
      ${visibleItems.map((item, i) => this.renderItem(item, this.startIndex + i)).join('')}
      <div style="height: ${(this.items.length - endIndex) * this.itemHeight}px;"></div>
    `;
    
    this.container.innerHTML = html;
  }
}

// Utilisation
const container = document.querySelector('#list');
const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

new VirtualScroller(container, items, 50, (item) => {
  return `<div class="item" style="height: 50px;">${item.name}</div>`;
});
```

### 2. Component Pattern

```javascript
class Component {
  constructor(container) {
    this.container = container;
    this.state = {};
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  
  render() {
    throw new Error('render() must be implemented');
  }
}

class Counter extends Component {
  constructor(container) {
    super(container);
    this.state = { count: 0 };
    this.render();
  }
  
  increment() {
    this.setState({ count: this.state.count + 1 });
  }
  
  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
  
  render() {
    this.container.innerHTML = `
      <div class="counter">
        <button id="dec">-</button>
        <span>${this.state.count}</span>
        <button id="inc">+</button>
      </div>
    `;
    
    this.container.querySelector('#inc').addEventListener('click', () => this.increment());
    this.container.querySelector('#dec').addEventListener('click', () => this.decrement());
  }
}

// Utilisation
const counter = new Counter(document.querySelector('#app'));
```

### 3. Template System

```javascript
class TemplateEngine {
  constructor(template) {
    this.template = template;
  }
  
  render(data) {
    return this.template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || '';
    });
  }
}

// Utilisation
const userTemplate = new TemplateEngine(`
  <div class="user-card">
    <h3>{{name}}</h3>
    <p>Email: {{email}}</p>
    <p>Role: {{role}}</p>
  </div>
`);

const user = {
  name: 'Alice',
  email: 'alice@example.com',
  role: 'Admin'
};

document.querySelector('#app').innerHTML = userTemplate.render(user);
```

---

## Projet complet : Todo App avancée

### HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    input[type="text"] {
      flex: 1;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }
    
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
    }
    
    .btn-primary {
      background: #4CAF50;
      color: white;
    }
    
    .btn-primary:hover {
      background: #45a049;
    }
    
    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .filter-btn {
      flex: 1;
      padding: 8px;
      background: #f0f0f0;
      border: 1px solid #ddd;
    }
    
    .filter-btn.active {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }
    
    .todo-list {
      list-style: none;
    }
    
    .todo-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 5px;
      margin-bottom: 10px;
      transition: all 0.3s;
    }
    
    .todo-item:hover {
      background: #f0f0f0;
    }
    
    .todo-item.completed {
      opacity: 0.6;
    }
    
    .todo-item.completed .todo-text {
      text-decoration: line-through;
    }
    
    .todo-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    
    .todo-text {
      flex: 1;
      font-size: 16px;
    }
    
    .todo-date {
      font-size: 12px;
      color: #999;
    }
    
    .btn-delete {
      padding: 8px 16px;
      background: #f44336;
      color: white;
    }
    
    .btn-delete:hover {
      background: #da190b;
    }
    
    .stats {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Todo App</h1>
    
    <div class="input-group">
      <input type="text" id="todoInput" placeholder="Ajouter une tâche...">
      <button class="btn-primary" id="addBtn">Ajouter</button>
    </div>
    
    <div class="filters">
      <button class="filter-btn active" data-filter="all">Toutes</button>
      <button class="filter-btn" data-filter="active">Actives</button>
      <button class="filter-btn" data-filter="completed">Complétées</button>
    </div>
    
    <ul id="todoList" class="todo-list"></ul>
    
    <div class="stats">
      <div class="stat-item">
        <div class="stat-number" id="totalCount">0</div>
        <div>Total</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="activeCount">0</div>
        <div>Actives</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="completedCount">0</div>
        <div>Complétées</div>
      </div>
    </div>
  </div>
  
  <script src="todo-app.js"></script>
</body>
</html>
```

### JavaScript

```javascript
class TodoApp {
  constructor() {
    this.todos = this.loadFromStorage();
    this.filter = 'all';
    
    this.todoInput = document.querySelector('#todoInput');
    this.addBtn = document.querySelector('#addBtn');
    this.todoList = document.querySelector('#todoList');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    
    this.init();
  }
  
  init() {
    // Event listeners
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });
    
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filter = e.target.dataset.filter;
        this.updateFilterButtons();
        this.render();
      });
    });
    
    // Délégation d'événements
    this.todoList.addEventListener('click', (e) => {
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;
      
      const id = parseInt(todoItem.dataset.id);
      
      if (e.target.classList.contains('todo-checkbox')) {
        this.toggleTodo(id);
      } else if (e.target.classList.contains('btn-delete')) {
        this.deleteTodo(id);
      }
    });
    
    this.render();
  }
  
  addTodo() {
    const text = this.todoInput.value.trim();
    
    if (!text) {
      alert('Veuillez entrer une tâche');
      return;
    }
    
    const todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.todos.push(todo);
    this.todoInput.value = '';
    this.saveToStorage();
    this.render();
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToStorage();
      this.render();
    }
  }
  
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
  }
  
  getFilteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }
  
  render() {
    const filteredTodos = this.getFilteredTodos();
    
    // Utiliser DocumentFragment pour performance
    const fragment = document.createDocumentFragment();
    
    filteredTodos.forEach(todo => {
      const li = this.createTodoElement(todo);
      fragment.appendChild(li);
    });
    
    this.todoList.innerHTML = '';
    this.todoList.appendChild(fragment);
    
    this.updateStats();
  }
  
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    const date = new Date(todo.createdAt).toLocaleDateString('fr-FR');
    
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text">${this.escapeHtml(todo.text)}</span>
      <span class="todo-date">${date}</span>
      <button class="btn-delete">Supprimer</button>
    `;
    
    return li;
  }
  
  updateFilterButtons() {
    this.filterBtns.forEach(btn => {
      if (btn.dataset.filter === this.filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  updateStats() {
    const total = this.todos.length;
    const active = this.todos.filter(t => !t.completed).length;
    const completed = this.todos.filter(t => t.completed).length;
    
    document.querySelector('#totalCount').textContent = total;
    document.querySelector('#activeCount').textContent = active;
    document.querySelector('#completedCount').textContent = completed;
  }
  
  saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  
  loadFromStorage() {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialisation
new TodoApp();
```

---

## Bonnes pratiques de performance

### ✅ À faire

```javascript
// 1. Utiliser DocumentFragment
const fragment = document.createDocumentFragment();
items.forEach(item => fragment.appendChild(createItem(item)));
container.appendChild(fragment);

// 2. Délégation d'événements
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) { }
});

// 3. Debounce/Throttle
window.addEventListener('scroll', throttle(handler, 100));

// 4. IntersectionObserver pour lazy loading
const observer = new IntersectionObserver(callback);
observer.observe(element);

// 5. Classes CSS plutôt que styles inline
element.classList.add('active');
```

### ❌ À éviter

```javascript
// 1. innerHTML dans boucles
for (let i = 0; i < 100; i++) {
  container.innerHTML += `<div>${i}</div>`; // ❌ Lent
}

// 2. Lectures/écritures entrelacées
element.style.width = '100px';
const width = element.offsetWidth; // Force reflow

// 3. Trop d'écouteurs
items.forEach(item => {
  item.addEventListener('click', handler); // ❌ Utiliser délégation
});
```

---

## Exercice final : Dashboard interactif

Créez un dashboard avec :
1. **Graphiques animés** (barres de progression)
2. **Filtres en temps réel** (recherche, catégories)
3. **Tri des données** (par nom, date, prix)
4. **Pagination** (10 éléments par page)
5. **Lazy loading** d'images
6. **Statistiques dynamiques**

**Critères :**
- Utiliser les patterns de performance
- Délégation d'événements
- Debounce pour la recherche
- localStorage pour persistance

---

**Prochaine sous-section** : Programmation Asynchrone ! 🚀
