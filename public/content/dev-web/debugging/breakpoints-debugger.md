# Breakpoints et Debugger

Arrêtez de mettre des `console.log()` partout ! Le debugger est bien plus puissant pour comprendre ce qui se passe dans votre code.

## Le mot-clé `debugger`

La façon la plus simple de créer un point d'arrêt :

```javascript
function processOrder(order) {
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  
  debugger; // L'exécution s'arrête ici quand DevTools est ouvert
  
  if (total > 100) {
    applyDiscount(order);
  }
  return total;
}
```

> ⚠️ **Important** : `debugger` ne fonctionne que si les DevTools sont ouverts !

---

## Breakpoints dans DevTools

### Accéder aux Sources

1. Ouvrez DevTools (`F12`)
2. Allez dans l'onglet **Sources**
3. Trouvez votre fichier dans le panneau de gauche
4. Cliquez sur le numéro de ligne pour ajouter un breakpoint

### Types de breakpoints

#### 🔴 Breakpoint standard
Cliquez sur le numéro de ligne. L'exécution s'arrête à chaque passage.

#### 🔵 Breakpoint conditionnel
Clic droit > "Add conditional breakpoint"

```javascript
// S'arrête uniquement si la condition est vraie
user.age > 18 && user.country === "FR"
```

Utile pour débugger un cas spécifique dans une boucle :

```javascript
for (const user of users) {
  processUser(user); // Breakpoint conditionnel: user.id === 42
}
```

#### 📝 Logpoint
Clic droit > "Add logpoint"

Affiche un message sans arrêter l'exécution :
```
"Processing user:", user.name, "with age:", user.age
```

C'est un `console.log` sans modifier le code !

---

## Contrôles de navigation

Quand l'exécution est en pause :

| Bouton | Action | Raccourci |
|--------|--------|-----------|
| ▶️ Resume | Reprendre jusqu'au prochain breakpoint | `F8` |
| ⏭️ Step Over | Exécuter la ligne (sans entrer dans les fonctions) | `F10` |
| ⏬ Step Into | Entrer dans la fonction appelée | `F11` |
| ⏫ Step Out | Sortir de la fonction actuelle | `Shift + F11` |

### Exemple pratique

```javascript
function main() {
  const data = fetchData();    // Step Over : exécute sans entrer
  const result = process(data); // Step Into : entre dans process()
  display(result);
}

function process(data) {       // Vous êtes ici après Step Into
  const cleaned = clean(data);
  const validated = validate(cleaned);
  return validated;            // Step Out : retourne à main()
}
```

---

## Panneau de débogage

### Variables (Scope)
Affiche toutes les variables accessibles :
- **Local** : Variables de la fonction actuelle
- **Closure** : Variables capturées par closure
- **Global** : Variables globales (window)

### Call Stack
La pile d'appels vous montre comment vous êtes arrivé là :

```
▼ process (app.js:15)
  main (app.js:5)
  (anonymous) (app.js:25)
```

Cliquez sur une ligne pour voir le contexte à ce niveau.

### Watch
Ajoutez des expressions à surveiller :

```javascript
user.orders.length
total * 1.2
isValid && hasPermission
```

Les valeurs se mettent à jour à chaque step.

---

## Breakpoints spéciaux

### Event Listener Breakpoints

Sources > Event Listener Breakpoints

Cochez les événements pour vous arrêter automatiquement :
- Mouse > click
- Keyboard > keydown
- Timer > setTimeout fired

### XHR/Fetch Breakpoints

S'arrêter quand une requête contient une URL spécifique :

1. Sources > XHR/Fetch Breakpoints
2. Cliquez sur "+"
3. Entrez une partie de l'URL : `api/users`

### DOM Breakpoints

Clic droit sur un élément dans l'inspecteur > "Break on..." :
- **Subtree modifications** : Enfants ajoutés/supprimés
- **Attribute modifications** : Attributs modifiés
- **Node removal** : Élément supprimé

Très utile pour comprendre quel code modifie le DOM !

---

## Blackboxing (ignorer les fichiers)

Pour ne pas entrer dans les fichiers de librairies :

1. Clic droit sur un fichier dans Sources
2. "Add script to ignore list"

Ou dans Settings > Ignore List :
```
/node_modules/
/vendor/
jquery\.min\.js
```

Le debugger "saute" ces fichiers lors du Step Into.

---

## Debugging asynchrone

### Async Call Stack

DevTools montre la pile même pour le code asynchrone :

```javascript
async function loadUser() {
  const response = await fetch('/api/user'); // Breakpoint ici
  const user = await response.json();
  return user;
}

// Call Stack affichera d'où loadUser() a été appelé
```

### Pause on Exceptions

Le bouton ⏸️ dans Sources permet de :
- **Pause on uncaught exceptions** : S'arrêter sur les erreurs non catchées
- **Pause on caught exceptions** : S'arrêter même sur les erreurs catchées

---

## Workflow de debug efficace

### 1. Reproduire le bug
Identifiez les étapes exactes pour reproduire le problème.

### 2. Formuler une hypothèse
"Je pense que le problème vient de cette fonction..."

### 3. Placer les breakpoints
Mettez des breakpoints avant la zone suspecte.

### 4. Inspecter les variables
Vérifiez si les valeurs correspondent à vos attentes.

### 5. Isoler le problème
Utilisez Step Over/Into pour trouver la ligne exacte.

### 6. Corriger et vérifier
Modifiez le code et vérifiez que le bug est résolu.

---

## Exercice : Trouvez le bug

```javascript
function calculateTotal(cart) {
  let total = 0;
  
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  
  // Bug : le discount n'est pas appliqué correctement
  if (cart.discount) {
    total = total - cart.discount;
  }
  
  return total;
}

const cart = {
  items: [
    { name: "Book", price: 20, quantity: 2 },
    { name: "Pen", price: 5, quantity: 3 }
  ],
  discount: 10
};

console.log(calculateTotal(cart)); // NaN - Pourquoi?
```

<details>
<summary>💡 Indice</summary>

Mettez un breakpoint dans la boucle et inspectez la variable `cart`. Est-ce que `cart.items` existe ?

</details>

<details>
<summary>✅ Solution</summary>

Le problème : on itère sur `cart` au lieu de `cart.items` !

```javascript
for (const item of cart.items) { // Correction
  total += item.price * item.quantity;
}
```

</details>

---

## Raccourcis essentiels

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Ouvrir DevTools | `F12` / `Ctrl+Shift+I` | `Cmd+Option+I` |
| Onglet Sources | `Ctrl+Shift+P` > "sources" | `Cmd+Shift+P` |
| Chercher un fichier | `Ctrl+P` | `Cmd+P` |
| Chercher dans le code | `Ctrl+Shift+F` | `Cmd+Option+F` |
| Resume | `F8` | `F8` |
| Step Over | `F10` | `F10` |
| Step Into | `F11` | `F11` |
| Step Out | `Shift+F11` | `Shift+F11` |
