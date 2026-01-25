# PWA & Manifest

Transformez votre application web en **Progressive Web App** installable avec un **manifest.json** et des **notifications push**.

---

## Qu'est-ce qu'une PWA ?

Une **Progressive Web App** est une application web qui :
- ✅ Fonctionne **offline**
- ✅ Est **installable** sur l'appareil
- ✅ Se comporte comme une **app native**
- ✅ Envoie des **notifications push**
- ✅ Fonctionne sur **tous les navigateurs**

### Critères PWA

```
✅ HTTPS
✅ Service Worker
✅ manifest.json
✅ Icônes (192px, 512px)
✅ Responsive design
✅ Page offline
```

---

## Le fichier manifest.json

### Structure de base

```json
{
  "name": "Mon Application",
  "short_name": "MonApp",
  "description": "Une Progressive Web App géniale",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Lier le manifest

```html
<!-- index.html -->
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#4285f4">
</head>
```

---

## Propriétés du manifest

### name et short_name

```json
{
  "name": "Mon Application Incroyable",  // Nom complet (écran de bienvenue)
  "short_name": "MonApp"  // Nom court (écran d'accueil, 12 caractères max)
}
```

### start_url

```json
{
  "start_url": "/?source=pwa",  // URL de démarrage avec tracking
  "scope": "/"  // Portée de la PWA
}
```

### display

```json
{
  "display": "standalone"
}
```

**Options** :
- `fullscreen` : Plein écran (jeux)
- `standalone` : Comme une app native (recommandé)
- `minimal-ui` : Avec barre d'URL minimale
- `browser` : Navigateur normal

### orientation

```json
{
  "orientation": "portrait"
}
```

**Options** : `portrait`, `landscape`, `any`

### Couleurs

```json
{
  "theme_color": "#4285f4",  // Couleur de la barre d'état
  "background_color": "#ffffff"  // Couleur de l'écran de démarrage
}
```

### Icônes

```json
{
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Catégorie

```json
{
  "categories": ["productivity", "utilities"]
}
```

---

## Détecter l'installation

### Événement beforeinstallprompt

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Empêcher le prompt automatique
  e.preventDefault();
  
  // Sauvegarder l'événement
  deferredPrompt = e;
  
  // Afficher le bouton d'installation
  document.getElementById('install-btn').style.display = 'block';
});

// Bouton d'installation personnalisé
document.getElementById('install-btn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  // Afficher le prompt
  deferredPrompt.prompt();
  
  // Attendre le choix de l'utilisateur
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('✅ PWA installée');
  } else {
    console.log('❌ Installation refusée');
  }
  
  deferredPrompt = null;
  document.getElementById('install-btn').style.display = 'none';
});
```

### Détecter si déjà installée

```javascript
// iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.navigator.standalone;

// Android
const isAndroid = window.matchMedia('(display-mode: standalone)').matches;

if (isStandalone || isAndroid) {
  console.log('✅ App installée');
} else {
  console.log('❌ App non installée');
}
```

### Événement appinstalled

```javascript
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installée avec succès');
  
  // Analytics
  gtag('event', 'pwa_installed');
});
```

---

## Notifications Push

### Demander la permission

```javascript
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('✅ Notifications autorisées');
    return true;
  } else if (permission === 'denied') {
    console.log('❌ Notifications refusées');
    return false;
  }
}

// Utilisation
document.getElementById('enable-notifications').addEventListener('click', async () => {
  const granted = await requestNotificationPermission();
  
  if (granted) {
    await subscribeUserToPush();
  }
});
```

### S'abonner aux notifications

```javascript
async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
  });
  
  // Envoyer au serveur
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
  
  console.log('✅ Abonné aux notifications');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
```

### Recevoir les notifications (Service Worker)

```javascript
// sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    },
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

---

## Splash Screen

### Configuration automatique

Le navigateur génère un splash screen avec :
- `name` du manifest
- `background_color`
- `icons` (512x512)

### Splash screen personnalisé

```html
<!-- index.html -->
<style>
  #splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  #splash-screen.hidden {
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }
</style>

<div id="splash-screen">
  <img src="/logo.png" alt="Logo" width="200">
</div>

<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('splash-screen').classList.add('hidden');
    }, 1000);
  });
</script>
```

---

## Mise à jour de la PWA

### Détecter les mises à jour

```javascript
let refreshing = false;

navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});

async function checkForUpdates() {
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration) {
    registration.update();
  }
}

// Vérifier toutes les heures
setInterval(checkForUpdates, 60 * 60 * 1000);
```

### Notification de mise à jour

```javascript
navigator.serviceWorker.register('/sw.js').then(registration => {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Nouvelle version disponible
        showUpdateNotification();
      }
    });
  });
});

function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <p>🎉 Nouvelle version disponible !</p>
    <button id="reload-btn">Recharger</button>
    <button id="dismiss-btn">Plus tard</button>
  `;
  
  document.body.appendChild(notification);
  
  document.getElementById('reload-btn').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('dismiss-btn').addEventListener('click', () => {
    notification.remove();
  });
}
```

---

## Audit PWA

### Lighthouse

1. Ouvrir Chrome DevTools
2. Aller dans **Lighthouse**
3. Cocher **Progressive Web App**
4. Cliquer sur **Generate report**

### Critères évalués

✅ **Installable** : manifest.json valide, Service Worker, HTTPS  
✅ **PWA optimized** : Splash screen, icônes, offline  
✅ **Performance** : Chargement rapide, responsive  
✅ **Accessibilité** : Contraste, navigation clavier  
✅ **Best practices** : HTTPS, pas d'erreurs console

---

## Exemple complet : PWA installable

### manifest.json

```json
{
  "name": "Todo App - PWA",
  "short_name": "TodoApp",
  "description": "Application de gestion de tâches offline-first",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#4285f4",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity"],
  "screenshots": [
    {
      "src": "/screenshots/screenshot1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#4285f4">
  <title>Todo App - PWA</title>
  
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
  
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <h1>📝 Todo App</h1>
    <button id="install-btn" style="display: none;">Installer l'app</button>
  </header>
  
  <main id="app"></main>
  
  <script src="/app.js"></script>
</body>
</html>
```

---

## Bonnes pratiques

1. ✅ **Icônes multiples** (192px, 512px minimum)
2. ✅ **start_url avec tracking** (?source=pwa)
3. ✅ **display: standalone** pour expérience native
4. ✅ **Service Worker** pour offline
5. ✅ **Page offline** de qualité
6. ✅ **HTTPS obligatoire** (sauf localhost)
7. ✅ **Audit Lighthouse** régulier

---

## Exercice pratique

Créez une **PWA complète** avec :
- manifest.json configuré
- Icônes 192px et 512px
- Bouton d'installation personnalisé
- Service Worker offline
- Notifications push
- Splash screen

**Bonus** : Score Lighthouse PWA 100/100 !

---

🎉 **Félicitations** ! Vous maîtrisez maintenant les PWA ! 🚀

**Prochaine étape** : [IndexedDB Base](../indexeddb/indexeddb-base.md) pour le stockage avancé !
