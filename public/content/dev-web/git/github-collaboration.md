# GitHub et Collaboration

GitHub est la plateforme de collaboration pour les projets Git. Apprenez à partager votre code et travailler en équipe.

---

## Ce que vous allez apprendre

- Créer et configurer un dépôt GitHub
- Synchroniser avec `push` et `pull`
- Collaborer avec les Pull Requests
- Gérer les issues et le projet

## Prérequis

- [Introduction à Git](./git-introduction.md)
- [Branches et Merging](./branches-merging.md)
- Un compte GitHub (gratuit)

---

## GitHub vs Git

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  GIT (local)                    GITHUB (cloud)              │
│  ┌──────────────┐               ┌──────────────┐            │
│  │ Ton ordi     │    push →     │ Serveur      │            │
│  │              │    ← pull     │              │            │
│  │ .git/        │               │ Repository   │            │
│  └──────────────┘               └──────────────┘            │
│                                        ↓                     │
│                                 Accessible par               │
│                                 toute l'équipe              │
└─────────────────────────────────────────────────────────────┘
```

| Git | GitHub |
|-----|--------|
| Outil en ligne de commande | Plateforme web |
| Fonctionne localement | Hébergement cloud |
| Gère l'historique | Ajoute collaboration |
| Gratuit, open-source | Freemium |

---

## Configuration SSH (recommandé)

### Pourquoi SSH ?

- Plus sécurisé que HTTPS
- Pas besoin de mot de passe à chaque push
- Requis pour les organisations

### Générer une clé SSH

```bash
# Générer une nouvelle clé
ssh-keygen -t ed25519 -C "votre.email@example.com"

# Appuyer sur Entrée pour accepter l'emplacement par défaut
# Entrer une passphrase (optionnel mais recommandé)
```

### Ajouter la clé à l'agent SSH

```bash
# Démarrer l'agent (Windows Git Bash)
eval "$(ssh-agent -s)"

# Ajouter la clé
ssh-add ~/.ssh/id_ed25519
```

### Ajouter la clé à GitHub

```bash
# Copier la clé publique
cat ~/.ssh/id_ed25519.pub
# Ou sur Windows: clip < ~/.ssh/id_ed25519.pub
```

1. Aller sur GitHub → Settings → SSH and GPG keys
2. Cliquer "New SSH key"
3. Coller la clé et sauvegarder

### Tester la connexion

```bash
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

---

## Créer un dépôt sur GitHub

### Option 1 : Depuis l'interface web

1. Cliquer sur "+" → "New repository"
2. Nommer le dépôt
3. Choisir Public ou Private
4. **Ne PAS** cocher "Add a README" (si projet existant)
5. Créer

### Option 2 : GitHub CLI

```bash
# Installer GitHub CLI
# https://cli.github.com/

# Se connecter
gh auth login

# Créer un dépôt
gh repo create mon-projet --public --source=. --push
```

---

## Connecter un projet local à GitHub

### Projet existant → GitHub

```bash
# Dans votre projet local
cd mon-projet

# Ajouter le remote (origine)
git remote add origin git@github.com:username/mon-projet.git

# Vérifier
git remote -v

# Premier push
git push -u origin main
```

### Cloner un projet GitHub

```bash
# HTTPS
git clone https://github.com/username/projet.git

# SSH (recommandé)
git clone git@github.com:username/projet.git

# Cloner dans un dossier spécifique
git clone git@github.com:username/projet.git mon-dossier
```

---

## Synchronisation

### Push (envoyer vers GitHub)

```bash
# Envoyer la branche actuelle
git push

# Envoyer une branche spécifique
git push origin feature/auth

# Premier push d'une nouvelle branche
git push -u origin feature/nouvelle
# -u configure le tracking (plus besoin de préciser ensuite)
```

### Pull (récupérer depuis GitHub)

```bash
# Récupérer et fusionner
git pull

# Équivalent à :
git fetch origin
git merge origin/main
```

### Fetch (récupérer sans fusionner)

```bash
# Voir les changements distants sans les appliquer
git fetch origin

# Comparer
git diff main origin/main

# Fusionner manuellement
git merge origin/main
```

---

## Pull Requests (PR)

### Concept

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  1. Créer branche        2. Push              3. PR         │
│                                                              │
│  feature/auth ──→  GitHub:feature/auth ──→  "Review plz!"  │
│                                                              │
│  4. Review               5. Merge            6. Deploy      │
│                                                              │
│  "LGTM 👍"          ──→  main               ──→  🚀         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Pull Request

```bash
# 1. Créer et travailler sur une branche
git switch -c feature/auth
# ... commits ...

# 2. Push la branche
git push -u origin feature/auth

# 3. Aller sur GitHub → "Compare & pull request"
```

### Créer une PR via GitHub CLI

```bash
# Créer une PR
gh pr create --title "Ajoute authentification" --body "Description..."

# Voir les PR
gh pr list

# Voir une PR spécifique
gh pr view 42
```

### Anatomie d'une bonne PR

```markdown
## Description

Ajoute le système d'authentification JWT avec :
- Login/Register
- Refresh tokens
- Middleware de protection

## Type de changement

- [x] Nouvelle fonctionnalité
- [ ] Correction de bug
- [ ] Breaking change

## Comment tester

1. `npm install`
2. `npm run dev`
3. Aller sur `/login`
4. Tester avec: user@test.com / password123

## Checklist

- [x] Tests ajoutés
- [x] Documentation mise à jour
- [x] Pas de console.log
```

### Review une PR

```bash
# Checkout la PR localement
gh pr checkout 42

# Tester le code...

# Approuver
gh pr review 42 --approve

# Demander des modifications
gh pr review 42 --request-changes --body "Voir commentaires"
```

---

## Issues

### Créer une issue

```markdown
## Bug: Le bouton de connexion ne fonctionne pas sur Safari

### Description
Cliquer sur "Se connecter" ne fait rien sur Safari 16.

### Étapes pour reproduire
1. Ouvrir Safari
2. Aller sur /login
3. Remplir le formulaire
4. Cliquer "Se connecter"

### Comportement attendu
Redirection vers /dashboard

### Comportement actuel
Rien ne se passe

### Environnement
- OS: macOS Ventura
- Navigateur: Safari 16.2
```

### Lier PR et Issues

```bash
# Dans le message de commit ou la PR
git commit -m "fix: corrige le login Safari

Closes #42"
```

Mots-clés qui ferment automatiquement l'issue :
- `Closes #42`
- `Fixes #42`
- `Resolves #42`

---

## Collaboration en équipe

### Ajouter des collaborateurs

1. Repository → Settings → Collaborators
2. Ajouter par username ou email
3. Le collaborateur accepte l'invitation

### Protéger la branche main

Settings → Branches → Add rule

```
✅ Require pull request before merging
✅ Require approvals (1-2)
✅ Require status checks to pass
✅ Require branches to be up to date
```

### Workflow équipe

```bash
# 1. Récupérer les dernières modifications
git switch main
git pull origin main

# 2. Créer une branche
git switch -c feature/ma-tache

# 3. Travailler et commiter
git add .
git commit -m "feat: description"

# 4. Mettre à jour avec main (éviter les conflits)
git fetch origin
git rebase origin/main
# Ou: git merge origin/main

# 5. Push
git push -u origin feature/ma-tache

# 6. Créer la PR sur GitHub
gh pr create

# 7. Après review et merge, nettoyer
git switch main
git pull origin main
git branch -d feature/ma-tache
```

---

## Forks et Contributions Open Source

### Fork un projet

1. Aller sur le repository
2. Cliquer "Fork"
3. Cloner VOTRE fork

```bash
# Cloner votre fork
git clone git@github.com:VOTRE-USERNAME/projet.git
cd projet

# Ajouter le repo original comme "upstream"
git remote add upstream git@github.com:ORIGINAL-OWNER/projet.git

# Vérifier
git remote -v
# origin    git@github.com:VOTRE-USERNAME/projet.git (fetch)
# origin    git@github.com:VOTRE-USERNAME/projet.git (push)
# upstream  git@github.com:ORIGINAL-OWNER/projet.git (fetch)
# upstream  git@github.com:ORIGINAL-OWNER/projet.git (push)
```

### Contribuer à un projet open source

```bash
# 1. Synchroniser avec upstream
git fetch upstream
git switch main
git merge upstream/main

# 2. Créer une branche
git switch -c fix/typo-readme

# 3. Faire les modifications
git commit -am "docs: corrige typo dans README"

# 4. Push vers VOTRE fork
git push origin fix/typo-readme

# 5. Créer une PR vers le repo original (via GitHub)
```

---

## GitHub Actions (CI/CD basique)

### Créer un workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
```

### Badges

```markdown
<!-- Dans README.md -->
![CI](https://github.com/username/projet/actions/workflows/ci.yml/badge.svg)
```

---

## Le fichier README.md

### Template de base

```markdown
# Nom du Projet

Description courte du projet.

## 🚀 Demo

[Lien vers la demo](https://mon-projet.vercel.app)

## ✨ Fonctionnalités

- Feature 1
- Feature 2
- Feature 3

## 🛠️ Technologies

- React 18
- Node.js / Express
- MongoDB
- Tailwind CSS

## 📦 Installation

```bash
# Cloner le projet
git clone git@github.com:username/projet.git
cd projet

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Lancer en développement
npm run dev
```

## 🔧 Configuration

Créer un fichier `.env` :

```env
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=votre-secret
```

## 📁 Structure

```
src/
├── components/    # Composants React
├── pages/         # Pages de l'application
├── services/      # Logique métier
└── utils/         # Fonctions utilitaires
```

## 👥 Auteurs

- [@username](https://github.com/username)

## 📄 License

MIT
```

---

## ❌ Erreurs Courantes

### 1. Push sur main protégé

```bash
# ❌ Erreur
git push origin main
# remote: error: GH006: Protected branch update failed

# ✅ Solution: utiliser une PR
git switch -c fix/mon-fix
git push -u origin fix/mon-fix
# Créer une PR sur GitHub
```

### 2. Oublier de pull avant de push

```bash
# ❌ Erreur
git push
# rejected: non-fast-forward

# ✅ Solution
git pull --rebase origin main
git push
```

### 3. Commiter des secrets

```bash
# ❌ DANGER: .env sur GitHub
git add .
git commit -m "Add config"
git push  # 😱 API keys exposées!

# ✅ Toujours avoir .gitignore AVANT
echo ".env" >> .gitignore
# Si déjà commité: changer les clés immédiatement!
```

### 4. Mauvais remote URL

```bash
# Vérifier le remote
git remote -v

# Corriger
git remote set-url origin git@github.com:username/projet.git
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Premier dépôt GitHub

**Objectif** : Publier un projet sur GitHub

1. Créer un nouveau dépôt sur GitHub
2. Créer un projet local avec un README
3. Connecter et pusher

<details>
<summary>💡 Solution</summary>

```bash
# Local
mkdir mon-premier-github
cd mon-premier-github
git init
echo "# Mon Premier Projet GitHub" > README.md
git add README.md
git commit -m "Initial commit"

# Connecter à GitHub
git remote add origin git@github.com:USERNAME/mon-premier-github.git
git push -u origin main
```
</details>

### Exercice 2 : Workflow PR

**Objectif** : Créer une Pull Request

1. Cloner votre dépôt
2. Créer une branche `feature/about`
3. Ajouter un fichier `ABOUT.md`
4. Pusher et créer une PR
5. Merger via GitHub

<details>
<summary>💡 Solution</summary>

```bash
git clone git@github.com:USERNAME/mon-projet.git
cd mon-projet

git switch -c feature/about
echo "# À propos" > ABOUT.md
git add ABOUT.md
git commit -m "docs: ajoute page about"
git push -u origin feature/about

# Sur GitHub: Create Pull Request → Merge
```
</details>

### Exercice 3 : Collaboration simulée

**Objectif** : Simuler un workflow d'équipe

1. Créer deux dossiers (simulant 2 développeurs)
2. Cloner le même repo dans les deux
3. Chaque "dev" crée une branche et un fichier
4. Merger les deux via PR

<details>
<summary>💡 Solution</summary>

```bash
# Dev 1
mkdir dev1 && cd dev1
git clone git@github.com:USERNAME/projet.git
cd projet
git switch -c feature/header
echo "<header>" > header.html
git add . && git commit -m "feat: add header"
git push -u origin feature/header

# Dev 2 (autre terminal)
mkdir dev2 && cd dev2
git clone git@github.com:USERNAME/projet.git
cd projet
git switch -c feature/footer
echo "<footer>" > footer.html
git add . && git commit -m "feat: add footer"
git push -u origin feature/footer

# Merger les deux PR sur GitHub
```
</details>

---

## Quiz de vérification

:::quiz
Q: Quelle commande envoie vos commits vers GitHub ?
- [ ] `git send`
- [x] `git push`
- [ ] `git upload`
> `git push` envoie vos commits locaux vers le dépôt distant (origin).

Q: Qu'est-ce qu'une Pull Request ?
- [ ] Télécharger du code
- [x] Demande de fusion de branche
- [ ] Supprimer une branche
> Une PR permet de proposer des modifications et de les faire relire avant de les merger.

Q: Comment récupérer les modifications d'un collègue ?
- [ ] `git download`
- [x] `git pull`
- [ ] `git sync`
> `git pull` récupère les commits distants et les fusionne avec votre branche locale.

Q: Quel fichier ne doit JAMAIS être sur GitHub ?
- [ ] `README.md`
- [ ] `.gitignore`
- [x] `.env`
> Le fichier `.env` contient des secrets (API keys, passwords) qui ne doivent jamais être publiés.
:::

---

## Pour aller plus loin

- [GitHub Skills](https://skills.github.com/) - Cours interactifs officiels
- [First Contributions](https://github.com/firstcontributions/first-contributions) - Premier PR open source
- [GitHub Docs](https://docs.github.com/)

---

## Prochaine étape

Vous maîtrisez maintenant Git et GitHub ! Retournez aux [projets](../projets/consignes.md) pour appliquer ces compétences dans vos réalisations.
