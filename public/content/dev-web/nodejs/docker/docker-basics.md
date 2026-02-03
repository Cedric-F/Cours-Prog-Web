# Docker - Les bases

Conteneurisez votre application pour un déploiement reproductible.

---

## Ce que vous allez apprendre

- Comprendre les conteneurs Docker
- Créer un Dockerfile pour Node.js
- Utiliser Docker Compose
- Déployer une stack complète

## Prérequis

- [Node.js - Installation](../installation-environnement/nodejs-installation)
- [Déploiement Backend](../../deployment/backend-deployment)

---

## Pourquoi Docker ?

### Le problème classique

```
"Ça marche sur ma machine !" 🤷

Développeur:  Node 18, MongoDB 6, Ubuntu
Production:   Node 16, MongoDB 5, Debian
Résultat:     Bug mystérieux 💥
```

### La solution Docker

```
┌─────────────────────────────────────────┐
│           CONTENEUR DOCKER              │
│  ┌─────────────────────────────────┐   │
│  │  Node 18 + dépendances exactes  │   │
│  │  + configuration identique      │   │
│  └─────────────────────────────────┘   │
│  Fonctionne partout : dev, test, prod  │
└─────────────────────────────────────────┘
```

### Conteneur vs VM

| Conteneur | Machine Virtuelle |
|-----------|-------------------|
| Partage le kernel OS | OS complet isolé |
| Démarre en secondes | Démarre en minutes |
| ~100 MB | ~10 GB |
| Milliers par serveur | Dizaines par serveur |

---

## Installation

### Windows / macOS

Télécharger [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Linux

```bash
# Ubuntu
sudo apt update
sudo apt install docker.io docker-compose-v2
sudo usermod -aG docker $USER
# Redémarrer le terminal
```

### Vérifier l'installation

```bash
docker --version
# Docker version 24.0.0

docker run hello-world
# Hello from Docker! ✅
```

---

## Concepts clés

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   Dockerfile  ──build──>  Image  ──run──>  Container    │
│   (recette)              (template)       (instance)     │
│                                                          │
└─────────────────────────────────────────────────────────┘

Image = Snapshot immuable de l'application
Container = Instance en cours d'exécution
```

---

## Premier Dockerfile

### Application Node.js

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello Docker!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Dockerfile

```dockerfile
# Dockerfile

# Image de base
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Port exposé
EXPOSE 3000

# Commande de démarrage
CMD ["node", "app.js"]
```

### Construire et lancer

```bash
# Construire l'image
docker build -t mon-api .

# Lancer le conteneur
docker run -p 3000:3000 mon-api

# En arrière-plan
docker run -d -p 3000:3000 --name mon-api-container mon-api

# Voir les logs
docker logs mon-api-container

# Arrêter
docker stop mon-api-container
```

---

## Dockerfile optimisé

```dockerfile
# Dockerfile

# === STAGE 1: Build ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json d'abord (cache des dépendances)
COPY package*.json ./
RUN npm ci

# Copier le code et build
COPY . .
RUN npm run build

# === STAGE 2: Production ===
FROM node:20-alpine AS production

WORKDIR /app

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier seulement les fichiers nécessaires
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Permissions
USER nodejs

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/app.js"]
```

### .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
.env
*
tests
coverage
.nyc_output
```

---

## Commandes essentielles

### Images

```bash
# Lister les images
docker images

# Construire une image
docker build -t nom:tag .

# Supprimer une image
docker rmi nom:tag

# Télécharger une image
docker pull node:20-alpine
```

### Conteneurs

```bash
# Lister les conteneurs actifs
docker ps

# Lister tous les conteneurs
docker ps -a

# Lancer un conteneur
docker run -d -p 3000:3000 --name mon-app image-name

# Exécuter une commande dans un conteneur
docker exec -it mon-app sh

# Voir les logs
docker logs -f mon-app

# Arrêter / Démarrer / Redémarrer
docker stop mon-app
docker start mon-app
docker restart mon-app

# Supprimer un conteneur
docker rm mon-app
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker container prune

# Supprimer les images non utilisées
docker image prune

# Tout nettoyer
docker system prune -a
```

---

## Docker Compose

### Pourquoi ?

```bash
# ❌ Sans Compose : commandes longues et répétitives
docker run -d --name db -e MONGO_INITDB_ROOT_USERNAME=... mongo
docker run -d --name api --link db -e DATABASE_URL=... mon-api
docker run -d --name nginx --link api -p 80:80 nginx

# ✅ Avec Compose : une seule commande
docker compose up -d
```

### docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Node.js
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://db:27017/myapp
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  # Base de données MongoDB
  db:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=myapp
    restart: unless-stopped

  # Interface d'administration (optionnel)
  mongo-express:
    image: mongo-express
    ports:
      - "8081:8081"
    environment:
      - ME_CONFIG_MONGODB_SERVER=db
    depends_on:
      - db

volumes:
  mongo-data:
```

### Commandes Compose

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Logs d'un service
docker compose logs -f api

# Arrêter
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Reconstruire
docker compose up -d --build

# Exécuter une commande
docker compose exec api sh
```

---

## Exemple complet : Stack MERN

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Frontend React (en dev)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000/api

  # Backend Express
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - JWT_SECRET=dev-secret
    depends_on:
      - mongo
    command: npm run dev

  # MongoDB
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  # Redis (cache/sessions)
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mongo-data:
```

### Dockerfile pour le frontend (dev)

```dockerfile
# frontend/Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

---

## Variables d'environnement

### Fichier .env

```env
# .env (NE PAS COMMITER !)
JWT_SECRET=super-secret-key
DATABASE_URL=mongodb://mongo:27017/myapp
```

```yaml
# docker-compose.yml
services:
  api:
    env_file:
      - .env
    # Ou directement
    environment:
      - JWT_SECRET=${JWT_SECRET}
```

### Fichiers multiples

```bash
# Développement
docker compose --env-file .env.dev up

# Production
docker compose --env-file .env.prod up
```

---

## Volumes et persistance

### Types de volumes

```yaml
services:
  db:
    volumes:
      # Volume nommé (recommandé pour les données)
      - mongo-data:/data/db
      
      # Bind mount (pour le développement)
      - ./data:/data/db
      
      # Volume anonyme
      - /data/db

volumes:
  mongo-data:
```

### Backup d'un volume

```bash
# Exporter
docker run --rm -v mongo-data:/data -v $(pwd):/backup alpine \
  tar cvf /backup/backup.tar /data

# Importer
docker run --rm -v mongo-data:/data -v $(pwd):/backup alpine \
  tar xvf /backup/backup.tar
```

---

## Réseaux Docker

```yaml
version: '3.8'

services:
  frontend:
    networks:
      - frontend-network

  backend:
    networks:
      - frontend-network
      - backend-network

  db:
    networks:
      - backend-network  # Isolé du frontend

networks:
  frontend-network:
  backend-network:
```

---

## Déploiement en production

### Build et push

```bash
# Tag avec version
docker build -t username/mon-api:1.0.0 .
docker build -t username/mon-api:latest .

# Push sur Docker Hub
docker login
docker push username/mon-api:1.0.0
docker push username/mon-api:latest
```

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  api:
    image: username/mon-api:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api
```

---

## ❌ Erreurs Courantes

### 1. Copier node_modules

```dockerfile
# ❌ Inclut node_modules local (peut être incompatible)
COPY . .

# ✅ Ignorer avec .dockerignore et installer proprement
COPY package*.json ./
RUN npm ci
COPY . .
```

### 2. Exécuter en root

```dockerfile
# ❌ Risque de sécurité
CMD ["node", "app.js"]

# ✅ Utilisateur non privilégié
USER node
CMD ["node", "app.js"]
```

### 3. Pas de .dockerignore

```bash
# ❌ L'image contient .git, node_modules, .env...
docker build -t app .  # Très gros et lent

# ✅ Créer .dockerignore (voir section plus haut)
```

### 4. Build non reproductible

```dockerfile
# ❌ Installe la dernière version (peut casser)
RUN npm install

# ✅ Installe les versions exactes du lock file
RUN npm ci
```

---

## Exercice Pratique

**Objectif** : Dockeriser votre API Express

1. Créer un `Dockerfile` pour votre API
2. Créer un `docker-compose.yml` avec MongoDB
3. Tester avec `docker compose up`
4. Vérifier que l'API fonctionne

<details>
<summary>Checklist</summary>

- [ ] Dockerfile créé
- [ ] .dockerignore avec node_modules
- [ ] docker-compose.yml avec api + db
- [ ] Variables d'environnement configurées
- [ ] `docker compose up -d` fonctionne
- [ ] API accessible sur http://localhost:3000
</details>

---

## Quiz de vérification

:::quiz
Q: Quelle commande construit une image ?
- [ ] `docker run`
- [x] `docker build`
- [ ] `docker create`
> `docker build` crée une image à partir d'un Dockerfile. `docker run` démarre un conteneur.

Q: Comment persister les données MongoDB ?
- [ ] Bind mount
- [x] Volume nommé
- [ ] Dans le conteneur
> Les volumes nommés sont gérés par Docker et persistent même si le conteneur est supprimé.

Q: Que fait `docker compose up -d` ?
- [ ] Construit les images
- [x] Lance en arrière-plan
- [ ] Supprime les conteneurs
> Le flag `-d` (detached) lance les conteneurs en arrière-plan.
:::

---

## Pour aller plus loin

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## Prochaine étape

Découvrez [Next.js](../../react/nextjs/nextjs-introduction) pour le rendu côté serveur.
