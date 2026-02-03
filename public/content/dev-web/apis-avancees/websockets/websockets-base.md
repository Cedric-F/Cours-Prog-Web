# WebSockets - Base

Découvrez les **WebSockets** pour établir une communication **bidirectionnelle** en temps réel entre le client et le serveur.

---

## Qu'est-ce qu'un WebSocket ?

**WebSocket** est un protocole de communication qui permet une connexion **persistante** et **bidirectionnelle** entre le client et le serveur.

### HTTP vs WebSocket

```
HTTP (Request-Response)
Client  →  Request  →  Server
Client  ←  Response ←  Server
(Connexion fermée)

WebSocket (Bidirectionnel)
Client  ↔  Messages  ↔  Server
(Connexion ouverte en permanence)
```

### Avantages des WebSockets

✅ **Communication bidirectionnelle** : Client et serveur peuvent envoyer des messages à tout moment  
✅ **Temps réel** : Latence minimale (~1-2ms)  
✅ **Connexion persistante** : Pas besoin de re-connecter à chaque message  
✅ **Moins de overhead** : Headers HTTP uniquement lors du handshake  
✅ **Événements push** : Le serveur peut pousser des données sans requête

### Cas d'usage

- 💬 **Chat en temps réel** (Slack, Discord)
- 🎮 **Jeux multijoueurs** (WebRTC gaming)
- 📊 **Dashboards live** (Analytics, trading)
- 📝 **Édition collaborative** (Google Docs, Figma)
- 🔔 **Notifications push** (Alertes, updates)
- 📹 **Streaming** (Video, audio)

---

## Créer une connexion WebSocket

### Syntaxe de base

```javascript
// Créer une connexion WebSocket
const socket = new WebSocket('ws://localhost:8080');

// ws:// pour HTTP
// wss:// pour HTTPS (sécurisé)
```

### Événements WebSocket

```javascript
const socket = new WebSocket('ws://localhost:8080');

// 1. Connexion ouverte
socket.addEventListener('open', (event) => {
  console.log('✅ Connexion établie');
  socket.send('Hello Server!');
});

// 2. Message reçu
socket.addEventListener('message', (event) => {
  console.log('📨 Message reçu:', event.data);
});

// 3. Erreur
socket.addEventListener('error', (error) => {
  console.error('❌ Erreur:', error);
});

// 4. Connexion fermée
socket.addEventListener('close', (event) => {
  console.log('🔌 Connexion fermée', event.code, event.reason);
});
```

### États de la connexion

```javascript
const socket = new WebSocket('ws://localhost:8080');

console.log(socket.readyState);

// WebSocket.CONNECTING = 0 (En cours de connexion)
// WebSocket.OPEN = 1 (Connexion ouverte)
// WebSocket.CLOSING = 2 (En cours de fermeture)
// WebSocket.CLOSED = 3 (Connexion fermée)

// Vérifier si ouvert
if (socket.readyState === WebSocket.OPEN) {
  socket.send('Message');
}
```

---

## Envoyer des messages

### Envoyer du texte

```javascript
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
  // Texte simple
  socket.send('Hello!');
  
  // JSON
  socket.send(JSON.stringify({
    type: 'message',
    text: 'Hello!',
    userId: 123
  }));
});
```

### Envoyer des données binaires

```javascript
// ArrayBuffer
const buffer = new ArrayBuffer(8);
socket.send(buffer);

// Blob
const blob = new Blob(['Hello'], { type: 'text/plain' });
socket.send(blob);

// File
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
socket.send(file);
```

---

## Recevoir des messages

### Parser les messages

```javascript
socket.addEventListener('message', (event) => {
  const data = event.data;
  
  // Texte simple
  if (typeof data === 'string') {
    console.log('Text:', data);
    
    // Parser JSON si nécessaire
    try {
      const json = JSON.parse(data);
      console.log('JSON:', json);
    } catch (e) {
      // Pas du JSON
    }
  }
  
  // Blob
  if (data instanceof Blob) {
    console.log('Blob received');
    data.text().then(text => console.log(text));
  }
  
  // ArrayBuffer
  if (data instanceof ArrayBuffer) {
    console.log('Binary data received');
  }
});
```

### Gérer différents types de messages

```javascript
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'chat':
      displayChatMessage(message.text, message.user);
      break;
    
    case 'notification':
      showNotification(message.content);
      break;
    
    case 'update':
      updateData(message.data);
      break;
    
    default:
      console.warn('Unknown message type:', message.type);
  }
});

function displayChatMessage(text, user) {
  const messageEl = document.createElement('div');
  messageEl.textContent = `${user}: ${text}`;
  document.getElementById('chat').appendChild(messageEl);
}
```

---

## Fermer la connexion

### Fermeture propre

```javascript
// Fermer avec code et raison
socket.close(1000, 'Normal closure');

// Codes de fermeture standards
// 1000 : Normal closure
// 1001 : Going away (page fermée)
// 1002 : Protocol error
// 1003 : Unsupported data
// 1006 : Abnormal closure (pas de close frame)
// 1011 : Server error
```

### Détecter la fermeture

```javascript
socket.addEventListener('close', (event) => {
  console.log('Fermé avec code:', event.code);
  console.log('Raison:', event.reason);
  console.log('Clean close:', event.wasClean);
  
  if (!event.wasClean) {
    console.log('⚠️ Connexion perdue de manière inattendue');
  }
});
```

---

## Exemple complet : Chat simple

### Client HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat WebSocket</title>
  <style>
    #messages {
      height: 300px;
      overflow-y: scroll;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
    }
    .message {
      margin: 5px 0;
      padding: 5px;
      background: #f0f0f0;
      border-radius: 3px;
    }
    .my-message {
      background: #d4edff;
      text-align: right;
    }
  </style>
</head>
<body>
  <h1>💬 Chat WebSocket</h1>
  
  <div id="status">🔌 Déconnecté</div>
  
  <div id="messages"></div>
  
  <input type="text" id="username" placeholder="Votre nom" />
  <input type="text" id="messageInput" placeholder="Message..." />
  <button id="sendBtn">Envoyer</button>
  
  <script>
    const messagesDiv = document.getElementById('messages');
    const statusDiv = document.getElementById('status');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Connexion au serveur WebSocket
    const socket = new WebSocket('ws://localhost:8080');
    
    // Connexion ouverte
    socket.addEventListener('open', () => {
      statusDiv.textContent = '✅ Connecté';
      statusDiv.style.color = 'green';
    });
    
    // Message reçu
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      displayMessage(message);
    });
    
    // Erreur
    socket.addEventListener('error', (error) => {
      console.error('Erreur WebSocket:', error);
      statusDiv.textContent = '❌ Erreur de connexion';
      statusDiv.style.color = 'red';
    });
    
    // Connexion fermée
    socket.addEventListener('close', () => {
      statusDiv.textContent = '🔌 Déconnecté';
      statusDiv.style.color = 'gray';
    });
    
    // Envoyer un message
    function sendMessage() {
      const username = usernameInput.value.trim() || 'Anonyme';
      const text = messageInput.value.trim();
      
      if (!text) return;
      
      if (socket.readyState === WebSocket.OPEN) {
        const message = {
          type: 'chat',
          username,
          text,
          timestamp: Date.now()
        };
        
        socket.send(JSON.stringify(message));
        messageInput.value = '';
        
        // Afficher mon message
        displayMessage({ ...message, isMe: true });
      } else {
        alert('Pas connecté au serveur');
      }
    }
    
    // Afficher un message
    function displayMessage(message) {
      const messageEl = document.createElement('div');
      messageEl.className = message.isMe ? 'message my-message' : 'message';
      
      const time = new Date(message.timestamp).toLocaleTimeString();
      messageEl.innerHTML = `
        <strong>${message.username}</strong>
        <span style="font-size: 0.8em; color: #666;">${time}</span>
        <br>
        ${message.text}
      `;
      
      messagesDiv.appendChild(messageEl);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  </script>
</body>
</html>
```

### Serveur Node.js (avec ws)

```javascript
// npm install ws
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 WebSocket server lancé sur ws://localhost:8080');

// Stocker tous les clients connectés
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('✅ Nouveau client connecté');
  
  // Ajouter le client
  clients.add(ws);
  
  // Message reçu
  ws.on('message', (data) => {
    console.log('📨 Message reçu:', data.toString());
    
    // Broadcaster à tous les clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });
  
  // Client déconnecté
  ws.on('close', () => {
    console.log('❌ Client déconnecté');
    clients.delete(ws);
  });
  
  // Erreur
  ws.on('error', (error) => {
    console.error('❌ Erreur:', error);
    clients.delete(ws);
  });
});
```

---

## Protocole WebSocket

### Handshake HTTP

Le WebSocket commence par un **handshake HTTP** :

```http
GET /chat HTTP/1.1
Host: localhost:8080
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

Après le handshake, la connexion passe en **mode WebSocket** (binaire).

### Format des frames

```
Frame WebSocket:
┌─────────────────────────────┐
│ FIN | RSV | Opcode (4 bits) │
│ Mask | Payload length       │
│ Masking key (si masqué)     │
│ Payload data                │
└─────────────────────────────┘
```

**Opcodes** :
- `0x0` : Continuation frame
- `0x1` : Text frame
- `0x2` : Binary frame
- `0x8` : Close frame
- `0x9` : Ping frame
- `0xA` : Pong frame

---

## Ping / Pong

Les WebSockets supportent des **heartbeats** pour détecter les connexions mortes.

### Serveur envoie Ping

```javascript
// Serveur
setInterval(() => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.ping();
    }
  });
}, 30000);  // Toutes les 30 secondes

// Client répond automatiquement avec Pong
```

### Détecter les connexions mortes

```javascript
// Serveur
const clients = new Map();

wss.on('connection', (ws) => {
  clients.set(ws, { isAlive: true });
  
  ws.on('pong', () => {
    clients.get(ws).isAlive = true;
  });
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Vérifier toutes les 30 secondes
setInterval(() => {
  clients.forEach((data, ws) => {
    if (!data.isAlive) {
      console.log('💀 Client mort, fermeture...');
      return ws.terminate();
    }
    
    data.isAlive = false;
    ws.ping();
  });
}, 30000);
```

---

## Sécurité

### Utiliser WSS (WebSocket Secure)

```javascript
// HTTPS nécessite WSS
const socket = new WebSocket('wss://example.com/socket');
```

### Authentification

```javascript
// Envoyer un token d'authentification
socket.addEventListener('open', () => {
  socket.send(JSON.stringify({
    type: 'auth',
    token: localStorage.getItem('authToken')
  }));
});

// Serveur vérifie le token
ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.type === 'auth') {
    if (verifyToken(message.token)) {
      ws.isAuthenticated = true;
      ws.send(JSON.stringify({ type: 'auth', success: true }));
    } else {
      ws.close(4001, 'Unauthorized');
    }
  }
});
```

### Validation des messages

```javascript
// Toujours valider côté serveur
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    
    // Vérifier le type
    if (!['chat', 'action', 'update'].includes(message.type)) {
      return ws.send(JSON.stringify({ error: 'Invalid type' }));
    }
    
    // Vérifier les champs requis
    if (message.type === 'chat' && !message.text) {
      return ws.send(JSON.stringify({ error: 'Missing text' }));
    }
    
    // Sanitize l'input
    message.text = sanitize(message.text);
    
    // Traiter le message
    handleMessage(ws, message);
  } catch (e) {
    ws.send(JSON.stringify({ error: 'Invalid JSON' }));
  }
});
```

---

## Bonnes pratiques

1. ✅ **Vérifier readyState** avant d'envoyer
2. ✅ **Gérer les erreurs** avec try/catch
3. ✅ **Utiliser WSS** en production
4. ✅ **Implémenter reconnexion** automatique
5. ✅ **Valider les messages** côté serveur
6. ✅ **Utiliser Ping/Pong** pour heartbeat
7. ❌ **Pas de données sensibles** sans chiffrement

---

## Exercice pratique

Créez un **Chat en temps réel** avec :
- Connexion WebSocket
- Envoi/réception de messages
- Liste des utilisateurs connectés
- Indicateur de saisie ("X is typing...")
- Gestion des déconnexions

**Bonus** : Ajoutez l'authentification et les rooms !

---

**Prochaine étape** : [Gestion Avancée](./websockets-avances) pour la reconnexion, les rooms et la gestion d'erreurs !
