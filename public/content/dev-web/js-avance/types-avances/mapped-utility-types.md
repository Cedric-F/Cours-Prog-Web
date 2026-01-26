# Mapped & Utility Types

## Introduction aux Mapped Types

Les **Mapped Types** permettent de créer de nouveaux types en transformant les propriétés d'un type existant.

### Syntaxe de Base

```typescript
// Syntaxe : { [P in K]: T }
// P : clé itérée
// K : union de clés (généralement keyof Type)
// T : type de la propriété

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;
/* {
  readonly id: number;
  readonly name: string;
} */

const user: ReadonlyUser = { id: 1, name: "Alice" };
// user.id = 2; // ❌ Erreur : readonly
```

### Mapped Types avec Modificateurs

```typescript
interface User {
  readonly id: number;
  name?: string;
  email?: string;
}

// Retirer readonly avec -readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type MutableUser = Mutable<User>;
/* {
  id: number;        // Plus readonly
  name?: string;
  email?: string;
} */

// Retirer optional avec -?
type Required<T> = {
  [P in keyof T]-?: T[P];
};

type RequiredUser = Required<User>;
/* {
  readonly id: number;
  name: string;      // Plus optional
  email: string;     // Plus optional
} */

// Combiner les deux
type MutableRequired<T> = {
  -readonly [P in keyof T]-?: T[P];
};

type FullyMutableUser = MutableRequired<User>;
/* {
  id: number;        // Ni readonly
  name: string;      // Ni optional
  email: string;     // Ni optional
} */
```

## Utility Types Natifs de TypeScript

### Partial et Required

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial : Toutes les propriétés optionnelles
type PartialUser = Partial<User>;
/* {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
} */

// Utilisation : Updates partiels
function updateUser(id: number, updates: Partial<User>) {
  const user = findUser(id);
  return { ...user, ...updates };
}

updateUser(1, { name: "Alice" });           // ✅ OK
updateUser(1, { name: "Bob", age: 30 });    // ✅ OK
updateUser(1, {});                          // ✅ OK

// Required : Toutes les propriétés requises
type RequiredUser = Required<PartialUser>;  // Retour à User

interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type FullConfig = Required<Config>;
/* {
  apiUrl: string;
  timeout: number;
  retries: number;
} */

// Forcer la configuration complète
function initializeApp(config: Required<Config>) {
  // config a toutes les propriétés
  console.log(config.apiUrl, config.timeout, config.retries);
}
```

### Pick et Omit

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pick : Sélectionner certaines propriétés
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;
/* {
  id: number;
  name: string;
  email: string;
} */

// Omit : Exclure certaines propriétés
type UserWithoutPassword = Omit<User, 'password'>;
/* {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} */

// Utilisation pratique
function sanitizeUser(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

// Alternative plus flexible
function sanitizeUser2(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}
```

### Record

```typescript
// Record<K, T> : Objet avec clés K et valeurs T
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

const roles: UserRoles = {
  "alice": "admin",
  "bob": "user",
  "charlie": "guest"
};

// Avec union de clés
type PageStatus = Record<'home' | 'about' | 'contact', boolean>;

const pageVisited: PageStatus = {
  home: true,
  about: false,
  contact: true
};

// Dictionnaire type-safe
type UserMap = Record<number, User>;

const users: UserMap = {
  1: { id: 1, name: "Alice", email: "alice@example.com" },
  2: { id: 2, name: "Bob", email: "bob@example.com" }
};

// Record avec objets complexes
type ApiEndpoints = Record<string, {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: any, res: any) => void;
}>;

const endpoints: ApiEndpoints = {
  getUsers: {
    method: 'GET',
    path: '/api/users',
    handler: (req, res) => res.json([])
  },
  createUser: {
    method: 'POST',
    path: '/api/users',
    handler: (req, res) => res.json({ created: true })
  }
};
```

### Readonly et ReadonlyArray

```typescript
interface User {
  id: number;
  name: string;
}

// Readonly : Toutes propriétés en lecture seule
type ReadonlyUser = Readonly<User>;
/* {
  readonly id: number;
  readonly name: string;
} */

const user: ReadonlyUser = { id: 1, name: "Alice" };
// user.name = "Bob"; // ❌ Erreur : readonly

// ReadonlyArray : Array en lecture seule
const numbers: ReadonlyArray<number> = [1, 2, 3];
const numbers2: readonly number[] = [1, 2, 3]; // Syntaxe alternative

// numbers.push(4);    // ❌ Erreur : push n'existe pas
// numbers[0] = 10;    // ❌ Erreur : index readonly

const copy = [...numbers]; // ✅ OK : spread crée une copie mutable

// Fonction qui ne modifie pas l'array
function sum(arr: readonly number[]): number {
  // arr.push(1); // ❌ Erreur de compilation
  return arr.reduce((a, b) => a + b, 0);
}
```

## Création de Utility Types Personnalisés

### DeepPartial

```typescript
// Rendre toutes propriétés optionnelles, même imbriquées
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends any[]
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

const partialConfig: DeepPartial<Config> = {
  server: {
    port: 3000
    // ssl optionnel
  }
  // database optionnel
};
```

### Nullable et NonNullable

```typescript
// Ajouter null et undefined
type Nullable<T> = T | null | undefined;

let value: Nullable<string> = "hello";
value = null;       // ✅ OK
value = undefined;  // ✅ OK

// Retirer null et undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;           // string
type B = NonNullable<number | undefined>;      // number
type C = NonNullable<string | null | undefined>; // string

// Utilisation pratique
function ensureNonNull<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
  return value as NonNullable<T>;
}

const maybeString: string | null = getSomeValue();
const definiteString = ensureNonNull(maybeString); // string
```

### Mutable

```typescript
// Retirer tous les readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

type MutableUser = Mutable<ReadonlyUser>;
/* {
  id: number;
  name: string;
  email: string;
} */

// Deep Mutable (récursif)
type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object
    ? DeepMutable<T[P]>
    : T[P];
};
```

### PickByType et OmitByType

```typescript
// Sélectionner les propriétés d'un certain type
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

// Exclure les propriétés d'un certain type
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

type NonStringProps = OmitByType<User, string>;
// { id: number; age: number; isActive: boolean }
```

## Key Remapping avec `as`

### Renommer les Clés

```typescript
// Préfixer toutes les clés
type Prefixed<T, Prefix extends string> = {
  [P in keyof T as `${Prefix}${P & string}`]: T[P];
};

interface User {
  id: number;
  name: string;
}

type PrefixedUser = Prefixed<User, 'user_'>;
// { user_id: number; user_name: string }

// Convertir en getters
type Getters<T> = {
  [P in keyof T as `get${Capitalize<P & string>}`]: () => T[P];
};

type UserGetters = Getters<User>;
/* {
  getId: () => number;
  getName: () => string;
} */

class UserClass implements UserGetters {
  constructor(private data: User) {}
  
  getId() {
    return this.data.id;
  }
  
  getName() {
    return this.data.name;
  }
}
```

### Filtrer les Propriétés

```typescript
// Garder uniquement les fonctions
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface MixedObject {
  id: number;
  name: string;
  save: () => void;
  delete: () => void;
  getData: () => any;
}

type OnlyFunctions = FunctionProperties<MixedObject>;
/* {
  save: () => void;
  delete: () => void;
  getData: () => any;
} */

// Garder uniquement les propriétés non-fonction
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type OnlyData = NonFunctionProperties<MixedObject>;
/* {
  id: number;
  name: string;
} */
```

## Exercices Pratiques

### Exercice 1 : Type-Safe Form Builder

```typescript
interface FormSchema {
  username: string;
  email: string;
  age: number;
  newsletter: boolean;
}

// Transformer en form fields avec metadata
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type FormState<T> = {
  [P in keyof T]: FormField<T[P]>;
};

type UserFormState = FormState<FormSchema>;
/* {
  username: FormField<string>;
  email: FormField<string>;
  age: FormField<number>;
  newsletter: FormField<boolean>;
} */

// Implémentation
const formState: UserFormState = {
  username: { value: "", touched: false },
  email: { value: "", error: "Email invalide", touched: true },
  age: { value: 0, touched: false },
  newsletter: { value: false, touched: false }
};
```

### Exercice 2 : API Response Wrapper

```typescript
// Wrapper pour toutes les réponses API
type ApiSuccess<T> = {
  success: true;
  data: T;
  timestamp: number;
};

type ApiError = {
  success: false;
  error: string;
  code: number;
  timestamp: number;
};

type ApiResult<T> = ApiSuccess<T> | ApiError;

// Mapper tous les endpoints
type ApiEndpoints = {
  getUser: (id: string) => Promise<User>;
  getUsers: () => Promise<User[]>;
  createUser: (data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
};

type ApiResultEndpoints = {
  [K in keyof ApiEndpoints]: ApiEndpoints[K] extends (...args: infer Args) => Promise<infer R>
    ? (...args: Args) => Promise<ApiResult<R>>
    : never;
};

/* {
  getUser: (id: string) => Promise<ApiResult<User>>;
  getUsers: () => Promise<ApiResult<User[]>>;
  createUser: (data: Partial<User>) => Promise<ApiResult<User>>;
  deleteUser: (id: string) => Promise<ApiResult<void>>;
} */
```

### Exercice 3 : Database Model to DTO

```typescript
interface DatabaseUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}

// Transformer en DTO (Data Transfer Object)
type ToDTO<T> = {
  [P in keyof T as P extends `${infer Name}_at` ? `${Name}At` : P]: 
    T[P] extends Date | null ? string | null :
    T[P] extends Date ? string :
    T[P];
};

type UserDTO = Omit<ToDTO<DatabaseUser>, 'password_hash'>;
/* {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
} */

// Fonction de conversion
function toDTO(user: DatabaseUser): UserDTO {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
    lastLoginAt: user.last_login_at?.toISOString() ?? null
  };
}
```

## Utility Types Avancés

### Extract et Exclude

```typescript
type Primitive = string | number | boolean | null | undefined;

// Extract : Garder uniquement certains types
type StringOrNumber = Extract<Primitive, string | number>;
// string | number

type OnlyString = Extract<Primitive, string>;
// string

// Exclude : Retirer certains types
type NoNull = Exclude<Primitive, null | undefined>;
// string | number | boolean

// Utilisation pratique : Exclure certaines clés
type OmitByKey<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface User {
  id: number;
  name: string;
  password: string;
}

type UserPublic = OmitByKey<User, 'password'>;
// { id: number; name: string }
```

### ReturnType et Parameters

```typescript
// ReturnType : Type de retour d'une fonction
function getUser(id: number): User {
  return { id, name: "Alice", email: "alice@example.com" };
}

type UserType = ReturnType<typeof getUser>; // User

// Parameters : Types des paramètres
type GetUserParams = Parameters<typeof getUser>; // [number]

// Utilisation : Wrapper de fonction
function logAndCall<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`Calling ${fn.name} with`, args);
  return fn(...args);
}

const user = logAndCall(getUser, 1);
// Calling getUser with [1]
```

### ConstructorParameters et InstanceType

```typescript
class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}
  
  greet() {
    return `Hello, ${this.name}!`;
  }
}

// ConstructorParameters : Types des paramètres du constructeur
type UserParams = ConstructorParameters<typeof User>;
// [number, string, string]

// InstanceType : Type de l'instance
type UserInstance = InstanceType<typeof User>;
// User

// Factory pattern type-safe
function createInstance<T extends new (...args: any[]) => any>(
  constructor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new constructor(...args);
}

const user = createInstance(User, 1, "Alice", "alice@example.com");
// Type: User
```

### Awaited

```typescript
// Awaited : Unwrap Promise types
type A = Awaited<Promise<string>>;  // string
type B = Awaited<Promise<Promise<number>>>; // number (récursif)
type C = Awaited<string>;           // string (pas une Promise)

// Utilisation pratique
async function fetchData(): Promise<{ users: User[] }> {
  const response = await fetch('/api/data');
  return response.json();
}

type DataType = Awaited<ReturnType<typeof fetchData>>;
// { users: User[] }

// Avec generics
type UnwrapAsync<T> = T extends Promise<infer U> ? Awaited<U> : T;

type X = UnwrapAsync<Promise<string>>;           // string
type Y = UnwrapAsync<Promise<Promise<number>>>;  // number
```

## Mapped Types Avancés

### Conditional Mapped Types

```typescript
// Transformer le type selon une condition
type StringifyProperties<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends object
      ? StringifyProperties<T[P]>
      : T[P];
};

interface Event {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  metadata: {
    createdAt: Date;
    tags: string[];
  };
}

type EventDTO = StringifyProperties<Event>;
/* {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  metadata: {
    createdAt: string;
    tags: string[];
  };
} */
```

### Mapped Types avec Template Literals

```typescript
// Créer des getters et setters automatiquement
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

type GettersAndSetters<T> = Getters<T> & Setters<T>;

interface User {
  name: string;
  age: number;
}

type UserAccessors = GettersAndSetters<User>;
/* {
  getName: () => string;
  getAge: () => number;
  setName: (value: string) => void;
  setAge: (value: number) => void;
} */

// Implémentation
class UserModel implements UserAccessors {
  constructor(private data: User) {}
  
  getName() { return this.data.name; }
  getAge() { return this.data.age; }
  setName(value: string) { this.data.name = value; }
  setAge(value: number) { this.data.age = value; }
}
```

### Optional Keys

```typescript
// Identifier les clés optionnelles
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

type UserOptionalKeys = OptionalKeys<User>; // "email" | "phone"

// Séparer en propriétés requises et optionnelles
type RequiredProps<T> = Pick<T, Exclude<keyof T, OptionalKeys<T>>>;
type OptionalProps<T> = Pick<T, OptionalKeys<T>>;

type UserRequired = RequiredProps<User>; // { id: number; name: string }
type UserOptional = OptionalProps<User>; // { email?: string; phone?: string }
```

## Résumé

**Mapped Types :**
- Transformer les propriétés d'un type existant
- Syntaxe : `{ [P in keyof T]: NewType }`
- Modificateurs : `readonly`, `?`, `-readonly`, `-?`
- Key remapping avec `as`

**Utility Types Natifs :**
- **Partial<T>** : Propriétés optionnelles
- **Required<T>** : Propriétés requises
- **Readonly<T>** : Propriétés readonly
- **Pick<T, K>** : Sélectionner des clés
- **Omit<T, K>** : Exclure des clés
- **Record<K, T>** : Dictionnaire type-safe
- **ReturnType<T>** : Type de retour
- **Parameters<T>** : Types des paramètres

**Utility Types Personnalisés :**
- DeepPartial, DeepReadonly, DeepMutable
- PickByType, OmitByType
- Getters et Setters automatiques
- Conversion DTO avec template literals

**Key Remapping :**
- `as` pour transformer les noms de clés
- Template literal types
- Filtrer les propriétés selon condition

Les Mapped & Utility Types sont essentiels pour créer des abstractions type-safe réutilisables. Dans le chapitre suivant, nous explorerons les **Interfaces Avancées**.