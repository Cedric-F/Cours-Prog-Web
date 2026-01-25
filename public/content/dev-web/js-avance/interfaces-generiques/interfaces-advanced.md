# Interfaces Avancées

## Introduction aux Interfaces

Les **interfaces** en TypeScript définissent la structure des objets. Elles sont plus flexibles que les types et offrent des fonctionnalités uniques.

### Syntaxe de Base

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Propriétés optionnelles
interface Product {
  id: number;
  name: string;
  description?: string;  // Optionnelle
  price: number;
}

// Propriétés readonly
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

// config.apiUrl = "https://other.com"; // ❌ Erreur : readonly
```

### Interfaces vs Types

```typescript
// Interface
interface UserInterface {
  name: string;
  age: number;
}

// Type alias
type UserType = {
  name: string;
  age: number;
};

// Différences principales :

// 1. Extension
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark: () => void;
}

// Avec type alias (intersection)
type AnimalType = {
  name: string;
};

type DogType = AnimalType & {
  bark: () => void;
};

// 2. Declaration Merging (uniquement interfaces)
interface Window {
  customProperty: string;
}

interface Window {
  anotherProperty: number;
}

// Window a maintenant les deux propriétés
declare const window: Window;
window.customProperty; // ✅ OK
window.anotherProperty; // ✅ OK

// 3. Computed properties
type Keys = 'name' | 'age';
type UserComputed = {
  [K in Keys]: string; // ✅ OK avec type
};

// interface UserInterface {
//   [K in Keys]: string; // ❌ Erreur : pas supporté dans interface
// }

// 4. Union types
type Status = 'active' | 'inactive'; // ✅ OK avec type
// interface Status = 'active' | 'inactive'; // ❌ Erreur

// Recommandation : 
// - Interfaces pour les objets publics/bibliothèques (declaration merging)
// - Types pour les unions, intersections, computed properties
```

## Extension d'Interfaces

### Extension Simple

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

const employee: Employee = {
  name: "Alice",
  age: 30,
  employeeId: "E001",
  department: "Engineering"
};

// Extension multiple
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Trackable {
  version: number;
  lastModifiedBy: string;
}

interface Document extends Timestamped, Trackable {
  id: string;
  title: string;
  content: string;
}

const doc: Document = {
  id: "doc1",
  title: "My Document",
  content: "...",
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  lastModifiedBy: "Alice"
};
```

### Overriding lors de l'extension

```typescript
interface Base {
  id: string | number;
  name: string;
}

// Restreindre le type
interface Strict extends Base {
  id: string; // Plus restrictif que string | number
}

const strict: Strict = {
  id: "123",  // ✅ string seulement
  name: "Test"
};

// Étendre le type avec union
interface Extended extends Base {
  id: string | number | bigint; // Plus large
}

// ❌ Erreur : Impossible de rendre moins restrictif
// interface Invalid extends Base {
//   id: boolean; // ❌ boolean n'est pas assignable à string | number
// }
```

## Index Signatures

### Signatures d'Index Basiques

```typescript
// Clés string, valeurs any
interface Dictionary {
  [key: string]: any;
}

const dict: Dictionary = {
  name: "Alice",
  age: 30,
  isActive: true
};

// Clés string, valeurs typées
interface StringMap {
  [key: string]: string;
}

const stringMap: StringMap = {
  firstName: "Alice",
  lastName: "Smith"
};

// Clés number (arrays)
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ["a", "b", "c"];
console.log(arr[0]); // "a"

// Combinaison avec propriétés nommées
interface UserMap {
  [userId: string]: User;
  admin: User; // ✅ OK : User est assignable à User
}

const users: UserMap = {
  "user1": { id: 1, name: "Alice" },
  "user2": { id: 2, name: "Bob" },
  admin: { id: 0, name: "Admin" }
};
```

### Index Signatures avec Types Union

```typescript
// Valeurs peuvent être de plusieurs types
interface MixedMap {
  [key: string]: string | number | boolean;
}

const mixed: MixedMap = {
  name: "Alice",
  age: 30,
  isActive: true
};

// Propriétés nommées doivent être compatibles
interface Config {
  [key: string]: string | number;
  apiUrl: string;    // ✅ OK : string est dans l'union
  timeout: number;   // ✅ OK : number est dans l'union
  // debug: boolean; // ❌ Erreur : boolean n'est pas dans l'union
}
```

### Index Signatures Avancées

```typescript
// Avec template literal types
interface Events {
  [key: `on${string}`]: () => void;
}

const events: Events = {
  onClick: () => console.log("clicked"),
  onHover: () => console.log("hovered"),
  onFocus: () => console.log("focused")
  // name: () => {} // ❌ Erreur : ne commence pas par "on"
};

// Record comme alternative
type EventMap = Record<`on${string}`, () => void>;

// Avec union de clés
type AllowedKeys = 'name' | 'age' | 'email';
interface StrictDict {
  [K in AllowedKeys]: string;
}

const strict: StrictDict = {
  name: "Alice",
  age: "30",
  email: "alice@example.com"
};
```

## Declaration Merging

### Fusion d'Interfaces

```typescript
// Première déclaration
interface User {
  id: number;
  name: string;
}

// Deuxième déclaration (merge)
interface User {
  email: string;
  age?: number;
}

// User a maintenant toutes les propriétés
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 30 // Optionnel
};

// Utilisation pratique : Étendre les types globaux
interface Window {
  myCustomAPI: {
    version: string;
    initialize: () => void;
  };
}

// Maintenant accessible
window.myCustomAPI.version;
window.myCustomAPI.initialize();

// Étendre les types de bibliothèques
declare module 'express' {
  interface Request {
    userId?: string;
    customProperty?: any;
  }
}

// Dans votre code Express
app.get('/api/user', (req, res) => {
  const userId = req.userId; // ✅ TypeScript connaît userId
  res.json({ userId });
});
```

### Fusion avec Namespaces

```typescript
// Interface + Namespace
interface Album {
  label: string;
}

namespace Album {
  export class AlbumLabel {
    constructor(public name: string) {}
  }
}

const myAlbum: Album = { label: "My Album" };
const labelClass = new Album.AlbumLabel("Epic Records");

// Pratique pour grouper types et valeurs
interface User {
  id: number;
  name: string;
}

namespace User {
  export function create(name: string): User {
    return { id: Date.now(), name };
  }
  
  export function validate(user: User): boolean {
    return user.name.length > 0;
  }
}

const user = User.create("Alice");
const isValid = User.validate(user);
```

## Interfaces pour Fonctions

### Fonction Interface

```typescript
// Interface pour une fonction
interface SearchFunc {
  (query: string, options?: { limit?: number }): Promise<Result[]>;
}

const searchUsers: SearchFunc = async (query, options) => {
  // Implémentation
  return [];
};

// Interface avec propriétés ET callable
interface Logger {
  (message: string): void;
  level: 'info' | 'warn' | 'error';
  setLevel: (level: string) => void;
}

const logger = ((message: string) => {
  console.log(`[${logger.level}] ${message}`);
}) as Logger;

logger.level = 'info';
logger.setLevel = (level) => {
  logger.level = level as any;
};

logger("Hello"); // Appel comme fonction
logger.setLevel('warn'); // Utilisation comme objet
```

### Constructor Interfaces

```typescript
// Interface pour un constructeur
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

// Classe qui implémente le constructeur
class DigitalClock implements ClockInterface {
  constructor(hour: number, minute: number) {}
  tick() {
    console.log("beep beep");
  }
}

class AnalogClock implements ClockInterface {
  constructor(hour: number, minute: number) {}
  tick() {
    console.log("tick tock");
  }
}

// Factory function type-safe
function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

const digital = createClock(DigitalClock, 12, 17);
const analog = createClock(AnalogClock, 7, 32);
```

## Interfaces Génériques

### Interfaces avec Type Parameters

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

// Multiple type parameters
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const pair: KeyValuePair<string, number> = {
  key: "age",
  value: 30
};

// Avec contraintes
interface Lengthwise {
  length: number;
}

interface Container<T extends Lengthwise> {
  item: T;
  getLength: () => number;
}

const container: Container<string> = {
  item: "hello",
  getLength: () => container.item.length
};

const arrayContainer: Container<number[]> = {
  item: [1, 2, 3],
  getLength: () => arrayContainer.item.length
};

// const invalidContainer: Container<number> = { // ❌ Erreur : number n'a pas length
//   item: 42,
//   getLength: () => 0
// };
```

### Repository Pattern

```typescript
interface Entity {
  id: string | number;
}

interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: T['id']): Promise<void>;
}

interface User extends Entity {
  id: string;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implémentation
    return null;
  }
  
  async findAll(): Promise<User[]> {
    return [];
  }
  
  async save(user: User): Promise<User> {
    return user;
  }
  
  async delete(id: string): Promise<void> {
    // Implémentation
  }
}

const userRepo = new UserRepository();
const user = await userRepo.findById("123"); // Type: User | null
```

## Interfaces Conditionnelles

### Conditional Properties

```typescript
// Propriétés conditionnelles basées sur un flag
interface BaseConfig {
  environment: 'development' | 'production';
}

interface DevelopmentConfig extends BaseConfig {
  environment: 'development';
  debugMode: boolean;
  sourceMap: boolean;
}

interface ProductionConfig extends BaseConfig {
  environment: 'production';
  minify: boolean;
  cdn: string;
}

type Config = DevelopmentConfig | ProductionConfig;

function handleConfig(config: Config) {
  if (config.environment === 'development') {
    // TypeScript sait que config est DevelopmentConfig
    console.log(config.debugMode);
    console.log(config.sourceMap);
  } else {
    // TypeScript sait que config est ProductionConfig
    console.log(config.minify);
    console.log(config.cdn);
  }
}
```

### Discriminated Unions avec Interfaces

```typescript
interface Success {
  status: 'success';
  data: any;
}

interface Error {
  status: 'error';
  error: string;
  code: number;
}

interface Loading {
  status: 'loading';
}

type ApiResponse = Success | Error | Loading;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      // response est Success
      console.log(response.data);
      break;
    case 'error':
      // response est Error
      console.log(response.error, response.code);
      break;
    case 'loading':
      // response est Loading
      console.log('Loading...');
      break;
  }
}
```

## Exercices Pratiques

### Exercice 1 : Plugin System

```typescript
// Système de plugins type-safe
interface Plugin<T = any> {
  name: string;
  version: string;
  initialize: (config: T) => void;
  execute: () => void;
  cleanup: () => void;
}

interface PluginWithHooks<T = any> extends Plugin<T> {
  onBeforeExecute?: () => void;
  onAfterExecute?: () => void;
  onError?: (error: Error) => void;
}

// Configuration spécifique pour un plugin
interface LoggerPluginConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  outputFile?: string;
}

class LoggerPlugin implements PluginWithHooks<LoggerPluginConfig> {
  name = 'logger';
  version = '1.0.0';
  private config!: LoggerPluginConfig;
  
  initialize(config: LoggerPluginConfig) {
    this.config = config;
  }
  
  onBeforeExecute() {
    console.log(`[${this.config.level}] Starting...`);
  }
  
  execute() {
    console.log('Executing logger plugin');
  }
  
  onAfterExecute() {
    console.log('Logger plugin completed');
  }
  
  cleanup() {
    console.log('Cleaning up logger plugin');
  }
}

// Registry générique
interface PluginRegistry {
  [pluginName: string]: Plugin;
}

const registry: PluginRegistry = {
  logger: new LoggerPlugin()
};
```

### Exercice 2 : Event Bus Type-Safe

```typescript
// Event map avec types stricts
interface EventMap {
  'user:created': { userId: string; name: string };
  'user:updated': { userId: string; changes: Partial<User> };
  'user:deleted': { userId: string };
  'order:placed': { orderId: string; total: number };
}

interface EventBus {
  on<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ): void;
  
  off<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ): void;
  
  emit<K extends keyof EventMap>(
    event: K,
    data: EventMap[K]
  ): void;
}

class EventBusImpl implements EventBus {
  private listeners: {
    [K in keyof EventMap]?: Array<(data: EventMap[K]) => void>;
  } = {};
  
  on<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }
  
  off<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ) {
    const handlers = this.listeners[event];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// Utilisation type-safe
const bus = new EventBusImpl();

bus.on('user:created', (data) => {
  console.log(data.userId, data.name); // ✅ Types corrects
});

bus.emit('user:created', { userId: "123", name: "Alice" }); // ✅ OK
// bus.emit('user:created', { invalid: true }); // ❌ Erreur de type
```

### Exercice 3 : Builder Pattern

```typescript
// Builder pattern type-safe avec interfaces
interface QueryBuilder<T> {
  where(condition: Partial<T>): this;
  orderBy(field: keyof T, direction: 'asc' | 'desc'): this;
  limit(count: number): this;
  offset(count: number): this;
  execute(): Promise<T[]>;
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

class UserQueryBuilder implements QueryBuilder<User> {
  private conditions: Partial<User> = {};
  private orderField?: keyof User;
  private orderDirection?: 'asc' | 'desc';
  private limitCount?: number;
  private offsetCount?: number;
  
  where(condition: Partial<User>): this {
    this.conditions = { ...this.conditions, ...condition };
    return this;
  }
  
  orderBy(field: keyof User, direction: 'asc' | 'desc'): this {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }
  
  limit(count: number): this {
    this.limitCount = count;
    return this;
  }
  
  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }
  
  async execute(): Promise<User[]> {
    // Build and execute query
    console.log('Conditions:', this.conditions);
    console.log('Order:', this.orderField, this.orderDirection);
    console.log('Limit:', this.limitCount, 'Offset:', this.offsetCount);
    return [];
  }
}

// Utilisation fluide et type-safe
const users = await new UserQueryBuilder()
  .where({ age: 25 })
  .orderBy('name', 'asc')
  .limit(10)
  .execute();
```

## Patterns Avancés

### Mixin Pattern avec Interfaces

```typescript
// Mixins type-safe
type Constructor<T = {}> = new (...args: any[]) => T;

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

function Timestampable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Timestamped {
    createdAt = new Date();
    updatedAt = new Date();
    
    touch() {
      this.updatedAt = new Date();
    }
  };
}

interface Trackable {
  version: number;
  incrementVersion(): void;
}

function Versionable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Trackable {
    version = 1;
    
    incrementVersion() {
      this.version++;
    }
  };
}

// Base class
class Entity {
  constructor(public id: string) {}
}

// Appliquer les mixins
const TimestampedEntity = Timestampable(Entity);
const VersionedEntity = Versionable(TimestampedEntity);

const entity = new VersionedEntity("123");
console.log(entity.id);           // ✅ de Entity
console.log(entity.createdAt);    // ✅ de Timestamped
entity.touch();                    // ✅ de Timestamped
console.log(entity.version);       // ✅ de Trackable
entity.incrementVersion();         // ✅ de Trackable
```

### Interface Segregation

```typescript
// Principe SOLID : Interface Segregation
// Plutôt qu'une grosse interface :
interface BadRepository {
  find(): Promise<Entity[]>;
  findById(id: string): Promise<Entity | null>;
  save(entity: Entity): Promise<Entity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  exists(id: string): Promise<boolean>;
  // ... 20 autres méthodes
}

// Séparer en petites interfaces :
interface Readable<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface Writable<T> {
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface Queryable {
  count(): Promise<number>;
  exists(id: string): Promise<boolean>;
}

// Composer selon les besoins
interface Repository<T> extends Readable<T>, Writable<T>, Queryable {}

// Ou utiliser partiellement
class ReadOnlyRepository<T> implements Readable<T> {
  async findById(id: string): Promise<T | null> {
    return null;
  }
  
  async findAll(): Promise<T[]> {
    return [];
  }
}
```

## Résumé

**📋 Interfaces :**
- Définissent la structure des objets
- Extension avec `extends`
- Declaration merging unique aux interfaces
- Préférer pour les APIs publiques

**🆚 Interfaces vs Types :**
- Interfaces : extension, declaration merging, objets
- Types : unions, intersections, computed properties
- Choisir selon le cas d'usage

**🔑 Index Signatures :**
- `[key: string]: Type` pour dictionnaires
- Compatible avec propriétés nommées
- Template literal keys pour patterns

**🔀 Declaration Merging :**
- Fusionner plusieurs déclarations d'interface
- Étendre types globaux (Window, Request, etc.)
- Combiner avec namespaces

**🎯 Interfaces Génériques :**
- Type parameters avec `<T>`
- Contraintes avec `extends`
- Repository pattern, Builder pattern

**🏗️ Patterns Avancés :**
- Mixins avec interfaces
- Interface Segregation (SOLID)
- Discriminated unions
- Plugin systems

Les interfaces sont la fondation de la structuration des types en TypeScript. Dans le chapitre suivant, nous explorerons les **Génériques Fondamentaux**.