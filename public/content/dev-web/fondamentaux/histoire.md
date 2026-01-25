# Histoire du Web

L'histoire du World Wide Web est une aventure fascinante qui a transformé notre monde en quelques décennies.

## Les origines (1989-1991)

### Tim Berners-Lee et le CERN

En **1989**, Tim Berners-Lee, un chercheur britannique travaillant au CERN (Organisation européenne pour la recherche nucléaire), propose un système de gestion de l'information basé sur l'hypertexte.

**Mars 1989** : Soumission de la proposition "Information Management: A Proposal"

**1990** : Développement des premiers composants :
- Le premier navigateur web (WorldWideWeb)
- Le premier serveur web
- Le premier site web

> Le premier site web est toujours accessible à l'adresse : http://info.cern.ch/

## Les années 1990 : L'explosion du Web

### 1993 : NCSA Mosaic

Le navigateur Mosaic rend le Web accessible au grand public avec :
- Une interface graphique intuitive
- Support des images
- Facilité d'utilisation

### 1994-1995 : La guerre des navigateurs

```javascript
// Les navigateurs de l'époque
const browsers = {
  netscape: "Navigator",
  microsoft: "Internet Explorer",
  marketShare: {
    1995: { netscape: 80, ie: 5 },
    2000: { netscape: 20, ie: 75 }
  }
};

console.log("La guerre des navigateurs commence !");
```

## Web 2.0 (années 2000)

L'évolution vers un web plus interactif et social :

| Année | Innovation | Impact |
|-------|-----------|---------|
| 2004 | Facebook | Réseaux sociaux |
| 2005 | YouTube | Partage vidéo |
| 2006 | Twitter | Microblogging |
| 2007 | iPhone | Web mobile |

## Web moderne (2010+)

### Les technologies actuelles

1. **HTML5** : Nouveau standard avec audio, vidéo, canvas
2. **CSS3** : Animations, transitions, grid, flexbox
3. **JavaScript moderne** : ES6+, frameworks (React, Vue, Angular)
4. **APIs modernes** : WebRTC, WebGL, Service Workers

### L'ère des applications web

Les Progressive Web Apps (PWA) brouillent la frontière entre web et applications natives :

```javascript
// Service Worker pour le mode hors-ligne
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker enregistré !');
    })
    .catch(error => {
      console.error('Erreur d\'enregistrement:', error);
    });
}
```

## Le futur du Web

Les tendances émergentes :

- **Web3** : Décentralisation avec blockchain
- **WebAssembly** : Performance native dans le navigateur
- **IA et Machine Learning** : TensorFlow.js, Brain.js
- **Réalité augmentée/virtuelle** : WebXR

## Chronologie interactive

```
1989 ─── Proposition initiale
  │
1991 ─── Premier site web
  │
1993 ─── NCSA Mosaic
  │
1995 ─── JavaScript créé
  │
2000 ─── Web 2.0
  │
2008 ─── Chrome lancé
  │
2014 ─── HTML5 standardisé
  │
2024 ─── Aujourd'hui
```

## Ressources supplémentaires

- [Histoire du Web sur Mozilla](https://developer.mozilla.org)
- [Web Design Museum](https://www.webdesignmuseum.org)
- [Internet Archive](https://archive.org/web/)

---

**À retenir** : Le Web a évolué d'un simple système de partage de documents à une plateforme d'applications complexes et interactives. Cette évolution continue encore aujourd'hui !
