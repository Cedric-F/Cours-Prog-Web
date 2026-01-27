# Network Tab : Analyser les requêtes

L'onglet Network est essentiel pour débugger les appels API, analyser les performances de chargement et comprendre ce qui transite entre votre application et le serveur.

## Ouvrir le Network Tab

1. `F12` pour ouvrir DevTools
2. Cliquez sur l'onglet **Network**
3. Rafraîchissez la page pour voir les requêtes

> 💡 Cochez **"Preserve log"** pour garder les requêtes lors de la navigation.

---

## Anatomie d'une requête

Chaque ligne représente une requête avec ces colonnes :

| Colonne | Description |
|---------|-------------|
| **Name** | URL de la ressource |
| **Status** | Code HTTP (200, 404, 500...) |
| **Type** | document, script, xhr, fetch, img... |
| **Initiator** | Ce qui a déclenché la requête |
| **Size** | Taille transférée (compressée) |
| **Time** | Temps de chargement |
| **Waterfall** | Timeline visuelle |

---

## Filtrer les requêtes

### Par type
Utilisez les boutons de filtre :
- **All** : Toutes les requêtes
- **Fetch/XHR** : Appels API (le plus utile !)
- **JS** : Fichiers JavaScript
- **CSS** : Feuilles de style
- **Img** : Images
- **Doc** : Documents HTML

### Par texte
La barre de recherche filtre par URL :
```
/api/users
.json
```

### Filtres avancés
```
status-code:404          # Erreurs 404
larger-than:100k         # Fichiers > 100Ko
method:POST              # Requêtes POST uniquement
domain:api.example.com   # Domaine spécifique
-domain:googleapis.com   # Exclure un domaine
```

---

## Inspecter une requête

Cliquez sur une requête pour voir les détails :

### Headers
```
Request URL: https://api.example.com/users
Request Method: GET
Status Code: 200 OK

Request Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

Response Headers:
  Content-Type: application/json
  Cache-Control: max-age=3600
```

### Preview
Affichage formaté de la réponse (JSON, HTML, images...).

### Response
Réponse brute du serveur.

### Timing
Détail du temps passé à chaque étape :
- **Queueing** : Attente dans la file
- **Stalled** : Bloqué (limite de connexions)
- **DNS Lookup** : Résolution DNS
- **Initial connection** : Établissement TCP
- **SSL** : Négociation HTTPS
- **TTFB** : Time To First Byte (temps serveur)
- **Content Download** : Téléchargement

---

## Débugger les erreurs API

### Erreurs courantes

#### 400 Bad Request
Problème avec les données envoyées :
```javascript
// Vérifiez le body dans l'onglet Payload
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }) // Manque-t-il des champs?
});
```

#### 401 Unauthorized / 403 Forbidden
Problème d'authentification :
- Vérifiez le header `Authorization`
- Le token a-t-il expiré ?
- L'utilisateur a-t-il les droits ?

#### 404 Not Found
Mauvaise URL :
- Vérifiez l'URL dans la requête
- Erreur de typo ? (`/user` vs `/users`)
- Paramètre manquant ? (`/users/undefined`)

#### 500 Internal Server Error
Erreur côté serveur :
- Vérifiez les logs du backend
- La réponse contient parfois un message d'erreur

#### CORS Error
Pas de colonne Status (requête bloquée) :
```
Access-Control-Allow-Origin header is missing
```
→ Le serveur doit autoriser votre origine.

---

## Copier les requêtes

Clic droit sur une requête :

### Copy as cURL
```bash
curl 'https://api.example.com/users' \
  -H 'Authorization: Bearer xxx' \
  -H 'Content-Type: application/json'
```

Pratique pour tester dans le terminal !

### Copy as fetch
```javascript
fetch("https://api.example.com/users", {
  "headers": {
    "authorization": "Bearer xxx",
    "content-type": "application/json"
  },
  "method": "GET"
});
```

Copiez directement dans votre code !

---

## Simuler des conditions réseau

### Throttling
Menu déroulant pour simuler des connexions lentes :
- **Fast 3G** : ~1.5 Mbps
- **Slow 3G** : ~400 Kbps
- **Offline** : Aucune connexion

Testez le comportement de votre app en condition dégradée !

### Bloquer des requêtes
Clic droit > **Block request URL** ou **Block request domain**

Utile pour tester le comportement quand une API est indisponible.

---

## Analyser les performances

### Waterfall
Le graphique montre l'ordre de chargement :
- Les barres longues = goulots d'étranglement
- Les requêtes qui bloquent les autres

### Résumé en bas
```
42 requests | 1.2 MB transferred | 3.5 MB resources
Finish: 2.35 s | DOMContentLoaded: 1.20 s | Load: 2.35 s
```

### Identifiez les problèmes
- **Trop de requêtes** : Regroupez les fichiers
- **Fichiers trop gros** : Compressez, lazy loading
- **Requêtes séquentielles** : Parallélisez si possible
- **Pas de cache** : Ajoutez des headers Cache-Control

---

## Replay et Edit

### Replay
Clic droit > **Replay XHR** pour rejouer une requête.

### Edit and Resend
1. Clic droit > **Edit and Resend** (Firefox)
2. Modifiez les headers, le body, la méthode
3. Envoyez pour tester une variation

---

## HAR (HTTP Archive)

### Exporter
Clic droit > **Save all as HAR with content**

Fichier JSON contenant toutes les requêtes. Utile pour :
- Partager avec un collègue
- Analyser hors ligne
- Reporter un bug avec contexte

### Importer
Glissez-déposez un fichier .har dans le Network tab.

---

## Exercice pratique

1. Ouvrez le Network tab sur un site que vous développez
2. Filtrez sur **Fetch/XHR**
3. Trouvez :
   - La requête la plus lente
   - Une requête qui n'utilise pas le cache
   - Le total des données transférées
4. Copiez une requête en cURL et testez-la dans le terminal

---

## Raccourcis utiles

| Action | Raccourci |
|--------|-----------|
| Vider le log | `Ctrl + L` |
| Rechercher | `Ctrl + F` |
| Ouvrir le fichier source | `Ctrl + clic` sur Initiator |
| Désactiver le cache | Checkbox "Disable cache" |

---

## Checklist debugging réseau

- [ ] Status code correct (2xx) ?
- [ ] Headers envoyés correctement ?
- [ ] Body de la requête valide ?
- [ ] Réponse au format attendu ?
- [ ] Temps de réponse acceptable ?
- [ ] Cache fonctionnel ?
- [ ] Pas d'erreur CORS ?
