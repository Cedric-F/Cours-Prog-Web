# Quiz – Niveau Confirmé (Architecture & Express avancé)

:::quiz
Q: Que se passe-t-il si deux middlewares modifient `req.user` successivement ?
- [ ] Le premier middleware écrase toujours le second
- [ ] Express bloque la modification
- [x] Le dernier middleware qui modifie la propriété définit la valeur finale
- [ ] req est immutable

> L’objet `req` est partagé tout au long de la requête. Chaque middleware peut le modifier.

Q: Pourquoi cette configuration peut poser problème en production ?

```js
res.cookie("token", jwt, { httpOnly: true });
```

- [ ] httpOnly est dangereux
- [x] Il manque secure et sameSite en HTTPS
- [ ] jwt doit être encodé en base64
- [ ] Les cookies ne fonctionnent pas avec JWT

> En production HTTPS, il faut généralement `secure: true` et définir `sameSite` pour éviter des failles CSRF.

Q: Que fait réellement `next(err)` ?
- [ ] Il redémarre la requête
- [x] Il saute les middlewares normaux et cherche un middleware d’erreur
- [ ] Il ignore l’erreur
- [ ] Il termine la requête automatiquement

> Express passe directement aux middlewares ayant la signature `(err, req, res, next)`.

Q: Pourquoi ce code peut-il provoquer une fuite mémoire ?

```js
let cache = [];

app.get("/data", (req, res) => {
  cache.push(req.body);
  res.send("ok");
});
```

- [ ] req.body est immutable
- [x] La variable globale grossit indéfiniment
- [ ] Express nettoie automatiquement
- [ ] Les tableaux ne consomment pas de mémoire

> Toute variable globale persistante peut croître indéfiniment si non contrôlée.

Q: Dans Express, quelle est la différence fondamentale entre :

```js
app.use("/users", middleware)

// ET

router.use(middleware)
```

- [ ] Aucune
- [ ] router.use ne supporte pas next()
- [x] router.use limite le scope au routeur monté
- [ ] app.use ne fonctionne pas avec des routes

> router.use applique le middleware uniquement aux routes gérées par ce router.

Q: Pourquoi ce code ne garantit-il pas la sécurité ?

```js
app.get("/admin", auth, (req, res) => {
  res.send("Admin page");
});
```

- [ ] auth est inutile
- [ ] GET ne peut pas être sécurisé
- [x] auth doit vérifier les rôles, pas seulement la présence d’un token
- [ ] res.send expose toujours des données

> Vérifier un JWT ne suffit pas. Il faut aussi contrôler les permissions.

Q: Quel est le principal risque si une route Express fait :

```js
await db.query("SELECT * FROM users");
```

sans filtrage ?

- [ ] SQL n’est pas compatible avec Node
- [x] Risque d’exposition massive de données
- [ ] Express bloque les requêtes longues
- [ ] db.query est toujours sécurisé

> Une requête non filtrée peut exposer des données sensibles.

Q: Pourquoi Node peut gérer beaucoup de connexions simultanées ?

- [ ] Il crée un thread par requête
- [ ] Il exécute tout en parallèle
- [x] Il utilise un modèle non bloquant et une event loop
- [ ] Il n’utilise pas TCP

> Node délègue l’attente I/O au kernel et ne bloque pas le thread principal.

Q: Quelle est la différence conceptuelle entre authentification et autorisation ?

- [ ] Aucune
- [x] Authentification = identité, Autorisation = permissions
- [ ] Autorisation vient avant authentification
- [ ] JWT remplace l’autorisation

> L’authentification identifie l’utilisateur. L’autorisation détermine ses droits.

Q: Pourquoi cette implémentation JWT est problématique ?

```js
jwt.sign({ user }, "secret");
```

- [ ] jwt.sign ne prend pas d’objet
- [x] Toute la structure user est embarquée dans le token
- [ ] secret ne peut pas être une string
- [ ] JWT ne supporte pas JSON

> Mettre l’objet complet augmente la taille du token et peut exposer des données sensibles. On ne met que les claims nécessaires.
:::