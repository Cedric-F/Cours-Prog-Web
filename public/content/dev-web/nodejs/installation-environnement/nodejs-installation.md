# Installation & Configuration de Node.js

## Installation de Node.js

### Téléchargement depuis le Site Officiel

La méthode la plus simple pour installer Node.js est de télécharger l'installateur depuis le site officiel.

**Étapes :**

1. Visiter [nodejs.org](https://nodejs.org)
2. Choisir entre deux versions :
   - **LTS (Long Term Support)** : Recommandée pour la production
   - **Current** : Dernières fonctionnalités, moins stable

```bash
# Vérifier l'installation
node --version
# v18.17.0

npm --version
# 9.8.1
```

### Choisir la Bonne Version

**Version LTS (Long Term Support) :**
- Support pendant 30 mois
- Corrections de bugs et sécurité garanties
- **Recommandée pour** : Production, projets professionnels
- Exemple : v18.x, v20.x (numéros pairs)

**Version Current :**
- Dernières fonctionnalités ES
- Mises à jour fréquentes
- **Recommandée pour** : Développement, expérimentation
- Exemple : v19.x, v21.x (numéros impairs)

```javascript
// Vérifier les features disponibles
console.log(process.versions);
/*
{
  node: '18.17.0',
  v8: '10.2.154.26',
  uv: '1.44.2',
  zlib: '1.2.13',
  brotli: '1.0.9',
  ares: '1.19.1',
  modules: '108',
  nghttp2: '1.52.0',
  napi: '9',
  llhttp: '6.0.11',
  openssl: '3.0.9',
  ...
}
*/
```

### Installation sur Windows

**Option 1 : Installateur MSI**

1. Télécharger le fichier `.msi` depuis nodejs.org
2. Exécuter l'installateur
3. Suivre l'assistant d'installation
4. Cocher "Automatically install necessary tools" (Python, Visual Studio Build Tools)

```powershell
# Vérifier l'installation
node --version
npm --version

# Localisation par défaut
C:\Program Files\nodejs\
```

**Option 2 : Chocolatey (Gestionnaire de paquets)**

```powershell
# Installer Chocolatey d'abord (admin PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installer Node.js
choco install nodejs-lts

# Ou version Current
choco install nodejs
```

**Option 3 : Winget (Windows Package Manager)**

```powershell
# Installer la version LTS
winget install OpenJS.NodeJS.LTS

# Ou version Current
winget install OpenJS.NodeJS
```

### Installation sur macOS

**Option 1 : Installateur PKG**

1. Télécharger le fichier `.pkg` depuis nodejs.org
2. Double-cliquer et suivre l'installateur
3. Node.js sera installé dans `/usr/local/bin/`

```bash
# Vérifier l'installation
node --version
npm --version
```

**Option 2 : Homebrew (Recommandé)**

```bash
# Installer Homebrew si nécessaire
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js LTS
brew install node@18

# Ou dernière version
brew install node

# Lier la version
brew link node@18

# Mettre à jour
brew upgrade node
```

### Installation sur Linux

**Ubuntu/Debian :**

```bash
# Méthode 1 : Via apt (peut être une version ancienne)
sudo apt update
sudo apt install nodejs npm

# Méthode 2 : Via NodeSource (version récente recommandée)
# Pour Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Pour Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

**CentOS/RHEL/Fedora :**

```bash
# Via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Ou avec dnf (Fedora)
sudo dnf install nodejs
```

**Arch Linux :**

```bash
# Via pacman
sudo pacman -S nodejs npm
```

## NVM : Node Version Manager

### Pourquoi Utiliser NVM ?

NVM permet de :
- Installer plusieurs versions de Node.js simultanément
- Basculer facilement entre les versions
- Tester la compatibilité avec différentes versions
- Éviter les conflits entre projets

**Cas d'usage :**
```
Projet A : Nécessite Node.js 16 (legacy)
Projet B : Nécessite Node.js 18 (LTS)
Projet C : Nécessite Node.js 20 (dernière LTS)

Sans NVM : Désinstaller/réinstaller à chaque changement ❌
Avec NVM : nvm use 16 / nvm use 18 / nvm use 20 ✅
```

### Installation de NVM

**macOS / Linux :**

```bash
# Installation via curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Ou via wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Ajouter à ~/.bashrc, ~/.zshrc ou ~/.profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Recharger le shell
source ~/.bashrc  # ou ~/.zshrc
```

**Windows : nvm-windows**

```powershell
# Télécharger depuis GitHub
# https://github.com/coreybutler/nvm-windows/releases

# Installer nvm-setup.exe
# Exécuter en tant qu'administrateur
```

### Utilisation de NVM

**Lister les versions disponibles :**

```bash
# Toutes les versions Node.js
nvm ls-remote

# Versions LTS uniquement
nvm ls-remote --lts
```

**Installer des versions :**

```bash
# Installer la dernière version
nvm install node

# Installer une version LTS spécifique
nvm install 18.17.0

# Installer la dernière LTS
nvm install --lts

# Installer plusieurs versions
nvm install 16
nvm install 18
nvm install 20
```

**Basculer entre les versions :**

```bash
# Lister les versions installées
nvm ls

# Utiliser une version spécifique
nvm use 18.17.0

# Utiliser la dernière LTS
nvm use --lts

# Définir une version par défaut
nvm alias default 18.17.0

# Vérifier la version active
node --version
```

**Désinstaller une version :**

```bash
# Désinstaller Node.js 16
nvm uninstall 16

# Nettoyer les versions non utilisées
nvm cache clear
```

### .nvmrc : Version par Projet

Créer un fichier `.nvmrc` à la racine du projet pour spécifier la version Node.js :

```bash
# .nvmrc
18.17.0
```

**Utilisation :**

```bash
# Naviguer dans le projet
cd mon-projet

# Utiliser la version spécifiée dans .nvmrc
nvm use

# Ou installer si nécessaire
nvm install
```

**Automatisation avec Zsh :**

```bash
# Ajouter à ~/.zshrc
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## Gestion des Versions Node.js

### Vérifier la Version Courante

```bash
# Version de Node.js
node --version
node -v

# Version de NPM
npm --version
npm -v

# Informations détaillées
node -p process.versions
```

### Mettre à Jour Node.js

**Avec NVM :**

```bash
# Installer la nouvelle version
nvm install 20

# Migrer les packages globaux
nvm install 20 --reinstall-packages-from=18

# Définir comme version par défaut
nvm alias default 20

# Supprimer l'ancienne version
nvm uninstall 18
```

**Sans NVM (réinstallation) :**

```bash
# Sauvegarder les packages globaux
npm list -g --depth=0 > global-packages.txt

# Désinstaller Node.js
# (via le désinstalleur ou gestionnaire de paquets)

# Réinstaller la nouvelle version

# Réinstaller les packages globaux
cat global-packages.txt | grep -v npm | xargs npm install -g
```

### Mettre à Jour NPM

```bash
# Mettre à jour NPM vers la dernière version
npm install -g npm@latest

# Ou vers une version spécifique
npm install -g npm@9.8.0

# Vérifier la version
npm --version
```

## Configuration de l'Environnement

### Variables d'Environnement

**Variables Importantes :**

```bash
# NODE_ENV : Environnement d'exécution
export NODE_ENV=development  # ou production

# PORT : Port du serveur
export PORT=3000

# Variables personnalisées
export DATABASE_URL=mongodb://localhost/myapp
export API_KEY=secret123
export JWT_SECRET=mysecret
```

**Fichier .env (avec dotenv) :**

```bash
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost/myapp
API_KEY=secret123
JWT_SECRET=mysecret
```

**Chargement dans Node.js :**

```javascript
require('dotenv').config();

console.log(process.env.NODE_ENV);      // development
console.log(process.env.PORT);          // 3000
console.log(process.env.DATABASE_URL);  // mongodb://localhost/myapp
```

### Configuration NPM

**Configuration Globale :**

```bash
# Voir toutes les configurations
npm config list

# Définir le registre (par défaut : npmjs.org)
npm config set registry https://registry.npmjs.org/

# Changer le répertoire de cache
npm config set cache ~/.npm-cache

# Définir le répertoire des packages globaux
npm config set prefix ~/.npm-global

# Proxy (si nécessaire)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Effacer une configuration
npm config delete proxy
```

**Configuration par Projet (.npmrc) :**

```bash
# .npmrc (à la racine du projet)
registry=https://registry.npmjs.org/
save-exact=true
engine-strict=true
```

### Configurer VS Code pour Node.js

**Extensions Recommandées :**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",      // ESLint
    "esbenp.prettier-vscode",      // Prettier
    "ms-vscode.vscode-typescript-next", // TypeScript
    "christian-kohler.npm-intellisense", // Autocomplétion npm
    "christian-kohler.path-intellisense", // Autocomplétion chemins
    "wix.vscode-import-cost"       // Taille des imports
  ]
}
```

**Configuration Workspace :**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Debugging Configuration :**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Lancer le programme",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Nodemon",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceFolder}/src/index.js",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Tests (Jest)",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Outils de Développement

### Nodemon : Auto-Restart

```bash
# Installation globale
npm install -g nodemon

# Installation locale (recommandée)
npm install -D nodemon
```

**Utilisation :**

```bash
# Au lieu de : node app.js
nodemon app.js

# Avec options
nodemon --watch src --ext js,json --exec "node --inspect" src/index.js
```

**Configuration (nodemon.json) :**

```json
{
  "watch": ["src"],
  "ext": "js,json,ts",
  "ignore": ["src/**/*.test.js", "node_modules"],
  "exec": "node src/index.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000",
  "verbose": true
}
```

**Script package.json :**

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "dev:debug": "nodemon --inspect src/index.js"
  }
}
```

### PM2 : Process Manager (Production)

```bash
# Installation globale
npm install -g pm2

# Démarrer une application
pm2 start app.js

# Avec nom personnalisé
pm2 start app.js --name "mon-app"

# Avec variables d'environnement
pm2 start app.js --env production

# Mode cluster (utilise tous les CPUs)
pm2 start app.js -i max

# Lister les processus
pm2 list

# Logs en temps réel
pm2 logs

# Monitoring
pm2 monit

# Redémarrer
pm2 restart mon-app

# Arrêter
pm2 stop mon-app

# Supprimer
pm2 delete mon-app

# Sauvegarder la configuration
pm2 save

# Démarrage automatique au boot
pm2 startup
```

**Configuration PM2 (ecosystem.config.js) :**

```javascript
module.exports = {
  apps: [{
    name: 'api',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G',
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

**Utilisation :**

```bash
# Démarrer avec le fichier de config
pm2 start ecosystem.config.js

# Avec environnement spécifique
pm2 start ecosystem.config.js --env production
```

### ESLint et Prettier

**Installation :**

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier

# Initialiser ESLint
npx eslint --init
```

**Configuration ESLint (.eslintrc.json) :**

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

**Configuration Prettier (.prettierrc) :**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

**Scripts package.json :**

```json
{
  "scripts": {
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\""
  }
}
```

## Bonnes Pratiques d'Installation

### 1. Utiliser NVM pour Gérer les Versions

```bash
# ✅ Bon : Utiliser NVM
nvm install 18
nvm use 18

# ❌ Éviter : Installation système globale
sudo apt install nodejs
```

### 2. Ne Jamais Utiliser sudo avec npm

```bash
# ❌ Mauvais : Risques de sécurité
sudo npm install -g typescript

# ✅ Bon : Configurer npm pour installer sans sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

npm install -g typescript
```

### 3. Utiliser .nvmrc pour les Projets

```bash
# .nvmrc
18.17.0
```

### 4. Vérifier la Compatibilité dans package.json

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Forcer la vérification :**

```bash
# .npmrc
engine-strict=true
```

### 5. Utiliser un Fichier .env pour les Secrets

```bash
# .env (JAMAIS commiter dans Git)
DATABASE_URL=mongodb://localhost/myapp
JWT_SECRET=super-secret-key
API_KEY=abc123

# .gitignore
.env
.env.local
.env.*.local
```

## Résumé

**Installation Node.js**
- Site officiel : LTS (production) vs Current (dev)
- Windows : MSI, Chocolatey, Winget
- macOS : PKG, Homebrew
- Linux : NodeSource, gestionnaires de paquets

**NVM : Version Manager**
- Gérer plusieurs versions simultanément
- Basculer facilement : `nvm use 18`
- .nvmrc pour spécifier la version par projet
- Recommandé pour tous les développeurs

**Configuration**
- Variables d'environnement avec .env
- Configuration NPM (.npmrc)
- VS Code : extensions et debugging
- PM2 pour la production

**Outils Essentiels**
- Nodemon : auto-restart en développement
- PM2 : process manager en production
- ESLint + Prettier : qualité de code
- Debugging avec VS Code

**Bonnes Pratiques**
- Utiliser NVM
- Éviter sudo avec npm
- .nvmrc pour chaque projet
- Vérifier engines dans package.json
- .env pour les secrets

Avec Node.js correctement installé et configuré, vous êtes prêt à explorer **NPM et la gestion des packages**.