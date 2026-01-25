# Listes, Liens & Images

Maîtrisez les éléments essentiels pour organiser l'information (listes), créer la navigation (liens) et intégrer du contenu visuel (images).

---

## Ce que vous allez apprendre

- Créer des listes ordonnées et non ordonnées
- Utiliser les liens et attributs `href`, `target`
- Intégrer des images avec `alt` accessibles
- Créer des tableaux de données

## Prérequis

- [HTML - Structure essentielle](./structure-essentielles.md)

---

## Listes

### Listes non ordonnées (`<ul>`)

Les listes à puces pour des éléments sans ordre particulier :

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

**Rendu :**
- HTML
- CSS
- JavaScript

### Listes ordonnées (`<ol>`)

Les listes numérotées pour des étapes ou un classement :

```html
<ol>
    <li>Apprendre HTML</li>
    <li>Apprendre CSS</li>
    <li>Apprendre JavaScript</li>
</ol>
```

**Rendu :**
1. Apprendre HTML
2. Apprendre CSS
3. Apprendre JavaScript

### Attributs des listes ordonnées

```html
<!-- Commencer à un autre numéro -->
<ol start="5">
    <li>Cinquième élément</li>
    <li>Sixième élément</li>
</ol>

<!-- Type de numérotation -->
<ol type="A">
    <li>Première (A)</li>
    <li>Deuxième (B)</li>
</ol>

<ol type="I">
    <li>Premier (I)</li>
    <li>Deuxième (II)</li>
</ol>

<ol type="a">
    <li>Première (a)</li>
    <li>Deuxième (b)</li>
</ol>

<!-- Ordre inversé -->
<ol reversed>
    <li>Troisième</li>
    <li>Deuxième</li>
    <li>Premier</li>
</ol>
```

### Listes imbriquées

```html
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS
                <ul>
                    <li>Flexbox</li>
                    <li>Grid</li>
                </ul>
            </li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>Backend
        <ul>
            <li>Node.js</li>
            <li>PHP</li>
            <li>Python</li>
        </ul>
    </li>
</ul>
```

### Listes de définitions (`<dl>`)

Pour définir des termes :

```html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - Langage de balisage pour le web</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets - Langage pour styliser les pages web</dd>
    
    <dt>JavaScript</dt>
    <dd>Langage de programmation pour rendre les pages interactives</dd>
</dl>
```

### Exemple pratique : Menu de navigation

```html
<nav>
    <ul class="menu">
        <li><a href="/">Accueil</a></li>
        <li>
            <a href="/produits">Produits</a>
            <ul class="sous-menu">
                <li><a href="/produits/nouveautes">Nouveautés</a></li>
                <li><a href="/produits/best-sellers">Best-sellers</a></li>
                <li><a href="/produits/soldes">Soldes</a></li>
            </ul>
        </li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

---

## Liens et navigation

### Types de liens

```html
<!-- 1. Lien externe (absolu) -->
<a href="https://www.example.com">Visitez Example.com</a>

<!-- 2. Lien interne (relatif) -->
<a href="/about">À propos</a>
<a href="./contact.html">Contact (même dossier)</a>
<a href="../index.html">Retour (dossier parent)</a>

<!-- 3. Lien avec nouvelle fenêtre -->
<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
    Ouvrir dans un nouvel onglet
</a>

<!-- 4. Ancre vers une section (même page) -->
<a href="#section1">Aller à la section 1</a>
<!-- ... -->
<h2 id="section1">Section 1</h2>

<!-- 5. Lien email -->
<a href="mailto:contact@example.com">Nous contacter</a>
<a href="mailto:contact@example.com?subject=Demande d'info&body=Bonjour,">
    Email pré-rempli
</a>

<!-- 6. Lien téléphone -->
<a href="tel:+33123456789">Appelez-nous</a>

<!-- 7. Lien SMS -->
<a href="sms:+33123456789">Envoyez un SMS</a>

<!-- 8. Téléchargement de fichier -->
<a href="document.pdf" download>Télécharger le PDF</a>
<a href="photo.jpg" download="ma-photo.jpg">Télécharger l'image</a>
```

### Attributs des liens

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `href` | URL de destination | `href="https://example.com"` |
| `target` | Où ouvrir le lien | `target="_blank"` (nouvel onglet) |
| `rel` | Relation avec la page liée | `rel="noopener noreferrer"` |
| `download` | Télécharger au lieu d'ouvrir | `download="fichier.pdf"` |
| `title` | Info-bulle au survol | `title="En savoir plus"` |
| `hreflang` | Langue de la page liée | `hreflang="en"` |

### Bonnes pratiques des liens

```html
<!-- ✅ Bon : Texte descriptif -->
<a href="/contact">Contactez-nous</a>

<!-- ❌ Mauvais : "Cliquez ici" -->
<a href="/contact">Cliquez ici</a>

<!-- ✅ Bon : Lien externe avec sécurité -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    Site externe
</a>

<!-- ✅ Bon : Lien avec titre descriptif -->
<a href="/article" title="Lire l'article complet : Guide du HTML">
    En savoir plus
</a>
```

### Navigation complète

```html
<header>
    <nav aria-label="Navigation principale">
        <ul>
            <li><a href="/" aria-current="page">Accueil</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
</header>

<!-- Fil d'Ariane (Breadcrumb) -->
<nav aria-label="Fil d'Ariane">
    <ol>
        <li><a href="/">Accueil</a></li>
        <li><a href="/produits">Produits</a></li>
        <li><a href="/produits/electronique">Électronique</a></li>
        <li aria-current="page">Smartphones</li>
    </ol>
</nav>

<!-- Pagination -->
<nav aria-label="Pagination">
    <ul>
        <li><a href="/page/1" aria-label="Page précédente">‹ Précédent</a></li>
        <li><a href="/page/1">1</a></li>
        <li><a href="/page/2" aria-current="page">2</a></li>
        <li><a href="/page/3">3</a></li>
        <li><a href="/page/3" aria-label="Page suivante">Suivant ›</a></li>
    </ul>
</nav>
```

---

## Images

### Image simple

```html
<!-- Image basique -->
<img src="photo.jpg" alt="Description de la photo">

<!-- Image avec dimensions fixes -->
<img src="photo.jpg" alt="Description" width="500" height="300">

<!-- Image responsive (CSS recommandé) -->
<img src="photo.jpg" alt="Description" style="max-width: 100%; height: auto;">
```

### Attribut `alt` (obligatoire !)

L'attribut `alt` est **essentiel** pour :
- **Accessibilité** : Lecteurs d'écran pour personnes malvoyantes
- **SEO** : Moteurs de recherche comprennent l'image
- **Fallback** : Si l'image ne charge pas

```html
<!-- ✅ Bon : Alt descriptif -->
<img src="chat.jpg" alt="Chat roux assis sur un canapé">

<!-- ✅ Bon : Image décorative (alt vide) -->
<img src="decoration.jpg" alt="">

<!-- ❌ Mauvais : Pas d'alt -->
<img src="chat.jpg">

<!-- ❌ Mauvais : Alt inutile -->
<img src="photo123.jpg" alt="photo123">
```

### Formats d'images

```html
<!-- JPEG : Photos, dégradés -->
<img src="paysage.jpg" alt="Paysage de montagne">

<!-- PNG : Transparence, logos -->
<img src="logo.png" alt="Logo de l'entreprise">

<!-- SVG : Vectoriel, scalable -->
<img src="icone.svg" alt="Icône de recherche">

<!-- WebP : Moderne, performant -->
<img src="photo.webp" alt="Photo optimisée">

<!-- GIF : Animations -->
<img src="animation.gif" alt="Animation de chargement">
```

### Images responsive avec `srcset`

```html
<!-- Différentes tailles selon l'écran -->
<img 
    src="photo-medium.jpg" 
    srcset="photo-small.jpg 400w,
            photo-medium.jpg 800w,
            photo-large.jpg 1200w"
    sizes="(max-width: 400px) 400px,
           (max-width: 800px) 800px,
           1200px"
    alt="Photo responsive">

<!-- Différentes résolutions (Retina) -->
<img 
    src="photo.jpg"
    srcset="photo.jpg 1x,
            photo@2x.jpg 2x,
            photo@3x.jpg 3x"
    alt="Photo haute résolution">
```

### Balise `<picture>` pour formats multiples

```html
<!-- Servir différents formats selon support -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Image avec fallback">
</picture>

<!-- Différentes images selon breakpoint -->
<picture>
    <source media="(max-width: 600px)" srcset="mobile.jpg">
    <source media="(max-width: 1200px)" srcset="tablet.jpg">
    <img src="desktop.jpg" alt="Image adaptative">
</picture>
```

### Figure et légende

```html
<!-- Image avec légende -->
<figure>
    <img src="graphique.jpg" alt="Graphique des ventes 2024">
    <figcaption>Figure 1 : Évolution des ventes au T1 2024</figcaption>
</figure>

<!-- Plusieurs images dans une figure -->
<figure>
    <img src="photo1.jpg" alt="Vue 1">
    <img src="photo2.jpg" alt="Vue 2">
    <img src="photo3.jpg" alt="Vue 3">
    <figcaption>Galerie : Vues du produit</figcaption>
</figure>

<!-- Citation illustrée -->
<figure>
    <blockquote>
        <p>Le code est comme de l'humour. Quand tu dois l'expliquer, c'est mauvais.</p>
    </blockquote>
    <figcaption>— <cite>Cory House</cite></figcaption>
</figure>
```

### Image map (zones cliquables)

```html
<img src="planete.jpg" alt="Système solaire" usemap="#solarsystem">

<map name="solarsystem">
    <area shape="circle" coords="100,100,50" href="/soleil" alt="Soleil">
    <area shape="circle" coords="200,100,30" href="/terre" alt="Terre">
    <area shape="circle" coords="300,100,20" href="/mars" alt="Mars">
</map>
```

### Lazy loading natif

```html
<!-- Chargement différé (lazy load) -->
<img src="photo.jpg" alt="Photo" loading="lazy">

<!-- Chargement immédiat (par défaut) -->
<img src="hero.jpg" alt="Image principale" loading="eager">
```

---

## Exemples pratiques complets

### Galerie de photos

```html
<section class="galerie">
    <h2>Nos Réalisations</h2>
    
    <div class="photos">
        <figure>
            <img src="projet1.jpg" alt="Site e-commerce pour boutique mode" loading="lazy">
            <figcaption>E-commerce - Boutique Mode</figcaption>
        </figure>
        
        <figure>
            <img src="projet2.jpg" alt="Application mobile de réservation" loading="lazy">
            <figcaption>App Mobile - Réservations</figcaption>
        </figure>
        
        <figure>
            <img src="projet3.jpg" alt="Dashboard analytics" loading="lazy">
            <figcaption>Dashboard - Analytics</figcaption>
        </figure>
    </div>
</section>
```

### Card produit avec image

```html
<article class="product-card">
    <figure>
        <img src="tshirt.jpg" alt="T-shirt bleu en coton bio" width="300" height="400">
    </figure>
    
    <h3>T-shirt Bio</h3>
    <p class="price">29,99 €</p>
    
    <ul class="features">
        <li>100% coton biologique</li>
        <li>Fabriqué en France</li>
        <li>Disponible en 5 couleurs</li>
    </ul>
    
    <a href="/produit/tshirt-bio" class="btn">Voir le produit</a>
</article>
```

### Article de blog avec images

```html
<article class="blog-post">
    <header>
        <h1>Guide du Développement Web en 2024</h1>
        <p class="meta">
            <time datetime="2024-01-15">15 janvier 2024</time> 
            par <a href="/auteur/jean">Jean Dupont</a>
        </p>
    </header>
    
    <figure class="featured-image">
        <img src="hero-article.jpg" alt="Développeur travaillant sur ordinateur" width="1200" height="600">
        <figcaption>Photo par Unsplash</figcaption>
    </figure>
    
    <p>Le développement web évolue constamment...</p>
    
    <h2>Les technologies incontournables</h2>
    <ul>
        <li><a href="#html">HTML & CSS</a></li>
        <li><a href="#javascript">JavaScript</a></li>
        <li><a href="#frameworks">Frameworks modernes</a></li>
    </ul>
    
    <h2 id="html">HTML & CSS</h2>
    <p>HTML5 et CSS3 sont les fondations...</p>
    
    <figure>
        <img src="html-structure.png" alt="Schéma de structure HTML5" loading="lazy">
        <figcaption>Figure 1 : Structure sémantique HTML5</figcaption>
    </figure>
    
    <p><a href="/contact">Contactez-nous</a> pour en savoir plus.</p>
</article>
```

---

## Tableaux basiques

### Tableau simple

```html
<table>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Âge</th>
            <th>Ville</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Alice</td>
            <td>25</td>
            <td>Paris</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>30</td>
            <td>Lyon</td>
        </tr>
        <tr>
            <td>Charlie</td>
            <td>35</td>
            <td>Marseille</td>
        </tr>
    </tbody>
</table>
```

### Tableau avec pied de page

```html
<table>
    <caption>Résultats trimestriels</caption>
    <thead>
        <tr>
            <th>Mois</th>
            <th>Ventes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Janvier</td>
            <td>1000€</td>
        </tr>
        <tr>
            <td>Février</td>
            <td>1200€</td>
        </tr>
        <tr>
            <td>Mars</td>
            <td>1500€</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th>Total</th>
            <td><strong>3700€</strong></td>
        </tr>
    </tfoot>
</table>
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Image sans `alt` | Inaccessible | Toujours ajouter `alt` descriptif |
| Lien sans texte | "Cliquez ici" | Texte descriptif de la destination |
| `target="_blank"` sans `rel` | Faille de sécurité | Ajouter `rel="noopener noreferrer"` |
| Tableau pour layout | Non sémantique | Utiliser Flexbox/Grid |

---

## Quiz de vérification

1. Quelle balise crée une liste non ordonnée ?
   - A) `<ol>`
   - B) `<ul>` ✅
   - C) `<list>`

2. Quel attribut rend une image accessible ?
   - A) `title`
   - B) `alt` ✅
   - C) `src`

3. Comment ouvrir un lien dans un nouvel onglet ?
   - A) `href="_new"`
   - B) `target="_blank"` ✅
   - C) `open="new"`

4. Quelle balise contient les en-têtes d'un tableau ?
   - A) `<thead>` ✅
   - B) `<th>`
   - C) `<header>`

---

## Prochaine étape

Découvrez les [Balises sémantiques et formulaires](./semantique-formulaires.md) pour structurer vos pages.
