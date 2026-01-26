# Concepts d'Authentification

L'authentification est le processus de vérification de l'identité d'un utilisateur. Comprenez les concepts fondamentaux avant d'implémenter un système d'authentification sécurisé.

---

## Ce que vous allez apprendre

- Distinguer authentification et autorisation
- Comparer sessions et tokens (JWT)
- Comprendre le hachage des mots de passe (bcrypt)
- Découvrir OAuth et l'authentification déléguée

## Prérequis

- [Express - Middleware et Routing](../express/middleware-routing.md)
- [MongoDB - Les Bases](../databases/mongodb-base.md)

---

## Authentification vs Autorisation

| Concept | Question | Exemple |
|---------|----------|---------|
| **Authentification** | Qui êtes-vous ? | Login avec email/mot de passe |
| **Autorisation** | Qu'avez-vous le droit de faire ? | Accès admin, permissions |

```javascript
// Flux typique
// 1. Authentification : l'utilisateur prouve son identité
POST /auth/login { email, password }
→ Retourne un token

// 2. Autorisation : vérifier les permissions
GET /admin/users (avec token)
→ Middleware vérifie : est-ce un admin ?
```

---

## Méthodes d'Authentification

### 1. Authentification par Session (Stateful)

Le serveur maintient l'état de connexion.

```
┌──────────┐                      ┌──────────┐
│  Client  │                      │  Serveur │
└────┬─────┘                      └────┬─────┘
     │                                 │
     │ 1. POST /login {email, pwd}     │
     │────────────────────────────────>│
     │                                 │ Vérifie credentials
     │                                 │ Crée session en BDD/mémoire
     │ 2. Set-Cookie: sessionId=abc123 │
     │<────────────────────────────────│
     │                                 │
     │ 3. GET /profile                 │
     │ Cookie: sessionId=abc123        │
     │────────────────────────────────>│
     │                                 │ Cherche session abc123
     │                                 │ Récupère userId
     │ 4. { user data }                │
     │<────────────────────────────────│
```

**Avantages** :
- ✅ Révocation facile (supprimer la session)
- ✅ Données de session côté serveur (sécurisé)
- ✅ Simple à implémenter

**Inconvénients** :
- ❌ Stockage serveur requis (mémoire/BDD)
- ❌ Difficile à scaler (sessions partagées)
- ❌ Problèmes CORS avec les cookies

### 2. Authentification par Token (Stateless)

Le serveur ne maintient pas d'état ; tout est dans le token.

```
┌──────────┐                      ┌──────────┐
│  Client  │                      │  Serveur │
└────┬─────┘                      └────┬─────┘
     │                                 │
     │ 1. POST /login {email, pwd}     │
     │────────────────────────────────>│
     │                                 │ Vérifie credentials
     │                                 │ Génère JWT signé
     │ 2. { token: "eyJhbG..." }       │
     │<────────────────────────────────│
     │                                 │
     │ Stocke le token (localStorage)  │
     │                                 │
     │ 3. GET /profile                 │
     │ Authorization: Bearer eyJhbG... │
     │────────────────────────────────>│
     │                                 │ Vérifie signature JWT
     │                                 │ Extrait userId du payload
     │ 4. { user data }                │
     │<────────────────────────────────│
```

**Avantages** :
- ✅ Stateless : pas de stockage serveur
- ✅ Scalable : n'importe quel serveur peut vérifier
- ✅ Fonctionne bien avec les APIs et mobile

**Inconvénients** :
- ❌ Révocation complexe (token valide jusqu'à expiration)
- ❌ Payload visible (bien que signé)
- ❌ Taille du token plus grande qu'un session ID

### 3. OAuth 2.0 / OpenID Connect

Délègue l'authentification à un fournisseur tiers.

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Client  │     │  Serveur │     │ Google/GitHub│
└────┬─────┘     └────┬─────┘     └──────┬───────┘
     │                │                   │
     │ 1. "Login with Google"             │
     │───────────────────────────────────>│
     │                │                   │
     │ 2. Redirect: code=xyz              │
     │<───────────────────────────────────│
     │                │                   │
     │ 3. POST /auth/google?code=xyz      │
     │───────────────>│                   │
     │                │ 4. Échange code   │
     │                │──────────────────>│
     │                │ 5. { user info }  │
     │                │<──────────────────│
     │ 6. { token }   │                   │
     │<───────────────│                   │
```

**Utilisé pour** :
- "Se connecter avec Google/GitHub/Facebook"
- SSO (Single Sign-On) entreprise
- Applications tierces accédant à des APIs

---

## Stockage des Mots de Passe

### ❌ Ce qu'il ne faut JAMAIS faire

```javascript
// ❌ JAMAIS : stocker en clair
const user = { email, password: 'monmotdepasse123' };

// ❌ JAMAIS : chiffrement réversible
const encrypted = encrypt(password, secretKey);
// Peut être déchiffré si la clé est compromise

// ❌ JAMAIS : hash simple (MD5, SHA1, SHA256)
const hash = crypto.createHash('sha256').update(password).digest('hex');
// Vulnérable aux rainbow tables
```

### ✅ La bonne méthode : Hachage avec sel

```javascript
const bcrypt = require('bcrypt');

// Hachage du mot de passe
const saltRounds = 12;  // Coût computationnel
const hashedPassword = await bcrypt.hash('monmotdepasse123', saltRounds);
// Résultat : $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.O4oSC8EjKjy/
//            ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            algo  sel (22 chars) + hash (31 chars)

// Vérification
const isValid = await bcrypt.compare('monmotdepasse123', hashedPassword);
// true si le mot de passe correspond
```

### Pourquoi bcrypt ?

| Caractéristique | Explication |
|-----------------|-------------|
| **Sel intégré** | Chaque hash est unique, même pour le même mot de passe |
| **Lent par conception** | Résiste aux attaques par force brute |
| **Coût ajustable** | Augmentez `saltRounds` avec le temps |
| **Standard éprouvé** | Utilisé depuis 1999, pas de faille connue |

```javascript
// Le sel rend chaque hash unique
await bcrypt.hash('password123', 12);
// → $2b$12$ABC...xyz (premier hash)

await bcrypt.hash('password123', 12);
// → $2b$12$DEF...uvw (hash différent, même mot de passe)
```

### Alternatives à bcrypt

```javascript
// Argon2 (recommandé pour les nouveaux projets)
const argon2 = require('argon2');

const hash = await argon2.hash('password123');
const isValid = await argon2.verify(hash, 'password123');

// scrypt (intégré à Node.js)
const crypto = require('crypto');

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync('password123', salt, 64);
```

---

## Structure d'un Système d'Auth

### Modèle Utilisateur

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: [8, 'Minimum 8 caractères'],
    select: false  // Non retourné par défaut
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // Légèrement avant
  next();
});

// Méthode de comparaison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Vérifier si le mot de passe a changé après l'émission du token
userSchema.methods.passwordChangedAfter = function(tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
```

### Routes d'Authentification

```javascript
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Routes protégées
router.use(protect);  // Middleware appliqué à toutes les routes suivantes
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);
router.post('/logout', authController.logout);

module.exports = router;
```

---

## Flux d'Authentification Complets

### Inscription (Register)

```javascript
// controllers/authController.js
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    
    // Vérification mot de passe
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: 'Les mots de passe ne correspondent pas'
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Cet email est déjà utilisé'
      });
    }
    
    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### Connexion (Login)

```javascript
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }
    
    // Trouver l'utilisateur (inclure le password)
    const user = await User.findOne({ email }).select('+password');
    
    // Vérifier credentials
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Compte désactivé'
      });
    }
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### Réinitialisation de Mot de Passe

```javascript
const crypto = require('crypto');

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return res.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      });
    }
    
    // Générer un token aléatoire
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Stocker le hash du token (pas le token en clair)
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save({ validateBeforeSave: false });
    
    // Envoyer l'email avec le token
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de mot de passe',
      text: `Cliquez ici pour réinitialiser : ${resetURL}`
    });
    
    res.json({
      success: true,
      message: 'Email envoyé'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Hash le token reçu pour le comparer
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    // Trouver l'utilisateur avec ce token non expiré
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }
    
    // Mettre à jour le mot de passe
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Connecter l'utilisateur
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Bonnes Pratiques

### 1. Validation des entrées

```javascript
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .message('Le mot de passe doit contenir une majuscule, une minuscule et un chiffre')
    .required(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
});
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 tentatives
  message: {
    success: false,
    error: 'Trop de tentatives, réessayez dans 15 minutes'
  }
});

app.post('/auth/login', loginLimiter, authController.login);
```

### 3. Messages d'erreur génériques

```javascript
// ❌ Trop précis (aide les attaquants)
'Cet email n\'existe pas'
'Mot de passe incorrect'

// ✅ Générique
'Email ou mot de passe incorrect'
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Stocker mot de passe en clair | Fuite de données catastrophique | Toujours utiliser bcrypt |
| JWT sans expiration | Token valide indéfiniment | Ajouter `expiresIn` |
| Secret JWT faible | Token falsifiable | Utiliser une clé longue et aléatoire |
| Messages d'erreur trop précis | Facilite les attaques | "Email ou mot de passe incorrect" |

---

## Quiz de vérification

:::quiz
Q: Quelle est la différence entre authentification et autorisation ?
- [ ] C'est la même chose
- [x] Authentification = qui, Autorisation = permissions
- [ ] Autorisation = qui, Authentification = permissions
> L'authentification vérifie l'identité (qui êtes-vous ?), l'autorisation vérifie les droits (que pouvez-vous faire ?).

Q: Pourquoi utiliser bcrypt plutôt que SHA-256 ?
- [ ] Plus rapide
- [x] Inclut un sel et est lent volontairement
- [ ] Plus court
> bcrypt est conçu pour être lent et intègre un sel unique, rendant les attaques par force brute impraticables.

Q: Où stocker un JWT côté client ?
- [ ] En variable globale
- [x] httpOnly cookie ou localStorage
- [ ] Dans l'URL
> Un cookie httpOnly est plus sécurisé (pas accessible via JS), localStorage est plus simple mais vulnérable aux XSS.

Q: Qu'est-ce qu'OAuth ?
- [ ] Un algorithme de hachage
- [x] Délégation d'authentification (Google, GitHub)
- [ ] Un type de token
> OAuth permet de déléguer l'authentification à un provider externe (Google, GitHub, etc.).
:::

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| Authentification | Vérifier l'identité |
| Autorisation | Vérifier les permissions |
| Session | État maintenu côté serveur |
| Token (JWT) | État dans le token, stateless |
| bcrypt | Hachage sécurisé des mots de passe |
| Sel | Valeur aléatoire ajoutée au hash |
| OAuth | Authentification déléguée (Google, etc.) |

---

## Ressources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt.js Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Passport.js](http://www.passportjs.org/) - Middleware d'authentification

---

## Prochaine étape

Implémentez les [JWT et Sessions](./jwt-sessions.md) pour sécuriser votre application.
