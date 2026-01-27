# Error Boundaries en React

En React, une erreur dans un composant peut faire planter toute l'application. Les Error Boundaries permettent de capturer ces erreurs et d'afficher une UI de repli.

## Le problème

```jsx
function UserProfile({ userId }) {
  const user = users.find(u => u.id === userId);
  // Si user est undefined → crash de toute l'app
  return <h1>{user.name}</h1>;
}

// TypeError: Cannot read property 'name' of undefined
// → Écran blanc pour l'utilisateur 😱
```

---

## Qu'est-ce qu'un Error Boundary ?

Un composant React spécial qui :
1. Capture les erreurs dans ses enfants
2. Affiche une UI de repli
3. Permet de logger l'erreur

```jsx
// Les Error Boundaries doivent être des Class Components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'UI de repli
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Logger l'erreur vers un service de monitoring
    console.error("Error caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Envoyer à Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de repli
      return (
        <div className="error-fallback">
          <h2>Oups ! Quelque chose s'est mal passé.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Utilisation

```jsx
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Main />
      <Footer />
    </ErrorBoundary>
  );
}
```

---

## Error Boundaries granulaires

### Stratégie de placement

```jsx
function App() {
  return (
    <div>
      {/* Erreur ici = header cassé seulement */}
      <ErrorBoundary fallback={<HeaderFallback />}>
        <Header />
      </ErrorBoundary>
      
      {/* Erreur ici = sidebar cassée seulement */}
      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>
      
      {/* Erreur ici = contenu principal cassé seulement */}
      <ErrorBoundary fallback={<ContentFallback />}>
        <MainContent />
      </ErrorBoundary>
    </div>
  );
}
```

### Error Boundary réutilisable

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback personnalisable
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Render prop pour accéder à l'erreur
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          reset: () => this.setState({ hasError: false })
        });
      }
      
      // Fallback par défaut
      return <div>Une erreur est survenue</div>;
    }

    return this.props.children;
  }
}

// Utilisations
<ErrorBoundary fallback={<Loading />}>
  <Component />
</ErrorBoundary>

<ErrorBoundary 
  fallbackRender={({ error, reset }) => (
    <div>
      <p>Erreur: {error.message}</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  )}
>
  <Component />
</ErrorBoundary>
```

---

## react-error-boundary

Librairie populaire qui simplifie l'utilisation :

```bash
npm install react-error-boundary
```

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Une erreur est survenue :</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log l'erreur
        console.error(error, info);
      }}
      onReset={() => {
        // Nettoyer le state si nécessaire
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Hook useErrorBoundary

```jsx
import { useErrorBoundary } from 'react-error-boundary';

function MyComponent() {
  const { showBoundary } = useErrorBoundary();
  
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // Propager l'erreur à l'Error Boundary
      showBoundary(error);
    }
  };
  
  return <button onClick={handleClick}>Action risquée</button>;
}
```

---

## Ce que les Error Boundaries NE capturent PAS

⚠️ Les Error Boundaries ne capturent pas :

### 1. Erreurs dans les event handlers

```jsx
function Button() {
  const handleClick = () => {
    throw new Error("Erreur!"); // Non capturée par Error Boundary
  };
  
  return <button onClick={handleClick}>Clic</button>;
}

// ✅ Solution : try/catch dans le handler
function Button() {
  const handleClick = () => {
    try {
      riskyAction();
    } catch (error) {
      // Gérer l'erreur ici
      setError(error.message);
    }
  };
  
  return <button onClick={handleClick}>Clic</button>;
}
```

### 2. Code asynchrone

```jsx
function AsyncComponent() {
  useEffect(() => {
    // Cette erreur N'EST PAS capturée
    fetch('/api/data').then(() => {
      throw new Error("Erreur async!");
    });
  }, []);
}

// ✅ Solution avec useErrorBoundary
function AsyncComponent() {
  const { showBoundary } = useErrorBoundary();
  
  useEffect(() => {
    fetch('/api/data')
      .then(processData)
      .catch(showBoundary); // Propage à l'Error Boundary
  }, []);
}
```

### 3. Erreurs SSR (Server-Side Rendering)

Les Error Boundaries ne fonctionnent que côté client.

### 4. Erreurs dans l'Error Boundary lui-même

```jsx
// Si le fallback crash, l'erreur remonte
<ErrorBoundary fallback={<BrokenFallback />}>
  <App />
</ErrorBoundary>
```

---

## Patterns avancés

### Reset automatique sur changement de route

```jsx
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  return (
    <ErrorBoundary
      key={location.pathname} // Reset sur navigation
      FallbackComponent={ErrorFallback}
    >
      <Routes />
    </ErrorBoundary>
  );
}
```

### Retry avec backoff

```jsx
function RetryableErrorBoundary({ children }) {
  const [retryCount, setRetryCount] = useState(0);
  
  const handleReset = () => {
    if (retryCount < 3) {
      setRetryCount(r => r + 1);
    }
  };
  
  return (
    <ErrorBoundary
      key={retryCount}
      onReset={handleReset}
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div>
          <p>Erreur (tentative {retryCount}/3)</p>
          {retryCount < 3 ? (
            <button onClick={resetErrorBoundary}>Réessayer</button>
          ) : (
            <p>Nombre maximum de tentatives atteint</p>
          )}
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## Intégration avec le monitoring

```jsx
import * as Sentry from '@sentry/react';

const SentryErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: <ErrorFallback />,
  showDialog: true, // Affiche un formulaire de feedback
});

// Ou manuellement
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, {
    contexts: {
      react: { componentStack: errorInfo.componentStack }
    }
  });
}
```

---

## Exercice pratique

Créez un Error Boundary pour une galerie d'images :

```jsx
// Les images peuvent avoir des URLs invalides
function ImageGallery({ images }) {
  return (
    <div className="gallery">
      {images.map(img => (
        <ImageCard key={img.id} src={img.url} alt={img.title} />
      ))}
    </div>
  );
}

function ImageCard({ src, alt }) {
  // Peut échouer si les props sont malformées
  return <img src={src} alt={alt} />;
}
```

<details>
<summary>✅ Solution</summary>

```jsx
function ImageErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="image-error">
      <span>🖼️ Image indisponible</span>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
}

function ImageCard({ src, alt }) {
  if (!src) {
    throw new Error("Image source is required");
  }
  return <img src={src} alt={alt} />;
}

function ImageGallery({ images }) {
  return (
    <div className="gallery">
      {images.map(img => (
        <ErrorBoundary
          key={img.id}
          FallbackComponent={ImageErrorFallback}
        >
          <ImageCard src={img.url} alt={img.title} />
        </ErrorBoundary>
      ))}
    </div>
  );
}
```

Chaque image a son propre Error Boundary - une image cassée n'affecte pas les autres.

</details>

---

## Ressources

- [React Docs - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
