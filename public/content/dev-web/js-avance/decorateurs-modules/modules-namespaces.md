# Modules & Namespaces

## ES Modules en TypeScript

### Import et Export

```typescript
// user.ts - Export nommé
export interface User {
  id: number;
  name: string;
  email: string;
}

export function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email
  };
}

export const DEFAULT_ROLE = 'user';

// app.ts - Import nommé
import { User, createUser, DEFAULT_ROLE } from './user';

const user = createUser("Alice", "alice@example.com");
console.log(DEFAULT_ROLE);

// Export par défaut
// config.ts
export default {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

// app.ts
import config from './config';
console.log(config.apiUrl);

// Mélanger default et named exports
// utils.ts
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}

export function format(date: Date): string {
  return date.toISOString();
}

// app.ts
import Logger, { format } from './utils';

const logger = new Logger();
logger.log(format(new Date()));
```

### Re-exports

```typescript
// models/user.ts
export interface User {
  id: number;
  name: string;
}

// models/product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
}

// models/index.ts - Barrel export
export { User } from './user';
export { Product } from './product';
export * from './order'; // Re-exporter tout

// app.ts
import { User, Product } from './models';

// Re-export avec renommage
// models/index.ts
export { User as UserModel } from './user';
export { Product as ProductModel } from './product';

// Re-export avec modification
// models/index.ts
export { User } from './user';
export type { Product } from './product'; // Export uniquement le type
```

### Import Dynamique

```typescript
// Import dynamique (lazy loading)
async function loadModule() {
  const module = await import('./heavy-module');
  module.initialize();
}

// Avec condition
if (condition) {
  import('./admin-panel').then(module => {
    module.renderAdminPanel();
  });
}

// Type-safe dynamic import
interface UserModule {
  getUser: (id: number) => Promise<User>;
  createUser: (data: Partial<User>) => Promise<User>;
}

async function getUserModule(): Promise<UserModule> {
  return import('./user-module');
}

const userModule = await getUserModule();
const user = await userModule.getUser(1);
```

### Import Assertions

```typescript
// Import JSON
import data from './data.json' assert { type: 'json' };

// Import CSS (avec bundler approprié)
import styles from './styles.css' assert { type: 'css' };

// Import type only
import type { User } from './user';

// Importer uniquement les types, pas le runtime
import { type User, type Product, createOrder } from './models';
```

## Module Resolution

### Stratégies de Résolution

```json
// tsconfig.json
{
  "compilerOptions": {
    // Classic (déprécié)
    "moduleResolution": "classic",
    
    // Node (standard)
    "moduleResolution": "node",
    
    // NodeNext / Node16 (moderne)
    "moduleResolution": "nodenext"
  }
}
```

### Module Resolution Classic

```typescript
// Relative import
import { User } from './user';
// Cherche : ./user.ts, ./user.tsx, ./user.d.ts

// Non-relative import
import { User } from 'user';
// Cherche dans :
// 1. /root/user.ts
// 2. /root/user.d.ts
// 3. /user.ts
// 4. /user.d.ts
```

### Module Resolution Node

```typescript
// Relative import
import { User } from './user';
// Cherche :
// 1. ./user.ts
// 2. ./user.tsx
// 3. ./user.d.ts
// 4. ./user/package.json (champ "types")
// 5. ./user/index.ts

// Non-relative import
import { express } from 'express';
// Cherche dans node_modules :
// 1. /root/node_modules/express.ts
// 2. /root/node_modules/express.tsx
// 3. /root/node_modules/express.d.ts
// 4. /root/node_modules/express/package.json (champ "types")
// 5. /root/node_modules/express/index.d.ts
// 6. /root/node_modules/@types/express/...
```

### Path Mapping

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@/*": ["*"]
    }
  }
}
```

```typescript
// Avant
import { User } from '../../../models/user';
import { ApiService } from '../../services/api';

// Après
import { User } from '@models/user';
import { ApiService } from '@services/api';
```

### Root Dirs

```json
// tsconfig.json
{
  "compilerOptions": {
    "rootDirs": ["src", "generated"]
  }
}
```

```typescript
// TypeScript traite src/ et generated/ comme le même dossier
// src/app.ts
import { User } from './user'; // Peut venir de src/ ou generated/
```

## Namespaces

### Syntaxe de Base

```typescript
// Namespace simple
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }
  
  export function distance(p1: Point, p2: Point): number {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
    );
  }
  
  // Non exporté (privé au namespace)
  function helper() {
    // ...
  }
}

// Usage
const point1: Geometry.Point = { x: 0, y: 0 };
const point2: Geometry.Point = { x: 3, y: 4 };
const dist = Geometry.distance(point1, point2); // 5
```

### Namespaces Imbriqués

```typescript
namespace App {
  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
    
    export interface Product {
      id: number;
      title: string;
    }
  }
  
  export namespace Services {
    export class UserService {
      getUser(id: number): Models.User {
        return { id, name: "Alice" };
      }
    }
  }
}

// Usage
const user: App.Models.User = { id: 1, name: "Bob" };
const service = new App.Services.UserService();
```

### Namespace Aliases

```typescript
namespace LongNamespace {
  export namespace VeryLongSubNamespace {
    export interface MyType {
      value: string;
    }
  }
}

// Alias pour simplifier
import MyType = LongNamespace.VeryLongSubNamespace.MyType;

const obj: MyType = { value: "hello" };
```

### Merging Namespaces

```typescript
// Première déclaration
namespace Animals {
  export class Dog {
    bark() {}
  }
}

// Deuxième déclaration (merge)
namespace Animals {
  export class Cat {
    meow() {}
  }
}

// Les deux classes sont disponibles
const dog = new Animals.Dog();
const cat = new Animals.Cat();
```

## Namespaces vs Modules

### Quand Utiliser les Namespaces

```typescript
// ✅ Bon usage : Organiser les types globaux
declare namespace NodeJS {
  interface Global {
    myCustomProperty: string;
  }
}

// ✅ Bon usage : Augmenter les types de bibliothèques
declare namespace Express {
  interface Request {
    userId?: string;
  }
}

// ❌ Mauvais usage : Code applicatif (utiliser modules)
namespace MyApp {
  export class Service {
    // Préférer export class Service
  }
}
```

### Migration Namespace → Module

```typescript
// Avant (namespace)
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString();
  }
  
  export function parseDate(str: string): Date {
    return new Date(str);
  }
}

// Après (module)
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function parseDate(str: string): Date {
  return new Date(str);
}

// app.ts
import * as Utils from './utils';
// Ou
import { formatDate, parseDate } from './utils';
```

## Ambient Modules

### Declaration Files

```typescript
// types/custom.d.ts
declare module 'my-library' {
  export function myFunction(arg: string): number;
  export const myConstant: string;
  
  export interface MyInterface {
    prop: string;
  }
}

// app.ts
import { myFunction, MyInterface } from 'my-library';

const result = myFunction("test");
const obj: MyInterface = { prop: "value" };
```

### Wildcard Module Declarations

```typescript
// types/assets.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// app.ts
import styles from './styles.css';
import logo from './logo.png';
import config from './config.json';

console.log(styles.container);
console.log(logo); // Image path
console.log(config.apiUrl);
```

### Global Augmentation

```typescript
// types/global.d.ts
export {}; // Faire de ce fichier un module

declare global {
  interface Window {
    myAPI: {
      version: string;
      initialize(): void;
    };
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      DATABASE_URL: string;
    }
  }
}

// app.ts
window.myAPI.initialize();
const apiKey = process.env.API_KEY; // Type-safe
```

## Module Augmentation

### Augmenter des Modules Existants

```typescript
// Augmenter Express
import { Request } from 'express';

declare module 'express' {
  interface Request {
    userId?: string;
    currentUser?: User;
  }
}

// Maintenant disponible
app.get('/api/user', (req, res) => {
  console.log(req.userId); // ✅ Type-safe
  console.log(req.currentUser); // ✅ Type-safe
});

// Augmenter une bibliothèque
declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: number;
    retryDelay?: number;
  }
}

import axios from 'axios';

axios.get('/api/data', {
  retry: 3,
  retryDelay: 1000
});
```

### Module Plugin Pattern

```typescript
// Définir une interface plugin
export interface Plugin {
  name: string;
  initialize(): void;
}

// Permettre l'augmentation
declare module './plugin-system' {
  interface RegisteredPlugins {
    // Les plugins vont s'enregistrer ici
  }
}

// Plugin 1
declare module './plugin-system' {
  interface RegisteredPlugins {
    logger: LoggerPlugin;
  }
}

// Plugin 2
declare module './plugin-system' {
  interface RegisteredPlugins {
    cache: CachePlugin;
  }
}

// Usage type-safe
const plugins: RegisteredPlugins = {
  logger: new LoggerPlugin(),
  cache: new CachePlugin()
};
```

## UMD et Module Formats

### Différents Formats

```typescript
// CommonJS
module.exports = { myFunction };
const lib = require('my-library');

// AMD
define(['dependency'], function(dep) {
  return { myFunction };
});

// UMD (Universal Module Definition)
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['dependency'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('dependency'));
  } else {
    // Global
    root.MyLibrary = factory(root.dependency);
  }
}(this, function (dependency) {
  return { myFunction };
}));
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs", // CommonJS
    "module": "es2015",   // ES Modules
    "module": "esnext",   // Latest ES Modules
    "module": "umd",      // UMD
    "module": "amd",      // AMD
    "module": "system",   // SystemJS
    "module": "nodenext"  // Node16+
  }
}
```

## Exercices Pratiques

### Exercice 1 : Module System avec Plugins

```typescript
// plugin-system.ts
export interface Plugin {
  name: string;
  version: string;
  initialize(): void;
  execute(): void;
}

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    plugin.initialize();
  }
  
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
  
  executeAll(): void {
    this.plugins.forEach(plugin => plugin.execute());
  }
}

// logger-plugin.ts
import { Plugin } from './plugin-system';

export class LoggerPlugin implements Plugin {
  name = 'logger';
  version = '1.0.0';
  
  initialize(): void {
    console.log('Logger plugin initialized');
  }
  
  execute(): void {
    console.log('Logger plugin executing');
  }
}

// app.ts
import { PluginManager } from './plugin-system';
import { LoggerPlugin } from './logger-plugin';

const manager = new PluginManager();
manager.register(new LoggerPlugin());
manager.executeAll();
```

### Exercice 2 : Type-Safe Event System

```typescript
// events.ts
export interface EventMap {
  // Les modules peuvent augmenter cette interface
}

export class EventEmitter<T extends EventMap = EventMap> {
  private listeners = new Map<keyof T, Set<Function>>();
  
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// user-events.ts
declare module './events' {
  interface EventMap {
    'user:login': { userId: string; timestamp: Date };
    'user:logout': { userId: string };
  }
}

// product-events.ts
declare module './events' {
  interface EventMap {
    'product:created': { productId: string; name: string };
    'product:updated': { productId: string; changes: any };
  }
}

// app.ts
import { EventEmitter } from './events';
import './user-events';
import './product-events';

const emitter = new EventEmitter();

// Type-safe events
emitter.on('user:login', (data) => {
  console.log(data.userId, data.timestamp);
});

emitter.on('product:created', (data) => {
  console.log(data.productId, data.name);
});

emitter.emit('user:login', {
  userId: "123",
  timestamp: new Date()
});
```

### Exercice 3 : Lazy Loading avec Dynamic Imports

```typescript
// Feature loader
interface Feature {
  name: string;
  load(): Promise<void>;
  unload(): void;
}

class FeatureLoader {
  private loadedFeatures = new Map<string, Feature>();
  
  async loadFeature(name: string, path: string): Promise<void> {
    if (this.loadedFeatures.has(name)) {
      console.log(`Feature ${name} already loaded`);
      return;
    }
    
    console.log(`Loading feature ${name}...`);
    const module = await import(path);
    const feature: Feature = new module.default();
    
    await feature.load();
    this.loadedFeatures.set(name, feature);
    console.log(`Feature ${name} loaded`);
  }
  
  unloadFeature(name: string): void {
    const feature = this.loadedFeatures.get(name);
    if (feature) {
      feature.unload();
      this.loadedFeatures.delete(name);
      console.log(`Feature ${name} unloaded`);
    }
  }
  
  isLoaded(name: string): boolean {
    return this.loadedFeatures.has(name);
  }
}

// admin-feature.ts
export default class AdminFeature implements Feature {
  name = 'admin';
  
  async load(): Promise<void> {
    console.log('Loading admin panel...');
    // Load admin UI components
  }
  
  unload(): void {
    console.log('Unloading admin panel...');
    // Clean up
  }
}

// app.ts
const loader = new FeatureLoader();

// Load feature on demand
if (user.isAdmin) {
  await loader.loadFeature('admin', './admin-feature');
}
```

## Patterns Avancés

### Facade Pattern avec Modules

```typescript
// database/connection.ts
export class DatabaseConnection {
  connect() {}
  disconnect() {}
}

// database/query-builder.ts
export class QueryBuilder {
  select() {}
  where() {}
}

// database/migration.ts
export class MigrationRunner {
  run() {}
  rollback() {}
}

// database/index.ts - Facade
export { DatabaseConnection } from './connection';
export { QueryBuilder } from './query-builder';
export { MigrationRunner } from './migration';

// API simplifiée
export class Database {
  constructor(
    private connection: DatabaseConnection,
    private queryBuilder: QueryBuilder,
    private migrationRunner: MigrationRunner
  ) {}
  
  async query(sql: string) {
    await this.connection.connect();
    return this.queryBuilder.select();
  }
}

// app.ts
import { Database } from './database';
```

### Singleton Module Pattern

```typescript
// config.ts
class Config {
  private static instance: Config;
  private settings: Record<string, any> = {};
  
  private constructor() {
    // Load config
  }
  
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
  
  get(key: string): any {
    return this.settings[key];
  }
  
  set(key: string, value: any): void {
    this.settings[key] = value;
  }
}

export default Config.getInstance();

// app.ts
import config from './config';
config.set('apiUrl', 'https://api.example.com');
```

## Résumé

**ES Modules :**
- `import`/`export` pour modules ES6
- Default et named exports
- Re-exports et barrel files
- Dynamic imports pour lazy loading

**Module Resolution :**
- Stratégies : classic, node, nodenext
- Path mapping avec `baseUrl` et `paths`
- Root directories

**Namespaces :**
- Organisation hiérarchique
- Namespaces imbriqués et aliases
- Merging de namespaces
- ⚠️ Préférer modules pour code applicatif

**Ambient Modules :**
- Declaration files (`.d.ts`)
- Wildcard modules (`*.css`, `*.png`)
- Global augmentation

**Module Augmentation :**
- Étendre modules existants
- Plugin pattern type-safe
- Interface augmentation

**Formats de Module :**
- CommonJS, AMD, UMD, ES Modules
- Configuration dans `tsconfig.json`
- Compatibilité Node.js

**Patterns :**
- Plugin system
- Facade pattern
- Singleton module
- Lazy loading avec dynamic imports

Les modules sont essentiels pour structurer une application TypeScript. Dans le chapitre suivant, nous explorerons la **Configuration Avancée**.