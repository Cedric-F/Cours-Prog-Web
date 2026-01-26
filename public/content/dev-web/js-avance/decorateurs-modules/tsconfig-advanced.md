# Configuration Avancée TypeScript

## tsconfig.json Détaillé

### Structure de Base

```json
{
  "compilerOptions": {
    // Options de compilation
  },
  "include": [
    // Fichiers à inclure
  ],
  "exclude": [
    // Fichiers à exclure
  ],
  "extends": "./base-config.json",
  "files": [
    // Fichiers spécifiques
  ],
  "references": [
    // Project references
  ]
}
```

### Compiler Options Essentielles

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",                    // Version JS cible
    "lib": ["ES2022", "DOM"],             // Bibliothèques disponibles
    "experimentalDecorators": true,        // Support décorateurs
    "emitDecoratorMetadata": true,         // Métadonnées décorateurs
    "jsx": "react-jsx",                    // Mode JSX
    
    /* Modules */
    "module": "commonjs",                  // Système de modules
    "moduleResolution": "node",            // Stratégie de résolution
    "baseUrl": "./",                       // Base pour paths
    "paths": {                             // Alias de chemins
      "@/*": ["src/*"],
      "@models/*": ["src/models/*"]
    },
    "rootDirs": ["src", "generated"],      // Dossiers racine
    "resolveJsonModule": true,             // Importer JSON
    "allowSyntheticDefaultImports": true,  // Import default synthétique
    "esModuleInterop": true,               // Interop ES/CommonJS
    
    /* Emit */
    "outDir": "./dist",                    // Dossier de sortie
    "rootDir": "./src",                    // Dossier source
    "declaration": true,                   // Générer .d.ts
    "declarationMap": true,                // Sourcemaps pour .d.ts
    "sourceMap": true,                     // Générer sourcemaps
    "removeComments": true,                // Retirer commentaires
    "importHelpers": true,                 // Importer helpers tslib
    "downlevelIteration": true,            // Itérateurs ES5
    
    /* Interop Constraints */
    "isolatedModules": true,               // Chaque fichier = module
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    /* Type Checking */
    "strict": true,                        // Mode strict
    "noImplicitAny": true,                 // Pas de any implicite
    "strictNullChecks": true,              // Vérification null/undefined
    "strictFunctionTypes": true,           // Types fonction stricts
    "strictBindCallApply": true,           // bind/call/apply stricts
    "strictPropertyInitialization": true,  // Init propriétés requise
    "noImplicitThis": true,                // Pas de this implicite
    "alwaysStrict": true,                  // "use strict" partout
    "noUnusedLocals": true,                // Erreur sur variables inutilisées
    "noUnusedParameters": true,            // Erreur sur params inutilisés
    "noImplicitReturns": true,             // Retours explicites requis
    "noFallthroughCasesInSwitch": true,    // Pas de fallthrough
    
    /* Advanced */
    "skipLibCheck": true,                  // Skip check .d.ts
    "allowUnreachableCode": false,         // Erreur code inaccessible
    "allowUnusedLabels": false             // Erreur labels inutilisés
  }
}
```

## Options de Compilation Avancées

### Target et Lib

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": [
      "ES2022",           // Features JS ES2022
      "DOM",              // APIs DOM
      "DOM.Iterable",     // DOM iterables
      "WebWorker",        // Web Workers
      "ScriptHost"        // Windows Script Host
    ]
  }
}
```

```typescript
// Avec "lib": ["ES2022"]
const obj = { a: 1, b: 2 };
const copy = { ...obj };                    // ✅ OK : Object spread
const arr = [1, 2, 3];
const includes = arr.includes(2);           // ✅ OK : Array.includes

// Avec "lib": ["DOM"]
const element = document.getElementById('app'); // ✅ OK
const xhr = new XMLHttpRequest();               // ✅ OK

// Sans "DOM"
// const element = document.getElementById('app'); // ❌ Erreur
```

### Module Options

```json
{
  "compilerOptions": {
    // Module system
    "module": "commonjs",      // CommonJS (Node.js)
    "module": "es2015",        // ES Modules
    "module": "esnext",        // Latest ES Modules
    "module": "umd",           // Universal Module Definition
    "module": "amd",           // Asynchronous Module Definition
    "module": "system",        // SystemJS
    "module": "nodenext",      // Node16+ (package.json "type")
    
    // Module resolution
    "moduleResolution": "node",    // Node.js style
    "moduleResolution": "classic", // TypeScript classic
    "moduleResolution": "nodenext" // Node16+ with package.json
  }
}
```

### Strict Mode Options

```json
{
  "compilerOptions": {
    // "strict": true équivaut à activer toutes ces options :
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

```typescript
// noImplicitAny
function log(message) {  // ❌ Erreur : 'message' has implicit any
  console.log(message);
}

function log(message: string) { // ✅ OK
  console.log(message);
}

// strictNullChecks
let name: string = null;  // ❌ Erreur avec strictNullChecks
let name: string | null = null; // ✅ OK

// strictPropertyInitialization
class User {
  name: string;  // ❌ Erreur : doit être initialisée
  age!: number;  // ✅ OK avec '!' (assertion)
  
  constructor() {
    this.name = ""; // ✅ OK si initialisée dans constructor
  }
}

// noImplicitThis
function fn() {
  return this.value;  // ❌ Erreur : 'this' implicite
}

function fn(this: { value: number }) { // ✅ OK
  return this.value;
}
```

## Project References

### Configuration Multi-Projets

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "composite": true,       // Requis pour project references
    "declaration": true,     // Requis pour project references
    "declarationMap": true
  }
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../core" }  // Référence à core
  ],
  "include": ["src/**/*"]
}

// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/app" }
  ]
}
```

### Build avec References

```bash
# Build tous les projets
tsc --build

# Build avec watch mode
tsc --build --watch

# Clean build outputs
tsc --build --clean

# Force rebuild
tsc --build --force

# Verbose output
tsc --build --verbose
```

```typescript
// packages/app/src/index.ts
import { CoreService } from '@packages/core'; // ✅ OK avec references

const service = new CoreService();
```

## Path Mapping Avancé

### Configuration

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      // Alias simples
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      
      // Multiple locations
      "@shared/*": [
        "shared/*",
        "../shared/*"
      ],
      
      // Fallback
      "*": [
        "node_modules/*",
        "types/*"
      ]
    }
  }
}
```

```typescript
// Avant
import { User } from '../../../models/user';
import { ApiService } from '../../services/api';
import { formatDate } from '../../../utils/date';

// Après
import { User } from '@models/user';
import { ApiService } from '@services/api';
import { formatDate } from '@utils/date';
```

### Avec Webpack/Vite

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
};

// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services')
    }
  }
});
```

## Declaration Files

### Générer des .d.ts

```json
{
  "compilerOptions": {
    "declaration": true,          // Générer .d.ts
    "declarationMap": true,       // Sourcemaps pour .d.ts
    "declarationDir": "./types",  // Dossier de sortie
    "emitDeclarationOnly": true   // Seulement .d.ts (pas de .js)
  }
}
```

```typescript
// src/user.ts
export interface User {
  id: number;
  name: string;
}

export function createUser(name: string): User {
  return { id: Date.now(), name };
}

// Génère dist/user.d.ts
export interface User {
  id: number;
  name: string;
}
export declare function createUser(name: string): User;
```

### Custom Declaration Files

```typescript
// types/global.d.ts
declare global {
  interface Window {
    myAPI: {
      version: string;
      init(): void;
    };
  }
  
  const API_URL: string;
}

export {};

// types/modules.d.ts
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'external-library' {
  export function doSomething(arg: string): number;
}
```

## Incremental Compilation

### Configuration

```json
{
  "compilerOptions": {
    "incremental": true,              // Activer mode incrémental
    "tsBuildInfoFile": "./.tsbuildinfo", // Fichier de cache
    "composite": true                 // Pour project references
  }
}
```

```bash
# First build (slower)
tsc

# Subsequent builds (faster - only changed files)
tsc

# Build info stored in .tsbuildinfo
# {
#   "program": {
#     "fileInfos": {...},
#     "options": {...},
#     "referencedMap": {...}
#   }
# }
```

## Type Acquisition

### Automatic Type Acquisition

```json
{
  "compilerOptions": {
    "types": [],                  // Types explicites
    "typeRoots": [                // Chemins des types
      "./node_modules/@types",
      "./types"
    ]
  }
}
```

```typescript
// Sans "types" spécifié : tous les @types/* sont inclus
import * as express from 'express'; // ✅ @types/express auto-inclus

// Avec "types": ["node", "express"] : seulement ceux-là
import * as express from 'express'; // ✅ OK
import * as jest from '@jest/globals'; // ❌ Erreur si pas dans "types"
```

### DefinitelyTyped

```bash
# Installer types pour bibliothèque
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/react

# Vérifier types disponibles
npm search @types/library-name
```

## Plugins et Language Service

### Compiler Plugins

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-css-modules"
      },
      {
        "name": "typescript-styled-plugin",
        "tags": ["styled", "css"]
      }
    ]
  }
}
```

### Language Service Plugins

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@typescript/eslint-plugin-tslint",
        "configFile": "./tslint.json"
      }
    ]
  }
}
```

## Watch Mode Options

### Configuration

```json
{
  "compilerOptions": {
    // ...
  },
  "watchOptions": {
    "watchFile": "useFsEvents",       // Strategy: useFsEvents, dynamicPriorityPolling, etc.
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": true,
    "excludeDirectories": ["**/node_modules", "dist"],
    "excludeFiles": ["**/*.spec.ts"]
  }
}
```

```bash
# Watch mode
tsc --watch

# Watch with project references
tsc --build --watch
```

## Configurations par Environnement

### Development

```json
// tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,
    "removeComments": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "incremental": true
  }
}
```

### Production

```json
// tsconfig.prod.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Test

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "node"],
    "esModuleInterop": true
  },
  "include": [
    "src/**/*.ts",
    "tests/**/*.ts",
    "**/*.spec.ts"
  ]
}
```

```bash
# Build avec config spécifique
tsc --project tsconfig.prod.json
```

## Exercices Pratiques

### Exercice 1 : Monorepo Configuration

```
my-monorepo/
├── tsconfig.base.json
├── tsconfig.json
├── packages/
│   ├── core/
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   ├── utils/
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   └── app/
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// packages/utils/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../core" }
  ],
  "include": ["src/**/*"]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../core" },
    { "path": "../utils" }
  ],
  "include": ["src/**/*"]
}

// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/app" }
  ]
}
```

### Exercice 2 : Configuration Full-Stack

```json
// Backend tsconfig
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "express"],
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@middleware/*": ["middleware/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}

// Frontend tsconfig
// frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Exercice 3 : Library Configuration

```json
// tsconfig.json (pour publier une bibliothèque)
{
  "compilerOptions": {
    "target": "ES2015",              // Compatible ancien navigateurs
    "module": "commonjs",            // CommonJS pour Node
    "declaration": true,             // Générer .d.ts
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "removeComments": true,
    "importHelpers": true            // Utiliser tslib
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}

// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",           // Entry point CommonJS
  "module": "dist/index.esm.js",     // Entry point ES Module
  "types": "dist/index.d.ts",        // Types
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tslib": "^2.5.0"
  }
}
```

## Optimisation de Build

### Faster Builds

```json
{
  "compilerOptions": {
    // Skip checking d.ts files
    "skipLibCheck": true,
    
    // Skip default lib checks
    "skipDefaultLibCheck": true,
    
    // Incremental compilation
    "incremental": true,
    
    // Faster module resolution
    "moduleResolution": "node",
    
    // Don't check all files
    "noEmit": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "**/*.spec.ts"
  ]
}
```

### Parallel Compilation

```bash
# Utiliser project references pour paralléliser
tsc --build --verbose

# Avec tool comme tsc-watch
npm install --save-dev tsc-watch
npx tsc-watch --onSuccess "node dist/index.js"
```

## Résumé

**tsconfig.json :**
- `compilerOptions` : Options de compilation
- `include`/`exclude` : Fichiers à traiter
- `extends` : Hériter d'une config
- `references` : Project references

**Options Clés :**
- `target` et `lib` : Version JavaScript et APIs
- `module` et `moduleResolution` : Système de modules
- `strict` : Mode strict (recommandé)
- `paths` : Alias de chemins

**Project References :**
- Monorepos et multi-projets
- `composite: true` requis
- Build incrémental
- `tsc --build`

**Path Mapping :**
- `baseUrl` et `paths`
- Simplifier imports
- Synchroniser avec bundler

**Declaration Files :**
- `.d.ts` pour types
- `declaration: true`
- Types customs et globals

**Optimisations :**
- `incremental: true`
- `skipLibCheck: true`
- Exclude node_modules
- Project references parallèles

**Multi-environnements :**
- Dev, prod, test configs
- `extends` pour réutilisation
- Scripts npm par environnement

**Plugins :**
- Language service plugins
- Compiler plugins
- Watch options

La configuration TypeScript est cruciale pour un projet performant et maintenable. Une bonne configuration améliore l'expérience développeur et la qualité du code.