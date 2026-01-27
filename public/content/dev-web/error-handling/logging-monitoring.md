# Logging et monitoring

Capturer et suivre les erreurs en production est crucial. Voici comment mettre en place un système de logging efficace.

## Pourquoi logger ?

En développement, vous voyez les erreurs dans la console. En production :
- Les utilisateurs ne reportent pas toutes les erreurs
- Vous n'avez pas accès à leur console
- Certaines erreurs sont silencieuses
- Vous devez comprendre le contexte

---

## Logging côté client

### Console structurée

```javascript
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  error: (message, error, context = {}) => {
    console.error(`[ERROR] ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...context
    });
  },
  
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};

// Utilisation
logger.info("Utilisateur connecté", { userId: 123 });
logger.error("Échec de l'appel API", error, { endpoint: "/api/users" });
```

### Envoi vers un service

```javascript
class RemoteLogger {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.queue = [];
    this.flushInterval = setInterval(() => this.flush(), 5000);
  }

  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.queue.push(entry);
    
    // Flush immédiat pour les erreurs
    if (level === 'error') {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;
    
    const entries = [...this.queue];
    this.queue = [];
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: entries })
      });
    } catch (error) {
      // Remettre en queue si échec
      this.queue.unshift(...entries);
    }
  }
}

const remoteLogger = new RemoteLogger('/api/logs');
```

---

## Capture globale des erreurs

### window.onerror

Capture les erreurs non catchées :

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  logger.error("Uncaught error", error, {
    message,
    source,
    line: lineno,
    column: colno
  });
  
  // Retourner true empêche l'affichage dans la console
  return false;
};
```

### unhandledrejection

Capture les Promises rejetées non gérées :

```javascript
window.addEventListener('unhandledrejection', (event) => {
  logger.error("Unhandled promise rejection", event.reason, {
    promise: event.promise
  });
});
```

### Wrapper global

```javascript
function setupGlobalErrorHandling() {
  // Erreurs synchrones
  window.onerror = (message, source, lineno, colno, error) => {
    reportError({
      type: 'uncaught',
      message,
      source,
      lineno,
      colno,
      stack: error?.stack
    });
    return false;
  };

  // Promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    reportError({
      type: 'unhandledrejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });

  // Erreurs de ressources (images, scripts)
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      reportError({
        type: 'resource',
        tagName: event.target.tagName,
        src: event.target.src || event.target.href
      });
    }
  }, true);
}
```

---

## Services de monitoring

### Sentry

Le plus populaire pour le monitoring d'erreurs :

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.NODE_ENV,
  release: "my-app@1.0.0",
  
  // Filtrer certaines erreurs
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    /Loading chunk \d+ failed/
  ],
  
  // Échantillonnage (1 = 100%, 0.1 = 10%)
  sampleRate: 1.0,
  tracesSampleRate: 0.2, // Pour le tracing de performance
});

// Capture manuelle
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: "checkout" },
    extra: { orderId: order.id }
  });
}

// Breadcrumbs (fil d'Ariane)
Sentry.addBreadcrumb({
  category: "user",
  message: "Clicked checkout button",
  level: "info"
});

// Contexte utilisateur
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
});
```

### LogRocket

Enregistre les sessions utilisateur :

```javascript
import LogRocket from 'logrocket';

LogRocket.init('app-id/project');

// Identifier l'utilisateur
LogRocket.identify(userId, {
  name: user.name,
  email: user.email
});

// Intégration avec Sentry
import * as Sentry from '@sentry/react';

LogRocket.getSessionURL(sessionURL => {
  Sentry.configureScope(scope => {
    scope.setExtra("sessionURL", sessionURL);
  });
});
```

---

## Logging côté serveur (Node.js)

### Winston

```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Erreurs dans un fichier séparé
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    // Tous les logs
    new winston.transports.File({ 
      filename: 'combined.log' 
    }),
  ],
});

// En développement, afficher dans la console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Utilisation
logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { error: err.message });
```

### Pino (plus performant)

```bash
npm install pino pino-pretty
```

```javascript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' }
    : undefined
});

// Utilisation
logger.info({ userId: 123 }, 'User logged in');
logger.error({ err, requestId }, 'Request failed');
```

### Middleware Express

```javascript
import morgan from 'morgan';

// Logger les requêtes HTTP
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Middleware d'erreur
app.use((err, req, res, next) => {
  logger.error({
    err,
    method: req.method,
    url: req.url,
    userId: req.user?.id,
    body: req.body
  }, 'Request error');
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## Bonnes pratiques

### 1. Structurer les logs

```javascript
// ❌ Mauvais
logger.info("User 123 logged in at 2024-01-15");

// ✅ Bon
logger.info("User logged in", { 
  userId: 123, 
  timestamp: new Date(),
  ip: request.ip
});
```

### 2. Niveaux de log appropriés

| Niveau | Usage |
|--------|-------|
| `error` | Erreurs critiques nécessitant une action |
| `warn` | Situations anormales mais gérées |
| `info` | Événements métier importants |
| `debug` | Détails pour le debugging |
| `trace` | Très verbeux, rarement activé |

### 3. Éviter les données sensibles

```javascript
// ❌ Ne jamais logger
logger.info("Login", { password: user.password });
logger.info("Payment", { cardNumber: card.number });

// ✅ Masquer les données sensibles
function sanitize(data) {
  const sanitized = { ...data };
  if (sanitized.password) sanitized.password = "[REDACTED]";
  if (sanitized.token) sanitized.token = "[REDACTED]";
  return sanitized;
}

logger.info("Login", sanitize(userData));
```

### 4. Corréler les logs

```javascript
import { v4 as uuid } from 'uuid';

// Middleware pour ajouter un ID de requête
app.use((req, res, next) => {
  req.requestId = uuid();
  next();
});

// Inclure dans tous les logs
logger.info({ requestId: req.requestId }, "Processing request");
```

---

## Dashboard et alertes

### Créer des alertes

Configurez des alertes pour :
- Taux d'erreurs > 1%
- Erreurs critiques spécifiques
- Latence API > seuil
- Nouveaux types d'erreurs

### Métriques clés

- **Error rate** : Pourcentage de requêtes en erreur
- **P50/P95/P99** : Latence (médiane, 95e, 99e percentile)
- **Uptime** : Disponibilité du service
- **Apdex** : Score de satisfaction utilisateur

---

## Exercice pratique

Implémentez un système de logging simple :

```javascript
// 1. Créez un logger avec niveaux
// 2. Capturez les erreurs globales
// 3. Envoyez vers une API (simulée)
// 4. Testez avec différentes erreurs
```

<details>
<summary>✅ Solution</summary>

```javascript
const Logger = {
  levels: { error: 0, warn: 1, info: 2, debug: 3 },
  currentLevel: 2,
  
  queue: [],
  endpoint: '/api/logs',
  
  log(level, message, data = {}) {
    if (this.levels[level] > this.currentLevel) return;
    
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href
    };
    
    console[level]?.(`[${level.toUpperCase()}]`, message, data);
    
    this.queue.push(entry);
    if (level === 'error' || this.queue.length >= 10) {
      this.flush();
    }
  },
  
  async flush() {
    if (!this.queue.length) return;
    const entries = this.queue.splice(0);
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: entries })
      });
    } catch (e) {
      this.queue.unshift(...entries);
    }
  },
  
  error: (msg, data) => Logger.log('error', msg, data),
  warn: (msg, data) => Logger.log('warn', msg, data),
  info: (msg, data) => Logger.log('info', msg, data),
  debug: (msg, data) => Logger.log('debug', msg, data),
  
  setupGlobalHandlers() {
    window.onerror = (msg, src, line, col, err) => {
      this.error('Uncaught error', { msg, src, line, stack: err?.stack });
    };
    
    window.addEventListener('unhandledrejection', (e) => {
      this.error('Unhandled rejection', { reason: e.reason?.message });
    });
  }
};

// Init
Logger.setupGlobalHandlers();
Logger.info('App started');
```

</details>

---

## Ressources

- [Sentry Documentation](https://docs.sentry.io/)
- [Winston](https://github.com/winstonjs/winston)
- [Pino](https://github.com/pinojs/pino)
- [The Twelve-Factor App - Logs](https://12factor.net/logs)
