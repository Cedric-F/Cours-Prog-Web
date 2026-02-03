# Gestion Avancée des WebSockets

Maîtrisez la **reconnexion automatique**, la **gestion des erreurs**, les **rooms** et les **patterns avancés** pour des WebSockets robustes en production.

---

## Reconnexion automatique

Une connexion WebSocket peut se fermer de manière inattendue. Il est essentiel d'implémenter une **reconnexion automatique**.

### Pattern de base

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;  // 1 seconde
    this.connect();
  }
  
  connect() {
    console.log('🔌 Connexion au serveur...');
    
    this.socket = new WebSocket(this.url);
    
    this.socket.addEventListener('open', () => {
      console.log('✅ Connecté');
      this.reconnectAttempts = 0;  // Reset le compteur
      this.onOpen();
    });
    
    this.socket.addEventListener('message', (event) => {
      this.onMessage(event);
    });
    
    this.socket.addEventListener('error', (error) => {
      console.error('❌ Erreur:', error);
    });
    
    this.socket.addEventListener('close', (event) => {
      console.log('🔌 Déconnecté');
      this.onClose(event);
      
      // Reconnexion si pas fermé intentionnellement
      if (event.code !== 1000) {
        this.reconnect();
      }
    });
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Nombre maximum de tentatives atteint');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`⏳ Reconnexion dans ${delay}ms (tentative ${this.reconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('⚠️ Socket pas prêt, message mis en file d\'attente');
      // Queue le message pour plus tard
    }
  }
  
  close() {
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
    }
  }
  
  // Méthodes à override
  onOpen() {}
  onMessage(event) {}
  onClose(event) {}
}

// Utilisation
const client = new WebSocketClient('ws://localhost:8080');

client.onOpen = () => {
  console.log('Je suis connecté !');
  client.send({ type: 'hello' });
};

client.onMessage = (event) => {
  console.log('Message:', event.data);
};
```

### Avec file d'attente de messages

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.messageQueue = [];
    this.connect();
  }
  
  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.addEventListener('open', () => {
      console.log('✅ Connecté');
      
      // Envoyer les messages en attente
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.socket.send(message);
      }
      
      this.onOpen();
    });
    
    this.socket.addEventListener('message', (event) => {
      this.onMessage(event);
    });
    
    this.socket.addEventListener('close', (event) => {
      if (event.code !== 1000) {
        this.reconnect();
      }
    });
  }
  
  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('📦 Message mis en file d\'attente');
      this.messageQueue.push(message);
    }
  }
  
  reconnect() {
    setTimeout(() => {
      console.log('⏳ Reconnexion...');
      this.connect();
    }, 2000);
  }
  
  onOpen() {}
  onMessage(event) {}
}
```

---

## Gestion des erreurs robuste

### Try/catch pour les messages

```javascript
socket.addEventListener('message', (event) => {
  try {
    const message = JSON.parse(event.data);
    handleMessage(message);
  } catch (error) {
    console.error('❌ Erreur parsing message:', error);
    // Envoyer une erreur au serveur
    socket.send(JSON.stringify({
      type: 'error',
      error: 'Invalid message format'
    }));
  }
});

function handleMessage(message) {
  if (!message.type) {
    throw new Error('Message sans type');
  }
  
  switch (message.type) {
    case 'chat':
      if (!message.text) throw new Error('Chat sans texte');
      displayChatMessage(message);
      break;
    
    case 'notification':
      showNotification(message);
      break;
    
    default:
      console.warn('Type de message inconnu:', message.type);
  }
}
```

### Timeout pour les messages

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.pendingRequests = new Map();
    this.messageId = 0;
    this.requestTimeout = 5000;  // 5 secondes
    this.connect();
  }
  
  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      
      // Si c'est une réponse à une requête
      if (message.requestId && this.pendingRequests.has(message.requestId)) {
        const { resolve, timeout } = this.pendingRequests.get(message.requestId);
        clearTimeout(timeout);
        this.pendingRequests.delete(message.requestId);
        resolve(message.data);
      } else {
        this.onMessage(message);
      }
    });
  }
  
  // Envoyer un message avec promesse
  async sendWithResponse(data) {
    return new Promise((resolve, reject) => {
      const requestId = ++this.messageId;
      
      // Timeout si pas de réponse
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, this.requestTimeout);
      
      this.pendingRequests.set(requestId, { resolve, reject, timeout });
      
      this.socket.send(JSON.stringify({
        ...data,
        requestId
      }));
    });
  }
  
  onMessage(message) {}
}

// Utilisation
const client = new WebSocketClient('ws://localhost:8080');

try {
  const response = await client.sendWithResponse({
    type: 'getUserData',
    userId: 123
  });
  
  console.log('Réponse:', response);
} catch (error) {
  console.error('Erreur ou timeout:', error);
}
```

---

## Rooms et Broadcasting

### Implémenter des rooms côté serveur

```javascript
// Serveur Node.js avec ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Stocker les rooms
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.id = generateId();
  ws.rooms = new Set();
  
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'joinRoom':
        joinRoom(ws, message.roomId);
        break;
      
      case 'leaveRoom':
        leaveRoom(ws, message.roomId);
        break;
      
      case 'sendToRoom':
        broadcastToRoom(message.roomId, message.data, ws);
        break;
      
      case 'broadcast':
        broadcastToAll(message.data, ws);
        break;
    }
  });
  
  ws.on('close', () => {
    // Retirer de toutes les rooms
    ws.rooms.forEach(roomId => {
      leaveRoom(ws, roomId);
    });
  });
});

function joinRoom(ws, roomId) {
  // Créer la room si elle n'existe pas
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  rooms.get(roomId).add(ws);
  ws.rooms.add(roomId);
  
  console.log(`✅ Client ${ws.id} a rejoint la room ${roomId}`);
  
  // Notifier les autres membres
  broadcastToRoom(roomId, {
    type: 'userJoined',
    userId: ws.id,
    roomId
  }, ws);
}

function leaveRoom(ws, roomId) {
  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);
    ws.rooms.delete(roomId);
    
    // Supprimer la room si vide
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    }
    
    console.log(`❌ Client ${ws.id} a quitté la room ${roomId}`);
    
    // Notifier les autres membres
    broadcastToRoom(roomId, {
      type: 'userLeft',
      userId: ws.id,
      roomId
    }, ws);
  }
}

function broadcastToRoom(roomId, data, excludeWs = null) {
  if (!rooms.has(roomId)) return;
  
  const message = JSON.stringify(data);
  
  rooms.get(roomId).forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastToAll(data, excludeWs = null) {
  const message = JSON.stringify(data);
  
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
```

### Client avec rooms

```javascript
class RoomClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.currentRoom = null;
    
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    });
  }
  
  joinRoom(roomId) {
    this.currentRoom = roomId;
    this.socket.send(JSON.stringify({
      type: 'joinRoom',
      roomId
    }));
  }
  
  leaveRoom(roomId) {
    this.socket.send(JSON.stringify({
      type: 'leaveRoom',
      roomId
    }));
    if (this.currentRoom === roomId) {
      this.currentRoom = null;
    }
  }
  
  sendToRoom(data) {
    if (!this.currentRoom) {
      console.warn('⚠️ Pas dans une room');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'sendToRoom',
      roomId: this.currentRoom,
      data
    }));
  }
  
  broadcast(data) {
    this.socket.send(JSON.stringify({
      type: 'broadcast',
      data
    }));
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'userJoined':
        console.log(`✅ ${message.userId} a rejoint la room`);
        this.onUserJoined(message);
        break;
      
      case 'userLeft':
        console.log(`❌ ${message.userId} a quitté la room`);
        this.onUserLeft(message);
        break;
      
      default:
        this.onMessage(message);
    }
  }
  
  onUserJoined(message) {}
  onUserLeft(message) {}
  onMessage(message) {}
}

// Utilisation
const client = new RoomClient('ws://localhost:8080');

client.onUserJoined = (message) => {
  console.log('Nouveau membre:', message.userId);
};

client.onMessage = (message) => {
  console.log('Message reçu:', message);
};

// Rejoindre une room
client.joinRoom('room-123');

// Envoyer un message à la room
client.sendToRoom({
  type: 'chat',
  text: 'Hello room!'
});
```

---

## Rate Limiting

### Limiter les messages côté client

```javascript
class RateLimitedWebSocket {
  constructor(url, maxMessagesPerSecond = 10) {
    this.socket = new WebSocket(url);
    this.maxMessagesPerSecond = maxMessagesPerSecond;
    this.messageTimestamps = [];
  }
  
  send(data) {
    const now = Date.now();
    
    // Nettoyer les timestamps > 1 seconde
    this.messageTimestamps = this.messageTimestamps.filter(
      timestamp => now - timestamp < 1000
    );
    
    // Vérifier si limite atteinte
    if (this.messageTimestamps.length >= this.maxMessagesPerSecond) {
      console.warn('⚠️ Rate limit atteint, message ignoré');
      return false;
    }
    
    this.messageTimestamps.push(now);
    this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    return true;
  }
}

const socket = new RateLimitedWebSocket('ws://localhost:8080', 5);  // Max 5 msg/s
```

### Rate limiting côté serveur

```javascript
const clients = new Map();

wss.on('connection', (ws) => {
  clients.set(ws, {
    messageCount: 0,
    lastReset: Date.now()
  });
  
  ws.on('message', (data) => {
    const clientData = clients.get(ws);
    const now = Date.now();
    
    // Reset le compteur toutes les secondes
    if (now - clientData.lastReset > 1000) {
      clientData.messageCount = 0;
      clientData.lastReset = now;
    }
    
    clientData.messageCount++;
    
    // Limiter à 10 messages par seconde
    if (clientData.messageCount > 10) {
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Rate limit exceeded'
      }));
      return;
    }
    
    // Traiter le message
    handleMessage(ws, data);
  });
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});
```

---

## Compression des messages

### Utiliser la compression WebSocket (permessage-deflate)

```javascript
// Serveur avec compression
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024  // Compresser uniquement si > 1KB
  }
});
```

### Compression custom JSON

```javascript
// Utiliser des clés courtes pour le JSON
function compressMessage(message) {
  return {
    t: message.type,      // type -> t
    u: message.userId,    // userId -> u
    m: message.text,      // text -> m
    ts: message.timestamp // timestamp -> ts
  };
}

function decompressMessage(compressed) {
  return {
    type: compressed.t,
    userId: compressed.u,
    text: compressed.m,
    timestamp: compressed.ts
  };
}

// Envoi
socket.send(JSON.stringify(compressMessage({
  type: 'chat',
  userId: 123,
  text: 'Hello',
  timestamp: Date.now()
})));

// Réception
socket.addEventListener('message', (event) => {
  const message = decompressMessage(JSON.parse(event.data));
});
```

---

## Monitoring et Debugging

### Logger toutes les activités

```javascript
class LoggedWebSocket {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.logs = [];
    
    this.socket.addEventListener('open', () => {
      this.log('OPEN', 'Connexion établie');
    });
    
    this.socket.addEventListener('message', (event) => {
      this.log('RECEIVE', event.data);
    });
    
    this.socket.addEventListener('close', (event) => {
      this.log('CLOSE', `Code: ${event.code}, Raison: ${event.reason}`);
    });
    
    this.socket.addEventListener('error', (error) => {
      this.log('ERROR', error);
    });
  }
  
  send(data) {
    this.log('SEND', data);
    this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
  }
  
  log(type, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      data
    };
    
    this.logs.push(logEntry);
    console.log(`[${logEntry.timestamp}] ${type}:`, data);
  }
  
  getLogs() {
    return this.logs;
  }
  
  exportLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-logs-${Date.now()}.json`;
    a.click();
  }
}
```

### Statistiques de connexion

```javascript
class StatsWebSocket {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.stats = {
      messagesSent: 0,
      messagesReceived: 0,
      bytesReceived: 0,
      bytesSent: 0,
      connectionTime: null,
      lastMessageTime: null
    };
    
    this.socket.addEventListener('open', () => {
      this.stats.connectionTime = Date.now();
    });
    
    this.socket.addEventListener('message', (event) => {
      this.stats.messagesReceived++;
      this.stats.bytesReceived += event.data.length;
      this.stats.lastMessageTime = Date.now();
    });
  }
  
  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.stats.messagesSent++;
    this.stats.bytesSent += message.length;
    this.socket.send(message);
  }
  
  getStats() {
    const uptime = this.stats.connectionTime 
      ? Date.now() - this.stats.connectionTime
      : 0;
    
    return {
      ...this.stats,
      uptime,
      avgBytesPerMessage: this.stats.messagesReceived > 0
        ? (this.stats.bytesReceived / this.stats.messagesReceived).toFixed(2)
        : 0
    };
  }
}
```

---

## Bonnes pratiques

1. ✅ **Reconnexion automatique** avec backoff exponentiel
2. ✅ **File d'attente** pour messages pendant déconnexion
3. ✅ **Timeout** pour les requêtes
4. ✅ **Rate limiting** côté client et serveur
5. ✅ **Validation** de tous les messages
6. ✅ **Logging** pour debugging
7. ✅ **Compression** pour grandes données

---

## Exercice pratique

Créez un **Chat avec rooms** incluant :
- Reconnexion automatique
- Système de rooms
- Rate limiting
- Indicateur de typing
- Historique des messages
- Statistiques de connexion

**Bonus** : Ajoutez la compression et le monitoring !

---

**Prochaine étape** : [Projets Pratiques](./websockets-pratique) pour construire des apps complètes !
