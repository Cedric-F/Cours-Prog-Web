# Formulaires en React

Créez des formulaires interactifs avec validation en React.

---

## Ce que vous allez apprendre

- Gérer les inputs contrôlés et non-contrôlés
- Valider les données côté client
- Utiliser React Hook Form
- Afficher les erreurs de validation

## Prérequis

- [Hooks de base](../hooks/hooks-base.md) - useState
- [Événements](../composants-jsx/evenements-rendu.md)

---

## Inputs contrôlés vs non-contrôlés

### Input contrôlé (recommandé)

React contrôle la valeur de l'input :

```jsx
import { useState } from 'react';

function ControlledInput() {
  const [email, setEmail] = useState('');
  
  return (
    <input
      type="email"
      value={email}                           // Valeur = state
      onChange={(e) => setEmail(e.target.value)} // Mise à jour du state
    />
  );
}
```

### Input non-contrôlé

Le DOM gère la valeur :

```jsx
import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value); // Lecture directe du DOM
  };
  
  return <input ref={inputRef} type="email" />;
}
```

### Comparaison

| Aspect | Contrôlé | Non-contrôlé |
|--------|----------|--------------|
| Source de vérité | State React | DOM |
| Validation temps réel | ✅ Facile | ❌ Difficile |
| Valeurs dynamiques | ✅ Oui | ❌ Non |
| Performance | ⚠️ Re-render à chaque frappe | ✅ Pas de re-render |
| Recommandé pour | Formulaires complexes | Formulaires simples |

---

## Formulaire basique

```jsx
import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Propriété calculée
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données:', formData);
    // Envoyer à l'API...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

## Types d'inputs

### Checkbox

```jsx
const [accepted, setAccepted] = useState(false);

<input
  type="checkbox"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

### Radio

```jsx
const [gender, setGender] = useState('');

<div>
  <label>
    <input
      type="radio"
      name="gender"
      value="male"
      checked={gender === 'male'}
      onChange={(e) => setGender(e.target.value)}
    />
    Homme
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="female"
      checked={gender === 'female'}
      onChange={(e) => setGender(e.target.value)}
    />
    Femme
  </label>
</div>
```

### Select

```jsx
const [country, setCountry] = useState('fr');

<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="">Sélectionnez un pays</option>
  <option value="fr">France</option>
  <option value="be">Belgique</option>
  <option value="ch">Suisse</option>
</select>
```

### Select multiple

```jsx
const [skills, setSkills] = useState([]);

<select 
  multiple 
  value={skills} 
  onChange={(e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setSkills(selected);
  }}
>
  <option value="react">React</option>
  <option value="node">Node.js</option>
  <option value="python">Python</option>
</select>
```

---

## Validation manuelle

### Validation simple

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Formulaire valide, envoyer...
      console.log('Envoi:', { email, password });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>
      
      <button type="submit">Connexion</button>
    </form>
  );
}
```

### Validation en temps réel

```jsx
function RealtimeValidation() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  
  const isValid = /\S+@\S+\.\S+/.test(email);
  const showError = touched && !isValid;
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}  // Marquer comme "touché" au blur
        className={showError ? 'error' : ''}
      />
      {showError && <span>Email invalide</span>}
    </div>
  );
}
```

---

## React Hook Form (recommandé)

### Installation

```bash
npm install react-hook-form
```

### Utilisation basique

```jsx
import { useForm } from 'react-hook-form';

function RegisterForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const onSubmit = async (data) => {
    console.log(data);
    // { email: "...", password: "...", confirmPassword: "..." }
    await api.register(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email', { 
            required: 'Email requis',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Email invalide'
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Mot de passe"
          {...register('password', { 
            required: 'Mot de passe requis',
            minLength: {
              value: 6,
              message: 'Minimum 6 caractères'
            }
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
```

### Règles de validation

```jsx
// Requis
register('name', { required: 'Ce champ est requis' })

// Longueur
register('username', {
  minLength: { value: 3, message: 'Min 3 caractères' },
  maxLength: { value: 20, message: 'Max 20 caractères' }
})

// Pattern (regex)
register('phone', {
  pattern: {
    value: /^[0-9]{10}$/,
    message: 'Numéro invalide (10 chiffres)'
  }
})

// Valeur min/max (nombres)
register('age', {
  min: { value: 18, message: 'Minimum 18 ans' },
  max: { value: 120, message: 'Maximum 120 ans' }
})

// Validation personnalisée
register('password', {
  validate: {
    hasUppercase: (v) => /[A-Z]/.test(v) || 'Une majuscule requise',
    hasNumber: (v) => /[0-9]/.test(v) || 'Un chiffre requis',
    hasSpecial: (v) => /[!@#$%]/.test(v) || 'Un caractère spécial requis'
  }
})
```

### Validation avec dépendance

```jsx
import { useForm } from 'react-hook-form';

function PasswordForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password'); // Observer la valeur
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        {...register('password', { required: true })}
      />
      
      <input
        type="password"
        {...register('confirmPassword', {
          required: 'Confirmation requise',
          validate: (value) => 
            value === password || 'Les mots de passe ne correspondent pas'
        })}
      />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
    </form>
  );
}
```

### Valeurs par défaut

```jsx
const { register } = useForm({
  defaultValues: {
    name: 'John Doe',
    email: 'john@example.com',
    newsletter: true
  }
});
```

### Reset du formulaire

```jsx
const { reset, handleSubmit } = useForm();

const onSubmit = async (data) => {
  await api.submit(data);
  reset(); // Réinitialiser le formulaire
};
```

---

## Validation avec Zod

### Installation

```bash
npm install zod @hookform/resolvers
```

### Schéma de validation

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Définir le schéma
const schema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(6, 'Minimum 6 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Utiliser dans le formulaire
function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      
      <button type="submit">S'inscrire</button>
    </form>
  );
}
```

---

## Composant Input réutilisable

```jsx
// components/FormInput.jsx
import { forwardRef } from 'react';

const FormInput = forwardRef(({ 
  label, 
  error, 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.name}>{label}</label>}
      <input
        ref={ref}
        type={type}
        id={props.name}
        className={error ? 'input-error' : ''}
        {...props}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
});

export default FormInput;
```

```jsx
// Utilisation
import FormInput from './components/FormInput';

function MyForm() {
  const { register, formState: { errors } } = useForm();
  
  return (
    <form>
      <FormInput
        label="Email"
        error={errors.email}
        {...register('email', { required: 'Email requis' })}
      />
      
      <FormInput
        label="Mot de passe"
        type="password"
        error={errors.password}
        {...register('password', { required: 'Mot de passe requis' })}
      />
    </form>
  );
}
```

---

## Gestion des erreurs API

```jsx
function LoginForm() {
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setApiError('');
      await api.login(data);
    } catch (error) {
      if (error.field) {
        // Erreur sur un champ spécifique
        setError(error.field, { message: error.message });
      } else {
        // Erreur générale
        setApiError(error.message);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {apiError && <div className="api-error">{apiError}</div>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Connexion</button>
    </form>
  );
}
```

---

## ❌ Erreurs Courantes

### 1. Oublier e.preventDefault()

```jsx
// ❌ Le formulaire recharge la page
const handleSubmit = () => {
  console.log('Envoyé');
};

// ✅ Empêcher le comportement par défaut
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Envoyé');
};
```

### 2. Mutation directe du state

```jsx
// ❌ Mutation directe
const handleChange = (e) => {
  formData.name = e.target.value; // Ne déclenche pas de re-render
};

// ✅ Créer un nouvel objet
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

### 3. Checkbox avec value au lieu de checked

```jsx
// ❌ Ne fonctionne pas
<input type="checkbox" value={accepted} />

// ✅ Utiliser checked
<input type="checkbox" checked={accepted} onChange={...} />
```

### 4. Ne pas gérer l'état de chargement

```jsx
// ❌ Double soumission possible
<button type="submit">Envoyer</button>

// ✅ Désactiver pendant l'envoi
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Envoi...' : 'Envoyer'}
</button>
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Formulaire de contact

**Objectif** : Créer un formulaire avec validation

1. Champs : nom, email, sujet (select), message
2. Validation : tous requis, email valide
3. Afficher les erreurs
4. Désactiver le bouton pendant l'envoi

<details>
<summary>💡 Solution</summary>

```jsx
import { useForm } from 'react-hook-form';

function ContactForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm();
  
  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000)); // Simule API
    console.log(data);
    reset();
    alert('Message envoyé !');
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input 
          placeholder="Nom"
          {...register('name', { required: 'Nom requis' })} 
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      <div>
        <input 
          placeholder="Email"
          {...register('email', { 
            required: 'Email requis',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' }
          })} 
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <div>
        <select {...register('subject', { required: 'Sujet requis' })}>
          <option value="">Sélectionnez un sujet</option>
          <option value="support">Support</option>
          <option value="sales">Commercial</option>
          <option value="other">Autre</option>
        </select>
        {errors.subject && <span>{errors.subject.message}</span>}
      </div>
      
      <div>
        <textarea 
          placeholder="Message"
          {...register('message', { 
            required: 'Message requis',
            minLength: { value: 10, message: 'Minimum 10 caractères' }
          })} 
        />
        {errors.message && <span>{errors.message.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
```
</details>

### Exercice 2 : Formulaire d'inscription

**Objectif** : Validation avancée avec confirmation de mot de passe

1. Email, mot de passe, confirmation, CGU (checkbox)
2. Mot de passe : min 8 chars, 1 majuscule, 1 chiffre
3. Confirmation doit matcher
4. CGU obligatoire

<details>
<summary>Solution avec Zod</summary>

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  confirmPassword: z.string(),
  cgu: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les CGU' })
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input type="email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      
      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      
      <label>
        <input type="checkbox" {...register('cgu')} />
        J'accepte les CGU
      </label>
      {errors.cgu && <p>{errors.cgu.message}</p>}
      
      <button type="submit">S'inscrire</button>
    </form>
  );
}
```
</details>

---

## Quiz Rapide

:::quiz
Q: Qu'est-ce qu'un input contrôlé ?
- [] Un input désactivé
- [x] Un input dont React gère la valeur
- [] Un input avec validation

Q: Quelle bibliothèque simplifie la gestion des formulaires ?
- [] React Forms
- [x] React Hook Form
- [] Formik (aussi valide, mais RHF est plus moderne)

Q: Comment empêcher le rechargement de page ?
- [] `e.stopPropagation()`
- [x] `e.preventDefault()`
- [] `return false`

Q: Quel prop utiliser pour une checkbox ?
- [] `value`
- [x] `checked`
- [] `selected`
:::

---

## Pour aller plus loin

- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Formik](https://formik.org/) - Alternative populaire

---

## Prochaine étape

Découvrez le [State Management](../state-management/context-api.md) pour gérer l'état global de votre application.
