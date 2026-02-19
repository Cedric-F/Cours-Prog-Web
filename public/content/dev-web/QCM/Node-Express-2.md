# Quiz – Niveau Intermédiaire (Express & HTTP)

:::quiz
Q: Que se passe-t-il si on appelle `res.send()` puis `next()` ?
- [ ] Rien
- [ ] Express ignore next()
- [x] Une erreur peut se produire
- [ ] La réponse est remplacée

> Après res.send(), la réponse est terminée. Appeler next() peut provoquer une tentative d’envoi multiple.

Q: Quel est le problème ici ?

```js
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
});
```

- [ ] Il manque next()
- [x] Il manque une réponse
- [ ] id n’existe pas
- [ ] Il manque express.json()

> La route ne renvoie jamais de réponse. La requête restera bloquée.

Q: L’ordre des middlewares est :
- [ ] Sans importance
- [x] Déterminé par l’ordre d’écriture
- [ ] Déterminé automatiquement
- [ ] Basé sur la méthode HTTP

> Express exécute les middlewares dans l’ordre où ils sont déclarés.

Q: Différence entre `res.send()` et `res.json()` ?
- [ ] Aucune
- [x] json force le Content-Type application/json
- [ ] send ne peut pas envoyer d’objet
- [ ] json est asynchrone

> res.json() définit automatiquement le header Content-Type en application/json.

Q: Que se passe-t-il si on envoie un GET sans body JSON alors que express.json() est activé ?
- [ ] Erreur
- [ ] Crash
- [x] Aucun problème
- [ ] Le middleware bloque

> express.json() ne pose pas problème si aucun body JSON n’est présent.

Q: Que se passe-t-il ici ?

```js
app.get("/a", (req, res, next) => {
  console.log("A1");
  next();
});

app.get("/a", (req, res) => {
  console.log("A2");
  res.send("done");
});
```

- [x] Les deux handlers s’exécutent
- [ ] Seul le premier s’exécute
- [ ] Seul le second s’exécute
- [ ] Erreur automatique

> Le premier appelle next(), donc le second handler est exécuté.

Q: Que se passe-t-il ici ?

```js
app.use((req, res, next) => {
  console.log("1");
  next();
});

app.use((req, res, next) => {
  console.log("2");
});
```

- [x] La requête reste bloquée
- [ ] La réponse est envoyée
- [ ] Express appelle automatiquement next()
- [ ] Erreur système

> Le deuxième middleware ne renvoie rien et n’appelle pas next(), donc la requête reste bloquée.

Q: Pourquoi ce code est dangereux ?

```js
app.get("/slow", (req, res) => {
  while (true) {}
});
```

- [ ] Il consomme peu de ressources
- [ ] Il s’arrête automatiquement
- [x] Il bloque l’event loop
- [ ] Il affecte seulement la route

> Une boucle infinie bloque le thread principal Node et empêche tout traitement ultérieur.

Q: Pourquoi est-il dangereux de faire `res.send(users)` si users contient des données sensibles ?
- [ ] Ce n’est pas dangereux
- [x] On expose potentiellement des données sensibles
- [ ] Express filtre automatiquement
- [ ] JSON masque les champs sensibles

> Toute donnée envoyée au client devient publique.

Q: Différence entre `app.use("/users", middleware)` et `app.get("/users", handler)` ?
- [x] use s’applique à toutes les méthodes HTTP, get uniquement aux requêtes GET
- [ ] Elles sont identiques
- [ ] use ne peut pas filtrer par chemin
- [ ] get fonctionne pour POST aussi

> app.use applique le middleware pour toutes les méthodes correspondant au chemin. app.get cible uniquement GET.
:::
