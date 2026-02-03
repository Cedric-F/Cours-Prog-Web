# Union & Intersection Types

Maîtrisez les Union et Intersection Types pour créer des types flexibles et composer des structures complexes en TypeScript.

---

## Ce que vous allez apprendre

- Définir des types avec plusieurs possibilités (Union `|`)
- Combiner des types existants (Intersection `&`)
- Appliquer le type narrowing pour sécuriser le code
- Utiliser les discriminated unions

## Prérequis

- [JavaScript - Variables et Types](../../javascript/variables-types/declaration-types-primitifs)
- Notions de base TypeScript (interfaces, types)

---

## Union Types

### Qu'est-ce qu'un Union Type ?

Un **Union Type** permet à une variable d'accepter plusieurs types différents. Il utilise l'opérateur pipe `|`.

```typescript
// Type de base
let id: number | string;

id = 123;      // ✅ OK
id = "abc123"; // ✅ OK
id = true;     // ❌ Erreur : Type 'boolean' n'est pas assignable

// Avec des types littéraux
type Status = "pending" | "approved" | "rejected";

let orderStatus: Status;
orderStatus = "pending";   // ✅ OK
orderStatus = "cancelled"; // ❌ Erreur : pas dans l'union
```

### Union Types avec des Objets

```typescript
interface Dog {
  type: "dog";
  bark: () => void;
  breed: string;
}

interface Cat {
  type: "cat";
  meow: () => void;
  color: string;
}

type Pet = Dog | Cat;

function handlePet(pet: Pet) {
  // TypeScript sait que 'type' existe sur les deux
  console.log(pet.type);
  
  // ❌ Erreur : bark n'existe pas forcément
  // pet.bark();
  
  // ✅ Type narrowing avec type guard
  if (pet.type === "dog") {
    pet.bark(); // OK, TypeScript sait que c'est un Dog
    console.log(pet.breed);
  } else {
    pet.meow(); // OK, TypeScript sait que c'est un Cat
    console.log(pet.color);
  }
}

const myDog: Dog = {
  type: "dog",
  bark: () => console.log("Woof!"),
  breed: "Labrador"
};

const myCat: Cat = {
  type: "cat",
  meow: () => console.log("Meow!"),
  color: "orange"
};

handlePet(myDog); // dog, Labrador
handlePet(myCat); // cat, orange
```

### Discriminated Unions (Tagged Unions)

Pattern puissant pour gérer différents types d'objets :

```typescript
interface SuccessResponse {
  status: "success";
  data: any;
}

interface ErrorResponse {
  status: "error";
  error: string;
  code: number;
}

interface LoadingResponse {
  status: "loading";
  progress: number;
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: ApiResponse) {
  // Discriminant: 'status'
  switch (response.status) {
    case "success":
      console.log("Données:", response.data);
      break;
    case "error":
      console.log(`Erreur ${response.code}: ${response.error}`);
      break;
    case "loading":
      console.log(`Chargement: ${response.progress}%`);
      break;
  }
}

// Utilisation
const success: ApiResponse = { status: "success", data: { users: [] } };
const error: ApiResponse = { status: "error", error: "Not found", code: 404 };
const loading: ApiResponse = { status: "loading", progress: 75 };

handleResponse(success);  // Données: { users: [] }
handleResponse(error);    // Erreur 404: Not found
handleResponse(loading);  // Chargement: 75%
```

### Union Types dans les Fonctions

```typescript
// Paramètres acceptant plusieurs types
function formatId(id: number | string): string {
  if (typeof id === "number") {
    return `ID-${id.toString().padStart(6, "0")}`;
  }
  return id.toUpperCase();
}

console.log(formatId(123));      // ID-000123
console.log(formatId("abc123")); // ABC123

// Retour de plusieurs types possibles
function findUser(id: number): User | null {
  const user = users.find(u => u.id === id);
  return user ?? null;
}

const user = findUser(1);
if (user !== null) {
  console.log(user.name); // Type narrowing
}

// Avec Promise
async function fetchData(url: string): Promise<Data | Error> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error as Error;
  }
}
```

### Union Types et Arrays

```typescript
// Array d'union types
const mixedArray: (number | string)[] = [1, "two", 3, "four"];

// Union d'arrays (différent!)
type NumberOrStringArray = number[] | string[];
const onlyNumbers: NumberOrStringArray = [1, 2, 3];     // ✅
const onlyStrings: NumberOrStringArray = ["a", "b"];    // ✅
const mixed: NumberOrStringArray = [1, "two"];          // ❌ Erreur

// Tuple avec union
type Result = [boolean, string | number];
const success: Result = [true, 200];
const failure: Result = [false, "Error message"];
```

## Type Narrowing

### Type Guards Natifs

```typescript
type Input = string | number | boolean;

function process(input: Input) {
  // typeof type guard
  if (typeof input === "string") {
    console.log(input.toUpperCase()); // string methods
  } else if (typeof input === "number") {
    console.log(input.toFixed(2)); // number methods
  } else {
    console.log(!input); // boolean operations
  }
}

// instanceof type guard
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in operator type guard
interface Bird {
  fly: () => void;
  wingspan: number;
}

interface Fish {
  swim: () => void;
  depth: number;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
    console.log(`Wingspan: ${animal.wingspan}`);
  } else {
    animal.swim();
    console.log(`Depth: ${animal.depth}`);
  }
}
```

### Custom Type Guards

```typescript
// Type predicate: parameterName is Type
interface User {
  name: string;
  email: string;
}

interface Admin extends User {
  role: "admin";
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return "role" in user && user.role === "admin";
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    console.log("Permissions:", user.permissions); // Type narrowed to Admin
  } else {
    console.log("Regular user:", user.email);
  }
}

// Type guard avec générique
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function processValue<T>(value: T | T[]) {
  if (isArray(value)) {
    value.forEach(item => console.log(item)); // T[]
  } else {
    console.log(value); // T
  }
}

processValue(42);           // 42
processValue([1, 2, 3]);    // 1, 2, 3
```

### Equality Narrowing

```typescript
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status, adminStatus: Status) {
  // Equality narrowing
  if (status === adminStatus) {
    // TypeScript sait que les deux ont le même type littéral
    console.log(`Both are: ${status}`);
  }
  
  // Truthiness narrowing
  function printLength(str: string | null) {
    if (str) {
      console.log(str.length); // string
    } else {
      console.log("No string"); // null
    }
  }
}
```

## Intersection Types

### Qu'est-ce qu'un Intersection Type ?

Un **Intersection Type** combine plusieurs types en un seul. L'objet doit satisfaire TOUS les types. Il utilise l'opérateur `&`.

```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

// Intersection: doit avoir name ET age
type Person = HasName & HasAge;

const person: Person = {
  name: "Alice",
  age: 30
  // Doit avoir les deux propriétés
};

// ❌ Erreur : manque 'age'
const invalid: Person = {
  name: "Bob"
};
```

### Intersection d'Interfaces

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Author {
  authorId: string;
  authorName: string;
}

interface Article {
  title: string;
  content: string;
}

// Combiner plusieurs interfaces
type BlogPost = Article & Timestamped & Author;

const post: BlogPost = {
  // Article
  title: "TypeScript Tips",
  content: "...",
  // Timestamped
  createdAt: new Date(),
  updatedAt: new Date(),
  // Author
  authorId: "123",
  authorName: "Alice"
};
```

### Intersection avec Types Primitifs

```typescript
// Intersection de types primitifs (souvent inutile)
type NeverType = string & number; // never (impossible)

// Mais utile avec des types littéraux
type Admin = { role: "admin" };
type User = { role: "user" };

type AdminUser = Admin & User; // never (role ne peut pas être "admin" ET "user")

// Intersection utile avec des propriétés différentes
type ReadOnly = { readonly id: number };
type Mutable = { name: string };

type ReadOnlyWithName = ReadOnly & Mutable;

const obj: ReadOnlyWithName = { id: 1, name: "Test" };
obj.name = "Updated"; // ✅ OK
obj.id = 2;           // ❌ Erreur : readonly
```

### Mixins avec Intersection Types

```typescript
// Pattern Mixin
class Disposable {
  isDisposed: boolean = false;
  dispose() {
    this.isDisposed = true;
  }
}

class Activatable {
  isActive: boolean = false;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

// Intersection de classes
type SmartObject = Disposable & Activatable;

// Fonction pour créer un mixin
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
    });
  });
}

class SmartObjectImpl implements SmartObject {
  // Disposable
  isDisposed: boolean = false;
  dispose!: () => void;
  
  // Activatable
  isActive: boolean = false;
  activate!: () => void;
  deactivate!: () => void;
  
  constructor() {
    // Logique propre
  }
}

applyMixins(SmartObjectImpl, [Disposable, Activatable]);

const smartObj = new SmartObjectImpl();
smartObj.activate();
console.log(smartObj.isActive); // true
smartObj.dispose();
console.log(smartObj.isDisposed); // true
```

### Extending Types avec Intersection

```typescript
// Type de base
type Entity = {
  id: string;
  createdAt: Date;
};

// Étendre avec intersection
type User = Entity & {
  name: string;
  email: string;
};

type Post = Entity & {
  title: string;
  content: string;
  authorId: string;
};

const user: User = {
  id: "u1",
  createdAt: new Date(),
  name: "Alice",
  email: "alice@example.com"
};

const post: Post = {
  id: "p1",
  createdAt: new Date(),
  title: "Hello",
  content: "World",
  authorId: "u1"
};
```

## Union vs Intersection

### Différences Clés

```typescript
// UNION (|) : OU - Au moins un des types
type A = { a: string };
type B = { b: number };

type AOrB = A | B;

const union1: AOrB = { a: "hello" };           // ✅ A
const union2: AOrB = { b: 42 };                // ✅ B
const union3: AOrB = { a: "hi", b: 10 };       // ✅ A et B
// const union4: AOrB = { c: true };           // ❌ Ni A ni B

// INTERSECTION (&) : ET - Tous les types
type AAndB = A & B;

const inter1: AAndB = { a: "hello", b: 42 };   // ✅ A ET B
// const inter2: AAndB = { a: "hello" };       // ❌ Manque B
// const inter3: AAndB = { b: 42 };            // ❌ Manque A
```

### Cas d'Usage Pratiques

```typescript
// Union: État qui peut être dans différents modes
type LoadingState = { status: "loading" };
type ErrorState = { status: "error"; error: string };
type SuccessState<T> = { status: "success"; data: T };

type AsyncState<T> = LoadingState | ErrorState | SuccessState<T>;

// Intersection: Combiner des fonctionnalités
interface Loggable {
  log: () => void;
}

interface Serializable {
  serialize: () => string;
}

type LoggableSerializable = Loggable & Serializable;

class DataObject implements LoggableSerializable {
  data: any;
  
  log() {
    console.log(this.data);
  }
  
  serialize() {
    return JSON.stringify(this.data);
  }
}
```

### Combinaison Union + Intersection

```typescript
// Type complexe utilisant les deux
type Shape = 
  | { type: "circle"; radius: number }
  | { type: "rectangle"; width: number; height: number };

type ColoredShape = Shape & { color: string };

const circle: ColoredShape = {
  type: "circle",
  radius: 10,
  color: "red"
};

const rectangle: ColoredShape = {
  type: "rectangle",
  width: 20,
  height: 30,
  color: "blue"
};

function getArea(shape: Shape): number {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

## Exercices Pratiques

### Exercice 1 : API Response Types

Créez des types pour gérer les réponses d'API :

```typescript
// Votre solution
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code: number };

function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    console.log("Data:", response.data);
  } else {
    console.error(`Error ${response.code}: ${response.error}`);
  }
}

// Test
const successResponse: ApiResponse<User[]> = {
  success: true,
  data: [{ id: 1, name: "Alice" }]
};

const errorResponse: ApiResponse<never> = {
  success: false,
  error: "Not found",
  code: 404
};

handleApiResponse(successResponse);
handleApiResponse(errorResponse);
```

### Exercice 2 : Type Guards Personnalisés

Créez des type guards pour valider des données :

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

function isProduct(obj: any): obj is Product {
  return (
    typeof obj === "object" &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number"
  );
}

// Utilisation
function processData(data: unknown) {
  if (isProduct(data)) {
    console.log(`Product: ${data.name} - $${data.price}`);
  } else {
    console.log("Invalid product data");
  }
}

processData({ id: 1, name: "Book", price: 29.99 }); // Product
processData({ id: 1, name: "Book" }); // Invalid
```

### Exercice 3 : Feature Flags avec Intersection

```typescript
interface BaseConfig {
  apiUrl: string;
  timeout: number;
}

interface AnalyticsFeature {
  analytics: {
    enabled: boolean;
    trackingId: string;
  };
}

interface ExperimentalFeature {
  experimental: {
    newUI: boolean;
    betaFeatures: boolean;
  };
}

// Configuration complète
type AppConfig = BaseConfig & AnalyticsFeature & ExperimentalFeature;

const config: AppConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  analytics: {
    enabled: true,
    trackingId: "UA-12345"
  },
  experimental: {
    newUI: false,
    betaFeatures: true
  }
};
```

## Résumé

**Union Types (|) :**
- Permet plusieurs types possibles
- "OU" logique entre types
- Nécessite type narrowing pour accéder aux propriétés spécifiques
- Discriminated unions pour pattern matching
- Cas d'usage : États multiples, valeurs alternatives

**Intersection Types (&) :**
- Combine plusieurs types
- "ET" logique entre types
- L'objet doit satisfaire tous les types
- Utile pour mixins et composition
- Cas d'usage : Étendre des types, features combinées

**Type Narrowing :**
- typeof, instanceof, in operator
- Custom type guards (is)
- Equality et truthiness narrowing
- Essentiel pour travailler avec unions

Dans le prochain chapitre, nous explorerons les **Conditional Types** pour créer des types dynamiques basés sur des conditions.