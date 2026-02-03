# Déploiement Frontend

Mettez votre application React en ligne sur Vercel ou Netlify.

---

## Ce que vous allez apprendre

- Préparer votre application pour la production
- Déployer sur Vercel (recommandé pour React/Next.js)
- Déployer sur Netlify
- Configurer un domaine personnalisé

## Prérequis

- [Git & GitHub](../git/github-collaboration)
- Une application React fonctionnelle
- Un compte GitHub

---

## Préparation au déploiement

### Build de production

```bash
# Créer le build optimisé
npm run build

# Le dossier dist/ (ou build/) contient votre site statique
```

### Vérifications avant déploiement

```bash
# 1. Tester le build localement
npm run preview  # Vite
# ou
npx serve -s build  # Create React App

# 2. Vérifier les erreurs
npm run build 2>&1 | grep -i error

# 3. Vérifier les variables d'environnement
cat .env.example
```

### Variables d'environnement côté client

```env
# .env (développement)
VITE_API_URL=http://localhost:3000/api

# .env.production (sera utilisé au build)
VITE_API_URL=https://mon-api.onrender.com/api
```

```javascript
// Utilisation dans le code
const API_URL = import.meta.env.VITE_API_URL;

// ⚠️ Avec Vite, le préfixe VITE_ est obligatoire
// ⚠️ Ces variables sont PUBLIQUES (visibles dans le code)
```

---

## Vercel (Recommandé)

### Pourquoi Vercel ?

| Avantage | Description |
|----------|-------------|
| Performance | CDN global, Edge Functions |
| Preview | Chaque PR a son URL de preview |
| Zero config | Détection automatique du framework |
| Gratuit | Généreux pour les projets perso |

### Déploiement via GitHub

1. **Connecter le repo**
   - Aller sur [vercel.com](https://vercel.com)
   - "Add New Project"
   - Importer depuis GitHub
   - Sélectionner votre repository

2. **Configuration automatique**
   ```
   Framework Preset: Vite (ou Create React App)
   Build Command: npm run build
   Output Directory: dist (ou build)
   Install Command: npm install
   ```

3. **Variables d'environnement**
   - Settings → Environment Variables
   - Ajouter `VITE_API_URL` = `https://votre-api.com`

4. **Déployer**
   - Cliquer "Deploy"
   - Attendre ~1 minute
   - Votre site est en ligne ! 🎉

### Configuration vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Déploiement CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod

# Variables d'environnement
vercel env add VITE_API_URL
```

### Preview Deployments

Chaque push sur une branche crée une URL de preview :

```
main           → mon-app.vercel.app
feature/auth   → mon-app-git-feature-auth-user.vercel.app
PR #42         → mon-app-pr-42.vercel.app
```

---

## Netlify

### Configuration

1. **Connecter le repo**
   - [app.netlify.com](https://app.netlify.com) → "Add new site"
   - "Import an existing project"
   - Connecter GitHub

2. **Paramètres de build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variables d'environnement**
   - Site settings → Environment variables
   - Ajouter vos variables

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Netlify CLI

```bash
# Installer
npm install -g netlify-cli

# Login
netlify login

# Déployer (preview)
netlify deploy

# Déployer en production
netlify deploy --prod
```

---

## Gestion des routes (SPA)

### Le problème

```
1. Utilisateur visite: mon-app.com/products/123
2. Serveur cherche: /products/123/index.html
3. Fichier n'existe pas → 404 ❌
```

### La solution : Redirections

Toutes les routes doivent pointer vers `index.html` :

**Vercel (vercel.json)**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify (_redirects)**
```
/*    /index.html   200
```

**Netlify (netlify.toml)**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Domaine personnalisé

### Sur Vercel

1. Settings → Domains
2. Ajouter votre domaine : `monsite.com`
3. Configurer les DNS chez votre registrar :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Sur Netlify

1. Domain settings → Add custom domain
2. Configurer les DNS :
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: votre-site.netlify.app
   ```

### SSL automatique

Les deux plateformes fournissent HTTPS gratuitement via Let's Encrypt.

---

## Optimisations production

### Compression des assets

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### Analyse du bundle

```bash
# Installer l'analyseur
npm install -D rollup-plugin-visualizer

# vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

# Puis
npm run build
# Ouvre stats.html avec la taille des bundles
```

---

## CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      # Vercel déploie automatiquement, pas besoin de cette étape
      # Mais utile pour les tests avant déploiement
```

---

## Comparaison Vercel vs Netlify

| Critère | Vercel | Netlify |
|---------|--------|---------|
| **React/Next.js** | ⭐ Optimal | ✅ Bon |
| **Fonctions serverless** | Edge + Node | Node |
| **Formulaires** | ❌ Non | ✅ Natif |
| **Preview deploys** | ✅ Excellent | ✅ Bon |
| **Analytics** | ✅ Intégré | Plugin |
| **Limite gratuite** | 100 GB/mois | 100 GB/mois |
| **Builds/mois** | 6000 min | 300 min |

**Recommandation** : Vercel pour React/Next.js, Netlify pour sites statiques avec formulaires.

---

## ❌ Erreurs Courantes

### 1. Routes 404 en production

```
# ❌ Erreur : /about retourne 404
# La redirection SPA n'est pas configurée

# ✅ Solution : Ajouter les rewrites (voir section Gestion des routes)
```

### 2. Variables d'environnement manquantes

```bash
# ❌ Build échoue ou API ne fonctionne pas
# Les variables ne sont pas définies sur la plateforme

# ✅ Solution : Ajouter les variables dans Settings
# Et reconstruire (Redeploy)
```

### 3. Cache des anciens fichiers

```bash
# ❌ Les utilisateurs voient l'ancienne version

# ✅ Forcer le rafraîchissement
# Vercel : Deployments → Redeploy
# Ou vider le cache du navigateur
```

### 4. Build qui marche en local mais pas en prod

```bash
# Vérifier la version de Node
node --version

# Spécifier dans package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🏋️ Exercice Pratique

**Objectif** : Déployer votre application React

1. Créer un repo GitHub avec votre projet
2. S'inscrire sur Vercel avec GitHub
3. Importer le projet
4. Configurer les variables d'environnement
5. Déployer et tester l'URL

<details>
<summary>Checklist</summary>

- [ ] Code pushé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Build réussi (voir logs)
- [ ] Variables d'environnement configurées
- [ ] Routes fonctionnent (test /about)
- [ ] API connectée (si applicable)
- [ ] HTTPS actif (cadenas vert)
</details>

---

## Quiz de vérification

:::quiz
Q: Quelle plateforme est optimale pour Next.js ?
- [ ] Netlify
- [x] Vercel
- [ ] GitHub Pages
> Vercel est créé par les développeurs de Next.js, offrant une intégration native et optimale.

Q: Comment gérer les routes SPA ?
- [ ] Créer tous les fichiers HTML
- [x] Rediriger vers index.html
- [ ] Utiliser un backend
> Les SPA nécessitent une redirection vers index.html pour que le router côté client puisse gérer les routes.

Q: Quel préfixe pour les variables Vite ?
- [ ] `REACT_APP_`
- [x] `VITE_`
- [ ] `ENV_`
> Seules les variables commençant par `VITE_` sont exposées au code côté client.
:::

---

## Pour aller plus loin

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Netlify](https://docs.netlify.com/)
- [Vite - Building for Production](https://vitejs.dev/guide/build.html)

---

## Prochaine étape

Déployez maintenant votre [backend sur Render](./backend-deployment).
