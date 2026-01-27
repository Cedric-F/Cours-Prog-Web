# Code Review : L'art de relire du code

La code review est une pratique essentielle du développement professionnel. Elle améliore la qualité du code, partage les connaissances et réduit les bugs.

## Pourquoi faire des code reviews ?

### Bénéfices

✅ **Qualité du code** : Détecter les bugs avant la production
✅ **Partage de connaissances** : Apprendre des autres et enseigner
✅ **Cohérence** : Maintenir un style uniforme
✅ **Documentation implicite** : Les discussions expliquent les décisions
✅ **Responsabilité partagée** : Plus d'une personne connaît le code

### Statistiques

- 60-90% des bugs peuvent être détectés en review
- Le coût de correction d'un bug augmente x10 à chaque phase (dev → test → prod)

---

## En tant que reviewer

### L'état d'esprit

> **Vous reviewez le code, pas la personne.**

- Soyez constructif, pas critique
- Posez des questions plutôt que d'affirmer
- Reconnaissez les bonnes idées
- Restez humble - vous pouvez vous tromper

### Que vérifier ?

#### 1. Fonctionnalité

- [ ] Le code fait-il ce qu'il est censé faire ?
- [ ] Les edge cases sont-ils gérés ?
- [ ] Y a-t-il des régressions possibles ?

#### 2. Design

- [ ] Le code est-il au bon endroit ?
- [ ] Les responsabilités sont-elles bien séparées ?
- [ ] Y a-t-il de la duplication ?

#### 3. Lisibilité

- [ ] Le code est-il compréhensible ?
- [ ] Les noms sont-ils explicites ?
- [ ] Y a-t-il des commentaires si nécessaire ?

#### 4. Maintenabilité

- [ ] Le code sera-t-il facile à modifier ?
- [ ] Y a-t-il des tests ?
- [ ] Les dépendances sont-elles appropriées ?

#### 5. Performance

- [ ] Y a-t-il des problèmes évidents de performance ?
- [ ] Les requêtes sont-elles optimisées ?

#### 6. Sécurité

- [ ] Les entrées sont-elles validées ?
- [ ] Y a-t-il des données sensibles exposées ?

---

## Comment commenter

### Types de commentaires

#### 🔴 Bloquant (must fix)

```
Cette requête SQL est vulnérable à l'injection. 
Il faut utiliser des paramètres préparés.
```

#### 🟡 Suggestion (should consider)

```
nit: On pourrait simplifier ces lignes avec un destructuring.

// Avant
const name = user.name;
const email = user.email;

// Après
const { name, email } = user;
```

#### 🟢 Nitpick (nice to have)

```
nitpick: Typo dans le commentaire : "utilisatuer" → "utilisateur"
```

#### ❓ Question

```
Question : Pourquoi utiliser setTimeout ici plutôt que requestAnimationFrame ?
Je suis curieux de comprendre le choix.
```

#### 💡 Suggestion positive

```
J'aime bien cette approche ! On pourrait même l'extraire 
dans un hook réutilisable pour les autres composants.
```

### Formulation

```diff
- ❌ "C'est mal écrit"
+ ✅ "Ce passage est un peu difficile à suivre. Que dirais-tu de..."

- ❌ "Tu dois changer ça"  
+ ✅ "Il faudrait modifier cette partie car..."

- ❌ "Pourquoi tu as fait ça ?"
+ ✅ "Je ne comprends pas bien ce choix, peux-tu m'expliquer ?"

- ❌ "..."
+ ✅ "Très bonne idée d'utiliser cette approche !"
```

### Préfixes utiles

| Préfixe | Signification |
|---------|---------------|
| `blocking:` | Doit être corrigé avant merge |
| `nit:` | Détail mineur, pas obligatoire |
| `suggestion:` | Proposition d'amélioration |
| `question:` | Demande de clarification |
| `thought:` | Réflexion à considérer |

---

## En tant qu'auteur

### Avant de demander une review

- [ ] J'ai testé mon code
- [ ] Les tests passent
- [ ] J'ai relu mon propre code
- [ ] La description de la PR est claire
- [ ] Les commits sont propres
- [ ] La PR n'est pas trop grosse (< 400 lignes idéalement)

### Description de PR efficace

```markdown
## Contexte
Résout le bug #123 où les utilisateurs ne pouvaient pas 
se connecter après avoir changé leur email.

## Changements
- Ajout d'une validation email avant la mise à jour
- Modification du flow de confirmation
- Tests unitaires pour les nouveaux cas

## Comment tester
1. Aller sur /settings
2. Changer l'email
3. Vérifier que la confirmation est demandée

## Screenshots
[si changements UI]

## Checklist
- [x] Tests ajoutés
- [x] Documentation mise à jour
- [ ] Migration de données nécessaire
```

### Répondre aux commentaires

```diff
+ ✅ "Bonne remarque, j'ai corrigé dans le commit abc123"
+ ✅ "Je ne suis pas d'accord parce que... mais je suis ouvert à la discussion"
+ ✅ "Je n'avais pas pensé à ce cas, merci !"

- ❌ "..." (ignorer le commentaire)
- ❌ "C'est comme ça, point."
- ❌ "Tu n'as pas compris"
```

---

## Le processus

### 1. Créer une PR/MR

```bash
# Sur GitHub/GitLab
git checkout -b feature/nouvelle-fonctionnalite
# ... commits ...
git push origin feature/nouvelle-fonctionnalite
# Créer la PR via l'interface
```

### 2. Assigner des reviewers

- Au moins 1-2 personnes
- Quelqu'un qui connaît le contexte
- Quelqu'un pour un regard neuf

### 3. Review

- Le reviewer lit le code
- Laisse des commentaires
- Approuve, demande des changements, ou commente

### 4. Itération

- L'auteur répond/corrige
- Le reviewer re-review
- Répéter jusqu'à approbation

### 5. Merge

- Squash ou merge selon les conventions
- Supprimer la branche

---

## Bonnes pratiques d'équipe

### Délais

- Review dans les **24h** (idéalement quelques heures)
- Ne pas laisser traîner les PRs
- Bloquer son calendrier pour des créneaux review

### Taille des PRs

| Lignes | Qualité de review |
|--------|-------------------|
| < 100 | Excellente |
| 100-400 | Bonne |
| 400-1000 | Correcte |
| > 1000 | Médiocre |

> Une grosse feature = plusieurs petites PRs

### Automatisation

- **Linting** : ESLint, Prettier en CI
- **Tests** : Jest, Cypress
- **Coverage** : Codecov, SonarQube
- **Security** : Dependabot, Snyk

Automatiser le trivial pour se concentrer sur l'important.

### Pair programming

Alternative à la review asynchrone :
- Deux développeurs, un clavier
- Review en temps réel
- Idéal pour les sujets complexes

---

## Erreurs courantes

### ❌ À éviter

1. **Reviews trop longues** : 1h max, sinon diviser la PR
2. **Bikeshedding** : Débattre des détails insignifiants
3. **Review sans contexte** : Demander le "pourquoi" si pas clair
4. **Approuver sans lire** : LGTM automatique
5. **Être trop sévère** : Décourager les contributions
6. **Être trop laxiste** : Laisser passer des problèmes

### Bikeshedding

```
Passer 30 minutes à débattre de :
- "should" vs "must" dans un message d'erreur
- Indentation 2 vs 4 espaces (devrait être automatisé)
- Nom d'une variable locale

Alors qu'il y a un bug de sécurité dans le code 🙈
```

---

## Exemple de review

### Le code

```javascript
// Nouvelle fonction à reviewer
function getUser(id) {
  const user = db.query("SELECT * FROM users WHERE id = " + id);
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }
  return null;
}
```

### La review

> 🔴 **Sécurité** : Cette requête est vulnérable à l'injection SQL. Utiliser des paramètres préparés :
> ```javascript
> db.query("SELECT * FROM users WHERE id = ?", [id])
> ```

> 🔴 **Sécurité** : Le mot de passe ne doit jamais être retourné ! Même hashé, c'est une fuite d'information.

> 🟡 **Suggestion** : Utiliser `SELECT id, name, email` plutôt que `*` pour éviter de récupérer des colonnes inutiles.

> 🟢 **nit** : La fonction pourrait lever une erreur plutôt que retourner null pour distinguer "non trouvé" de "erreur".

---

## Exercice

Reviewez ce code et identifiez les problèmes :

```javascript
async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  
  if (user.password === req.body.password) {
    const token = jwt.sign({ id: user.id }, 'secret123');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
}
```

<details>
<summary>✅ Problèmes identifiés</summary>

1. **Pas de vérification si user existe** → `user.password` crashera si email non trouvé
2. **Comparaison de mot de passe en clair** → Devrait utiliser bcrypt.compare()
3. **Secret JWT en dur** → Devrait être dans une variable d'environnement
4. **Message d'erreur trop précis** → "Wrong password" vs "Invalid credentials" (énumération d'utilisateurs)
5. **Pas de try/catch** → Les erreurs DB ne sont pas gérées
6. **Pas de validation** → req.body.email et req.body.password pourraient être undefined

</details>

---

## Ressources

- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [Conventional Comments](https://conventionalcomments.org/)
- [How to Do Code Reviews Like a Human](https://mtlynch.io/human-code-reviews-1/)
