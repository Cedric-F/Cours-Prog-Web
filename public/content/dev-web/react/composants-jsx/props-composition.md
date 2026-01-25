# Props & Composition

Maîtrisez la communication entre composants avec les **props** et créez des composants réutilisables grâce à la **composition**.

---

## Props : Passer des données

Les **props** (properties) permettent de passer des données d'un composant parent à un composant enfant.

### Props de base

```jsx
// Composant enfant
function Welcome(props) {
  return <h1>Bonjour, {props.name} !</h1>;
}

// Composant parent
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}
```

### Destructuration des props

```jsx
// ✅ Recommandé : Destructuration
function Welcome({ name }) {
  return <h1>Bonjour, {name} !</h1>;
}

// Props multiples
function UserCard({ name, email, age, isActive }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Email : {email}</p>
      <p>Âge : {age} ans</p>
      <span className={isActive ? 'active' : 'inactive'}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    </div>
  );
}

function App() {
  return (
    <UserCard
      name="Alice Martin"
      email="alice@example.com"
      age={28}
      isActive={true}
    />
  );
}
```

### Types de props

```jsx
function Profile({
  name,          // string
  age,           // number
  isActive,      // boolean
  hobbies,       // array
  address,       // object
  onUpdate,      // function
  children       // JSX
}) {
  return (
    <div>
      <h2>{name} ({age} ans)</h2>
      <p>Statut : {isActive ? 'Actif' : 'Inactif'}</p>
      <p>Ville : {address.city}</p>
      
      <h3>Hobbies :</h3>
      <ul>
        {hobbies.map((hobby, i) => (
          <li key={i}>{hobby}</li>
        ))}
      </ul>
      
      <button onClick={onUpdate}>Mettre à jour</button>
      
      {children}
    </div>
  );
}

function App() {
  const handleUpdate = () => {
    console.log('Mise à jour du profil');
  };

  return (
    <Profile
      name="Alice"
      age={28}
      isActive={true}
      hobbies={['Lecture', 'Sport', 'Coding']}
      address={{ city: 'Paris', country: 'France' }}
      onUpdate={handleUpdate}
    >
      <p>Contenu additionnel via children</p>
    </Profile>
  );
}
```

### Props par défaut

```jsx
// Avec valeurs par défaut dans la destructuration
function Button({ text = 'Cliquez-moi', type = 'button', variant = 'primary' }) {
  return (
    <button type={type} className={`btn btn-${variant}`}>
      {text}
    </button>
  );
}

// Utilisation
<Button />                                    // Valeurs par défaut
<Button text="Envoyer" />                    // text personnalisé
<Button text="Supprimer" variant="danger" /> // Plusieurs props
```

### Props avec spread operator

```jsx
function UserCard({ name, email, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <p>{age} ans</p>
    </div>
  );
}

function App() {
  const user = {
    name: 'Alice',
    email: 'alice@example.com',
    age: 28
  };

  // ✅ Spread operator (pratique)
  return <UserCard {...user} />;
  
  // Équivalent à :
  // return <UserCard name={user.name} email={user.email} age={user.age} />;
}
```

### Props immuables

```jsx
// ❌ INTERDIT : Modifier les props
function Button({ text }) {
  // Ne JAMAIS faire ça !
  text = text.toUpperCase(); // ❌
  
  return <button>{text}</button>;
}

// ✅ BON : Créer une nouvelle variable
function Button({ text }) {
  const displayText = text.toUpperCase(); // ✅
  
  return <button>{displayText}</button>;
}
```

---

## Props.children

La prop spéciale **children** contient le contenu entre les balises ouvrante et fermante d'un composant.

### Utilisation de base

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Card title="Ma carte">
      <p>Ceci est le contenu</p>
      <button>Action</button>
    </Card>
  );
}
```

### Wrapper génériques

```jsx
function Container({ children, className = '' }) {
  return (
    <div className={`container ${className}`}>
      {children}
    </div>
  );
}

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Container className="main">
        <h1>Titre</h1>
        <p>Contenu</p>
      </Container>
      
      <Modal isOpen={true}>
        <h2>Confirmation</h2>
        <p>Êtes-vous sûr ?</p>
        <button>Oui</button>
        <button>Non</button>
      </Modal>
    </>
  );
}
```

### Layout components

```jsx
function PageLayout({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <PageLayout>
      <h1>Page d'accueil</h1>
      <p>Contenu de la page</p>
    </PageLayout>
  );
}

function AboutPage() {
  return (
    <PageLayout>
      <h1>À propos</h1>
      <p>Informations</p>
    </PageLayout>
  );
}
```

---

## Composition de composants

La **composition** permet de construire des composants complexes à partir de composants simples.

### Spécialisation

```jsx
// Composant générique
function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

// Composants spécialisés
function PrimaryButton({ children, ...props }) {
  return <Button variant="primary" {...props}>{children}</Button>;
}

function DangerButton({ children, ...props }) {
  return <Button variant="danger" {...props}>{children}</Button>;
}

function SubmitButton({ children, ...props }) {
  return (
    <PrimaryButton type="submit" {...props}>
      {children || 'Envoyer'}
    </PrimaryButton>
  );
}

// Utilisation
function Form() {
  return (
    <form>
      <PrimaryButton>Sauvegarder</PrimaryButton>
      <DangerButton>Supprimer</DangerButton>
      <SubmitButton />
    </form>
  );
}
```

### Containment (Inclusion)

```jsx
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <DialogHeader title={title} />
      <DialogBody>
        {children}
      </DialogBody>
      <DialogFooter />
    </div>
  );
}

function DialogHeader({ title }) {
  return (
    <div className="dialog-header">
      <h2>{title}</h2>
      <button className="close">×</button>
    </div>
  );
}

function DialogBody({ children }) {
  return <div className="dialog-body">{children}</div>;
}

function DialogFooter() {
  return (
    <div className="dialog-footer">
      <button>Annuler</button>
      <button>Confirmer</button>
    </div>
  );
}

// Utilisation
function App() {
  return (
    <Dialog title="Confirmation">
      <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
    </Dialog>
  );
}
```

### Composition avancée

```jsx
function Panel({ children, header, footer }) {
  return (
    <div className="panel">
      {header && <div className="panel-header">{header}</div>}
      <div className="panel-body">{children}</div>
      {footer && <div className="panel-footer">{footer}</div>}
    </div>
  );
}

function App() {
  return (
    <Panel
      header={<h2>Mon panneau</h2>}
      footer={<button>Action</button>}
    >
      <p>Contenu du panneau</p>
    </Panel>
  );
}
```

### Slots pattern

```jsx
function Card({ header, content, actions }) {
  return (
    <div className="card">
      <div className="card-header">{header}</div>
      <div className="card-content">{content}</div>
      <div className="card-actions">{actions}</div>
    </div>
  );
}

function App() {
  return (
    <Card
      header={<h2>Titre de la carte</h2>}
      content={<p>Contenu de la carte</p>}
      actions={
        <>
          <button>Modifier</button>
          <button>Supprimer</button>
        </>
      }
    />
  );
}
```

---

## Render Props

Le pattern **Render Props** permet de partager de la logique en passant une fonction comme prop.

### Exemple de base

```jsx
function DataProvider({ data, render }) {
  return <div>{render(data)}</div>;
}

function App() {
  const users = ['Alice', 'Bob', 'Charlie'];

  return (
    <DataProvider
      data={users}
      render={(users) => (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      )}
    />
  );
}
```

### Mouse Tracker (exemple classique)

```jsx
import { useState } from 'react';

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {render(position)}
    </div>
  );
}

function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <h1>Position de la souris : {x}, {y}</h1>
      )}
    />
  );
}
```

---

## Patterns de composition

### Container/Presentational

```jsx
// Presentational (UI pure)
function UserCardView({ user }) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Container (logique + données)
function UserCardContainer({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <div>Chargement...</div>;

  return <UserCardView user={user} />;
}
```

### Higher-Order Components (HOC) - Avancé

```jsx
// HOC qui ajoute un titre
function withTitle(Component, title) {
  return function WithTitleComponent(props) {
    return (
      <div>
        <h1>{title}</h1>
        <Component {...props} />
      </div>
    );
  };
}

function UserList({ users }) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

const UserListWithTitle = withTitle(UserList, 'Liste des utilisateurs');
```

---

## Exemple complet : Système de cartes

```jsx
// Card.jsx
function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
};

// Utilisation
function App() {
  return (
    <Card>
      <Card.Header>
        <h2>Titre de la carte</h2>
      </Card.Header>
      <Card.Body>
        <p>Contenu de la carte</p>
      </Card.Body>
      <Card.Footer>
        <button>Action</button>
      </Card.Footer>
    </Card>
  );
}

export default Card;
```

---

## Bonnes pratiques

### ✅ Props explicites

```jsx
// ✅ BON : Props explicites et typées
function UserCard({ name, email, age }) {
  return <div>...</div>;
}

// ❌ MAUVAIS : Props trop génériques
function UserCard({ data }) {
  return <div>{data.name}</div>;
}
```

### ✅ Composition > Héritage

```jsx
// ✅ BON : Composition
function Dialog({ title, children }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// ❌ React n'utilise PAS l'héritage de classes
```

### ✅ Props minimales

```jsx
// ❌ MAUVAIS : Trop de props
<UserCard
  firstName={user.firstName}
  lastName={user.lastName}
  email={user.email}
  age={user.age}
  address={user.address}
  phone={user.phone}
/>

// ✅ BON : Passer l'objet complet
<UserCard user={user} />
```

### ✅ Déstructuration avec rest

```jsx
function Button({ variant, children, ...restProps }) {
  return (
    <button className={`btn btn-${variant}`} {...restProps}>
      {children}
    </button>
  );
}

// Toutes les props HTML natives sont passées
<Button variant="primary" onClick={handleClick} disabled>
  Cliquez
</Button>
```

---

## Exercice pratique

Créez un **Système de Navigation** avec :
- Un composant `Nav` avec slots pour logo, liens et actions
- Un composant `NavLink` pour les liens de navigation
- Un composant `Dropdown` réutilisable avec children
- Composition pour créer différents types de navigations
- Props pour personnaliser les styles

**Bonus** : Ajoutez un menu mobile responsive et des animations !

---

**Prochaine étape** : [Événements & Rendu](./evenements-rendu.md) pour l'interactivité ! 🎯
