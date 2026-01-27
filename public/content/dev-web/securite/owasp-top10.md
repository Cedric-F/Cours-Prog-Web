# OWASP Top 10 : Les vulnérabilités web essentielles

L'OWASP (Open Web Application Security Project) publie régulièrement une liste des 10 vulnérabilités les plus critiques. C'est une connaissance essentielle pour tout développeur web.

## Vue d'ensemble

| # | Vulnérabilité | Impact |
|---|---------------|--------|
| 1 | Broken Access Control | Accès non autorisé |
| 2 | Cryptographic Failures | Données exposées |
| 3 | Injection | Exécution de code malveillant |
| 4 | Insecure Design | Failles architecturales |
| 5 | Security Misconfiguration | Mauvaise configuration |
| 6 | Vulnerable Components | Dépendances vulnérables |
| 7 | Authentication Failures | Usurpation d'identité |
| 8 | Software Integrity Failures | Code/données altérés |
| 9 | Logging Failures | Attaques non détectées |
| 10 | SSRF | Requêtes serveur malveillantes |

---

## 1. Broken Access Control

### Le problème

L'utilisateur accède à des ressources auxquelles il ne devrait pas avoir accès.

```javascript
// ❌ Vulnérable - Pas de vérification d'autorisation
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user); // N'importe qui peut voir n'importe quel utilisateur !
});

// ❌ IDOR (Insecure Direct Object Reference)
// /api/invoices/12345 → L'utilisateur devine les IDs
```

### Solution

```javascript
// ✅ Vérifier l'autorisation
app.get('/api/users/:id', authenticate, async (req, res) => {
  // L'utilisateur ne peut voir que son propre profil
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  
  const user = await User.findById(req.params.id);
  res.json(user);
});

// ✅ Utiliser des IDs non prévisibles (UUID)
// /api/invoices/550e8400-e29b-41d4-a716-446655440000
```

### Checklist

- [ ] Vérifier les autorisations côté serveur (jamais côté client)
- [ ] Refuser par défaut
- [ ] Logger les tentatives d'accès non autorisées
- [ ] Utiliser des UUIDs plutôt que des IDs séquentiels

---

## 2. Cryptographic Failures

### Le problème

Données sensibles non chiffrées ou mal protégées.

```javascript
// ❌ Mot de passe en clair
const user = { email, password }; // Stocké tel quel en BDD

// ❌ Données sensibles en HTTP (non HTTPS)
// ❌ Algorithmes obsolètes (MD5, SHA1)
const hash = md5(password);
```

### Solution

```javascript
import bcrypt from 'bcrypt';

// ✅ Hasher les mots de passe avec bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// ✅ Vérification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);

// ✅ Chiffrer les données sensibles
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### Checklist

- [ ] HTTPS partout (pas seulement le login)
- [ ] Mots de passe hashés (bcrypt, argon2)
- [ ] Données sensibles chiffrées au repos
- [ ] Pas de données sensibles dans les URLs ou logs

---

## 3. Injection

### Le problème

Du code malveillant est injecté et exécuté.

```javascript
// ❌ SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
// email = "'; DROP TABLE users; --"

// ❌ XSS (Cross-Site Scripting)
element.innerHTML = userInput;
// userInput = "<script>stealCookies()</script>"

// ❌ Command Injection
exec(`ls ${userInput}`);
// userInput = "; rm -rf /"
```

### Solution

```javascript
// ✅ Requêtes paramétrées
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]);

// ✅ ORM avec échappement automatique
await User.findOne({ where: { email } });

// ✅ Échapper le HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ Utiliser textContent au lieu de innerHTML
element.textContent = userInput;

// ✅ Dans React, l'échappement est automatique
<p>{userInput}</p> // Sûr

// ⚠️ Attention à dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### Checklist

- [ ] Requêtes SQL paramétrées / ORM
- [ ] Validation et sanitisation des entrées
- [ ] Encoder les sorties selon le contexte (HTML, JS, URL)
- [ ] Content Security Policy (CSP)

---

## 4. Insecure Design

### Le problème

Failles fondamentales dans la conception.

```javascript
// ❌ Pas de rate limiting sur le login
// Un attaquant peut tester des milliers de mots de passe

// ❌ Réinitialisation de mot de passe prévisible
// "Quel est le nom de votre animal ?"

// ❌ Pas de vérification email à l'inscription
```

### Solution

```javascript
// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: 'Trop de tentatives, réessayez plus tard'
});

app.post('/login', loginLimiter, loginHandler);

// ✅ Réinitialisation sécurisée
const token = crypto.randomBytes(32).toString('hex');
const expires = Date.now() + 3600000; // 1 heure
// Envoyer le lien par email uniquement
```

### Checklist

- [ ] Modélisation des menaces dès la conception
- [ ] Rate limiting sur les actions sensibles
- [ ] Vérification d'identité robuste
- [ ] Principe du moindre privilège

---

## 5. Security Misconfiguration

### Le problème

Configuration par défaut ou incorrecte.

```javascript
// ❌ Mode debug en production
app.use(errorHandler({ debug: true })); // Stack traces exposées

// ❌ Headers de sécurité manquants
// ❌ Répertoires exposés (/admin, /.git, /backup)
// ❌ Comptes par défaut (admin/admin)
```

### Solution

```javascript
// ✅ Helmet pour les headers de sécurité
import helmet from 'helmet';
app.use(helmet());

// ✅ Désactiver X-Powered-By
app.disable('x-powered-by');

// ✅ Gestion d'erreurs sécurisée en production
app.use((err, req, res, next) => {
  console.error(err); // Logger côté serveur
  
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : err.message
  });
});
```

### Checklist

- [ ] Headers de sécurité (Helmet, CSP)
- [ ] Pas de mode debug en production
- [ ] Supprimer les fichiers par défaut
- [ ] Mettre à jour régulièrement

---

## 6. Vulnerable and Outdated Components

### Le problème

Utiliser des dépendances avec des vulnérabilités connues.

```bash
# ❌ Dépendances jamais mises à jour
# ❌ Versions avec CVE connues
```

### Solution

```bash
# ✅ Auditer les dépendances
npm audit

# ✅ Corriger automatiquement
npm audit fix

# ✅ Utiliser des outils comme Snyk ou Dependabot
npx snyk test

# ✅ Garder les dépendances à jour
npx npm-check-updates
```

### Checklist

- [ ] Audits réguliers (`npm audit`)
- [ ] Alertes de sécurité activées (GitHub Dependabot)
- [ ] Supprimer les dépendances inutilisées
- [ ] Politique de mise à jour

---

## 7. Identification and Authentication Failures

### Le problème

Authentification faible ou mal implémentée.

```javascript
// ❌ Mots de passe faibles acceptés
// ❌ Session jamais expirée
// ❌ Token JWT sans expiration
// ❌ Pas de MFA pour les actions sensibles
```

### Solution

```javascript
// ✅ Validation de mot de passe fort
function validatePassword(password) {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

// ✅ Session avec expiration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    maxAge: 3600000, // 1 heure
    sameSite: 'strict'
  }
};

// ✅ JWT avec expiration courte
const token = jwt.sign({ userId }, secret, { expiresIn: '15m' });
```

### Checklist

- [ ] Mots de passe forts obligatoires
- [ ] Sessions avec expiration
- [ ] Cookies sécurisés (httpOnly, secure, sameSite)
- [ ] MFA pour les actions sensibles
- [ ] Invalidation des sessions au logout

---

## 8. Software and Data Integrity Failures

### Le problème

Code ou données modifiés sans vérification.

```html
<!-- ❌ Scripts externes sans intégrité -->
<script src="https://cdn.example.com/lib.js"></script>

<!-- ❌ Désérialisation non sécurisée -->
```

### Solution

```html
<!-- ✅ Subresource Integrity (SRI) -->
<script 
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

```javascript
// ✅ Vérifier les signatures
// ✅ CI/CD sécurisé avec revue de code
// ✅ Pas de eval() ou de désérialisation aveugle
```

---

## 9. Security Logging and Monitoring Failures

### Le problème

Les attaques passent inaperçues faute de logs.

```javascript
// ❌ Pas de logs
// ❌ Logs insuffisants (pas d'IP, pas de contexte)
// ❌ Logs jamais consultés
```

### Solution

```javascript
// ✅ Logger les événements de sécurité
function logSecurityEvent(type, data) {
  logger.warn({
    type,
    timestamp: new Date().toISOString(),
    ip: data.ip,
    userId: data.userId,
    ...data
  });
}

// Exemples à logger :
// - Tentatives de login échouées
// - Changements de mot de passe
// - Tentatives d'accès non autorisées
// - Erreurs 4xx/5xx anormales
```

### Checklist

- [ ] Logger les tentatives d'authentification
- [ ] Logger les accès refusés
- [ ] Alertes sur les comportements suspects
- [ ] Rétention et analyse des logs

---

## 10. Server-Side Request Forgery (SSRF)

### Le problème

L'application fait des requêtes vers des URLs contrôlées par l'attaquant.

```javascript
// ❌ Vulnérable
app.get('/fetch', async (req, res) => {
  const response = await fetch(req.query.url);
  res.json(await response.json());
});

// Attaque : /fetch?url=http://169.254.169.254/metadata
// Accès aux métadonnées cloud internes !
```

### Solution

```javascript
// ✅ Whitelist des domaines autorisés
const allowedDomains = ['api.example.com', 'cdn.example.com'];

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return allowedDomains.includes(parsed.hostname);
  } catch {
    return false;
  }
}

app.get('/fetch', async (req, res) => {
  if (!isAllowedUrl(req.query.url)) {
    return res.status(400).json({ error: 'URL non autorisée' });
  }
  // ...
});
```

---

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## Quiz rapide

:::quiz
Q: Quelle est la meilleure façon de stocker un mot de passe ?
- [ ] En clair dans la base de données
- [ ] Chiffré avec AES
- [x] Hashé avec bcrypt ou Argon2
- [ ] Encodé en Base64
Explication: Le hachage avec bcrypt ou Argon2 est irréversible et inclut un salt, contrairement au chiffrement qui est réversible.

Q: Comment prévenir les injections SQL ?
- [ ] Valider les entrées côté client
- [x] Utiliser des requêtes paramétrées
- [ ] Échapper les caractères spéciaux manuellement
- [ ] Limiter la longueur des champs
Explication: Les requêtes paramétrées (prepared statements) séparent le code SQL des données, empêchant l'injection.

Q: Que fait le header CSP (Content-Security-Policy) ?
- [ ] Chiffre les communications
- [ ] Bloque les robots
- [x] Contrôle les sources de contenu autorisées
- [ ] Compresse les réponses
Explication: CSP permet de définir quelles sources de scripts, styles, images, etc. sont autorisées, prévenant le XSS.
:::
