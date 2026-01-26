# NPM & Gestion des Packages

## Introduction à NPM

**NPM (Node Package Manager)** est le gestionnaire de packages par défaut de Node.js. Il permet d'installer, partager et gérer les dépendances de vos projets JavaScript.

### Qu'est-ce qu'un Package ?

Un **package** (ou module) est un répertoire contenant du code JavaScript réutilisable, généralement distribué via le registre npm.

```javascript
// Exemple d'utilisation d'un package
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Le Registre NPM

- **[npmjs.com](https://www.npmjs.com/)** : Registre public contenant plus de 2 millions de packages
- Packages open-source gratuits
- Possibilité d'héberger des registres privés

## Initialisation d'un Projet

### Créer un package.json

```bash
# Création interactive
npm init

# Création avec valeurs par défaut
npm init -y

# Création avec Yarn
yarn init

# Création avec pnpm
pnpm init
```

**Exemple de `package.json` :**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My awesome application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": ["node", "express"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

### Champs Importants

```json
{
  "name": "package-name",           // Nom unique (obligatoire)
  "version": "1.0.0",               // Version semver (obligatoire)
  "description": "Description",     // Description du package
  "main": "index.js",               // Point d'entrée principal
  "type": "module",                 // "module" pour ES Modules, "commonjs" par défaut
  "scripts": {},                    // Scripts npm
  "keywords": [],                   // Mots-clés pour recherche npm
  "author": "Name <email>",         // Auteur
  "license": "MIT",                 // Licence
  "repository": {                   // Dépôt Git
    "type": "git",
    "url": "https://github.com/user/repo.git"
  },
  "bugs": {                         // Tracking des bugs
    "url": "https://github.com/user/repo/issues"
  },
  "homepage": "https://myproject.com",
  "engines": {                      // Versions Node.js/npm requises
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "private": true                   // Empêcher publication accidentelle
}
```

## Installation de Packages

### Installation Locale (Projet)

```bash
# Installer une dépendance de production
npm install express
npm i express  # Raccourci

# Installer plusieurs packages
npm install express body-parser cors

# Installer une dépendance de développement
npm install --save-dev nodemon
npm i -D nodemon  # Raccourci

# Installer une version spécifique
npm install express@4.18.2

# Installer depuis une URL Git
npm install https://github.com/user/repo.git

# Installer depuis un dossier local
npm install ../my-local-package
```

### Installation Globale

```bash
# Installer globalement
npm install -g typescript
npm i -g nodemon

# Lister les packages globaux
npm list -g --depth=0

# Désinstaller globalement
npm uninstall -g typescript
```

### Types de Dépendances

**1. dependencies (Production) :**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1"
  }
}
```

Packages nécessaires pour l'exécution de l'application.

**2. devDependencies (Développement) :**

```json
{
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

Packages utilisés uniquement en développement (tests, build, linting).

**3. peerDependencies :**

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

Indique que votre package nécessite que l'utilisateur ait installé ces dépendances.

**4. optionalDependencies :**

```json
{
  "optionalDependencies": {
    "fsevents": "^2.3.3"
  }
}
```

Dépendances optionnelles (l'installation continue si elles échouent).

**5. bundledDependencies :**

```json
{
  "bundledDependencies": [
    "custom-package"
  ]
}
```

Packages inclus dans le tarball lors de la publication.

## Gestion des Versions (Semver)

### Semantic Versioning

Format : `MAJOR.MINOR.PATCH` (ex: `2.4.1`)

- **MAJOR** : Changements non compatibles (breaking changes)
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

### Préfixes de Version

```json
{
  "dependencies": {
    "express": "4.18.2",      // Version exacte
    "lodash": "^4.17.21",     // Compatible (>=4.17.21 <5.0.0)
    "axios": "~1.6.0",        // Patch uniquement (>=1.6.0 <1.7.0)
    "moment": "*",            // Dernière version (déconseillé)
    "react": ">=16.8.0",      // Version minimum
    "vue": "3.x",             // Range 3.x
    "typescript": "latest"    // Dernière version
  }
}
```

**Exemples de `^` (caret) :**

```json
"^1.2.3"  // >=1.2.3 <2.0.0
"^0.2.3"  // >=0.2.3 <0.3.0
"^0.0.3"  // >=0.0.3 <0.0.4
```

**Exemples de `~` (tilde) :**

```json
"~1.2.3"  // >=1.2.3 <1.3.0
"~1.2"    // >=1.2.0 <1.3.0
"~1"      // >=1.0.0 <2.0.0
```

### Mettre à Jour les Packages

```bash
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour tous les packages (respecte semver dans package.json)
npm update

# Mettre à jour un package spécifique
npm update express

# Mettre à jour vers la dernière version (ignore semver)
npm install express@latest

# Avec npm-check-updates (ncu)
npm install -g npm-check-updates
ncu                     # Vérifier les mises à jour
ncu -u                  # Mettre à jour package.json
npm install             # Installer les nouvelles versions
```

## Scripts NPM

### Définir des Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "webpack --mode production",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write 'src/**/*.{js,json}'",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "postbuild": "npm run test"
  }
}
```

### Exécuter des Scripts

```bash
# Scripts standards (sans "run")
npm start
npm test
npm stop
npm restart

# Scripts personnalisés (avec "run")
npm run dev
npm run build
npm run lint

# Passer des arguments
npm run test -- --coverage
npm run build -- --watch

# Exécuter plusieurs scripts en parallèle
npm run dev & npm run watch

# Avec npm-run-all
npm install -g npm-run-all
npm-run-all --parallel dev watch
```

### Hooks de Scripts

```json
{
  "scripts": {
    "prebuild": "npm run lint",      // Avant build
    "build": "webpack",
    "postbuild": "npm run test",     // Après build
    
    "preinstall": "echo 'Installing...'",
    "install": "node setup.js",
    "postinstall": "npm run build",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run coverage"
  }
}
```

### Scripts Système

```json
{
  "scripts": {
    "clean:unix": "rm -rf dist",
    "clean:win": "rmdir /s /q dist",
    "clean": "node -e \"require('fs').rmSync('dist', {recursive:true, force:true})\"",
    
    "copy:unix": "cp -r src dist",
    "copy:win": "xcopy /E /I src dist",
    "copy": "cpx 'src/**/*' dist"
  }
}
```

## package-lock.json

### Rôle du Lockfile

`package-lock.json` enregistre les **versions exactes** de toutes les dépendances installées (y compris les dépendances transitives).

**Avantages :**

- Installations reproductibles
- Sécurité (versions vérifiées)
- Performances (résolution plus rapide)

**Exemple :**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "my-app",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.2"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "body-parser": "1.20.1",
        "cookie": "0.5.0"
      }
    }
  }
}
```

### Commandes Lockfile

```bash
# Générer/mettre à jour le lockfile
npm install

# Installer exactement ce qui est dans le lockfile
npm ci

# Mettre à jour le lockfile sans installer
npm install --package-lock-only

# Supprimer et régénérer
rm package-lock.json
npm install
```

## NPM Workspaces (Monorepo)

### Configuration

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**Structure :**

```
my-monorepo/
├── package.json
├── package-lock.json
├── packages/
│   ├── core/
│   │   └── package.json
│   └── utils/
│       └── package.json
└── apps/
    └── web/
        └── package.json
```

### Commandes Workspace

```bash
# Installer toutes les dépendances
npm install

# Installer une dépendance dans un workspace spécifique
npm install express --workspace=packages/core

# Exécuter un script dans un workspace
npm run test --workspace=packages/core

# Exécuter dans tous les workspaces
npm run test --workspaces

# Lister les workspaces
npm ls --workspaces
```

### Dépendances entre Workspaces

```json
// packages/web/package.json
{
  "name": "@myapp/web",
  "dependencies": {
    "@myapp/core": "^1.0.0",      // Référence workspace
    "express": "^4.18.2"
  }
}
```

## Alternatives à NPM

### Yarn

```bash
# Installer Yarn
npm install -g yarn

# Commandes équivalentes
yarn                    # = npm install
yarn add express        # = npm install express
yarn add -D jest        # = npm install -D jest
yarn remove express     # = npm uninstall express
yarn upgrade            # = npm update

# Scripts
yarn start              # = npm start
yarn test               # = npm test
yarn run build          # = npm run build
```

**Avantages de Yarn :**

- Plus rapide (parallélisation)
- yarn.lock plus déterministe
- Workspaces (avant npm)
- Commandes plus concises

### pnpm

```bash
# Installer pnpm
npm install -g pnpm

# Commandes équivalentes
pnpm install            # = npm install
pnpm add express        # = npm install express
pnpm add -D jest        # = npm install -D jest
pnpm remove express     # = npm uninstall express

# Scripts
pnpm start              # = npm start
pnpm test               # = npm test
pnpm run build          # = npm run build
```

**Avantages de pnpm :**

- **Très rapide** (hardlinks, pas de duplication)
- **Économise l'espace disque** (store global)
- **Strict** (pas d'accès aux dépendances non déclarées)
- Compatible avec npm

### Comparaison

| Fonctionnalité | npm | Yarn | pnpm |
|---|---|---|---|
| Vitesse | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Espace disque | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Workspaces | ✅ | ✅ | ✅ |
| Lockfile | ✅ | ✅ | ✅ |
| Communauté | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

## Sécurité et Audit

### Audit de Sécurité

```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Corriger avec breaking changes
npm audit fix --force

# Audit au format JSON
npm audit --json

# Ignorer certaines vulnérabilités
npm audit --audit-level=high  # Ignore low/moderate
```

### Fichier .npmrc pour Sécurité

```ini
# .npmrc
# Vérifier les signatures des packages
audit=true

# Ne pas accepter les vulnérabilités modérées/hautes
audit-level=moderate

# Exiger HTTPS
strict-ssl=true
```

### Vérifier les Packages

```bash
# Informations sur un package
npm view express

# Voir toutes les versions
npm view express versions

# Voir le dépôt
npm repo express

# Voir la documentation
npm docs express

# Chercher des packages
npm search "http server"
```

## Publier un Package

### Préparation

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "description": "An awesome package",
  "main": "index.js",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": ["awesome", "package"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  }
}
```

### Fichier .npmignore

```
# .npmignore
node_modules
.git
.env
tests
*.test.js
*.spec.js
coverage
.vscode
.idea
```

### Commandes de Publication

```bash
# Créer un compte npm
npm adduser

# Se connecter
npm login

# Vérifier l'identité
npm whoami

# Test de publication (dry-run)
npm publish --dry-run

# Publier
npm publish

# Publier avec tag
npm publish --tag beta

# Dépublier (dans les 72h)
npm unpublish my-package@1.0.0

# Déprécier une version
npm deprecate my-package@1.0.0 "Please use 2.0.0"
```

### Versioning Automatique

```bash
# Incrémenter la version
npm version patch    # 1.0.0 -> 1.0.1
npm version minor    # 1.0.0 -> 1.1.0
npm version major    # 1.0.0 -> 2.0.0

# Avec commit et tag Git automatique
npm version patch -m "Release v%s"
```

## Optimisation et Bonnes Pratiques

### Cache NPM

```bash
# Nettoyer le cache
npm cache clean --force

# Vérifier l'intégrité
npm cache verify

# Voir la taille du cache
du -sh ~/.npm

# Désactiver le cache (déconseillé)
npm install --no-cache
```

### Installation Rapide

```bash
# Installer en mode CI (plus rapide)
npm ci

# Installer uniquement les dépendances de production
npm install --production
npm install --omit=dev

# Installer sans générer le lockfile
npm install --no-save

# Installer avec pnpm (recommandé pour rapidité)
pnpm install
```

### .npmrc Optimisé

```ini
# Performances
cache-min=9999999
package-lock=true
prefer-offline=true
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000

# Sécurité
audit=true
audit-level=moderate

# Logs
loglevel=error
progress=false
```

### Ignorer les Scripts Postinstall

```bash
# Ignorer les scripts (plus rapide, mais attention)
npm install --ignore-scripts
```

## Troubleshooting

### Problèmes Courants

**1. Erreur EACCES (permissions) :**

```bash
# Changer le répertoire npm global
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**2. Erreur de checksum :**

```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**3. Dépendances en conflit :**

```bash
# Forcer l'installation
npm install --legacy-peer-deps

# Ou avec --force
npm install --force
```

**4. Lockfile corrompu :**

```bash
rm package-lock.json
npm install
```

**5. Module non trouvé :**

```bash
# Réinstaller
rm -rf node_modules
npm install

# Vérifier le module
npm ls <package-name>
```

### Debug

```bash
# Mode verbose
npm install --verbose

# Logs détaillés
npm install --loglevel=silly

# Voir le cache
npm config get cache

# Voir la configuration
npm config list
npm config list -l
```

## Résumé

**NPM Basics :**
- `npm init` : Initialiser un projet
- `npm install` : Installer les dépendances
- `npm install <package>` : Installer un package
- `package.json` : Manifest du projet

**Scripts :**
- Définir dans `"scripts": {}`
- Exécuter avec `npm run <script>`
- Hooks : pre/post scripts

**Lockfile :**
- `package-lock.json` : Versions exactes
- `npm ci` : Installation reproductible
- Commit dans Git

**Sécurité :**
- `npm audit` : Vérifier les vulnérabilités
- `npm audit fix` : Corriger automatiquement
- Vérifier les packages avant installation

**Alternatives :**
- **Yarn** : Plus rapide que npm
- **pnpm** : Très rapide, économe en espace

**Publication :**
- `npm publish` : Publier un package
- Semantic versioning
- .npmignore pour exclure fichiers

**Optimisation :**
- `npm ci` pour CI/CD
- `--production` pour production
- pnpm pour économiser de l'espace

NPM est l'outil central de l'écosystème Node.js. Dans le chapitre suivant, nous verrons comment **structurer un projet Node.js**.