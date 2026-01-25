# Cas d'Usage & Architectures Node.js

## APIs REST

### Pourquoi Node.js Excelle pour les APIs REST

Node.js est particulièrement adapté aux APIs REST grâce à :
- **Performance I/O** : Gestion efficace des requêtes HTTP simultanées
- **JSON natif** : Parsing et sérialisation JSON ultra-rapides
- **Écosystème riche** : Express, Fastify, Koa pour créer des APIs rapidement
- **Scalabilité** : Architecture non-bloquante pour des milliers de requêtes/seconde

### API REST Complète avec Express

```javascript
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost/api-demo');

// Modèle User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Routes publiques
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Utilisateur créé',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Générer JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes protégées
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur modifie son propre profil
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API REST démarrée sur port ${PORT}`);
});
```

### API REST avec Validation

```javascript
const Joi = require('joi');

// Schémas de validation
const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email()
  })
};

// Middleware de validation
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.details.map(d => d.message)
      });
    }
    
    req.body = value;
    next();
  };
}

// Utilisation
app.post('/auth/register', validate(schemas.register), async (req, res) => {
  // req.body est validé
});

app.post('/auth/login', validate(schemas.login), async (req, res) => {
  // req.body est validé
});
```

### Rate Limiting et Sécurité

```javascript
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Sécurité HTTP headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: 'Trop de requêtes, réessayez plus tard'
});

app.use('/api/', limiter);

// Rate limiting strict pour login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion'
});

app.use('/auth/login', authLimiter);
```

## Applications Temps Réel

### Chat en Temps Réel avec Socket.io

```javascript
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Stockage en mémoire (utiliser Redis en production)
const users = new Map();
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);
  
  // Inscription d'un utilisateur
  socket.on('register', ({ username }) => {
    users.set(socket.id, { username, socketId: socket.id });
    socket.emit('registered', { socketId: socket.id, username });
    
    // Notifier tous les clients
    io.emit('users-update', Array.from(users.values()));
  });
  
  // Rejoindre une room
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    const user = users.get(socket.id);
    
    // Notifier la room
    io.to(roomId).emit('user-joined', {
      user: user.username,
      roomId,
      timestamp: Date.now()
    });
    
    // Envoyer l'historique des messages (simulé)
    socket.emit('room-history', {
      roomId,
      messages: [] // Charger depuis la BDD
    });
  });
  
  // Envoyer un message
  socket.on('send-message', ({ roomId, message }) => {
    const user = users.get(socket.id);
    
    const messageData = {
      id: Date.now(),
      user: user.username,
      message,
      timestamp: Date.now()
    };
    
    // Broadcast à la room
    io.to(roomId).emit('new-message', messageData);
    
    // Sauvegarder en BDD (async)
    saveMessage(roomId, messageData);
  });
  
  // Typing indicator
  socket.on('typing-start', ({ roomId }) => {
    const user = users.get(socket.id);
    socket.to(roomId).emit('user-typing', {
      user: user.username,
      roomId
    });
  });
  
  socket.on('typing-stop', ({ roomId }) => {
    const user = users.get(socket.id);
    socket.to(roomId).emit('user-stopped-typing', {
      user: user.username,
      roomId
    });
  });
  
  // Quitter une room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId);
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
    }
    
    const user = users.get(socket.id);
    io.to(roomId).emit('user-left', {
      user: user.username,
      roomId,
      timestamp: Date.now()
    });
  });
  
  // Déconnexion
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    // Retirer de toutes les rooms
    rooms.forEach((roomUsers, roomId) => {
      if (roomUsers.has(socket.id)) {
        roomUsers.delete(socket.id);
        io.to(roomId).emit('user-left', {
          user: user?.username,
          roomId,
          timestamp: Date.now()
        });
      }
    });
    
    users.delete(socket.id);
    io.emit('users-update', Array.from(users.values()));
    
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

async function saveMessage(roomId, message) {
  // Sauvegarder dans MongoDB, PostgreSQL, etc.
  // await Message.create({ roomId, ...message });
}

server.listen(3000, () => {
  console.log('Serveur de chat sur port 3000');
});
```

### Notifications en Temps Réel

```javascript
const io = socketIO(server);

// Authentification Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  
  // Rejoindre une room personnelle
  socket.join(`user:${userId}`);
  
  console.log(`User ${userId} connected`);
});

// Fonction pour envoyer une notification
function sendNotification(userId, notification) {
  io.to(`user:${userId}`).emit('notification', {
    id: Date.now(),
    type: notification.type,
    message: notification.message,
    timestamp: Date.now()
  });
}

// Exemple d'utilisation dans une API
app.post('/orders', authenticateToken, async (req, res) => {
  const order = await Order.create({
    userId: req.user.id,
    ...req.body
  });
  
  // Notifier l'utilisateur en temps réel
  sendNotification(req.user.id, {
    type: 'order-created',
    message: 'Votre commande a été créée avec succès'
  });
  
  // Notifier les admins
  const admins = await User.find({ role: 'admin' });
  admins.forEach(admin => {
    sendNotification(admin._id, {
      type: 'new-order',
      message: `Nouvelle commande #${order._id}`
    });
  });
  
  res.status(201).json(order);
});
```

### Tableau de Bord en Temps Réel

```javascript
// Serveur : Envoyer des métriques en temps réel
const os = require('os');

io.on('connection', (socket) => {
  // Métriques système toutes les secondes
  const metricsInterval = setInterval(() => {
    const metrics = {
      cpu: os.loadavg()[0],
      memory: {
        free: os.freemem(),
        total: os.totalmem(),
        usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
      },
      uptime: os.uptime(),
      timestamp: Date.now()
    };
    
    socket.emit('metrics-update', metrics);
  }, 1000);
  
  // Nettoyer à la déconnexion
  socket.on('disconnect', () => {
    clearInterval(metricsInterval);
  });
});

// Client (React)
/*
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const socket = io('http://localhost:3000');
    
    socket.on('metrics-update', (data) => {
      setMetrics(data);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div>
      <h2>Métriques Système</h2>
      {metrics && (
        <>
          <p>CPU: {metrics.cpu}%</p>
          <p>Mémoire: {metrics.memory.usage}%</p>
          <p>Uptime: {metrics.uptime}s</p>
        </>
      )}
    </div>
  );
}
*/
```

## Microservices

### Architecture Microservices avec Node.js

```javascript
// Service 1 : Authentification (auth-service.js)
const express = require('express');
const jwt = require('jsonwebtoken');

const authApp = express();
authApp.use(express.json());

authApp.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier credentials
  const user = await verifyCredentials(email, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token });
});

authApp.listen(3001, () => console.log('Auth service on port 3001'));

// Service 2 : Utilisateurs (users-service.js)
const usersApp = express();
usersApp.use(express.json());

usersApp.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

usersApp.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

usersApp.listen(3002, () => console.log('Users service on port 3002'));

// Service 3 : Commandes (orders-service.js)
const ordersApp = express();
ordersApp.use(express.json());

ordersApp.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.query.userId });
  res.json(orders);
});

ordersApp.post('/orders', async (req, res) => {
  const order = await Order.create(req.body);
  
  // Appeler le service de paiement
  const payment = await fetch('http://localhost:3003/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: order.id, amount: order.total })
  });
  
  res.status(201).json(order);
});

ordersApp.listen(3004, () => console.log('Orders service on port 3004'));

// API Gateway (gateway.js)
const gatewayApp = express();
const axios = require('axios');

gatewayApp.use(express.json());

// Proxy vers les microservices
gatewayApp.post('/api/auth/login', async (req, res) => {
  const response = await axios.post('http://localhost:3001/login', req.body);
  res.json(response.data);
});

gatewayApp.get('/api/users/:id', async (req, res) => {
  const response = await axios.get(`http://localhost:3002/users/${req.params.id}`);
  res.json(response.data);
});

gatewayApp.get('/api/orders', async (req, res) => {
  const response = await axios.get('http://localhost:3004/orders', {
    params: req.query
  });
  res.json(response.data);
});

gatewayApp.listen(3000, () => console.log('API Gateway on port 3000'));
```

### Communication entre Microservices avec Message Queue

```javascript
// Utilisation de RabbitMQ pour communication asynchrone
const amqp = require('amqplib');

// Producer : Orders Service
async function publishOrderCreated(orderData) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const message = JSON.stringify(orderData);
  channel.publish(exchange, 'order.created', Buffer.from(message));
  
  console.log('Event published: order.created');
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

// Consumer : Email Service
async function consumeOrderEvents() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const queue = await channel.assertQueue('email-service', { durable: true });
  await channel.bindQueue(queue.queue, exchange, 'order.*');
  
  channel.consume(queue.queue, async (msg) => {
    const orderData = JSON.parse(msg.content.toString());
    
    console.log('Received order event:', orderData);
    
    // Envoyer email de confirmation
    await sendOrderConfirmationEmail(orderData);
    
    channel.ack(msg);
  });
}

consumeOrderEvents();

// Consumer : Inventory Service
async function consumeForInventory() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const queue = await channel.assertQueue('inventory-service', { durable: true });
  await channel.bindQueue(queue.queue, exchange, 'order.created');
  
  channel.consume(queue.queue, async (msg) => {
    const orderData = JSON.parse(msg.content.toString());
    
    // Mettre à jour l'inventaire
    await updateInventory(orderData.items);
    
    channel.ack(msg);
  });
}
```

## Streaming de Données

### Upload de Fichiers avec Streams

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.json({
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype
  });
});

// Upload avec streaming manuel (efficace pour gros fichiers)
const fs = require('fs');
const path = require('path');

app.post('/upload-stream', (req, res) => {
  const filename = req.headers['x-filename'] || 'upload.dat';
  const filepath = path.join(__dirname, 'uploads', filename);
  
  const writeStream = fs.createWriteStream(filepath);
  
  let uploadedBytes = 0;
  
  req.on('data', (chunk) => {
    uploadedBytes += chunk.length;
    writeStream.write(chunk);
    
    // Progress tracking
    console.log(`Uploaded: ${uploadedBytes} bytes`);
  });
  
  req.on('end', () => {
    writeStream.end();
    res.json({
      message: 'Upload terminé',
      size: uploadedBytes,
      file: filename
    });
  });
  
  req.on('error', (err) => {
    writeStream.end();
    res.status(500).json({ error: err.message });
  });
});
```

### Streaming Vidéo

```javascript
const fs = require('fs');
const path = require('path');

app.get('/video/:filename', (req, res) => {
  const videoPath = path.join(__dirname, 'videos', req.params.filename);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    // Streaming avec range requests (permet seek dans la vidéo)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    
    const file = fs.createReadStream(videoPath, { start, end });
    
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // Streaming complet
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});
```

### Export de Données CSV

```javascript
const { Parser } = require('json2csv');

app.get('/export/users', async (req, res) => {
  try {
    // Récupérer les users (peut être très nombreux)
    const usersCursor = User.find().cursor();
    
    const fields = ['username', 'email', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    
    // Écrire le header CSV
    res.write(json2csvParser.parse([]) + '\n');
    
    // Stream les données
    for (let user = await usersCursor.next(); user != null; user = await usersCursor.next()) {
      const csv = json2csvParser.parse([user]);
      const lines = csv.split('\n');
      res.write(lines[1] + '\n'); // Ignorer le header répété
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Serverless Functions

### AWS Lambda avec Node.js

```javascript
// lambda-function.js
exports.handler = async (event) => {
  // Parse le body si c'est du JSON
  const body = JSON.parse(event.body || '{}');
  
  try {
    // Logique métier
    const result = await processData(body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function processData(data) {
  // Connexion à DynamoDB, S3, etc.
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  await dynamodb.put({
    TableName: 'Users',
    Item: data
  }).promise();
  
  return { success: true, id: data.id };
}
```

### Netlify Functions

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  const { name } = event.queryStringParameters;
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}!` })
  };
};

// Accessible sur : /.netlify/functions/hello?name=Alice
```

### Vercel Serverless Functions

```javascript
// api/user.js
module.exports = async (req, res) => {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      const users = await getUsers();
      res.status(200).json(users);
      break;
      
    case 'POST':
      const user = await createUser(req.body);
      res.status(201).json(user);
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
```

## Scraping et Automation

### Web Scraping avec Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Extraire des données
  const data = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h2')).map(el => el.textContent);
    const links = Array.from(document.querySelectorAll('a')).map(el => el.href);
    
    return { titles, links };
  });
  
  await browser.close();
  
  return data;
}

// API endpoint
app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  
  try {
    const data = await scrapeWebsite(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Génération de PDFs

```javascript
const puppeteer = require('puppeteer');

app.post('/generate-pdf', async (req, res) => {
  const { html, filename } = req.body;
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(html);
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px' }
  });
  
  await browser.close();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.pdf`);
  res.send(pdf);
});
```

## Résumé des Cas d'Usage

**🌐 APIs REST**
- Gestion efficace de milliers de requêtes simultanées
- JSON natif, validation, authentification JWT
- Frameworks matures : Express, Fastify, Koa

**⚡ Temps Réel**
- WebSockets, Socket.io pour chat et notifications
- Server-Sent Events pour updates unidirectionnels
- Tableaux de bord et monitoring en direct

**🔧 Microservices**
- Léger, démarrage rapide (vs Java Spring)
- Communication HTTP ou Message Queues (RabbitMQ)
- Conteneurisation optimale avec Docker

**📊 Streaming**
- Upload/download de gros fichiers sans saturer la RAM
- Streaming vidéo avec range requests
- Export de données volumineuses (CSV, JSON)

**☁️ Serverless**
- AWS Lambda, Vercel, Netlify Functions
- Cold start rapide (~100ms vs Java 5s)
- Pay-per-execution, scalabilité automatique

**🤖 Automation**
- Web scraping avec Puppeteer
- Génération de PDFs, screenshots
- Automatisation de tâches répétitives

**❌ Non Recommandé Pour :**
- Calculs CPU-intensifs (ML, encodage vidéo)
- Applications scientifiques (préférer Python/R)
- Jeux 3D ou simulations physiques complexes

Node.js excelle dans les applications **I/O-intensives** où il faut gérer de nombreuses connexions simultanées avec des opérations rapides.