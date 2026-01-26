# JWT & Sessions

Implémentez l'authentification avec JSON Web Tokens (JWT) ou les sessions classiques. Comprenez les différences et choisissez la bonne approche pour votre application.

---

## Ce que vous allez apprendre

- Comprendre la structure d'un JWT
- Générer et vérifier des tokens
- Implémenter le refresh token
- Comparer JWT et sessions classiques

## Prérequis

- [Concepts d'Authentification](./auth-concepts.md)
- [Express - Middleware](../express/middleware-routing.md)

---

## JSON Web Tokens (JWT)

### Structure d'un JWT

Un JWT est composé de trois parties séparées par des points :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                      │                                                                              │
└──────────────┬───────────────────────┴──────────────────────────────────────────┬────────────────────────────────────┴─────────────────────────────────┐
               │                                                                   │                                                                       │
            HEADER                                                              PAYLOAD                                                                SIGNATURE
```

```javascript
// Header (algorithme utilisé)
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload (données)
{
  "userId": "1234567890",
  "role": "admin",
  "iat": 1516239022,    // Issued At
  "exp": 1516242622     // Expiration
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Installation

```bash
npm install jsonwebtoken
```

### Génération de Tokens

```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
```

```env
# .env
JWT_SECRET=votre_secret_super_long_et_complexe_minimum_32_caracteres
JWT_REFRESH_SECRET=autre_secret_super_long_et_complexe
JWT_EXPIRES_IN=7d
```

### Middleware d'Authentification

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Vous devez être connecté pour accéder à cette ressource'
      });
    }
    
    // 2. Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expiré, veuillez vous reconnecter'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
    
    // 3. Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'L\'utilisateur n\'existe plus'
      });
    }
    
    // 4. Vérifier si le mot de passe n'a pas changé après l'émission du token
    if (user.passwordChangedAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        error: 'Mot de passe modifié, veuillez vous reconnecter'
      });
    }
    
    // 5. Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware de restriction par rôle
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'avez pas la permission d\'effectuer cette action'
      });
    }
    next();
  };
};
```

### Utilisation dans les Routes

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Route publique
router.get('/public', userController.getPublicData);

// Routes protégées (utilisateur connecté)
router.use(protect);

router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);

// Routes admin uniquement
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
```

### Refresh Tokens

```javascript
// controllers/authController.js
const { generateToken, generateRefreshToken } = require('../utils/jwt');

exports.login = async (req, res, next) => {
  // ... vérification des credentials
  
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  // Stocker le refresh token en BDD (pour pouvoir le révoquer)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  
  // Envoyer le refresh token dans un cookie HTTP-only
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000  // 30 jours
  });
  
  res.json({
    success: true,
    accessToken,
    data: { user }
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token manquant'
      });
    }
    
    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Vérifier que le token correspond à celui stocké
    const user = await User.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token invalide'
      });
    }
    
    // Générer un nouveau access token
    const newAccessToken = generateToken(user._id);
    
    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Supprimer le refresh token de la BDD
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: undefined
    });
    
    // Supprimer le cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Authentification par Session

### Installation

```bash
npm install express-session connect-mongo
```

### Configuration

```javascript
// app.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60  // 1 jour
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only en prod
    httpOnly: true,      // Non accessible via JavaScript
    maxAge: 24 * 60 * 60 * 1000,  // 1 jour
    sameSite: 'strict'   // Protection CSRF
  }
}));
```

### Utilisation avec Sessions

```javascript
// controllers/authController.js

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    // Stocker l'utilisateur dans la session
    req.session.userId = user._id;
    req.session.role = user.role;
    
    res.json({
      success: true,
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

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion'
      });
    }
    
    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.session.userId);
  
  res.json({
    success: true,
    data: { user }
  });
};
```

### Middleware Session

```javascript
// middleware/sessionAuth.js

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: 'Vous devez être connecté'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès réservé aux administrateurs'
    });
  }
  next();
};
```

---

## JWT vs Sessions : Comparaison

| Critère | JWT | Sessions |
|---------|-----|----------|
| **Stockage** | Client (localStorage/cookie) | Serveur (mémoire/BDD) |
| **Stateless** | ✅ Oui | ❌ Non |
| **Scalabilité** | ✅ Facile | ⚠️ Nécessite session store partagé |
| **Révocation** | ⚠️ Complexe | ✅ Simple (supprimer la session) |
| **Taille** | ⚠️ Plus grand (~500 bytes) | ✅ Petit (session ID) |
| **Mobile/API** | ✅ Idéal | ⚠️ Problèmes CORS |
| **SPA** | ✅ Idéal | ⚠️ Nécessite configuration |
| **SSR** | ⚠️ Plus complexe | ✅ Simple avec cookies |

### Quand utiliser JWT ?

- ✅ APIs RESTful stateless
- ✅ Applications mobiles
- ✅ Microservices
- ✅ Authentification cross-domain
- ✅ SPAs (React, Vue, Angular)

### Quand utiliser Sessions ?

- ✅ Applications web traditionnelles (SSR)
- ✅ Besoin de révocation immédiate
- ✅ Données sensibles (pas de stockage client)
- ✅ Applications monolithiques simples

---

## Stockage des Tokens côté Client

### Options de stockage

| Méthode | XSS | CSRF | Recommandé |
|---------|-----|------|------------|
| localStorage | ❌ Vulnérable | ✅ Protégé | ⚠️ |
| sessionStorage | ❌ Vulnérable | ✅ Protégé | ⚠️ |
| Cookie HTTP-only | ✅ Protégé | ❌ Vulnérable | ✅ (avec CSRF token) |
| Mémoire (variable) | ✅ Protégé | ✅ Protégé | ✅ (mais perdu au refresh) |

### Approche hybride recommandée

```javascript
// Serveur : Access token en mémoire, Refresh token en cookie HTTP-only

// Login response
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000
});

res.json({
  success: true,
  accessToken  // Stocké en mémoire côté client
});
```

```javascript
// Client (React exemple)
import { useState, useEffect } from 'react';

function useAuth() {
  const [accessToken, setAccessToken] = useState(null);
  
  // Refresh le token au chargement
  useEffect(() => {
    refreshAccessToken();
  }, []);
  
  const refreshAccessToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'  // Inclure les cookies
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccessToken(data.accessToken);
      }
    } catch (error) {
      // Utilisateur non connecté
      setAccessToken(null);
    }
  };
  
  // Refresh automatique avant expiration
  useEffect(() => {
    if (!accessToken) return;
    
    // Décoder le token pour obtenir l'expiration
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresIn = payload.exp * 1000 - Date.now();
    
    // Refresh 1 minute avant expiration
    const timeout = setTimeout(refreshAccessToken, expiresIn - 60000);
    
    return () => clearTimeout(timeout);
  }, [accessToken]);
  
  return { accessToken, refreshAccessToken };
}
```

---

## Implémentation Complète

### Configuration du Serveur

```javascript
// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true  // Autoriser les cookies
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;
```

### Routes d'Auth Complètes

```javascript
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Routes protégées
router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);

module.exports = router;
```

### Tests avec cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Password123!","passwordConfirm":"Password123!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123!"}' \
  -c cookies.txt

# Accéder à une route protégée
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token>" \
  -b cookies.txt
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Token en localStorage | Vulnérable XSS | httpOnly cookie |
| Pas d'expiration | Token valide indéfiniment | Ajouter `expiresIn` |
| Secret faible | Token falsifiable | Clé longue et aléatoire |
| Pas de refresh token | UX dégradée (re-login fréquent) | Implémenter refresh |

---

## Quiz de vérification

:::quiz
Q: Combien de parties composent un JWT ?
- [ ] 2
- [x] 3
- [ ] 4
> Un JWT est composé de 3 parties séparées par des points : Header, Payload, Signature.

Q: Où stocker le refresh token ?
- [ ] localStorage
- [x] httpOnly cookie
- [ ] Dans l'URL
> Un cookie httpOnly n'est pas accessible par JavaScript, protégeant contre les attaques XSS.

Q: Quelle est la durée recommandée pour un access token ?
- [ ] 1 an
- [x] 15 minutes à 1 heure
- [ ] Infinie
> Un access token court limite les dégâts en cas de vol. Le refresh token permet de le renouveler.

Q: Quelle différence JWT vs Session ?
- [ ] JWT est plus sécurisé
- [x] Session stocke l'état côté serveur, JWT côté client
- [ ] Aucune
> Les sessions nécessitent un stockage serveur, les JWT sont stateless et auto-contenus.
:::

---

## Récapitulatif

| Concept | Description |
|---------|-------------|
| JWT | Token auto-contenu avec signature |
| Access Token | Token court (15min-7j) pour l'API |
| Refresh Token | Token long (30j) pour renouveler l'access token |
| Session | État stocké côté serveur |
| HTTP-only Cookie | Cookie non accessible par JavaScript |
| SameSite | Protection contre CSRF |

---

## Ressources

- [JWT.io](https://jwt.io/) - Debugger et documentation
- [jsonwebtoken NPM](https://www.npmjs.com/package/jsonwebtoken)
- [express-session](https://www.npmjs.com/package/express-session)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## Prochaine étape

Découvrez les [Stratégies OAuth](./oauth-social.md) pour l'authentification via Google, GitHub, etc.
