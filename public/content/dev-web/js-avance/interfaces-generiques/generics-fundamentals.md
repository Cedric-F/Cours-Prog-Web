# Génériques Fondamentaux

## Introduction aux Génériques

Les **génériques** (generics) permettent de créer des composants réutilisables qui fonctionnent avec plusieurs types au lieu d'un seul.

### Pourquoi les Génériques ?

```typescript
// Sans génériques : Code dupliqué
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// Avec any : Perte de type safety
function getFirstAny(arr: any[]): any {
  return arr[0];
}

const result = getFirstAny([1, 2, 3]); // Type: any (on perd l'information)

// Avec génériques : Réutilisable ET type-safe
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);        // Type: number
const str = getFirst(["a", "b", "c"]); // Type: string
const user = getFirst([{ name: "Alice" }]); // Type: { name: string }
```

### Syntaxe de Base

```typescript
// Fonction générique
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);           // T = number
const str = identity("hello");      // T = string
const obj = identity({ x: 10 });    // T = { x: number }

// Spécifier explicitement le type
const explicit = identity<string>("hello");

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair(1, "hello");        // [number, string]
const p2 = pair("a", true);         // [string, boolean]
const p3 = pair<string, number>("x", 10); // Explicit
```

## Fonctions Génériques

### Fonctions Simples

```typescript
// Reverse array
function reverse<T>(arr: T[]): T[] {
  return arr.reverse();
}

const nums = reverse([1, 2, 3]);    // number[]
const strs = reverse(["a", "b"]);   // string[]

// Filter function
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const adults = filter(
  [{ age: 15 }, { age: 25 }, { age: 30 }],
  (person) => person.age >= 18
); // { age: number }[]

// Map function
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const lengths = map(["hello", "world"], (str) => str.length); // number[]
const names = map([{ name: "Alice" }], (user) => user.name);  // string[]
```

### Fonctions avec Contraintes

```typescript
// Contrainte : T doit avoir une propriété length
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello");           // ✅ string a length
logLength([1, 2, 3]);         // ✅ array a length
logLength({ length: 10 });    // ✅ OK
// logLength(42);             // ❌ Erreur : number n'a pas length

// Contrainte sur keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name");  // Type: string
const age = getProperty(user, "age");    // Type: number
// const invalid = getProperty(user, "invalid"); // ❌ Erreur

// Multiple contraintes
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

function processEntity<T extends HasId & HasName>(entity: T): string {
  return `${entity.name} (ID: ${entity.id})`;
}

processEntity({ id: 1, name: "Alice", extra: true }); // ✅ OK
// processEntity({ id: 1 }); // ❌ Erreur : manque name
```

### Fonctions Génériques Avancées

```typescript
// Generic curry function
function curry<T, U, V>(fn: (a: T, b: U) => V) {
  return (a: T) => (b: U) => fn(a, b);
}

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
const result = add5(10); // 15

// Generic memoize
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveFunction = (n: number) => {
  console.log("Computing...");
  return n * n;
};

const memoized = memoize(expensiveFunction);
memoized(5); // "Computing..." => 25
memoized(5); // 25 (from cache)
```

## Classes Génériques

### Classes Simples

```typescript
// Généric stack
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");

// Généric queue
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  size(): number {
    return this.items.length;
  }
}

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
console.log(queue.dequeue()); // "first"
```

### Classes avec Contraintes

```typescript
// Contrainte sur le type générique
interface Comparable {
  compareTo(other: this): number;
}

class SortedList<T extends Comparable> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => a.compareTo(b));
  }
  
  getItems(): T[] {
    return [...this.items];
  }
}

class Person implements Comparable {
  constructor(public name: string, public age: number) {}
  
  compareTo(other: Person): number {
    return this.age - other.age;
  }
}

const list = new SortedList<Person>();
list.add(new Person("Bob", 30));
list.add(new Person("Alice", 25));
list.add(new Person("Charlie", 35));
console.log(list.getItems()); // Sorted by age
```

### Repository Pattern

```typescript
interface Entity {
  id: string | number;
}

class Repository<T extends Entity> {
  private items: Map<T['id'], T> = new Map();
  
  save(entity: T): T {
    this.items.set(entity.id, entity);
    return entity;
  }
  
  findById(id: T['id']): T | undefined {
    return this.items.get(id);
  }
  
  findAll(): T[] {
    return Array.from(this.items.values());
  }
  
  delete(id: T['id']): boolean {
    return this.items.delete(id);
  }
  
  count(): number {
    return this.items.size;
  }
}

interface User extends Entity {
  id: string;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.save({ id: "1", name: "Alice", email: "alice@example.com" });
const user = userRepo.findById("1"); // User | undefined
```

## Interfaces Génériques

### Interfaces de Base

```typescript
// Interface générique simple
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

// Interface avec méthodes génériques
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
  map<U>(fn: (value: T) => U): Container<U>;
}

class BoxImpl<T> implements Container<T> {
  constructor(public value: T) {}
  
  getValue(): T {
    return this.value;
  }
  
  setValue(value: T): void {
    this.value = value;
  }
  
  map<U>(fn: (value: T) => U): Container<U> {
    return new BoxImpl(fn(this.value));
  }
}

const box = new BoxImpl(5);
const doubled = box.map(x => x * 2); // BoxImpl<number>
const stringified = box.map(x => x.toString()); // BoxImpl<string>
```

### Collection Interfaces

```typescript
// Generic collection interface
interface Collection<T> {
  add(item: T): void;
  remove(item: T): boolean;
  contains(item: T): boolean;
  size(): number;
  toArray(): T[];
  clear(): void;
}

class ArrayList<T> implements Collection<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
  
  contains(item: T): boolean {
    return this.items.includes(item);
  }
  
  size(): number {
    return this.items.length;
  }
  
  toArray(): T[] {
    return [...this.items];
  }
  
  clear(): void {
    this.items = [];
  }
}

const list = new ArrayList<string>();
list.add("apple");
list.add("banana");
console.log(list.contains("apple")); // true
```

### Promise et Async Generics

```typescript
// Generic async operations
interface AsyncOperation<T> {
  execute(): Promise<T>;
  cancel(): void;
}

class FetchOperation<T> implements AsyncOperation<T> {
  private abortController = new AbortController();
  
  constructor(private url: string) {}
  
  async execute(): Promise<T> {
    const response = await fetch(this.url, {
      signal: this.abortController.signal
    });
    return response.json();
  }
  
  cancel(): void {
    this.abortController.abort();
  }
}

interface User {
  id: number;
  name: string;
}

const userFetch = new FetchOperation<User>("/api/user/1");
const user = await userFetch.execute(); // User

// Generic result type
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

async function fetchWithResult<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

const result = await fetchWithResult<User[]>("/api/users");
if (result.success) {
  console.log(result.data); // User[]
} else {
  console.error(result.error);
}
```

## Type Parameters par Défaut

### Default Type Parameters

```typescript
// Type par défaut
interface Response<T = any> {
  data: T;
  status: number;
}

const response1: Response = { data: "anything", status: 200 }; // T = any
const response2: Response<User> = { data: user, status: 200 }; // T = User

// Multiple defaults
interface ApiResponse<T = unknown, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

const resp1: ApiResponse = { success: true }; // T = unknown, E = Error
const resp2: ApiResponse<string> = { success: true, data: "hello" }; // E = Error
const resp3: ApiResponse<string, CustomError> = { 
  success: false, 
  error: new CustomError() 
};

// Defaults dans fonctions
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const strings = createArray(3, "hello"); // string[]
const numbers = createArray<number>(3, 0); // number[]
const auto = createArray(3, "x"); // string[] (default)
```

## Exercices Pratiques

### Exercice 1 : Generic Cache

```typescript
interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

class Cache<K, V> {
  private store = new Map<K, { value: V; expiry: number }>();
  private maxSize: number;
  private ttl: number;
  
  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.ttl = options.ttl ?? 60000; // 1 minute default
  }
  
  set(key: K, value: V): void {
    // Implement LRU if max size exceeded
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      this.store.delete(firstKey);
    }
    
    this.store.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }
  
  get(key: K): V | undefined {
    const item = this.store.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check expiry
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
  
  clear(): void {
    this.store.clear();
  }
  
  size(): number {
    return this.store.size;
  }
}

// Usage
const userCache = new Cache<string, User>({ maxSize: 50, ttl: 300000 });
userCache.set("user1", { id: "1", name: "Alice", email: "alice@example.com" });
const user = userCache.get("user1"); // User | undefined
```

### Exercice 2 : Generic Event Emitter

```typescript
type EventHandler<T> = (data: T) => void;

class EventEmitter<EventMap extends Record<string, any>> {
  private listeners: {
    [K in keyof EventMap]?: EventHandler<EventMap[K]>[];
  } = {};
  
  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }
  
  off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit<K extends keyof EventMap>(
    event: K,
    data: EventMap[K]
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  once<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): void {
    const onceHandler: EventHandler<EventMap[K]> = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }
}

// Usage
interface AppEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'data:updated': { entityId: string; changes: any };
}

const emitter = new EventEmitter<AppEvents>();

emitter.on('user:login', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('user:login', {
  userId: "123",
  timestamp: new Date()
});
```

### Exercice 3 : Generic Builder Pattern

```typescript
// Type-safe builder pattern
class QueryBuilder<T> {
  private conditions: Partial<T> = {};
  private orderField?: keyof T;
  private orderDirection?: 'asc' | 'desc';
  private limitValue?: number;
  
  where(condition: Partial<T>): this {
    this.conditions = { ...this.conditions, ...condition };
    return this;
  }
  
  orderBy(field: keyof T, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }
  
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }
  
  build(): {
    conditions: Partial<T>;
    order?: { field: keyof T; direction: 'asc' | 'desc' };
    limit?: number;
  } {
    return {
      conditions: this.conditions,
      order: this.orderField ? {
        field: this.orderField,
        direction: this.orderDirection!
      } : undefined,
      limit: this.limitValue
    };
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Type-safe query building
const query = new QueryBuilder<User>()
  .where({ age: 25 })
  .orderBy('name', 'asc')
  .limit(10)
  .build();

console.log(query);
/* {
  conditions: { age: 25 },
  order: { field: 'name', direction: 'asc' },
  limit: 10
} */
```

## Patterns Avancés

### Option/Maybe Type

```typescript
// Generic Option type (like Rust's Option)
class Option<T> {
  private constructor(
    private value: T | null,
    private hasValue: boolean
  ) {}
  
  static some<T>(value: T): Option<T> {
    return new Option(value, true);
  }
  
  static none<T>(): Option<T> {
    return new Option<T>(null, false);
  }
  
  isSome(): boolean {
    return this.hasValue;
  }
  
  isNone(): boolean {
    return !this.hasValue;
  }
  
  unwrap(): T {
    if (!this.hasValue) {
      throw new Error("Called unwrap on a None value");
    }
    return this.value!;
  }
  
  unwrapOr(defaultValue: T): T {
    return this.hasValue ? this.value! : defaultValue;
  }
  
  map<U>(fn: (value: T) => U): Option<U> {
    if (this.hasValue) {
      return Option.some(fn(this.value!));
    }
    return Option.none();
  }
  
  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this.hasValue) {
      return fn(this.value!);
    }
    return Option.none();
  }
}

// Usage
function divide(a: number, b: number): Option<number> {
  if (b === 0) {
    return Option.none();
  }
  return Option.some(a / b);
}

const result1 = divide(10, 2); // Option<number>
console.log(result1.unwrap()); // 5

const result2 = divide(10, 0);
console.log(result2.unwrapOr(0)); // 0

const doubled = result1.map(x => x * 2); // Option<number>
console.log(doubled.unwrap()); // 10
```

### Result Type

```typescript
// Generic Result type for error handling
class Result<T, E = Error> {
  private constructor(
    private value: T | null,
    private error: E | null,
    private isSuccess: boolean
  ) {}
  
  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, null, true);
  }
  
  static err<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(null, error, false);
  }
  
  isOk(): boolean {
    return this.isSuccess;
  }
  
  isErr(): boolean {
    return !this.isSuccess;
  }
  
  unwrap(): T {
    if (!this.isSuccess) {
      throw this.error;
    }
    return this.value!;
  }
  
  unwrapOr(defaultValue: T): T {
    return this.isSuccess ? this.value! : defaultValue;
  }
  
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess) {
      return Result.ok(fn(this.value!));
    }
    return Result.err(this.error!);
  }
  
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this.isSuccess) {
      return Result.ok(this.value!);
    }
    return Result.err(fn(this.error!));
  }
}

// Usage
function parseJSON<T>(json: string): Result<T, string> {
  try {
    const data = JSON.parse(json);
    return Result.ok(data);
  } catch (error) {
    return Result.err("Invalid JSON");
  }
}

const result = parseJSON<User>('{"id":1,"name":"Alice"}');
if (result.isOk()) {
  console.log(result.unwrap());
} else {
  console.error("Parse error");
}
```

## Résumé

**Génériques :**
- Créer des composants réutilisables type-safe
- Syntaxe : `<T>` pour un paramètre de type
- Éviter `any` : Conserver les informations de type

**Fonctions Génériques :**
- `function fn<T>(param: T): T`
- Contraintes avec `extends`
- `keyof` pour accès aux propriétés type-safe

**Classes Génériques :**
- `class Stack<T>`
- Repository pattern
- Collections type-safe

**Interfaces Génériques :**
- `interface Box<T>`
- Collections et containers
- Promise et async operations

**Type Parameters :**
- Multiple parameters : `<T, U, V>`
- Defaults : `<T = string>`
- Contraintes : `<T extends Base>`

**Patterns :**
- Option/Maybe type
- Result type pour error handling
- Builder pattern
- Generic cache et event emitter

Les génériques sont essentiels pour écrire du code TypeScript réutilisable et type-safe. Dans le chapitre suivant, nous explorerons les **Génériques Avancés**.