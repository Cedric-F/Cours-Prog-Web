# HTTPS et Certificats SSL/TLS

HTTPS est devenu indispensable. Comprenons comment fonctionne le chiffrement des communications web.

## Pourquoi HTTPS ?

### HTTP vs HTTPS

| HTTP | HTTPS |
|------|-------|
| Données en clair | Données chiffrées |
| Pas d'authentification du serveur | Serveur vérifié par certificat |
| Vulnérable aux attaques man-in-the-middle | Protégé |
| Port 80 | Port 443 |

### Ce que HTTPS protège

✅ **Confidentialité** : Les données ne peuvent pas être lues en transit
✅ **Intégrité** : Les données ne peuvent pas être modifiées
✅ **Authentification** : Vous communiquez avec le bon serveur

### Ce que HTTPS NE protège PAS

❌ Le contenu une fois arrivé (XSS, etc.)
❌ Les métadonnées (quelle URL vous visitez)
❌ Les données stockées côté serveur

---

## Comment fonctionne TLS

### La poignée de main (Handshake)

```
Client                                    Serveur
   |                                          |
   |-------- Client Hello ------------------>|
   |         (versions TLS, cipher suites)   |
   |                                          |
   |<------- Server Hello -------------------|
   |         (version choisie, certificat)   |
   |                                          |
   |         Vérification du certificat       |
   |                                          |
   |-------- Key Exchange ------------------>|
   |         (clé de session chiffrée)       |
   |                                          |
   |<------- Finished ----------------------|
   |                                          |
   |========= Communication chiffrée ========|
```

### Chiffrement asymétrique vs symétrique

1. **Asymétrique** (RSA, ECDSA) : Clé publique + clé privée
   - Utilisé pour l'échange initial (authentification)
   - Lent mais sécurisé pour l'échange de clés

2. **Symétrique** (AES) : Même clé des deux côtés
   - Utilisé pour les données (rapide)
   - La clé est échangée via l'asymétrique

---

## Les Certificats

### Qu'est-ce qu'un certificat ?

Un fichier signé par une autorité de certification (CA) qui prouve :
- L'identité du propriétaire du domaine
- La clé publique du serveur
- La période de validité

### Types de certificats

| Type | Validation | Usage |
|------|------------|-------|
| **DV** (Domain Validation) | Domaine seulement | Sites personnels, blogs |
| **OV** (Organization Validation) | Domaine + entreprise | Sites d'entreprise |
| **EV** (Extended Validation) | Vérification complète | Banques, e-commerce |

### Chaîne de confiance

```
Certificat Racine (CA)
    │
    └── Certificat Intermédiaire
            │
            └── Votre Certificat
```

Les navigateurs font confiance aux CA racines. Votre certificat est validé par la chaîne.

---

## Obtenir un certificat

### Let's Encrypt (gratuit, recommandé)

```bash
# Installer Certbot
sudo apt install certbot

# Pour Nginx
sudo certbot --nginx -d example.com -d www.example.com

# Pour Apache
sudo certbot --apache -d example.com

# Standalone (port 80 doit être libre)
sudo certbot certonly --standalone -d example.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

### Fichiers générés

```
/etc/letsencrypt/live/example.com/
├── cert.pem        # Votre certificat
├── chain.pem       # Certificats intermédiaires
├── fullchain.pem   # cert.pem + chain.pem
└── privkey.pem     # Votre clé privée (SECRET !)
```

---

## Configuration serveur

### Nginx

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    
    # Redirection HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # Certificats
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # Configuration TLS moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS (force HTTPS pendant 1 an)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP Stapling (vérification de révocation)
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Reste de la configuration...
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName example.com
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/example.com/chain.pem
    
    # Configuration moderne
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    
    Header always set Strict-Transport-Security "max-age=31536000"
</VirtualHost>
```

### Node.js / Express

```javascript
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// En production, utilisez un reverse proxy (Nginx) plutôt que ça
const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

https.createServer(options, app).listen(443);

// Redirection HTTP → HTTPS
import http from 'http';
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
```

---

## HTTPS en développement

### mkcert (certificats locaux)

```bash
# Installation
brew install mkcert  # macOS
choco install mkcert # Windows

# Créer une CA locale
mkcert -install

# Générer un certificat pour localhost
mkcert localhost 127.0.0.1 ::1

# Résultat : localhost.pem et localhost-key.pem
```

### Utilisation avec Vite

```javascript
// vite.config.js
import fs from 'fs';

export default {
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    }
  }
}
```

### Utilisation avec Next.js

```javascript
// next.config.js
const https = require('https');
const fs = require('fs');

// Créer un server.js personnalisé
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};
```

---

## Headers de sécurité HTTPS

### HSTS (HTTP Strict Transport Security)

Force le navigateur à utiliser HTTPS :

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- `max-age` : Durée en secondes
- `includeSubDomains` : Applique aux sous-domaines
- `preload` : Inscription dans la liste préchargée des navigateurs

### Autres headers importants

```javascript
// Avec Helmet.js
import helmet from 'helmet';

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    }
  }
}));
```

---

## Vérifier la configuration

### SSL Labs

Testez votre configuration : [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

Note visée : **A** ou **A+**

### Mozilla Observatory

[observatory.mozilla.org](https://observatory.mozilla.org/)

### En ligne de commande

```bash
# Vérifier le certificat
openssl s_client -connect example.com:443 -servername example.com

# Voir les détails du certificat
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -text

# Vérifier l'expiration
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Problèmes courants

### ERR_CERT_AUTHORITY_INVALID

Le certificat n'est pas signé par une CA reconnue.
- Utilisez Let's Encrypt
- Vérifiez la chaîne de certificats

### ERR_CERT_DATE_INVALID

Le certificat a expiré.
- Renouvelez avec `certbot renew`
- Configurez le renouvellement automatique

### ERR_SSL_VERSION_OR_CIPHER_MISMATCH

Configuration TLS incompatible.
- Mettez à jour vers TLS 1.2/1.3
- Utilisez des cipher suites modernes

### Mixed Content

La page HTTPS charge des ressources HTTP.
```html
<!-- ❌ Mauvais -->
<img src="http://example.com/image.jpg">

<!-- ✅ Bon -->
<img src="https://example.com/image.jpg">
<!-- ou -->
<img src="//example.com/image.jpg">
```

---

## Checklist HTTPS

- [ ] Certificat valide (Let's Encrypt)
- [ ] Redirection HTTP → HTTPS
- [ ] HSTS activé
- [ ] TLS 1.2+ uniquement
- [ ] Pas de mixed content
- [ ] Renouvellement automatique configuré
- [ ] Note A sur SSL Labs

---

## Ressources

- [Let's Encrypt](https://letsencrypt.org/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [mkcert](https://github.com/FiloSottile/mkcert)
