# Projet - Blog Personnel avec React

## Objectif

Créer une application de blog personnel complète en utilisant **React**. Ce projet intermédiaire vous permettra d'approfondir vos compétences React : routing, formulaires complexes, gestion d'état avancée, et communication avec une API backend (ou mock).

## Description du Projet

Une application de blog où les utilisateurs peuvent lire des articles, et l'administrateur peut créer, modifier et supprimer des articles. Le projet couvre le cycle CRUD complet (Create, Read, Update, Delete) et introduit des concepts plus avancés comme le routing et la gestion de formulaires complexes.

## Contraintes Techniques

### Obligatoire
- **React 18+** : Composants fonctionnels et hooks
- **React Router** : Navigation multi-pages (SPA)
- **Hooks avancés** : `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate`
- **Formulaires contrôlés** : Gestion complète des inputs
- **CSS** : Stylisation au choix (CSS Modules, Styled Components, Sass...)

### Technologies Autorisées
- React + React Router DOM
- CSS / Sass / Styled Components / Tailwind CSS
- Axios ou Fetch pour les appels API
- React Markdown pour le rendu Markdown (optionnel)
- localStorage ou JSONPlaceholder pour simuler le backend

### Pas de State Management Global (pour ce projet)
- Pas de Redux, MobX, Zustand : utilisez Context API si nécessaire

## Fonctionnalités Minimum Attendues

### Fonctionnalités de Base (Obligatoires)

#### Pages Publiques
1. **Page d'accueil (Home)**
   - Liste de tous les articles (titre, extrait, date, auteur)
   - Pagination ou scroll infini (optionnel)
   - Bouton "Lire la suite" vers l'article complet

2. **Page Article (Post Detail)**
   - Affichage complet d'un article
   - Titre, contenu, date de publication, auteur
   - Image de couverture (optionnel)
   - Bouton retour vers la liste

3. **Page À Propos (About)**
   - Informations sur le blog et l'auteur

#### Zone Administrateur
4. **Page de liste Admin**
   - Tableau de tous les articles avec boutons Modifier/Supprimer
   - Bouton "Créer un nouvel article"

5. **Page Créer un Article**
   - Formulaire avec titre, contenu, image (URL), catégorie
   - Validation des champs
   - Soumission et redirection

6. **Page Modifier un Article**
   - Formulaire pré-rempli avec les données existantes
   - Possibilité de modifier et sauvegarder
   - Bouton annuler

7. **Suppression d'Article**
   - Confirmation avant suppression
   - Mise à jour de la liste après suppression

### Fonctionnalités Bonus (Optionnelles)
- **Authentification** : Login/Logout pour accéder à la zone admin
- **Système de commentaires** : Ajouter des commentaires aux articles
- **Catégories** : Filtrer les articles par catégorie
- **Recherche** : Barre de recherche pour trouver des articles
- **Tags** : Système de tags pour les articles
- **Vues** : Compteur de vues par article
- **Likes/Favoris** : Système de likes
- **Markdown** : Écrire et afficher en Markdown
- **Mode brouillon** : Sauvegarder sans publier
- **Images upload** : Upload d'images (avec backend ou Cloudinary)
- **Partage social** : Boutons de partage Twitter, Facebook, LinkedIn
- **Dark mode** : Toggle thème clair/sombre
- **SEO** : Meta tags dynamiques (react-helmet)

## Suggestions et Pistes

### Structure de Routes

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import AdminDashboard from './pages/admin/Dashboard';
import CreatePost from './pages/admin/CreatePost';
import EditPost from './pages/admin/EditPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="about" element={<About />} />
          
          {/* Admin routes */}
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="edit/:id" element={<EditPost />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Structure de Données

**Article (Post) :**
```javascript
const post = {
  id: 1,
  title: "Introduction à React",
  slug: "introduction-a-react",
  content: "Contenu complet de l'article...",
  excerpt: "React est une bibliothèque JavaScript...",
  coverImage: "https://example.com/image.jpg",
  author: {
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg"
  },
  category: "JavaScript",
  tags: ["React", "Frontend", "JavaScript"],
  createdAt: "2026-01-20T10:00:00Z",
  updatedAt: "2026-01-25T15:30:00Z",
  views: 125,
  likes: 15
};
```

### Composants Suggérés

```
src/
├── components/
│   ├── Layout.jsx           # Layout principal avec Navbar, Footer
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PostCard.jsx         # Carte article pour la liste
│   ├── PostForm.jsx         # Formulaire Create/Edit réutilisable
│   └── ConfirmModal.jsx     # Modale de confirmation
├── pages/
│   ├── Home.jsx
│   ├── PostDetail.jsx
│   ├── About.jsx
│   ├── NotFound.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── CreatePost.jsx
│       └── EditPost.jsx
├── context/
│   └── PostContext.jsx      # Context API pour les posts (optionnel)
├── services/
│   └── api.js               # Fonctions d'appel API
├── utils/
│   └── formatDate.js        # Fonctions utilitaires
└── App.jsx
```

### Exemple de Code

**Home.jsx - Liste des Articles :**
```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="home">
      <h1>Articles Récents</h1>
      <div className="posts-grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
```

**PostDetail.jsx - Affichage d'un Article :**
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost } from '../services/api';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        console.error('Error:', error);
        // Rediriger vers 404 si article non trouvé
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (!post) return null;

  return (
    <article className="post-detail">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} />
      )}
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>Par {post.author.name}</span>
      </div>
      <div className="post-content">
        {post.content}
      </div>
      <button onClick={() => navigate(-1)}>← Retour</button>
    </article>
  );
}

export default PostDetail;
```

**CreatePost.jsx - Création d'Article :**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    category: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newPost = await createPost(formData);
      // Rediriger vers l'article créé
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erreur lors de la création de l\'article');
    }
  };

  return (
    <div className="create-post">
      <h1>Créer un Article</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Extrait</label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenu *</label>
          <textarea
            id="content"
            name="content"
            rows="15"
            value={formData.content}
            onChange={handleChange}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-msg">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">Image de couverture (URL)</label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Sélectionner...</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="CSS">CSS</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">Publier</button>
          <button type="button" onClick={() => navigate('/admin')}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
```

**services/api.js - Fonctions API :**
```javascript
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
// Ou votre propre backend

export const getPosts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const getPost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch post');
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};

export const updatePost = async (id, postData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
};
```

### Mock Backend (Alternative)

Si vous ne voulez pas créer de backend, utilisez **localStorage** :

```javascript
// services/localApi.js
const STORAGE_KEY = 'blog_posts';

export const getPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
};

export const getPost = (id) => {
  const posts = getPosts();
  return posts.find(p => p.id === parseInt(id));
};

export const createPost = (postData) => {
  const posts = getPosts();
  const newPost = {
    ...postData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.push(newPost);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
};

export const updatePost = (id, postData) => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts[index];
  }
  return null;
};

export const deletePost = (id) => {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== parseInt(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
```

## Étapes Suggérées

1. **Setup**
   - Créer le projet React avec Vite
   - Installer React Router : `npm install react-router-dom`
   - Structure de dossiers

2. **Routing**
   - Configurer les routes
   - Créer le Layout avec Navbar
   - Tester la navigation

3. **Pages publiques**
   - Page Home avec liste d'articles
   - Page PostDetail
   - Page About

4. **Backend Mock**
   - Créer des données de test
   - Implémenter les fonctions API (fetch ou localStorage)

5. **Zone Admin**
   - Dashboard avec liste CRUD
   - Page CreatePost avec formulaire
   - Page EditPost avec formulaire pré-rempli
   - Suppression avec confirmation

6. **Validation et UX**
   - Validation de formulaires
   - Messages d'erreur
   - Loaders et états de chargement

7. **Stylisation**
   - Design moderne et responsive
   - Animations et transitions

8. **Bonus**
   - Authentification
   - Commentaires
   - Filtres et recherche

## Critères d'Évaluation

- **Routing** : React Router bien configuré
- **CRUD complet** : Create, Read, Update, Delete fonctionnels
- **Formulaires** : Validation, gestion d'erreurs
- **Code React** : Composants modulaires, hooks bien utilisés
- **UX/UI** : Interface intuitive et esthétique
- **Gestion d'état** : Mise à jour correcte des listes après CRUD
- **Responsive** : Mobile-friendly

## Compétences Travaillées

- **React Router** : Navigation, params, navigation programmatique
- **Hooks avancés** : useParams, useNavigate, useLocation
- **Formulaires complexes** : Validation, état, soumission
- **CRUD** : Opérations complètes
- **Appels API** : Fetch, async/await, gestion d'erreurs
- **Composition de composants** : Réutilisation, props drilling
- **localStorage** : Alternative au backend

## Ressources Utiles

- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/) (optionnel)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) (fake API)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

**Bon développement !**
