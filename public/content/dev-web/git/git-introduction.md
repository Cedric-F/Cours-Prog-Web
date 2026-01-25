# Introduction à Git

Système de contrôle de version distribué, indispensable pour tout développeur.

---

## Ce que vous allez apprendre

- Comprendre le concept de versioning
- Installer et configurer Git
- Maîtriser les commandes de base
- Gérer l'historique de votre projet

## Prérequis

- Utilisation basique du terminal/ligne de commande
- Un éditeur de code (VS Code recommandé)

---

## Pourquoi utiliser Git ?

### Le problème sans Git

```
📁 mon-projet/
├── index.html
├── index_v2.html
├── index_v2_final.html
├── index_v2_final_vraiment.html
├── index_backup_23-01.html
└── index_UTILISER_CELUI_CI.html   ← 😱
```

### La solution avec Git

```
📁 mon-projet/
├── index.html                      ← Version actuelle
└── .git/                           ← Historique complet
    └── (toutes les versions)
```

Git enregistre **chaque modification** avec :
- 📅 La date et l'heure
- 👤 L'auteur
- 💬 Un message descriptif
- 🔗 Un identifiant unique (hash)

---

## Installation

### Windows

```bash
# Télécharger depuis git-scm.com
# Ou avec winget
winget install Git.Git
```

### macOS

```bash
# Avec Homebrew
brew install git

# Ou avec Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
```

### Vérifier l'installation

```bash
git --version
# git version 2.43.0
```

---

## Configuration initiale

### Identité (obligatoire)

```bash
# Votre nom (apparaît dans les commits)
git config --global user.name "Votre Nom"

# Votre email (doit correspondre à GitHub)
git config --global user.email "votre.email@example.com"
```

### Configurations recommandées

```bash
# Éditeur par défaut (VS Code)
git config --global core.editor "code --wait"

# Branche par défaut
git config --global init.defaultBranch main

# Couleurs dans le terminal
git config --global color.ui auto

# Vérifier la configuration
git config --list
```

---

## Les concepts fondamentaux

### Les 3 zones de Git

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKING DIRECTORY                         │
│              (Vos fichiers sur le disque)                   │
│                                                              │
│    index.html  ←── Vous modifiez ici                        │
│    style.css                                                 │
│    app.js                                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ git add
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     STAGING AREA                             │
│              (Index - Zone de préparation)                  │
│                                                              │
│    Fichiers prêts à être "photographiés"                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ git commit
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORY                              │
│              (Historique des commits)                       │
│                                                              │
│    commit abc123 ─── commit def456 ─── commit ghi789        │
└─────────────────────────────────────────────────────────────┘
```

### Workflow de base

```bash
# 1. Modifier des fichiers (Working Directory)
# 2. Ajouter au staging
git add fichier.js

# 3. Créer un commit (snapshot)
git commit -m "Description du changement"
```

---

## Commandes de base

### Initialiser un projet

```bash
# Créer un nouveau dépôt Git
cd mon-projet
git init

# Résultat
# Initialized empty Git repository in /mon-projet/.git/
```

### Vérifier l'état

```bash
git status
```

**Exemple de sortie :**

```
On branch main

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   index.html      ← Modifié, pas stagé

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        nouveau.js                  ← Nouveau fichier, pas suivi
```

### Ajouter des fichiers (staging)

```bash
# Un fichier spécifique
git add index.html

# Plusieurs fichiers
git add index.html style.css

# Tous les fichiers modifiés
git add .

# Tous les fichiers d'un type
git add *.js
```

### Créer un commit

```bash
# Commit avec message
git commit -m "Ajoute la page d'accueil"

# Commit avec message détaillé (ouvre l'éditeur)
git commit
```

### Bonnes pratiques pour les messages

```bash
# ✅ BON - Verbe à l'impératif, concis, descriptif
git commit -m "Ajoute la validation du formulaire de contact"
git commit -m "Corrige le bug d'affichage sur mobile"
git commit -m "Supprime les console.log de debug"

# ❌ MAUVAIS - Vague, passé, trop long
git commit -m "fix"
git commit -m "changements"
git commit -m "j'ai modifié le fichier index.html pour ajouter un titre"
```

### Format conventionnel (Conventional Commits)

```bash
# type(scope): description
git commit -m "feat(auth): ajoute la connexion Google"
git commit -m "fix(cart): corrige le calcul du total"
git commit -m "docs(readme): met à jour les instructions"
git commit -m "style(css): améliore le responsive"
git commit -m "refactor(api): simplifie les routes utilisateur"
```

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de code) |
| `refactor` | Refactoring |
| `test` | Ajout de tests |
| `chore` | Maintenance (dépendances, config) |

---

## Consulter l'historique

### Voir les commits

```bash
# Liste des commits
git log

# Format compact (une ligne par commit)
git log --oneline

# Avec graphe des branches
git log --oneline --graph --all

# Les 5 derniers commits
git log -5
```

**Exemple de sortie :**

```
abc1234 (HEAD -> main) Ajoute le panier d'achat
def5678 Corrige le bug de connexion
ghi9012 Ajoute l'authentification JWT
jkl3456 Initial commit
```

### Voir les différences

```bash
# Modifications non stagées
git diff

# Modifications stagées (prêtes à commit)
git diff --staged

# Différence entre deux commits
git diff abc123 def456

# Différence pour un fichier spécifique
git diff index.html
```

---

## Annuler des modifications

### Annuler les modifications non stagées

```bash
# Un fichier spécifique
git checkout -- index.html

# Tous les fichiers (⚠️ destructif)
git checkout -- .

# Méthode moderne (Git 2.23+)
git restore index.html
```

### Retirer du staging (sans perdre les modifications)

```bash
# Un fichier
git reset HEAD index.html

# Méthode moderne
git restore --staged index.html
```

### Modifier le dernier commit

```bash
# Changer le message
git commit --amend -m "Nouveau message"

# Ajouter des fichiers oubliés au dernier commit
git add fichier-oublie.js
git commit --amend --no-edit
```

### Revenir à un commit précédent

```bash
# Voir l'historique
git log --oneline

# Créer un nouveau commit qui annule les changements
git revert abc123

# ⚠️ Revenir en arrière (perd les commits suivants)
git reset --hard abc123
```

---

## Le fichier .gitignore

Fichier qui liste ce que Git doit ignorer :

```gitignore
# Dépendances
node_modules/
vendor/

# Build
dist/
build/
.next/

# Environnement
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Cache
.cache/
.parcel-cache/
```

### Créer un .gitignore

```bash
# Créer le fichier
touch .gitignore

# Utiliser un template (gitignore.io)
# Aller sur gitignore.io et générer pour Node, React, etc.
```

---

## ❌ Erreurs Courantes

### 1. Committer sans configuration

```bash
# ❌ Erreur
git commit -m "Premier commit"
# fatal: unable to auto-detect email address

# ✅ Solution
git config --global user.email "email@example.com"
git config --global user.name "Votre Nom"
```

### 2. Oublier d'ajouter avant de commit

```bash
# ❌ Rien n'est commité
git commit -m "Mes modifications"
# nothing to commit, working tree clean

# ✅ Ajouter d'abord
git add .
git commit -m "Mes modifications"
```

### 3. Committer node_modules

```bash
# ❌ Catastrophe (des milliers de fichiers)
git add .
git commit -m "Add project"

# ✅ Créer .gitignore AVANT le premier commit
echo "node_modules/" >> .gitignore
git add .
git commit -m "Initial commit"
```

### 4. Message de commit vague

```bash
# ❌ Inutile pour comprendre l'historique
git commit -m "update"
git commit -m "fix stuff"

# ✅ Descriptif
git commit -m "Corrige l'affichage du prix dans le panier"
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Premier dépôt

**Objectif** : Créer votre premier projet versionné

1. Créer un dossier `mon-premier-repo`
2. Initialiser Git
3. Créer un fichier `README.md` avec votre nom
4. Faire votre premier commit

<details>
<summary>💡 Solution</summary>

```bash
mkdir mon-premier-repo
cd mon-premier-repo
git init
echo "# Mon Projet - Par [Votre Nom]" > README.md
git add README.md
git commit -m "Initial commit: ajoute README"
```
</details>

### Exercice 2 : Workflow complet

**Objectif** : Pratiquer le cycle add/commit

1. Créer 3 fichiers : `index.html`, `style.css`, `app.js`
2. Commit chaque fichier séparément avec un message approprié
3. Vérifier l'historique avec `git log --oneline`

<details>
<summary>💡 Solution</summary>

```bash
touch index.html style.css app.js

echo "<html></html>" > index.html
git add index.html
git commit -m "feat: ajoute la structure HTML"

echo "body {}" > style.css
git add style.css
git commit -m "style: ajoute la feuille de style"

echo "console.log('Hello');" > app.js
git add app.js
git commit -m "feat: ajoute le fichier JavaScript principal"

git log --oneline
```
</details>

### Exercice 3 : Gérer .gitignore

**Objectif** : Ignorer les fichiers sensibles

1. Créer un fichier `.env` avec `API_KEY=secret123`
2. Créer un dossier `node_modules/` avec un fichier dedans
3. Configurer `.gitignore` pour les ignorer
4. Vérifier avec `git status`

<details>
<summary>💡 Solution</summary>

```bash
echo "API_KEY=secret123" > .env
mkdir node_modules
touch node_modules/package.json

echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore

git status
# .env et node_modules ne doivent PAS apparaître

git add .gitignore
git commit -m "chore: configure gitignore"
```
</details>

---

## Quiz de vérification

1. Quelle commande initialise un nouveau dépôt Git ?
   - A) `git start`
   - B) `git init` ✅
   - C) `git create`

2. Quelle zone contient les fichiers prêts à être commités ?
   - A) Working Directory
   - B) Staging Area ✅
   - C) Repository

3. Quel fichier permet d'ignorer certains fichiers ?
   - A) `.gitconfig`
   - B) `.gitignore` ✅
   - C) `.gitexclude`

4. Quelle commande affiche l'état des fichiers ?
   - A) `git log`
   - B) `git status` ✅
   - C) `git show`

---

## Pour aller plus loin

- [Documentation officielle Git](https://git-scm.com/doc)
- [Learn Git Branching](https://learngitbranching.js.org/) - Jeu interactif
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Solutions aux erreurs courantes

---

## Prochaine étape

Maintenant que vous maîtrisez les bases, apprenez à [travailler avec les branches](./branches-merging.md) pour gérer plusieurs versions de votre code en parallèle.
