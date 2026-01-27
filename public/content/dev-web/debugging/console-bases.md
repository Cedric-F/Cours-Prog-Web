# Console : Au-delà de console.log

La console du navigateur est bien plus puissante qu'un simple `console.log()`. Maîtriser ses fonctionnalités vous fera gagner un temps considérable.

## Ouvrir les DevTools

| Système | Raccourci |
|---------|-----------|
| Windows/Linux | `F12` ou `Ctrl + Shift + I` |
| Mac | `Cmd + Option + I` |

> 💡 **Astuce** : `Ctrl + Shift + J` (ou `Cmd + Option + J` sur Mac) ouvre directement l'onglet Console.

---

## Les différentes méthodes console

### console.log() - Le classique

```javascript
const user = { name: "Alice", age: 25 };
console.log(user);
console.log("Utilisateur:", user);
```

### console.table() - Affichage tabulaire

Parfait pour les tableaux et objets :

```javascript
const users = [
  { name: "Alice", age: 25, city: "Paris" },
  { name: "Bob", age: 30, city: "Lyon" },
  { name: "Charlie", age: 28, city: "Marseille" }
];

console.table(users);
// Affiche un tableau formaté avec colonnes cliquables pour trier
```

### console.group() - Organiser les logs

```javascript
console.group("Chargement utilisateur");
console.log("Récupération des données...");
console.log("Parsing JSON...");
console.log("Mise à jour du state...");
console.groupEnd();

// Les logs sont regroupés et repliables
```

### console.time() - Mesurer les performances

```javascript
console.time("fetch-users");

await fetch("/api/users");

console.timeEnd("fetch-users");
// Affiche: fetch-users: 234.5ms
```

### console.count() - Compter les appels

```javascript
function handleClick() {
  console.count("clicks");
  // clicks: 1, clicks: 2, clicks: 3...
}
```

### console.assert() - Assertions

```javascript
const age = 15;
console.assert(age >= 18, "L'utilisateur doit être majeur!", { age });
// N'affiche rien si la condition est vraie
// Affiche l'erreur si la condition est fausse
```

### console.trace() - Stack trace

```javascript
function a() { b(); }
function b() { c(); }
function c() { 
  console.trace("Où suis-je?");
}
a();
// Affiche la pile d'appels complète
```

---

## Styling des logs

Vous pouvez styliser vos logs avec CSS :

```javascript
console.log(
  "%c🚀 Application démarrée!",
  "color: green; font-size: 20px; font-weight: bold;"
);

console.log(
  "%cSuccès%c Données chargées",
  "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;",
  "color: inherit;"
);
```

---

## Console interactive

### Accéder aux éléments

```javascript
// Dernier élément sélectionné dans l'inspecteur
$0 

// Les 5 derniers éléments sélectionnés
$0, $1, $2, $3, $4

// Raccourcis jQuery-like (même sans jQuery)
$("selector")      // document.querySelector
$$("selector")     // document.querySelectorAll
```

### Copier des données

```javascript
// Copie dans le presse-papier
copy(someObject)

// Copier un objet en JSON formaté
copy(JSON.stringify(data, null, 2))
```

### Monitorer les événements

```javascript
// Surveiller tous les événements d'un élément
monitorEvents($0)

// Surveiller des événements spécifiques
monitorEvents($0, ["click", "keydown"])

// Arrêter la surveillance
unmonitorEvents($0)
```

---

## Bonnes pratiques

### ❌ À éviter en production

```javascript
// Laisser des console.log partout
console.log("debug:", data); // À supprimer avant commit!
```

### ✅ Utiliser un logger conditionnel

```javascript
const isDev = process.env.NODE_ENV === "development";

const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => console.error(...args), // Garder les erreurs
  table: (...args) => isDev && console.table(...args),
};

// Utilisation
logger.log("Debug info"); // N'apparaît qu'en dev
```

---

## Exercice pratique

Ouvrez la console de votre navigateur et essayez :

```javascript
// 1. Créez un tableau d'objets et affichez-le avec console.table
const products = [
  { name: "Laptop", price: 999, stock: 5 },
  { name: "Phone", price: 699, stock: 12 },
  { name: "Tablet", price: 449, stock: 8 }
];
console.table(products);

// 2. Mesurez le temps d'une opération
console.time("loop");
for (let i = 0; i < 1000000; i++) {}
console.timeEnd("loop");

// 3. Créez un log stylisé
console.log("%c✨ Bravo!", "font-size: 24px; color: gold;");
```

---

## Ressources

- [MDN - Console API](https://developer.mozilla.org/fr/docs/Web/API/Console)
- [Chrome DevTools Console](https://developer.chrome.com/docs/devtools/console/)
