# Documentation : Écrire pour les autres (et soi-même)

Une bonne documentation est ce qui différencie un projet professionnel d'un projet amateur. C'est aussi votre meilleur allié quand vous reviendrez sur votre code dans 6 mois.

## Pourquoi documenter ?

> "Le code dit comment, les commentaires disent pourquoi."

### Bénéfices

✅ **Onboarding** : Les nouveaux arrivent plus vite à contribuer
✅ **Maintenance** : Comprendre le code rapidement
✅ **Collaboration** : Équipe alignée sur les conventions
✅ **Mémoire** : Vous oublierez dans 3 mois

### Le vrai coût

- Documentation absente = questions constantes
- Documentation obsolète = pire que pas de doc
- Documentation excessive = jamais lue

---

## Le README.md

Votre vitrine. C'est la première chose que les gens voient.

### Structure recommandée

```markdown
# Nom du Projet

Description courte et percutante (1-2 phrases).

## 🚀 Démarrage rapide

\`\`\`bash
npm install
npm run dev
\`\`\`

## ✨ Fonctionnalités

- Feature 1
- Feature 2
- Feature 3

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+

## 🔧 Installation

1. Cloner le repo
2. Copier `.env.example` vers `.env`
3. Configurer les variables d'environnement
4. Lancer `npm install`
5. Lancer `npm run dev`

## 📖 Documentation

Lien vers la documentation complète.

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT
```

### Badges

```markdown
![Build Status](https://github.com/user/repo/workflows/CI/badge.svg)
![npm version](https://img.shields.io/npm/v/package)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

---

## Commentaires dans le code

### Quand commenter ?

```javascript
// ❌ Commentaire inutile - le code est évident
// Incrémente i
i++;

// ❌ Commentaire redondant
// Retourne l'utilisateur
return user;

// ✅ Explique le POURQUOI
// On utilise 1000ms car l'API rate-limite à 1 req/sec
await delay(1000);

// ✅ Avertit d'un piège
// ATTENTION: Cette fonction modifie l'objet original
function normalize(data) { ... }

// ✅ Référence externe
// Voir RFC 7231 section 6.5.4 pour les codes d'erreur
```

### Types de commentaires utiles

#### TODO / FIXME / HACK

```javascript
// TODO: Implémenter la pagination
// FIXME: Cette requête est lente avec > 1000 items
// HACK: Workaround pour le bug de Safari 14
// NOTE: Cette valeur vient du design system
```

#### Documentation d'edge cases

```javascript
// Les emails avec '+' sont valides (user+tag@example.com)
// mais certains services les rejettent, donc on les accepte
// mais on affiche un warning
if (email.includes('+')) {
  showWarning('Certains services n\'acceptent pas ce format');
}
```

#### Décisions d'architecture

```javascript
// On utilise une Map au lieu d'un Object car :
// 1. Les clés peuvent être n'importe quel type
// 2. L'ordre d'insertion est garanti
// 3. .size est O(1) vs Object.keys().length O(n)
const cache = new Map();
```

---

## JSDoc / TSDoc

Documentation structurée pour les fonctions et classes.

### Syntaxe de base

```javascript
/**
 * Calcule le prix total avec les taxes.
 * 
 * @param {number} price - Le prix hors taxes
 * @param {number} taxRate - Le taux de taxe (ex: 0.2 pour 20%)
 * @returns {number} Le prix TTC arrondi à 2 décimales
 * 
 * @example
 * calculateTotal(100, 0.2) // 120.00
 */
function calculateTotal(price, taxRate) {
  return Math.round((price * (1 + taxRate)) * 100) / 100;
}
```

### Avec TypeScript

```typescript
/**
 * Options de configuration pour le client API.
 */
interface ApiClientOptions {
  /** URL de base de l'API */
  baseUrl: string;
  /** Timeout en millisecondes (défaut: 5000) */
  timeout?: number;
  /** Headers personnalisés */
  headers?: Record<string, string>;
}

/**
 * Client HTTP pour communiquer avec l'API.
 * 
 * @example
 * const client = new ApiClient({ baseUrl: 'https://api.example.com' });
 * const users = await client.get('/users');
 */
class ApiClient {
  /**
   * Crée une nouvelle instance du client.
   * @param options - Configuration du client
   */
  constructor(private options: ApiClientOptions) {}
  
  /**
   * Effectue une requête GET.
   * @param path - Le chemin de l'endpoint (ex: '/users')
   * @returns Les données de la réponse
   * @throws {ApiError} Si la requête échoue
   */
  async get<T>(path: string): Promise<T> {
    // ...
  }
}
```

### Tags utiles

| Tag | Usage |
|-----|-------|
| `@param` | Paramètre de fonction |
| `@returns` | Valeur de retour |
| `@throws` | Exception possible |
| `@example` | Exemple d'utilisation |
| `@deprecated` | Marquer comme déprécié |
| `@see` | Référence à autre chose |
| `@since` | Version d'introduction |
| `@default` | Valeur par défaut |

---

## Documentation d'API

### Format OpenAPI / Swagger

```yaml
openapi: 3.0.0
info:
  title: Mon API
  version: 1.0.0

paths:
  /users:
    get:
      summary: Liste tous les utilisateurs
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Liste des utilisateurs
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

### Documentation inline (Express)

```javascript
/**
 * @api {get} /users Liste des utilisateurs
 * @apiName GetUsers
 * @apiGroup Users
 * 
 * @apiQuery {Number} [page=1] Numéro de page
 * @apiQuery {Number} [limit=20] Nombre par page
 * 
 * @apiSuccess {Object[]} users Liste des utilisateurs
 * @apiSuccess {String} users.id ID unique
 * @apiSuccess {String} users.email Email de l'utilisateur
 */
app.get('/users', (req, res) => { ... });
```

---

## Architecture et décisions

### ADR (Architecture Decision Records)

Documenter les décisions importantes :

```markdown
# ADR-001: Utiliser PostgreSQL pour la base de données

## Statut
Accepté

## Contexte
Nous devons choisir une base de données pour l'application.
Options considérées : PostgreSQL, MySQL, MongoDB

## Décision
Nous utilisons PostgreSQL.

## Raisons
- Support JSON natif pour la flexibilité
- Excellentes performances pour les requêtes complexes
- Équipe déjà expérimentée
- Écosystème mature (extensions, outils)

## Conséquences
- Formation non nécessaire
- Hosting légèrement plus cher que MySQL
- Besoin d'un backup strategy (pg_dump)
```

### Diagrammes

Utilisez Mermaid (supporté par GitHub/GitLab) :

```markdown
\`\`\`mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Order Service]
    D --> F[(PostgreSQL)]
    E --> G[(MongoDB)]
\`\`\`
```

---

## Structure de documentation

```
docs/
├── README.md              # Vue d'ensemble
├── getting-started.md     # Guide de démarrage
├── architecture.md        # Architecture globale
├── api/
│   ├── authentication.md  # Doc API auth
│   └── users.md           # Doc API users
├── guides/
│   ├── deployment.md      # Guide de déploiement
│   └── contributing.md    # Guide de contribution
└── adr/                   # Décisions d'architecture
    ├── 001-database.md
    └── 002-framework.md
```

---

## Outils de documentation

### Générateurs

| Outil | Usage |
|-------|-------|
| **Docusaurus** | Sites de documentation (React) |
| **VitePress** | Sites de documentation (Vue) |
| **TypeDoc** | API TypeScript |
| **Storybook** | Composants UI |
| **Swagger UI** | API REST |

### Dans l'IDE

```javascript
// VSCode affiche la doc au survol
/** 
 * Formate une date en français.
 * @param date - La date à formater
 * @returns La date formatée (ex: "15 janvier 2024")
 */
function formatDate(date: Date): string { ... }

// Utilisation - l'IDE affiche la doc
formatDate(new Date()) // 👈 Hover pour voir la doc
```

---

## Bonnes pratiques

### ✅ À faire

1. **Documenter le "pourquoi"**, pas le "quoi"
2. **Garder la doc à jour** (dans le même commit que le code)
3. **Utiliser des exemples concrets**
4. **Automatiser** la génération quand possible
5. **Versionner** la documentation avec le code

### ❌ À éviter

1. **Commentaires obsolètes** (pire que pas de commentaires)
2. **Paraphraser le code** (`i++ // incrémente i`)
3. **Doc trop longue** que personne ne lit
4. **Doc séparée du code** (se désynchronise vite)
5. **Jargon sans explication**

---

## Exercice

Documentez cette fonction :

```javascript
function process(data, opts) {
  const r = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].active && (!opts.filter || opts.filter(data[i]))) {
      r.push(opts.transform ? opts.transform(data[i]) : data[i]);
    }
  }
  return opts.limit ? r.slice(0, opts.limit) : r;
}
```

<details>
<summary>✅ Solution</summary>

```typescript
interface ProcessOptions<T, R> {
  /** Fonction de filtrage optionnelle */
  filter?: (item: T) => boolean;
  /** Fonction de transformation optionnelle */
  transform?: (item: T) => R;
  /** Limite le nombre de résultats */
  limit?: number;
}

/**
 * Filtre, transforme et limite une collection d'éléments actifs.
 * 
 * @param data - Tableau d'éléments avec une propriété `active`
 * @param options - Options de filtrage, transformation et limitation
 * @returns Les éléments actifs filtrés et transformés
 * 
 * @example
 * // Filtrer les utilisateurs actifs premium, récupérer leurs noms
 * const names = process(users, {
 *   filter: user => user.isPremium,
 *   transform: user => user.name,
 *   limit: 10
 * });
 */
function process<T extends { active: boolean }, R = T>(
  data: T[],
  options: ProcessOptions<T, R> = {}
): (T | R)[] {
  const { filter, transform, limit } = options;
  
  const results = data
    .filter(item => item.active && (!filter || filter(item)))
    .map(item => transform ? transform(item) : item);
  
  return limit ? results.slice(0, limit) : results;
}
```

</details>

---

## Ressources

- [Write the Docs](https://www.writethedocs.org/)
- [Documentation System](https://documentation.divio.com/) - Les 4 types de doc
- [JSDoc](https://jsdoc.app/)
- [TSDoc](https://tsdoc.org/)
