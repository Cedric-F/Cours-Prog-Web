# Branches et Merging

Les branches permettent de travailler sur différentes fonctionnalités en parallèle sans affecter le code principal.

---

## Ce que vous allez apprendre

- Créer et naviguer entre les branches
- Fusionner des branches (merge)
- Résoudre les conflits de fusion
- Appliquer des stratégies de branching

## Prérequis

- [Introduction à Git](./git-introduction.md) - Commandes de base

---

## Pourquoi utiliser des branches ?

### Sans branches

```
┌─────────────────────────────────────────────────────────────┐
│ main: ──○──○──○──○──○──○──○──○──○──○                        │
│              │                                               │
│              └── 😱 Tout le monde travaille ici             │
│                  - Conflits constants                        │
│                  - Code cassé sur main                       │
│                  - Impossible de revenir en arrière         │
└─────────────────────────────────────────────────────────────┘
```

### Avec branches

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ feature/auth:        ○──○──○──○                             │
│                     /          \                             │
│ main:        ──○──○─────────────○──○──○                     │
│                     \              /                         │
│ feature/cart:        ○──○──○──○──○                          │
│                                                              │
│ ✅ Travail isolé    ✅ Merge quand prêt    ✅ main stable   │
└─────────────────────────────────────────────────────────────┘
```

---

## Commandes de base

### Lister les branches

```bash
# Branches locales
git branch

# Branches locales + distantes
git branch -a

# Avec le dernier commit
git branch -v
```

**Exemple de sortie :**

```
* main                  abc1234 Dernière feature
  feature/auth          def5678 Ajoute login
  feature/cart          ghi9012 WIP panier
```

L'astérisque `*` indique la branche actuelle.

### Créer une branche

```bash
# Créer sans y aller
git branch feature/nouvelle-fonctionnalite

# Créer ET y aller (recommandé)
git checkout -b feature/nouvelle-fonctionnalite

# Méthode moderne (Git 2.23+)
git switch -c feature/nouvelle-fonctionnalite
```

### Changer de branche

```bash
# Méthode classique
git checkout main

# Méthode moderne
git switch main

# Revenir à la branche précédente
git switch -
```

### Supprimer une branche

```bash
# Supprimer une branche fusionnée
git branch -d feature/auth

# Forcer la suppression (⚠️ perte de travail possible)
git branch -D feature/non-fusionnee
```

---

## Workflow de développement

### 1. Créer une branche pour chaque feature

```bash
# Toujours partir de main à jour
git switch main
git pull origin main

# Créer la branche feature
git switch -c feature/user-profile

# Travailler...
git add .
git commit -m "feat(profile): ajoute la page profil"
git commit -m "feat(profile): ajoute l'upload d'avatar"
```

### 2. Fusionner quand c'est prêt

```bash
# Retourner sur main
git switch main

# Fusionner la feature
git merge feature/user-profile

# Supprimer la branche (optionnel)
git branch -d feature/user-profile
```

---

## Types de merge

### Fast-Forward Merge

Quand main n'a pas bougé depuis la création de la branche :

```
AVANT:
main:     ──○──○──○
                   \
feature:            ○──○──○

APRÈS (fast-forward):
main:     ──○──○──○──○──○──○
                   (feature supprimée)
```

```bash
# Résultat: pas de commit de merge, historique linéaire
git merge feature/auth
# Fast-forward
```

### Merge Commit (3-way merge)

Quand main a évolué en parallèle :

```
AVANT:
main:     ──○──○──○──○──○
                   \
feature:            ○──○──○

APRÈS:
main:     ──○──○──○──○──○──○
                   \      /
feature:            ○──○──○
                         
                    └── Commit de merge
```

```bash
git merge feature/cart
# Merge made by the 'ort' strategy.
```

---

## Résoudre les conflits

### Quand un conflit survient

```bash
git merge feature/auth
# CONFLICT (content): Merge conflict in src/App.js
# Automatic merge failed; fix conflicts and then commit the result.
```

### Anatomie d'un conflit

```javascript
// src/App.js
function App() {
<<<<<<< HEAD
  // Code de main
  return <div>Version Main</div>;
=======
  // Code de feature/auth
  return <div>Version Auth</div>;
>>>>>>> feature/auth
}
```

| Marqueur | Signification |
|----------|---------------|
| `<<<<<<< HEAD` | Début du code de la branche actuelle (main) |
| `=======` | Séparateur |
| `>>>>>>> feature/auth` | Fin du code de la branche mergée |

### Résoudre manuellement

```javascript
// Choisir une version, combiner, ou réécrire
function App() {
  return <div>Version finale combinée</div>;
}
```

```bash
# Marquer comme résolu
git add src/App.js

# Terminer le merge
git commit -m "merge: résout conflit App.js"
```

### Résoudre avec VS Code

VS Code affiche des boutons au-dessus des conflits :

```
Accept Current Change | Accept Incoming Change | Accept Both Changes | Compare Changes
```

### Annuler un merge en cours

```bash
# Revenir à l'état avant le merge
git merge --abort
```

---

## Stratégies de branching

### Git Flow (projets structurés)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ production:  ─────────────────○─────────────────○────       │
│                              /                  /            │
│ main:        ──○──○──○──○──○────○──○──○──○──○──○──○──       │
│                    \       /        \        /               │
│ feature/*:          ○──○──○          ○──○──○                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Branche | Rôle |
|---------|------|
| `main` | Développement actif |
| `production` | Code en production |
| `feature/*` | Nouvelles fonctionnalités |
| `hotfix/*` | Corrections urgentes |
| `release/*` | Préparation de version |

### GitHub Flow (projets simples)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ main:        ──○──○──○──○──○──○──○──○──○──○──○──○────       │
│                    \     /    \        /                     │
│ feature/*:          ○──○       ○──○──○                       │
│                                                              │
│ Règle: main est TOUJOURS déployable                         │
└─────────────────────────────────────────────────────────────┘
```

**Workflow :**
1. Créer une branche depuis `main`
2. Développer + commits
3. Ouvrir une Pull Request
4. Review + merge
5. Déployer

### Trunk-Based (équipes expérimentées)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ main:        ──○──○──○──○──○──○──○──○──○──○──○──○────       │
│                 \   /   \  /                                 │
│ feature:         ○─○     ○─○   (branches très courtes)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Conventions de nommage

### Format recommandé

```bash
type/description-courte

# Exemples
feature/user-authentication
feature/shopping-cart
bugfix/login-redirect
hotfix/payment-crash
refactor/api-structure
docs/readme-update
```

### Types courants

| Préfixe | Usage |
|---------|-------|
| `feature/` | Nouvelle fonctionnalité |
| `bugfix/` | Correction de bug |
| `hotfix/` | Correction urgente |
| `refactor/` | Refactoring |
| `docs/` | Documentation |
| `test/` | Ajout de tests |
| `chore/` | Maintenance |

---

## Commandes avancées

### Rebase (réécrire l'historique)

```bash
# Mettre à jour feature avec les derniers commits de main
git switch feature/auth
git rebase main
```

**Avant :**
```
main:     ──○──○──○──○──○
                   \
feature:            ○──○──○
```

**Après rebase :**
```
main:     ──○──○──○──○──○
                         \
feature:                  ○──○──○
```

⚠️ **Ne jamais rebase des branches partagées !**

### Cherry-pick (prendre un commit spécifique)

```bash
# Appliquer un commit d'une autre branche
git cherry-pick abc1234
```

### Stash (mettre de côté temporairement)

```bash
# Sauvegarder les modifications en cours
git stash

# Changer de branche
git switch main

# Récupérer les modifications
git switch feature/auth
git stash pop
```

---

## ❌ Erreurs Courantes

### 1. Travailler directement sur main

```bash
# ❌ Risqué
git switch main
# ... modifications ...
git commit -m "Nouvelle feature"

# ✅ Toujours créer une branche
git switch -c feature/ma-feature
# ... modifications ...
git commit -m "Nouvelle feature"
```

### 2. Ne pas mettre à jour avant de merger

```bash
# ❌ Conflits garantis
git switch main
git merge feature/auth  # main est obsolète

# ✅ Mettre à jour main d'abord
git switch main
git pull origin main
git merge feature/auth
```

### 3. Supprimer une branche non fusionnée

```bash
# ❌ Perte de travail
git branch -D feature/importante

# ✅ Vérifier avant
git log main..feature/importante  # Voir les commits non fusionnés
git branch -d feature/importante  # Erreur si non fusionnée
```

### 4. Rebase sur une branche partagée

```bash
# ❌ Casse l'historique pour les autres
git switch main
git rebase feature/shared  # JAMAIS !

# ✅ Merge à la place
git merge feature/shared
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Workflow basique

**Objectif** : Créer et fusionner une branche

1. Créer un fichier `index.html` sur `main`
2. Créer une branche `feature/header`
3. Ajouter un `<header>` dans le fichier
4. Fusionner dans `main`

<details>
<summary>💡 Solution</summary>

```bash
# Setup
echo "<html><body></body></html>" > index.html
git add index.html
git commit -m "Initial commit"

# Feature
git switch -c feature/header
# Modifier index.html pour ajouter <header>
git add index.html
git commit -m "feat: ajoute le header"

# Merge
git switch main
git merge feature/header
git branch -d feature/header
```
</details>

### Exercice 2 : Résoudre un conflit

**Objectif** : Gérer un conflit de fusion

1. Sur `main`, créer `app.js` avec `const version = "1.0"`
2. Créer branche `feature/v2`, changer en `"2.0"`
3. Retourner sur `main`, changer en `"1.5"`
4. Merger et résoudre le conflit

<details>
<summary>💡 Solution</summary>

```bash
# Setup sur main
echo 'const version = "1.0";' > app.js
git add app.js
git commit -m "Initial version"

# Feature branch
git switch -c feature/v2
echo 'const version = "2.0";' > app.js
git commit -am "Upgrade to v2"

# Modification sur main
git switch main
echo 'const version = "1.5";' > app.js
git commit -am "Patch to v1.5"

# Merge avec conflit
git merge feature/v2
# CONFLICT!

# Résoudre: choisir la version finale
echo 'const version = "2.0";' > app.js
git add app.js
git commit -m "merge: résout conflit, garde v2"
```
</details>

### Exercice 3 : Branches multiples

**Objectif** : Gérer plusieurs features en parallèle

1. Créer `feature/nav` et `feature/footer` depuis `main`
2. Ajouter du contenu dans chaque branche
3. Fusionner les deux dans `main`

<details>
<summary>💡 Solution</summary>

```bash
# Feature 1
git switch -c feature/nav
echo "<nav>Menu</nav>" > nav.html
git add nav.html
git commit -m "feat: ajoute navigation"

# Feature 2 (depuis main)
git switch main
git switch -c feature/footer
echo "<footer>© 2024</footer>" > footer.html
git add footer.html
git commit -m "feat: ajoute footer"

# Merge les deux
git switch main
git merge feature/nav
git merge feature/footer

# Cleanup
git branch -d feature/nav feature/footer
```
</details>

---

## Quiz de vérification

1. Quelle commande crée une branche ET y bascule ?
   - A) `git branch feature`
   - B) `git switch -c feature` ✅
   - C) `git checkout feature`

2. Que signifie "fast-forward" lors d'un merge ?
   - A) Le merge est annulé
   - B) Il y a un conflit
   - C) La branche est simplement avancée ✅

3. Comment résoudre un conflit ?
   - A) `git conflict --resolve`
   - B) Éditer le fichier, puis `git add` et `git commit` ✅
   - C) `git merge --force`

4. Quelle stratégie est recommandée pour les débutants ?
   - A) Git Flow
   - B) GitHub Flow ✅
   - C) Trunk-Based

---

## Pour aller plus loin

- [Learn Git Branching](https://learngitbranching.js.org/) - Visualisation interactive
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials/using-branches)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

---

## Prochaine étape

Apprenez à [collaborer avec GitHub](./github-collaboration.md) pour partager votre code et travailler en équipe.
