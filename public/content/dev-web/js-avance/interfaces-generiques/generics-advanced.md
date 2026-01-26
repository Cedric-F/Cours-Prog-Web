# Génériques Avancés

## Variance en TypeScript

### Covariance

La **covariance** permet d'assigner un type plus spécifique à un type plus général (dans le sens de la flèche de dérivation).

```typescript
// Covariance avec arrays (lecture seule)
class Animal {
  name: string = "";
}

class Dog extends Animal {
  bark() {}
}

class Cat extends Animal {
  meow() {}
}

// Arrays sont covariants en TypeScript (mais pas type-safe !)
let animals: Animal[] = [];
let dogs: Dog[] = [new Dog()];

animals = dogs; // ✅ Covariance : Dog[] → Animal[]
animals.push(new Cat()); // ⚠️ Problème : Cat dans Dog[]

// ReadonlyArray est vraiment covariant
let readonlyAnimals: readonly Animal[] = [];
let readonlyDogs: readonly Dog[] = [new Dog()];

readonlyAnimals = readonlyDogs; // ✅ Safe covariance
// readonlyAnimals.push(new Cat()); // ❌ Erreur : readonly

// Fonction return types sont covariants
type AnimalFactory = () => Animal;
type DogFactory = () => Dog;

let animalFactory: AnimalFactory;
let dogFactory: DogFactory = () => new Dog();

animalFactory = dogFactory; // ✅ Covariance : () => Dog → () => Animal
```

### Contravariance

La **contravariance** permet d'assigner un type plus général à un type plus spécifique (sens inverse).

```typescript
// Contravariance avec paramètres de fonction
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

let handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name);
};

let handleDog: DogHandler;

handleDog = handleAnimal; // ✅ Contravariance : (Animal) => void → (Dog) => void

// Pourquoi ça marche ?
handleDog(new Dog()); // Dog est un Animal, donc handleAnimal peut le gérer

// L'inverse ne marche pas
// handleAnimal = handleDog; // ❌ Erreur : Cat n'est pas un Dog
```

### Invariance

L'**invariance** n'autorise ni covariance ni contravariance.

```typescript
// Arrays en écriture sont invariants
class Box<T> {
  constructor(public value: T) {}
  
  setValue(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

let animalBox: Box<Animal> = new Box(new Animal());
let dogBox: Box<Dog> = new Box(new Dog());

// animalBox = dogBox; // ❌ Erreur en strict mode
// dogBox = animalBox; // ❌ Erreur en strict mode

// Pourquoi ? Parce qu'on peut écrire ET lire
// Si on permettait : animalBox = dogBox
// Alors : animalBox.setValue(new Cat()) // Cat dans Box<Dog> !
```

## Generic Constraints Avancées

### Contraintes avec `keyof`

```typescript
// Accès type-safe aux propriétés
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };

const name = getProperty(user, "name");    // Type: string
const id = getProperty(user, "id");        // Type: number
// const invalid = getProperty(user, "age"); // ❌ Erreur

// Setter type-safe
function setProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value;
}

setProperty(user, "name", "Bob");          // ✅ OK
setProperty(user, "id", 2);                // ✅ OK
// setProperty(user, "name", 42);          // ❌ Erreur : number n'est pas string

// Pick multiple properties
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

const partial = pick(user, "name", "email"); // { name: string; email: string }
```

### Contraintes Conditionnelles

```typescript
// Contrainte : T doit être un array
type ArrayElement<T extends any[]> = T extends (infer E)[] ? E : never;

type A = ArrayElement<string[]>;  // string
type B = ArrayElement<number[]>;  // number
// type C = ArrayElement<string>;  // ❌ Erreur : string n'est pas un array

// Contrainte : T doit être une Promise
type UnwrapPromise<T extends Promise<any>> = 
  T extends Promise<infer U> ? U : never;

type X = UnwrapPromise<Promise<string>>;  // string
type Y = UnwrapPromise<Promise<number>>;  // number
// type Z = UnwrapPromise<string>;         // ❌ Erreur

// Contrainte : T doit avoir certaines propriétés
type HasId<T extends { id: any }> = T['id'];

type UserId = HasId<{ id: number; name: string }>; // number
// type Invalid = HasId<{ name: string }>;          // ❌ Erreur : pas de id
```

### Contraintes Récursives

```typescript
// Type pour JSON (récursif)
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

function parseJSON<T extends JSONValue>(json: string): T {
  return JSON.parse(json);
}

const data = parseJSON<{ name: string; age: number }>('{"name":"Alice","age":30}');

// Deep Readonly récursif
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: any[]) => any
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
    };
  };
}

const config: DeepReadonly<Config> = {
  server: {
    host: "localhost",
    port: 3000,
    ssl: { enabled: false }
  }
};

// config.server.port = 4000;          // ❌ Erreur : readonly
// config.server.ssl.enabled = true;   // ❌ Erreur : readonly (deep)
```

## Higher-Order Generics

### Generic Functions retournant des Generics

```typescript
// Factory de factories
function createFactory<T>() {
  return function<U extends T>(value: U): U {
    return value;
  };
}

const numberFactory = createFactory<number>();
const result = numberFactory(42);  // Type: 42 (literal)

// Curried generic function
function curry<A, B, C>(fn: (a: A, b: B) => C) {
  return function(a: A) {
    return function(b: B): C {
      return fn(a, b);
    };
  };
}

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
const result2 = add5(10); // 15

// Compose functions
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

const double = (n: number) => n * 2;
const toString = (n: number) => n.toString();
const doubleAndStringify = compose(toString, double);

console.log(doubleAndStringify(5)); // "10"
```

### Generic Classes avec Generic Methods

```typescript
class Collection<T> {
  constructor(private items: T[] = []) {}
  
  // Méthode générique avec type différent
  map<U>(fn: (item: T) => U): Collection<U> {
    return new Collection(this.items.map(fn));
  }
  
  filter(predicate: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter(predicate));
  }
  
  // Méthode avec second generic
  zip<U>(other: Collection<U>): Collection<[T, U]> {
    const length = Math.min(this.items.length, other.items.length);
    const result: [T, U][] = [];
    for (let i = 0; i < length; i++) {
      result.push([this.items[i], other.items[i]]);
    }
    return new Collection(result);
  }
  
  toArray(): T[] {
    return [...this.items];
  }
}

const numbers = new Collection([1, 2, 3]);
const strings = numbers.map(n => n.toString()); // Collection<string>
const doubled = numbers.map(n => n * 2);        // Collection<number>

const names = new Collection(["Alice", "Bob"]);
const zipped = numbers.zip(names);              // Collection<[number, string]>
console.log(zipped.toArray());                  // [[1, "Alice"], [2, "Bob"]]
```

## Conditional Types avec Generics

### Distributive Conditional Types

```typescript
// Filtrer un union type
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;           // string
type B = NonNullable<number | undefined>;      // number
type C = NonNullable<string | number | null>;  // string | number

// Extract : Garder certains types
type Extract<T, U> = T extends U ? T : never;

type Primitives = string | number | boolean | null;
type StringOrNumber = Extract<Primitives, string | number>; // string | number

// Exclude : Retirer certains types
type Exclude<T, U> = T extends U ? never : T;

type NotNull = Exclude<Primitives, null>; // string | number | boolean

// Extraire les clés de fonctions
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface MixedObject {
  name: string;
  age: number;
  greet: () => void;
  save: () => void;
}

type FunctionKeys = FunctionPropertyNames<MixedObject>; // "greet" | "save"
```

### Infer dans Generics

```typescript
// Extraire le type de retour
type ReturnType<T extends (...args: any[]) => any> = 
  T extends (...args: any[]) => infer R ? R : never;

function getUser(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>; // { id: number; name: string }

// Extraire les paramètres
type Parameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number): User {
  return { id: 1, name, age, email: "" };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// Unwrap Promise récursif
type Awaited<T> = T extends Promise<infer U>
  ? Awaited<U>  // Récursion pour Promise<Promise<T>>
  : T;

type A = Awaited<Promise<string>>;           // string
type B = Awaited<Promise<Promise<number>>>;  // number
type C = Awaited<string>;                    // string

// Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;

type D = Flatten<string[]>;   // string
type E = Flatten<number[][]>; // number[]
type F = Flatten<string>;     // string
```

## Generic Utility Types Personnalisés

### Partial et Required Avancés

```typescript
// DeepPartial : Rendre tout optionnel récursivement
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends any[]
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

interface User {
  id: number;
  profile: {
    name: string;
    address: {
      street: string;
      city: string;
    };
  };
}

const partialUser: DeepPartial<User> = {
  profile: {
    address: {
      city: "Paris"
      // street optionnel
    }
  }
  // id et profile.name optionnels
};

// RequiredKeys : Extraire les clés requises
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface MixedProps {
  required1: string;
  required2: number;
  optional1?: string;
  optional2?: boolean;
}

type Required = RequiredKeys<MixedProps>; // "required1" | "required2"
```

### Mutable et Readonly

```typescript
// Mutable : Retirer tous les readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

type MutableUser = Mutable<ReadonlyUser>;
// { id: number; name: string }

// DeepMutable : Retirer readonly récursivement
type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object
    ? DeepMutable<T[P]>
    : T[P];
};

// DeepReadonly : Ajouter readonly récursivement
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: any[]) => any
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};
```

### PickByType et OmitByType

```typescript
// PickByType : Sélectionner propriétés d'un type
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

type StringProps = PickByType<User, string>;
// { name: string; email: string }

type NumberProps = PickByType<User, number>;
// { id: number; age: number }

// OmitByType : Exclure propriétés d'un type
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

type NonStringProps = OmitByType<User, string>;
// { id: number; age: number; isActive: boolean }

// PickByValueType : Avec contraintes
type PickOptional<T> = {
  [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};

interface Props {
  required: string;
  optional?: number;
  alsoOptional?: boolean;
}

type OptionalOnly = PickOptional<Props>;
// { optional?: number; alsoOptional?: boolean }
```

## Exercices Pratiques

### Exercice 1 : Type-Safe Redux

```typescript
// Actions type-safe
interface Action<T extends string, P = undefined> {
  type: T;
  payload: P;
}

type ActionCreator<T extends string, P = undefined> = 
  P extends undefined
    ? () => Action<T, undefined>
    : (payload: P) => Action<T, P>;

// Actions map
interface UserActions {
  'USER_LOGIN': { userId: string; username: string };
  'USER_LOGOUT': undefined;
  'USER_UPDATE': { userId: string; changes: Partial<User> };
}

// Générer les action creators
type ActionCreators<T extends Record<string, any>> = {
  [K in keyof T]: ActionCreator<K & string, T[K]>;
};

const userActions: ActionCreators<UserActions> = {
  USER_LOGIN: (payload) => ({ type: 'USER_LOGIN', payload }),
  USER_LOGOUT: () => ({ type: 'USER_LOGOUT', payload: undefined }),
  USER_UPDATE: (payload) => ({ type: 'USER_UPDATE', payload })
};

// Usage
const loginAction = userActions.USER_LOGIN({
  userId: "123",
  username: "Alice"
}); // Action<"USER_LOGIN", { userId: string; username: string }>

const logoutAction = userActions.USER_LOGOUT();
// Action<"USER_LOGOUT", undefined>

// Reducer type-safe
type ActionsUnion<T extends Record<string, any>> = {
  [K in keyof T]: Action<K & string, T[K]>;
}[keyof T];

type UserActionsUnion = ActionsUnion<UserActions>;

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

function userReducer(
  state: UserState,
  action: UserActionsUnion
): UserState {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        currentUser: action.payload, // Type connu !
        isLoggedIn: true
      };
    case 'USER_LOGOUT':
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false
      };
    case 'USER_UPDATE':
      return {
        ...state,
        currentUser: state.currentUser
          ? { ...state.currentUser, ...action.payload.changes }
          : null
      };
  }
}
```

### Exercice 2 : Generic Query Builder

```typescript
// Query builder avec type inference
type Operator<T> = {
  $eq?: T;
  $ne?: T;
  $gt?: T extends number | Date ? T : never;
  $gte?: T extends number | Date ? T : never;
  $lt?: T extends number | Date ? T : never;
  $lte?: T extends number | Date ? T : never;
  $in?: T[];
  $nin?: T[];
  $exists?: boolean;
};

type Query<T> = {
  [P in keyof T]?: T[P] | Operator<T[P]>;
};

class QueryBuilder<T> {
  private query: Query<T> = {};
  private sortField?: keyof T;
  private sortOrder?: 'asc' | 'desc';
  private limitValue?: number;
  
  where(query: Query<T>): this {
    this.query = { ...this.query, ...query };
    return this;
  }
  
  sort(field: keyof T, order: 'asc' | 'desc' = 'asc'): this {
    this.sortField = field;
    this.sortOrder = order;
    return this;
  }
  
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }
  
  async execute(): Promise<T[]> {
    console.log('Query:', this.query);
    console.log('Sort:', this.sortField, this.sortOrder);
    console.log('Limit:', this.limitValue);
    // Execute query...
    return [];
  }
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Usage type-safe
const products = await new QueryBuilder<Product>()
  .where({
    price: { $gte: 10, $lte: 100 },
    stock: { $gt: 0 },
    name: { $in: ["Product A", "Product B"] }
  })
  .sort('price', 'asc')
  .limit(20)
  .execute();
```

### Exercice 3 : Type-Safe Form Validation

```typescript
// Validation schema builder
type ValidationRule<T> = {
  required?: boolean;
  min?: T extends number ? number : never;
  max?: T extends number ? number : never;
  minLength?: T extends string ? number : never;
  maxLength?: T extends string ? number : never;
  pattern?: T extends string ? RegExp : never;
  custom?: (value: T) => boolean | string;
};

type ValidationSchema<T> = {
  [P in keyof T]?: ValidationRule<T[P]>;
};

type ValidationErrors<T> = {
  [P in keyof T]?: string;
};

class FormValidator<T> {
  constructor(private schema: ValidationSchema<T>) {}
  
  validate(data: Partial<T>): ValidationErrors<T> {
    const errors: ValidationErrors<T> = {};
    
    for (const key in this.schema) {
      const rule = this.schema[key];
      const value = data[key];
      
      if (!rule) continue;
      
      // Required check
      if (rule.required && (value === undefined || value === null)) {
        errors[key] = `${String(key)} is required`;
        continue;
      }
      
      if (value === undefined || value === null) continue;
      
      // Type-specific validations
      if (typeof value === 'number') {
        const numRule = rule as ValidationRule<number>;
        if (numRule.min !== undefined && value < numRule.min) {
          errors[key] = `${String(key)} must be at least ${numRule.min}`;
        }
        if (numRule.max !== undefined && value > numRule.max) {
          errors[key] = `${String(key)} must be at most ${numRule.max}`;
        }
      }
      
      if (typeof value === 'string') {
        const strRule = rule as ValidationRule<string>;
        if (strRule.minLength && value.length < strRule.minLength) {
          errors[key] = `${String(key)} must be at least ${strRule.minLength} characters`;
        }
        if (strRule.maxLength && value.length > strRule.maxLength) {
          errors[key] = `${String(key)} must be at most ${strRule.maxLength} characters`;
        }
        if (strRule.pattern && !strRule.pattern.test(value)) {
          errors[key] = `${String(key)} is invalid`;
        }
      }
      
      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value as any);
        if (typeof result === 'string') {
          errors[key] = result;
        } else if (result === false) {
          errors[key] = `${String(key)} is invalid`;
        }
      }
    }
    
    return errors;
  }
}

// Usage
interface RegisterForm {
  username: string;
  email: string;
  age: number;
  password: string;
}

const validator = new FormValidator<RegisterForm>({
  username: {
    required: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  age: {
    required: true,
    min: 18,
    max: 120
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value) => {
      if (!/[A-Z]/.test(value)) return "Password must contain uppercase";
      if (!/[0-9]/.test(value)) return "Password must contain number";
      return true;
    }
  }
});

const errors = validator.validate({
  username: "ab",  // Trop court
  email: "invalid",
  age: 15,         // Trop jeune
  password: "weak"
});

console.log(errors);
/* {
  username: "username must be at least 3 characters",
  email: "email is invalid",
  age: "age must be at least 18",
  password: "Password must contain uppercase"
} */
```

## Patterns Avancés

### Branded Types

```typescript
// Types distincts pour éviter les confusions
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId) {
  console.log(`Getting user ${id}`);
}

function getOrder(id: OrderId) {
  console.log(`Getting order ${id}`);
}

const userId = createUserId("user123");
const orderId = createOrderId("order456");

getUser(userId);    // ✅ OK
// getUser(orderId); // ❌ Erreur : OrderId n'est pas UserId
```

### Type-Level Programming

```typescript
// Compter les propriétés d'un type
type Length<T extends any[]> = T['length'];

type Count<T> = Length<keyof T & string[]>;

interface User {
  id: number;
  name: string;
  email: string;
}

// Union de toutes les valeurs
type ValueOf<T> = T[keyof T];

type UserValues = ValueOf<User>; // number | string

// Paths dans un objet (récursif)
type Paths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? K extends string
      ? `${Prefix}${K}` | Paths<T[K], `${Prefix}${K}.`>
      : never
    : K extends string
      ? `${Prefix}${K}`
      : never;
}[keyof T];

interface NestedObject {
  user: {
    profile: {
      name: string;
      age: number;
    };
    settings: {
      theme: string;
    };
  };
}

type AllPaths = Paths<NestedObject>;
// "user" | "user.profile" | "user.profile.name" | "user.profile.age" | "user.settings" | "user.settings.theme"
```

## Résumé

**Variance :**
- **Covariance** : Type plus spécifique → plus général (return types)
- **Contravariance** : Type plus général → plus spécifique (parameters)
- **Invariance** : Pas de conversion (mutable structures)

**Contraintes Avancées :**
- `keyof T` pour accès type-safe
- Conditional constraints avec `extends`
- Contraintes récursives pour structures imbriquées

**Higher-Order Generics :**
- Generics retournant des generics
- Currying et composition
- Generic methods dans generic classes

**Conditional Types :**
- Distributive conditional types
- `infer` pour extraction de types
- Filtrage d'union types

**Utility Types Personnalisés :**
- DeepPartial, DeepReadonly, DeepMutable
- PickByType, OmitByType
- RequiredKeys, OptionalKeys

**Patterns Avancés :**
- Type-safe Redux actions
- Generic query builders
- Form validation type-safe
- Branded types
- Type-level programming

Les génériques avancés permettent de créer des abstractions puissantes et type-safe en TypeScript. Dans le chapitre suivant, nous explorerons les **Décorateurs**.