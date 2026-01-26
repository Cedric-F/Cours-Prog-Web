# Décorateurs

## Introduction aux Décorateurs

Les **décorateurs** sont une fonctionnalité expérimentale de TypeScript qui permet d'ajouter des annotations et de modifier le comportement de classes, méthodes, propriétés et paramètres.

### Configuration

Pour utiliser les décorateurs, activez-les dans `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Syntaxe de Base

```typescript
// Décorateur simple
function logged(target: any) {
  console.log("Class decorated:", target.name);
}

@logged
class MyClass {
  // ...
}
// Output: "Class decorated: MyClass"
```

## Décorateurs de Classe

### Décorateur Simple

```typescript
// Décorateur qui log la création
function Component(target: Function) {
  console.log(`Component ${target.name} registered`);
}

@Component
class AppComponent {
  // ...
}

// Ajouter des propriétés
function AddTimestamp<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
  };
}

@AddTimestamp
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");
console.log((user as any).createdAt); // Date actuelle
```

### Décorateur avec Factory

```typescript
// Factory pattern : Fonction qui retourne un décorateur
function Component(options: { selector: string; template: string }) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      selector = options.selector;
      template = options.template;
    };
  };
}

@Component({
  selector: 'app-root',
  template: '<div>Hello World</div>'
})
class AppComponent {
  title = 'My App';
}

const app = new AppComponent();
console.log((app as any).selector); // 'app-root'
console.log((app as any).template); // '<div>Hello World</div>'

// Décorateur pour rendre une classe singleton
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T;
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  };
}

@Singleton
class Database {
  constructor(public connectionString: string) {}
}

const db1 = new Database("connection1");
const db2 = new Database("connection2");
console.log(db1 === db2); // true (même instance)
```

### Décorateurs Multiples

```typescript
// Les décorateurs sont appliqués de bas en haut
function First() {
  console.log("First() factory");
  return function(target: any) {
    console.log("First() called");
  };
}

function Second() {
  console.log("Second() factory");
  return function(target: any) {
    console.log("Second() called");
  };
}

@First()
@Second()
class Example {
  // Output:
  // Second() factory
  // First() factory
  // Second() called
  // First() called
}
```

## Décorateurs de Méthode

### Décorateur Simple

```typescript
// Target: prototype (instance methods) ou constructor (static methods)
// PropertyKey: nom de la méthode
// Descriptor: PropertyDescriptor
function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Calling add with: [2, 3]
// Result: 5
```

### Mesure de Performance

```typescript
function Measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
  
  return descriptor;
}

class DataService {
  @Measure
  async fetchUsers(): Promise<User[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [];
  }
}

const service = new DataService();
await service.fetchUsers();
// Output: fetchUsers took 1000.xx ms
```

### Validation et Retry

```typescript
// Décorateur pour réessayer en cas d'erreur
function Retry(maxRetries: number = 3, delay: number = 1000) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError;
    };
    
    return descriptor;
  };
}

class ApiClient {
  @Retry(3, 2000)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  }
}

// Décorateur de validation
function ValidateArgs(...validators: Array<(arg: any) => boolean>) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      args.forEach((arg, index) => {
        if (validators[index] && !validators[index](arg)) {
          throw new Error(`Invalid argument at position ${index}`);
        }
      });
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class UserService {
  @ValidateArgs(
    (name) => typeof name === 'string' && name.length > 0,
    (age) => typeof age === 'number' && age >= 0
  )
  createUser(name: string, age: number) {
    return { name, age };
  }
}

const userService = new UserService();
userService.createUser("Alice", 30);  // ✅ OK
// userService.createUser("", 30);    // ❌ Erreur
// userService.createUser("Bob", -5); // ❌ Erreur
```

## Décorateurs de Propriété

### Décorateurs Simples

```typescript
// Target: prototype (instance) ou constructor (static)
// PropertyKey: nom de la propriété
function Readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class User {
  @Readonly
  id: number = 1;
  
  name: string = "Alice";
}

const user = new User();
console.log(user.id);    // 1
// user.id = 2;          // ❌ Erreur en strict mode

// Log l'accès aux propriétés
function LogProperty(target: any, propertyKey: string) {
  let value: any;
  
  const getter = function() {
    console.log(`Get: ${propertyKey} => ${value}`);
    return value;
  };
  
  const setter = function(newValue: any) {
    console.log(`Set: ${propertyKey} => ${newValue}`);
    value = newValue;
  };
  
  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class Product {
  @LogProperty
  name: string = "";
  
  @LogProperty
  price: number = 0;
}

const product = new Product();
product.name = "Laptop"; // Set: name => Laptop
console.log(product.name); // Get: name => Laptop
```

### Validation de Propriété

```typescript
// Décorateur pour min/max sur nombres
function Range(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    let value: number;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (newValue < min || newValue > max) {
          throw new Error(
            `${propertyKey} must be between ${min} and ${max}`
          );
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Person {
  name: string = "";
  
  @Range(0, 120)
  age: number = 0;
}

const person = new Person();
person.age = 30;    // ✅ OK
// person.age = 150; // ❌ Erreur: age must be between 0 and 120

// Format de propriété
function Format(formatter: (value: string) => string) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: string) {
        value = formatter(newValue);
      },
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @Format((value) => value.toLowerCase())
  email: string = "";
  
  @Format((value) => value.trim())
  username: string = "";
}

const user = new User();
user.email = "ALICE@EXAMPLE.COM";
console.log(user.email); // "alice@example.com"
```

## Décorateurs de Paramètre

### Décorateurs Simples

```typescript
// Target: prototype ou constructor
// PropertyKey: nom de la méthode
// ParameterIndex: index du paramètre
function LogParameter(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  const metadataKey = `log_${propertyKey}_parameters`;
  
  if (Array.isArray(target[metadataKey])) {
    target[metadataKey].push(parameterIndex);
  } else {
    target[metadataKey] = [parameterIndex];
  }
}

class UserController {
  greet(@LogParameter name: string, @LogParameter age: number) {
    return `Hello ${name}, you are ${age} years old`;
  }
}

// Validation de paramètre
const requiredMetadataKey = Symbol("required");

function Required(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] = 
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const requiredParameters: number[] = 
      Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    
    for (let parameterIndex of requiredParameters) {
      if (
        args[parameterIndex] === undefined ||
        args[parameterIndex] === null
      ) {
        throw new Error(
          `Missing required argument at position ${parameterIndex}`
        );
      }
    }
    
    return method.apply(this, args);
  };
}

class ProductService {
  @Validate
  createProduct(
    @Required name: string,
    @Required price: number,
    description?: string
  ) {
    return { name, price, description };
  }
}

const productService = new ProductService();
productService.createProduct("Laptop", 999); // ✅ OK
// productService.createProduct("Laptop", null); // ❌ Erreur
```

## Décorateur Metadata

### Reflect Metadata

Installez le package :
```bash
npm install reflect-metadata
```

```typescript
import "reflect-metadata";

// Stocker et récupérer des métadonnées
function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata("tableName", tableName, constructor);
  };
}

function Column(columnName?: string) {
  return function(target: any, propertyKey: string) {
    const columns = Reflect.getMetadata("columns", target.constructor) || [];
    columns.push({
      propertyKey,
      columnName: columnName || propertyKey
    });
    Reflect.defineMetadata("columns", columns, target.constructor);
  };
}

@Entity("users")
class User {
  @Column("user_id")
  id: number = 0;
  
  @Column()
  name: string = "";
  
  @Column("email_address")
  email: string = "";
}

// Récupérer les métadonnées
const tableName = Reflect.getMetadata("tableName", User);
const columns = Reflect.getMetadata("columns", User);

console.log(tableName); // "users"
console.log(columns);
// [
//   { propertyKey: 'id', columnName: 'user_id' },
//   { propertyKey: 'name', columnName: 'name' },
//   { propertyKey: 'email', columnName: 'email_address' }
// ]

// Générer des requêtes SQL
function buildInsertQuery(entityClass: any, data: any): string {
  const tableName = Reflect.getMetadata("tableName", entityClass);
  const columns = Reflect.getMetadata("columns", entityClass);
  
  const columnNames = columns.map((c: any) => c.columnName).join(", ");
  const values = columns
    .map((c: any) => {
      const value = data[c.propertyKey];
      return typeof value === "string" ? `'${value}'` : value;
    })
    .join(", ");
  
  return `INSERT INTO ${tableName} (${columnNames}) VALUES (${values})`;
}

const query = buildInsertQuery(User, {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
});

console.log(query);
// INSERT INTO users (user_id, name, email_address) VALUES (1, 'Alice', 'alice@example.com')
```

## Exercices Pratiques

### Exercice 1 : Cache Decorator

```typescript
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}`);
      return cache.get(key);
    }
    
    console.log(`Cache miss for ${propertyKey}`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
  
  @Memoize
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

const math = new MathService();
console.log(math.fibonacci(10)); // Cache miss, calcule
console.log(math.fibonacci(10)); // Cache hit, retourne immédiatement
```

### Exercice 2 : Dependency Injection

```typescript
import "reflect-metadata";

// Service decorator
function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata("injectable", true, constructor);
    return constructor;
  };
}

// Inject decorator
function Inject(token: any) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const existingInjections = 
      Reflect.getOwnMetadata("injections", target) || [];
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata("injections", existingInjections, target);
  };
}

// Container
class Container {
  private services = new Map<any, any>();
  
  register<T>(token: any, instance: T) {
    this.services.set(token, instance);
  }
  
  resolve<T>(token: any): T {
    const instance = this.services.get(token);
    if (!instance) {
      throw new Error(`No provider for ${token.name}`);
    }
    return instance;
  }
  
  create<T>(constructor: new (...args: any[]) => T): T {
    const injections: Array<{ index: number; token: any }> =
      Reflect.getMetadata("injections", constructor) || [];
    
    const args = injections
      .sort((a, b) => a.index - b.index)
      .map(injection => this.resolve(injection.token));
    
    return new constructor(...args);
  }
}

// Services
@Injectable()
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

@Injectable()
class Database {
  query(sql: string) {
    console.log(`[DB] ${sql}`);
  }
}

@Injectable()
class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    @Inject(Database) private db: Database
  ) {}
  
  getUser(id: number) {
    this.logger.log(`Getting user ${id}`);
    this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Usage
const container = new Container();
container.register(Logger, new Logger());
container.register(Database, new Database());

const userService = container.create(UserService);
userService.getUser(1);
// [LOG] Getting user 1
// [DB] SELECT * FROM users WHERE id = 1
```

### Exercice 3 : Route Decorator (Express-like)

```typescript
const routeMetadataKey = Symbol("routes");

interface RouteDefinition {
  path: string;
  method: string;
  methodName: string;
}

// HTTP method decorators
function Get(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes: RouteDefinition[] = 
      Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
    
    routes.push({
      path,
      method: 'GET',
      methodName: propertyKey
    });
    
    Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
  };
}

function Post(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes: RouteDefinition[] = 
      Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
    
    routes.push({
      path,
      method: 'POST',
      methodName: propertyKey
    });
    
    Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
  };
}

// Controller decorator
function Controller(prefix: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata("prefix", prefix, constructor);
  };
}

// Example controller
@Controller('/api/users')
class UserController {
  @Get('/')
  getAllUsers() {
    return { users: [] };
  }
  
  @Get('/:id')
  getUserById() {
    return { user: {} };
  }
  
  @Post('/')
  createUser() {
    return { created: true };
  }
}

// Route registration
function registerRoutes(controller: any) {
  const prefix = Reflect.getMetadata("prefix", controller);
  const routes: RouteDefinition[] = 
    Reflect.getMetadata(routeMetadataKey, controller) || [];
  
  routes.forEach(route => {
    const fullPath = `${prefix}${route.path}`;
    console.log(`${route.method} ${fullPath} -> ${route.methodName}`);
  });
}

registerRoutes(UserController);
// GET /api/users/ -> getAllUsers
// GET /api/users/:id -> getUserById
// POST /api/users/ -> createUser
```

## Patterns Avancés

### Composition de Décorateurs

```typescript
// Composer plusieurs décorateurs
function compose(...decorators: MethodDecorator[]) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    decorators.reverse().forEach(decorator => {
      decorator(target, propertyKey, descriptor);
    });
  };
}

// Usage
class Service {
  @compose(Log, Measure, Retry(3))
  async fetchData() {
    // ...
  }
}
```

### Décorateurs Conditionnels

```typescript
function ConditionalDecorator(condition: boolean) {
  return function(decorator: MethodDecorator) {
    return function(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      if (condition) {
        decorator(target, propertyKey, descriptor);
      }
    };
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';

class ApiService {
  @ConditionalDecorator(isDevelopment)(Log)
  fetchData() {
    // Logged only in development
  }
}
```

## Résumé

**Décorateurs :**
- Annotations pour classes, méthodes, propriétés, paramètres
- `experimentalDecorators: true` dans tsconfig.json
- Factory pattern pour paramètres

**Décorateurs de Classe :**
- Modifier le constructeur
- Singleton, Component, Entity patterns
- Composition bottom-up

**Décorateurs de Méthode :**
- Log, mesure de performance
- Retry, validation, caching
- Modifier le comportement

**Décorateurs de Propriété :**
- Readonly, validation
- Getters/setters custom
- Format et transformation

**Décorateurs de Paramètre :**
- Validation de paramètres
- Dependency injection
- Métadonnées

**Reflect Metadata :**
- Stocker des métadonnées
- ORM patterns (Entity, Column)
- Dependency injection

**Patterns :**
- Memoization
- Dependency injection container
- Route decorators (Express-style)
- Composition de décorateurs

Les décorateurs sont puissants pour la métaprogrammation en TypeScript. Dans le chapitre suivant, nous explorerons les **Modules & Namespaces**.