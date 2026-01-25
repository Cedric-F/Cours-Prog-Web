# Conditional Types

## Introduction aux Conditional Types

Les **Conditional Types** permettent de créer des types dynamiques basés sur des conditions. Ils utilisent une syntaxe similaire aux opérateurs ternaires JavaScript.

### Syntaxe de Base

```typescript
// Syntaxe : T extends U ? X : Y
// Si T est assignable à U, alors le type est X, sinon Y

type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true (string literal extends string)
```

### Exemple Pratique

```typescript
// Type qui extrait le type de retour d'une fonction
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "hello";
}

function getNumber(): number {
  return 42;
}

type StringReturn = ReturnTypeOf<typeof getString>; // string
type NumberReturn = ReturnTypeOf<typeof getNumber>; // number

// Type qui extrait les paramètres d'une fonction
type ParametersOf<T> = T extends (...args: infer P) => any ? P : never;

function add(a: number, b: number): number {
  return a + b;
}

type AddParams = ParametersOf<typeof add>; // [number, number]
```

## Le Mot-Clé `infer`

### Qu'est-ce que `infer` ?

`infer` permet d'**inférer** un type à l'intérieur d'une condition et de l'utiliser.

```typescript
// Extraire le type d'un Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>;  // string
type B = UnwrapPromise<Promise<number>>;  // number
type C = UnwrapPromise<boolean>;          // boolean (pas une Promise)

// Utilisation pratique
async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');
  return response.json();
}

type UserType = UnwrapPromise<ReturnType<typeof fetchUser>>; // User
```

### Infer avec Arrays

```typescript
// Extraire le type des éléments d'un array
type ElementType<T> = T extends (infer E)[] ? E : T;

type A = ElementType<string[]>;  // string
type B = ElementType<number[]>;  // number
type C = ElementType<User[]>;    // User
type D = ElementType<string>;    // string (pas un array)

// Extraire le premier élément d'un tuple
type First<T> = T extends [infer F, ...any[]] ? F : never;

type A = First<[string, number, boolean]>; // string
type B = First<[1, 2, 3]>;                 // 1 (literal type)
type C = First<[]>;                        // never

// Extraire le dernier élément
type Last<T> = T extends [...any[], infer L] ? L : never;

type X = Last<[string, number, boolean]>; // boolean
type Y = Last<[1, 2, 3]>;                 // 3
```

### Infer avec Objects

```typescript
// Extraire le type d'une propriété
type PropType<T, K extends keyof T> = T extends { [key in K]: infer P } ? P : never;

interface User {
  id: number;
  name: string;
  email: string;
}

type NameType = PropType<User, 'name'>; // string
type IdType = PropType<User, 'id'>;     // number

// Extraire les types de retour de toutes les méthodes
type MethodReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};

interface API {
  getUser: () => Promise<User>;
  getPosts: () => Promise<Post[]>;
  getName: () => string;
}

type Returns = MethodReturnTypes<API>;
/* {
  getUser: Promise<User>;
  getPosts: Promise<Post[]>;
  getName: string;
} */
```

## Conditional Types Distributifs

### Distribution sur les Unions

Quand un conditional type est appliqué à un union type, il se **distribue** sur chaque membre de l'union.

```typescript
type ToArray<T> = T extends any ? T[] : never;

// Distribution automatique
type A = ToArray<string | number>;
// Équivalent à : ToArray<string> | ToArray<number>
// Résultat : string[] | number[]

// Exemple pratique
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | null | undefined>; // string

// Comment ça fonctionne :
// NonNullable<string | null> se distribue en :
// NonNullable<string> | NonNullable<null>
// string | never
// string (never est éliminé des unions)
```

### Empêcher la Distribution

```typescript
// Wrapper dans un tuple pour éviter la distribution
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type A = ToArrayNonDist<string | number>;
// Pas de distribution, résultat : (string | number)[]

// Comparaison
type Distributed = ToArray<string | number>;       // string[] | number[]
type NonDistributed = ToArrayNonDist<string | number>; // (string | number)[]

// Exemple pratique
const arr1: Distributed = ["hello"];        // ✅ string[]
const arr2: Distributed = [42];             // ✅ number[]
// const arr3: Distributed = ["hello", 42]; // ❌ Erreur

const arr4: NonDistributed = ["hello", 42]; // ✅ (string | number)[]
```

## Utility Types Avancés avec Conditionals

### Exclude et Extract

```typescript
// Exclude : Retirer des types d'une union
type Exclude<T, U> = T extends U ? never : T;

type A = Exclude<'a' | 'b' | 'c', 'a'>;        // 'b' | 'c'
type B = Exclude<string | number, string>;     // number
type C = Exclude<string | number | boolean, string | boolean>; // number

// Extract : Garder uniquement certains types
type Extract<T, U> = T extends U ? T : never;

type D = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'
type E = Extract<string | number, number>;     // number
```

### NonNullable

```typescript
// Retirer null et undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;           // string
type B = NonNullable<number | undefined>;      // number
type C = NonNullable<string | null | undefined>; // string

// Utilisation pratique
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
  return value as NonNullable<T>;
}

const result = processValue("hello"); // string (not string | null)
```

### ReturnType et Parameters

```typescript
// ReturnType : Extraire le type de retour
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function getUser(): User {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>; // User

// Parameters : Extraire les types des paramètres
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string): User {
  return { id: Date.now(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]

// Utilisation pratique
function logFunctionCall<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`Calling ${fn.name} with:`, args);
  return fn(...args);
}

const user = logFunctionCall(createUser, "Alice", 30, "alice@example.com");
```

## Conditional Types Récursifs

### Types Récursifs pour Structures Imbriquées

```typescript
// Deep Partial : Rendre toutes les propriétés optionnelles récursivement
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
      key: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

// Toutes les propriétés sont optionnelles, même imbriquées
const partialConfig: DeepPartial<Config> = {
  server: {
    port: 3000
    // ssl est optionnel
  }
  // database est optionnel
};

// Deep Readonly : Rendre tout readonly récursivement
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const config: DeepReadonly<Config> = {
  server: {
    host: "localhost",
    port: 3000,
    ssl: { enabled: false, cert: "", key: "" }
  },
  database: { url: "mongodb://localhost", poolSize: 10 }
};

// config.server.port = 4000;          // ❌ Erreur : readonly
// config.server.ssl.enabled = true;   // ❌ Erreur : readonly (deep)
```

### Flatten Types

```typescript
// Aplatir un type imbriqué
type Flatten<T> = T extends Array<infer U> 
  ? U extends Array<any>
    ? Flatten<U>  // Récursion pour arrays multidimensionnels
    : U
  : T;

type A = Flatten<string[]>;           // string
type B = Flatten<number[][]>;         // number
type C = Flatten<boolean[][][]>;      // boolean
type D = Flatten<string>;             // string (pas un array)

// Utilisation pratique
function flattenArray<T>(arr: T): Flatten<T>[] {
  return arr.flat(Infinity) as Flatten<T>[];
}

const nested = [[1, 2], [3, [4, 5]]];
const flattened = flattenArray(nested); // number[]
```

### JSON Type Validation

```typescript
// Type pour valider du JSON
type Primitive = string | number | boolean | null;
type JSONValue = Primitive | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

// Vérifier si un type est sérialisable en JSON
type IsJSON<T> = T extends JSONValue ? true : false;

type A = IsJSON<string>;                           // true
type B = IsJSON<{ name: string; age: number }>;    // true
type C = IsJSON<() => void>;                       // false
type D = IsJSON<Date>;                             // false

// Type pour parser du JSON
type ParseJSON<T extends string> = 
  T extends `{${string}}`
    ? { [key: string]: any }
    : T extends `[${string}]`
      ? any[]
      : T extends "true" | "false"
        ? boolean
        : T extends `${number}`
          ? number
          : T extends "null"
            ? null
            : string;

type JsonObject = ParseJSON<'{"name":"Alice"}'>; // { [key: string]: any }
type JsonArray = ParseJSON<'[1,2,3]'>;           // any[]
type JsonBool = ParseJSON<'true'>;               // boolean
```

## Exercices Pratiques

### Exercice 1 : Filtrer les Propriétés Optionnelles

Créez un type qui extrait uniquement les propriétés optionnelles :

```typescript
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type Required<T> = {
  [K in keyof T]-?: T[K];
};

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  age: number;
}

type UserOptionalKeys = OptionalKeys<User>; // "email" | "phone"

// Extraire uniquement les propriétés optionnelles
type OnlyOptional<T> = Pick<T, OptionalKeys<T>>;

type UserOptional = OnlyOptional<User>; // { email?: string; phone?: string }
```

### Exercice 2 : Type-Safe Event Emitter

```typescript
type EventMap = {
  'user:created': { userId: string; name: string };
  'user:updated': { userId: string; changes: Partial<User> };
  'user:deleted': { userId: string };
};

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};
  
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]) {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

const emitter = new TypedEventEmitter<EventMap>();

// ✅ Type-safe
emitter.on('user:created', (data) => {
  console.log(data.userId, data.name); // TypeScript connaît la structure
});

// ❌ Erreur de type
emitter.on('user:created', (data) => {
  console.log(data.invalid); // Erreur : 'invalid' n'existe pas
});

emitter.emit('user:created', { userId: "123", name: "Alice" });
```

### Exercice 3 : Query Builder Type-Safe

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Type pour les opérateurs de comparaison
type WhereOperators<T> = {
  $eq?: T;
  $ne?: T;
  $gt?: T extends number ? T : never;
  $gte?: T extends number ? T : never;
  $lt?: T extends number ? T : never;
  $lte?: T extends number ? T : never;
  $in?: T[];
  $nin?: T[];
};

type WhereCondition<T> = {
  [P in keyof T]?: T[P] | WhereOperators<T[P]>;
};

class QueryBuilder<T> {
  private conditions: WhereCondition<T> = {};
  
  where(condition: WhereCondition<T>) {
    this.conditions = { ...this.conditions, ...condition };
    return this;
  }
  
  async execute(): Promise<T[]> {
    // Exécuter la requête
    return [];
  }
}

const userQuery = new QueryBuilder<User>();

// ✅ Type-safe
userQuery.where({ 
  name: { $eq: "Alice" },
  age: { $gte: 18, $lte: 65 }
});

// ❌ Erreur : $gte n'est pas disponible pour string
userQuery.where({
  name: { $gte: "Alice" } // Erreur de compilation
});
```

## Conditional Types Avancés

### Template Literal Types avec Conditionals

```typescript
// Convertir string en différents formats
type Uppercase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Uppercase<Rest>}`
  : S;

type Lowercase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Lowercase<First>}${Lowercase<Rest>}`
  : S;

// Utilisation avec built-in utility types
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<K & string>]: T[K];
};

interface User {
  name: string;
  email: string;
}

type UserUppercase = UppercaseKeys<User>;
// { NAME: string; EMAIL: string }

// Convertir camelCase en snake_case
type CamelToSnake<S extends string> = 
  S extends `${infer T}${infer U}`
    ? U extends Uncapitalize<U>
      ? `${Uncapitalize<T>}${CamelToSnake<U>}`
      : `${Uncapitalize<T>}_${CamelToSnake<Uncapitalize<U>>}`
    : S;

type A = CamelToSnake<"firstName">;      // "first_name"
type B = CamelToSnake<"userId">;         // "user_id"
type C = CamelToSnake<"createdAtDate">; // "created_at_date"
```

### Conditional Types avec Generics

```typescript
// Type qui change selon le type d'input
type ApiResponse<T> = T extends { error: any }
  ? { success: false; error: T['error'] }
  : { success: true; data: T };

type SuccessType = ApiResponse<{ users: User[] }>;
// { success: true; data: { users: User[] } }

type ErrorType = ApiResponse<{ error: string }>;
// { success: false; error: string }

// Fonction avec conditional return type
function processResponse<T>(response: T): ApiResponse<T> {
  if ('error' in (response as any)) {
    return { success: false, error: (response as any).error } as any;
  }
  return { success: true, data: response } as any;
}
```

## Patterns Avancés

### Type-Level Programming

```typescript
// Additionner des nombres au niveau du type
type Length<T extends any[]> = T['length'];

type Add<A extends number, B extends number> = 
  Length<[...Array<A>, ...Array<B>]>;

type Sum = Add<3, 5>; // 8

// Comparer des nombres
type IsGreater<A extends number, B extends number> = 
  A extends B ? false : B extends A ? false : true;

type Compare1 = IsGreater<10, 5>;  // true
type Compare2 = IsGreater<3, 8>;   // false
```

### Validation de Schémas

```typescript
// Vérifier qu'un type a certaines propriétés requises
type HasRequiredProps<T, Required extends keyof T> = 
  Required extends keyof T
    ? T[Required] extends undefined
      ? false
      : true
    : false;

interface User {
  id: number;
  name: string;
  email?: string;
}

type HasId = HasRequiredProps<User, 'id'>;    // true
type HasName = HasRequiredProps<User, 'name'>; // true
type HasEmail = HasRequiredProps<User, 'email'>; // false (optional)

// Type pour forcer certaines propriétés à être requises
type RequireProps<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

type UserWithEmail = RequireProps<User, 'email'>;
// { id: number; name: string; email: string } (email devient requis)
```

### Fonction avec Overload Type-Safe

```typescript
// Different return types based on parameter
type ReturnTypeByParam<T extends boolean> = T extends true ? string : number;

function getValue<T extends boolean>(asString: T): ReturnTypeByParam<T> {
  if (asString) {
    return "hello" as ReturnTypeByParam<T>;
  }
  return 42 as ReturnTypeByParam<T>;
}

const str = getValue(true);   // string
const num = getValue(false);  // number

// Avec literal types
type FormatOutput<F extends 'json' | 'xml' | 'csv'> = 
  F extends 'json' ? object :
  F extends 'xml' ? string :
  F extends 'csv' ? string :
  never;

function format<F extends 'json' | 'xml' | 'csv'>(
  data: any,
  format: F
): FormatOutput<F> {
  if (format === 'json') {
    return data as FormatOutput<F>;
  } else if (format === 'xml') {
    return `<data>${JSON.stringify(data)}</data>` as FormatOutput<F>;
  } else {
    return Object.values(data).join(',') as FormatOutput<F>;
  }
}

const jsonData = format({ name: "Alice" }, 'json');  // object
const xmlData = format({ name: "Alice" }, 'xml');    // string
const csvData = format({ name: "Alice" }, 'csv');    // string
```

## Résumé

**🎯 Conditional Types :**
- Syntaxe : `T extends U ? X : Y`
- Créer des types dynamiques basés sur des conditions
- Similaire aux opérateurs ternaires JavaScript

**🔍 Mot-clé `infer` :**
- Inférer un type à l'intérieur d'une condition
- Extraire types de Promise, Array, Function
- Puissant pour créer des utility types

**📦 Distribution :**
- Conditional types se distribuent sur les unions
- `NonNullable`, `Exclude`, `Extract`
- Empêcher avec `[T] extends [any]`

**🔧 Utility Types Natifs :**
- `ReturnType<T>` : Type de retour d'une fonction
- `Parameters<T>` : Types des paramètres
- `NonNullable<T>` : Retirer null/undefined
- `Exclude<T, U>` et `Extract<T, U>`

**♻️ Types Récursifs :**
- DeepPartial, DeepReadonly
- Flatten pour arrays multidimensionnels
- Validation de schémas complexes

Les Conditional Types sont la fondation de la **programmation au niveau des types** en TypeScript. Dans le chapitre suivant, nous explorerons les **Mapped & Utility Types**.