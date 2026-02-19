# Quiz – HTTP / Node / Express / Middleware / CRUD (Notions)

:::quiz
Q: Que contient obligatoirement une requête HTTP ?
- [ ] Un status code
- [x] Une méthode
- [ ] Un body
- [ ] Une réponse

> Une requête HTTP contient obligatoirement une méthode (GET, POST, etc.). Le status code appartient à la réponse.

Q: Quelle méthode HTTP correspond à une suppression ?
- [ ] PUT
- [ ] PATCH
- [x] DELETE
- [ ] REMOVE

> DELETE est la méthode standard pour supprimer une ressource.

Q: Node.js est :
- [ ] Un serveur web
- [x] Un runtime JavaScript
- [ ] Une base de données
- [ ] Un protocole

> Node.js est un environnement d’exécution JavaScript côté serveur.

Q: Express sert principalement à :
- [ ] Gérer la mémoire
- [x] Simplifier la gestion des routes HTTP
- [ ] Compiler du JavaScript
- [ ] Remplacer Node

> Express est un framework qui facilite la gestion des routes et du pipeline HTTP.

Q: Dans un middleware Express, `next()` permet :
- [ ] D’arrêter le serveur
- [ ] D’envoyer la réponse
- [x] De passer au middleware suivant
- [ ] De relancer la requête

> next() transfère le contrôle au middleware suivant dans la stack.

Q: Quelle est la différence principale entre GET et POST ?
- [x] GET lit une ressource, POST en crée une
- [ ] GET modifie une ressource
- [ ] POST ne peut pas envoyer de body
- [ ] Il n’y a aucune différence

> GET récupère des données. POST envoie des données pour créer une ressource.

Q: Que se passe-t-il si un middleware n’appelle pas `next()` et n’envoie pas de réponse ?
- [ ] Express appelle automatiquement le middleware suivant
- [ ] La requête est supprimée
- [x] La requête reste bloquée
- [ ] Le serveur redémarre

> La requête reste en attente car la chaîne de middlewares ne continue pas et aucune réponse n’est envoyée.

Q: À quoi sert `express.json()` ?
- [ ] À sécuriser l’API
- [x] À parser le body JSON des requêtes
- [ ] À convertir les réponses en JSON
- [ ] À gérer les cookies

> express.json() permet de lire le body des requêtes dont le Content-Type est application/json.

Q: Quel code HTTP faut-il retourner lorsqu’une ressource n’est pas trouvée ?
- [ ] 200
- [ ] 500
- [x] 404
- [ ] 302

> 404 Not Found indique qu’une ressource demandée n’existe pas.

Q: Quelle association CRUD est correcte ?
- [x] Create → POST, Read → GET, Update → PUT/PATCH, Delete → DELETE
- [ ] Create → GET
- [ ] Update → POST
- [ ] Delete → PUT

> Les méthodes HTTP standards correspondent directement aux opérations CRUD.
:::