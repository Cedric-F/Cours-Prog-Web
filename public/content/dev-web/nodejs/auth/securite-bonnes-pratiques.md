# Sécurité & Bonnes Pratiques

Sécurisez votre application Node.js/Express en suivant les meilleures pratiques de l'industrie. La sécurité n'est pas optionnelle !

---

## Les Menaces Principales

### OWASP Top 10

| Rang | Menace | Description |
|------|--------|-------------|
| 1 | Broken Access Control | Accès non autorisé à des ressources |
| 2 | Cryptographic Failures | Mauvaise gestion du chiffrement |
| 3 | Injection | SQL, NoSQL, Command injection |
| 4 | Insecure Design | Conception vulnérable |
| 5 | Security Misconfiguration | Mauvaise configuration |
| 6 | Vulnerable Components | Dépendances vulnérables |
| 7 | Authentication Failures | Failles d'authentification |
| 8 | Data Integrity Failures | Données non vérifiées |
| 9 | Security Logging Failures | Manque de logs |
| 10 | SSRF | Server-Side Request Forgery |

---

## Protection des Headers HTTP

### Helmet.js

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

// Configuration par défaut (recommandée)
app.use(helmet());

// Configuration personnalisée
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"]
    }
  },
  crossOriginEmbedderPolicy: false  // Si vous intégrez des ressources externes
}));
```

### Headers ajoutés par Helmet

```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 0
Strict-Transport-Security: max-age=15552000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
```

---

## Protection contre les Injections

### Injection NoSQL (MongoDB)

```javascript
// ❌ VULNÉRABLE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Un attaquant peut envoyer : { "$gt": "" }
  const user = await User.findOne({ email, password });
});

// Requête malveillante :
// POST { "email": { "$gt": "" }, "password": { "$gt": "" } }
// → Trouve le premier utilisateur !
```

```javascript
// ✅ SÉCURISÉ

// 1. Validation avec Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// 2. Sanitization
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());  // Supprime $ et . des inputs

// 3. Typage explicite
app.post('/login', async (req, res) => {
  const email = String(req.body.email);
  const password = String(req.body.password);
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }
});
```

### Injection de Commandes

```javascript
// ❌ VULNÉRABLE
const { exec } = require('child_process');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  // Attaque : host = "google.com; rm -rf /"
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    res.send(stdout);
  });
});
```

```javascript
// ✅ SÉCURISÉ
const { execFile } = require('child_process');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // Valider le format
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).json({ error: 'Host invalide' });
  }
  
  // execFile ne permet pas l'injection de commandes
  execFile('ping', ['-c', '4', host], (error, stdout) => {
    res.send(stdout);
  });
});
```

---

## Protection XSS (Cross-Site Scripting)

### Sanitisation des entrées

```bash
npm install xss
```

```javascript
const xss = require('xss');

// Sanitiser les entrées utilisateur
app.post('/comments', (req, res) => {
  const sanitizedContent = xss(req.body.content);
  // <script>alert('xss')</script> → &lt;script&gt;alert('xss')&lt;/script&gt;
  
  await Comment.create({
    content: sanitizedContent,
    author: req.user._id
  });
});
```

### Configuration XSS

```javascript
const xss = require('xss');

const xssOptions = {
  whiteList: {
    a: ['href', 'title', 'target'],
    b: [],
    i: [],
    u: [],
    p: [],
    br: [],
    ul: [],
    ol: [],
    li: [],
    strong: [],
    em: [],
    code: [],
    pre: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

const sanitize = (input) => xss(input, xssOptions);
```

### Content Security Policy

```javascript
// Empêcher l'exécution de scripts inline
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],  // Pas de 'unsafe-inline'
    styleSrc: ["'self'", "'unsafe-inline'"],  // CSS inline souvent nécessaire
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));
```

---

## Protection CSRF (Cross-Site Request Forgery)

### Avec csurf (pour les sessions)

```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Appliquer aux routes qui modifient des données
app.use('/api', csrfProtection);

// Envoyer le token au client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Gestion des erreurs CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: 'Token CSRF invalide'
    });
  }
  next(err);
});
```

### Protection via SameSite Cookie

```javascript
// La protection la plus simple pour les APIs modernes
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'  // Bloque les requêtes cross-site
});
```

---

## Rate Limiting

### Protection contre les attaques par force brute

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// Limite globale
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requêtes par IP
  message: {
    error: 'Trop de requêtes, réessayez plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

// Limite stricte pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 tentatives
  message: {
    error: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
  },
  skipSuccessfulRequests: true  // Ne pas compter les succès
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Limite pour les opérations coûteuses
const expensiveLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10
});

app.use('/api/search', expensiveLimiter);
app.use('/api/export', expensiveLimiter);
```

### Rate limiting par utilisateur

```javascript
const rateLimit = require('express-rate-limit');

const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => {
    // Limiter par utilisateur au lieu de par IP
    return req.user?.id || req.ip;
  }
});
```

---

## Validation des Données

### Validation complète avec Joi

```javascript
const Joi = require('joi');

// Schémas de validation
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required()
      .pattern(/^[a-zA-ZÀ-ÿ\s-]+$/)
      .messages({
        'string.pattern.base': 'Le nom ne doit contenir que des lettres'
      }),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required()
      .messages({
        'string.pattern.base': 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
      }),
    passwordConfirm: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Les mots de passe ne correspondent pas'
      })
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    bio: Joi.string().max(500),
    website: Joi.string().uri().allow('')
  }).min(1)
};

// Middleware de validation
const validate = (schemaName) => {
  return (req, res, next) => {
    const { error, value } = schemas[schemaName].validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      
      return res.status(422).json({
        success: false,
        error: 'Validation échouée',
        details: errors
      });
    }
    
    req.body = value;
    next();
  };
};

// Utilisation
app.post('/auth/register', validate('register'), authController.register);
```

---

## Gestion des Secrets

### Variables d'environnement

```env
# .env (JAMAIS versionné)
NODE_ENV=development
PORT=3000

# Base de données
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=votre_secret_super_long_minimum_64_caracteres_genere_aleatoirement
JWT_REFRESH_SECRET=autre_secret_super_long_minimum_64_caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=votre_user
SMTP_PASS=votre_password

# Chiffrement
ENCRYPTION_KEY=clef_de_32_caracteres_exactement
```

```javascript
// Vérification au démarrage
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Variable d'environnement manquante: ${varName}`);
    process.exit(1);
  }
});

// Vérifier la force du secret
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET doit faire au moins 32 caractères');
  process.exit(1);
}
```

### Génération de secrets sécurisés

```bash
# Générer un secret aléatoire
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```javascript
// En code
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
```

---

## Logging de Sécurité

### Logger les événements importants

```bash
npm install winston
```

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/security.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Fonctions de logging sécurité
logger.security = {
  loginSuccess: (userId, ip) => {
    logger.info('Login successful', { event: 'LOGIN_SUCCESS', userId, ip });
  },
  
  loginFailed: (email, ip, reason) => {
    logger.warn('Login failed', { event: 'LOGIN_FAILED', email, ip, reason });
  },
  
  suspiciousActivity: (userId, ip, activity) => {
    logger.warn('Suspicious activity', { event: 'SUSPICIOUS', userId, ip, activity });
  },
  
  accessDenied: (userId, resource, ip) => {
    logger.warn('Access denied', { event: 'ACCESS_DENIED', userId, resource, ip });
  },
  
  passwordChanged: (userId, ip) => {
    logger.info('Password changed', { event: 'PASSWORD_CHANGED', userId, ip });
  }
};

module.exports = logger;
```

```javascript
// Utilisation dans les controllers
const logger = require('../utils/logger');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const ip = req.ip;
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    logger.security.loginFailed(email, ip, 'Invalid credentials');
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }
  
  logger.security.loginSuccess(user._id, ip);
  // ...
};
```

---

## Audit des Dépendances

### Vérification des vulnérabilités

```bash
# Audit des dépendances
npm audit

# Correction automatique
npm audit fix

# Forcer les corrections majeures
npm audit fix --force

# Rapport détaillé
npm audit --json > audit-report.json
```

### Automatisation avec GitHub Actions

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Tous les jours

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm audit --audit-level=high
```

### Mise à jour régulière

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour une dépendance spécifique
npm update package-name

# Outil pour les mises à jour interactives
npx npm-check-updates -i
```

---

## HTTPS et TLS

### En production (avec reverse proxy)

```javascript
// Forcer HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Ou avec Helmet
app.use(helmet.hsts({
  maxAge: 31536000,  // 1 an
  includeSubDomains: true,
  preload: true
}));
```

### En développement (certificat auto-signé)

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

https.createServer(options, app).listen(443);
```

---

## Checklist de Sécurité

### Avant la mise en production

- [ ] **Helmet.js** configuré
- [ ] **HTTPS** activé
- [ ] **Variables d'environnement** sécurisées
- [ ] **Mots de passe** hashés avec bcrypt (coût ≥ 12)
- [ ] **Validation** de toutes les entrées
- [ ] **Sanitisation** des données (XSS, NoSQL injection)
- [ ] **Rate limiting** sur l'authentification
- [ ] **CORS** configuré correctement
- [ ] **Cookies** avec httpOnly, secure, sameSite
- [ ] **JWT** avec expiration courte
- [ ] **Logs** des événements de sécurité
- [ ] **npm audit** sans vulnérabilités critiques
- [ ] **Dépendances** à jour
- [ ] **Secrets** suffisamment longs et aléatoires
- [ ] **Gestion d'erreurs** sans fuite d'information

### Configuration production Express

```javascript
// app.js - Configuration sécurisée
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust proxy (pour rate limiting derrière un reverse proxy)
app.set('trust proxy', 1);

// Sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
app.use(mongoSanitize());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Parsing avec limites
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Supprimer le header X-Powered-By
app.disable('x-powered-by');

module.exports = app;
```

---

## Récapitulatif

| Protection | Outil/Méthode |
|------------|---------------|
| Headers HTTP | Helmet.js |
| Injection NoSQL | express-mongo-sanitize, validation |
| XSS | xss, CSP |
| CSRF | csurf, SameSite cookies |
| Brute Force | express-rate-limit |
| Mots de passe | bcrypt, argon2 |
| Secrets | Variables d'environnement |
| Dépendances | npm audit |
| Logging | Winston |
| HTTPS | TLS/SSL |

---

## Ressources

- 📖 [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- 📖 [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- 📖 [Helmet.js Documentation](https://helmetjs.github.io/)
- 📖 [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- 🛠️ [Snyk - Security Scanner](https://snyk.io/)
