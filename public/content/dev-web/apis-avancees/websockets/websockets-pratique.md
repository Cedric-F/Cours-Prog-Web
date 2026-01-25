# Projets Pratiques WebSockets

Construisez des **applications complètes** en temps réel : chat, notifications, tableau collaboratif et plus encore !

---

## Projet 1 : Chat en Temps Réel

### Architecture complète

```
Client (React)
├── WebSocket connection
├── Chat interface
├── User list
├── Typing indicator
└── Message history

Server (Node.js + ws)
├── WebSocket server
├── Room management
├── User management
├── Message broadcasting
└── Persistence (optional)
```

### Client React complet

```jsx
// ChatApp.jsx
import { useState, useEffect, useRef } from 'react';
import './ChatApp.css';

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Connexion WebSocket
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.addEventListener('open', () => {
      console.log('✅ Connecté');
      setConnected(true);
    });
    
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    });
    
    ws.addEventListener('close', () => {
      console.log('❌ Déconnecté');
      setConnected(false);
    });
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, []);
  
  // Scroll auto vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Gérer les messages
  function handleMessage(message) {
    switch (message.type) {
      case 'chat':
        setMessages(prev => [...prev, message]);
        break;
      
      case 'userList':
        setUsers(message.users);
        break;
      
      case 'userJoined':
        setUsers(prev => [...prev, message.user]);
        addSystemMessage(`${message.user.username} a rejoint le chat`);
        break;
      
      case 'userLeft':
        setUsers(prev => prev.filter(u => u.id !== message.userId));
        addSystemMessage(`${message.username} a quitté le chat`);
        break;
      
      case 'typing':
        handleTyping(message);
        break;
      
      case 'history':
        setMessages(message.messages);
        break;
    }
  }
  
  function addSystemMessage(text) {
    setMessages(prev => [...prev, {
      type: 'system',
      text,
      timestamp: Date.now()
    }]);
  }
  
  function handleTyping(message) {
    if (message.isTyping) {
      setTypingUsers(prev => new Set(prev).add(message.username));
      
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(message.username);
          return newSet;
        });
      }, 3000);
    } else {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.username);
        return newSet;
      });
    }
  }
  
  // Rejoindre le chat
  function joinChat() {
    if (!username.trim()) return;
    
    socket.send(JSON.stringify({
      type: 'join',
      username: username.trim(),
      room: currentRoom
    }));
  }
  
  // Envoyer un message
  function sendMessage(e) {
    e.preventDefault();
    
    if (!inputMessage.trim() || !connected) return;
    
    socket.send(JSON.stringify({
      type: 'chat',
      text: inputMessage.trim(),
      room: currentRoom
    }));
    
    setInputMessage('');
    
    // Arrêter l'indicateur de saisie
    socket.send(JSON.stringify({
      type: 'typing',
      isTyping: false,
      room: currentRoom
    }));
  }
  
  // Indicateur de saisie
  function handleInputChange(e) {
    setInputMessage(e.target.value);
    
    if (!connected) return;
    
    // Envoyer "typing"
    socket.send(JSON.stringify({
      type: 'typing',
      isTyping: true,
      room: currentRoom
    }));
    
    // Clear timeout précédent
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Arrêter après 2 secondes d'inactivité
    typingTimeoutRef.current = setTimeout(() => {
      socket.send(JSON.stringify({
        type: 'typing',
        isTyping: false,
        room: currentRoom
      }));
    }, 2000);
  }
  
  // Changer de room
  function changeRoom(room) {
    socket.send(JSON.stringify({
      type: 'changeRoom',
      newRoom: room
    }));
    
    setCurrentRoom(room);
    setMessages([]);
  }
  
  if (!connected) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Connexion au serveur...</p>
      </div>
    );
  }
  
  if (!username) {
    return (
      <div className="chat-login">
        <h1>💬 Chat WebSocket</h1>
        <input
          type="text"
          placeholder="Votre nom..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && joinChat()}
        />
        <button onClick={joinChat}>Rejoindre</button>
      </div>
    );
  }
  
  return (
    <div className="chat-app">
      <aside className="chat-sidebar">
        <div className="chat-rooms">
          <h3>Rooms</h3>
          <button
            className={currentRoom === 'general' ? 'active' : ''}
            onClick={() => changeRoom('general')}
          >
            # general
          </button>
          <button
            className={currentRoom === 'random' ? 'active' : ''}
            onClick={() => changeRoom('random')}
          >
            # random
          </button>
          <button
            className={currentRoom === 'tech' ? 'active' : ''}
            onClick={() => changeRoom('tech')}
          >
            # tech
          </button>
        </div>
        
        <div className="chat-users">
          <h3>Utilisateurs ({users.length})</h3>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <span className="user-status">🟢</span>
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      
      <main className="chat-main">
        <header className="chat-header">
          <h2># {currentRoom}</h2>
          <div className="user-info">
            <span>👤 {username}</span>
          </div>
        </header>
        
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === 'system' ? (
                <p className="system-message">{msg.text}</p>
              ) : (
                <>
                  <div className="message-header">
                    <strong>{msg.username}</strong>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="message-text">{msg.text}</p>
                </>
              )}
            </div>
          ))}
          
          {typingUsers.size > 0 && (
            <div className="typing-indicator">
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'est' : 'sont'} en train d'écrire...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder={`Message #${currentRoom}`}
            value={inputMessage}
            onChange={handleInputChange}
          />
          <button type="submit">Envoyer</button>
        </form>
      </main>
    </div>
  );
}

export default ChatApp;
```

### Serveur Node.js complet

```javascript
// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map();
const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = generateId();
  
  clients.set(ws, {
    id: clientId,
    username: null,
    room: null
  });
  
  console.log(`✅ Client ${clientId} connecté`);
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (error) {
      console.error('Erreur parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    const client = clients.get(ws);
    console.log(`❌ Client ${client.username || client.id} déconnecté`);
    
    if (client.room) {
      leaveRoom(ws, client.room);
    }
    
    clients.delete(ws);
  });
});

function handleMessage(ws, message) {
  const client = clients.get(ws);
  
  switch (message.type) {
    case 'join':
      handleJoin(ws, message);
      break;
    
    case 'chat':
      handleChat(ws, message);
      break;
    
    case 'typing':
      handleTyping(ws, message);
      break;
    
    case 'changeRoom':
      handleChangeRoom(ws, message);
      break;
  }
}

function handleJoin(ws, message) {
  const client = clients.get(ws);
  client.username = message.username;
  client.room = message.room;
  
  // Ajouter à la room
  if (!rooms.has(message.room)) {
    rooms.set(message.room, new Set());
  }
  rooms.get(message.room).add(ws);
  
  // Envoyer l'historique
  ws.send(JSON.stringify({
    type: 'history',
    messages: []  // Charger depuis DB si besoin
  }));
  
  // Notifier les autres
  broadcastToRoom(message.room, {
    type: 'userJoined',
    user: { id: client.id, username: client.username }
  }, ws);
  
  // Envoyer la liste des utilisateurs
  sendUserList(message.room);
  
  console.log(`✅ ${client.username} a rejoint ${message.room}`);
}

function handleChat(ws, message) {
  const client = clients.get(ws);
  
  const chatMessage = {
    type: 'chat',
    id: generateId(),
    username: client.username,
    text: message.text,
    timestamp: Date.now()
  };
  
  broadcastToRoom(client.room, chatMessage);
}

function handleTyping(ws, message) {
  const client = clients.get(ws);
  
  broadcastToRoom(client.room, {
    type: 'typing',
    username: client.username,
    isTyping: message.isTyping
  }, ws);
}

function handleChangeRoom(ws, message) {
  const client = clients.get(ws);
  
  // Quitter l'ancienne room
  if (client.room) {
    leaveRoom(ws, client.room);
  }
  
  // Rejoindre la nouvelle
  client.room = message.newRoom;
  
  if (!rooms.has(message.newRoom)) {
    rooms.set(message.newRoom, new Set());
  }
  rooms.get(message.newRoom).add(ws);
  
  // Notifier
  broadcastToRoom(message.newRoom, {
    type: 'userJoined',
    user: { id: client.id, username: client.username }
  }, ws);
  
  sendUserList(message.newRoom);
}

function leaveRoom(ws, roomId) {
  const client = clients.get(ws);
  
  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);
    
    // Notifier
    broadcastToRoom(roomId, {
      type: 'userLeft',
      userId: client.id,
      username: client.username
    });
    
    sendUserList(roomId);
    
    // Supprimer la room si vide
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    }
  }
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  if (!rooms.has(roomId)) return;
  
  const data = JSON.stringify(message);
  
  rooms.get(roomId).forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function sendUserList(roomId) {
  if (!rooms.has(roomId)) return;
  
  const users = Array.from(rooms.get(roomId)).map(ws => {
    const client = clients.get(ws);
    return { id: client.id, username: client.username };
  });
  
  broadcastToRoom(roomId, {
    type: 'userList',
    users
  });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

console.log('🚀 WebSocket server lancé sur ws://localhost:8080');
```

Fichier créé ! Continuons avec les autres chapitres. Je vais maintenant créer les fichiers pour Service Workers & PWA, IndexedDB, et Performance Web de manière efficace.

---

**Prochaine étape** : Service Workers & PWA ! 🚀
