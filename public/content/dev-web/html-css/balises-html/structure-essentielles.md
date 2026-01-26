# Structure & Balises Essentielles

Les bases du HTML : comprendre la structure d'une balise et maîtriser les éléments essentiels pour créer votre première page web.

---

## Ce que vous allez apprendre

- Comprendre la structure d'une balise HTML
- Connaître les éléments essentiels d'un document HTML
- Maîtriser les balises de texte et de structure
- Appliquer les bonnes pratiques d'écriture HTML

## Prérequis

- [Introduction au développement web](../../fondamentaux/introduction.md)
- Un éditeur de code (VS Code recommandé) ou [CodePen](https://codepen.io/pen/)

---

## Structure de base d'une balise

Une balise HTML se compose généralement d'une **balise ouvrante** et d'une **balise fermante** :

```html
<balise>Contenu</balise>
```

### Balises auto-fermantes

Certaines balises n'ont pas besoin de balise fermante :

```html
<img src="image.jpg" alt="Description" />
<br />
<hr />
<input type="text" />
```

---

## Structure du document HTML

### Document HTML complet

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Description de votre page">
    <title>Titre de la page</title>
</head>
<body>
    <!-- Contenu de la page -->
</body>
</html>
```

### Explication des éléments

```html
<!-- Déclaration du type de document -->
<!DOCTYPE html>

<!-- Balise racine avec langue -->
<html lang="fr">

<!-- En-tête (métadonnées, non visible) -->
<head>
    <!-- Encodage des caractères -->
    <meta charset="UTF-8">
    
    <!-- Responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO : Description -->
    <meta name="description" content="Description pour moteurs de recherche">
    
    <!-- SEO : Mots-clés -->
    <meta name="keywords" content="html, css, web">
    
    <!-- Titre (onglet navigateur) -->
    <title>Mon Site Web</title>
    
    <!-- Favicon -->
    <link rel="icon" href="favicon.ico">
    
    <!-- CSS externe -->
    <link rel="stylesheet" href="styles.css">
</head>

<!-- Corps (contenu visible) -->
<body>
    <h1>Bienvenue</h1>
    <p>Contenu de la page...</p>
    
    <!-- JavaScript externe -->
    <script src="script.js"></script>
</body>
</html>
```

---

## Titres et paragraphes

### Hiérarchie des titres

HTML propose 6 niveaux de titres (`<h1>` à `<h6>`) :

```html
<h1>Titre principal (le plus important)</h1>
<h2>Titre secondaire</h2>
<h3>Titre de niveau 3</h3>
<h4>Titre de niveau 4</h4>
<h5>Titre de niveau 5</h5>
<h6>Titre de niveau 6 (le moins important)</h6>
```

### Exemple de hiérarchie correcte

```html
<h1>Guide du Développement Web</h1>

<h2>1. Introduction au HTML</h2>
<p>Le HTML est le langage de balisage...</p>

<h3>1.1 Histoire du HTML</h3>
<p>Le HTML a été créé en 1991...</p>

<h3>1.2 Versions du HTML</h3>
<p>HTML5 est la dernière version...</p>

<h2>2. Introduction au CSS</h2>
<p>Le CSS permet de styliser...</p>

<h3>2.1 Sélecteurs CSS</h3>
<p>Les sélecteurs permettent...</p>
```

### Bonnes pratiques des titres

✅ **À faire** :
- Utilisez **un seul** `<h1>` par page (titre principal)
- Respectez la hiérarchie (ne sautez pas de niveaux)
- Les titres améliorent le SEO et l'accessibilité
- Utilisez les titres pour structurer logiquement le contenu

❌ **À éviter** :
```html
<!-- ❌ Mauvais : Plusieurs h1 -->
<h1>Titre 1</h1>
<h1>Titre 2</h1>

<!-- ❌ Mauvais : Sauter des niveaux -->
<h1>Titre principal</h1>
<h4>Sous-titre</h4>

<!-- ❌ Mauvais : Titres pour la taille visuelle -->
<h1 style="font-size: 12px;">Petit texte</h1>
```

### Paragraphes

```html
<p>Ceci est un paragraphe de texte normal.</p>

<p>
    Vous pouvez avoir plusieurs lignes dans un paragraphe.
    Les retours à la ligne sont automatiquement gérés.
</p>

<!-- Saut de ligne dans un paragraphe -->
<p>
    Première ligne<br>
    Deuxième ligne<br>
    Troisième ligne
</p>

<!-- Ligne horizontale de séparation -->
<hr>

<!-- Div générique (conteneur) -->
<div>
    <p>Paragraphe dans un conteneur div.</p>
</div>

<!-- Span inline (portée de texte) -->
<p>Ceci est un <span style="color: red;">mot en rouge</span> dans une phrase.</p>
```

---

## Formatage du texte

### Importance sémantique vs visuelle

```html
<!-- Importance SÉMANTIQUE (recommandé) -->
<strong>Texte important (gras)</strong>
<em>Texte accentué (italique)</em>

<!-- Importance VISUELLE seulement -->
<b>Gras (sans importance sémantique)</b>
<i>Italique (sans importance sémantique)</i>
```

### Autres formats de texte

```html
<!-- Texte surligné -->
<mark>Texte surligné en jaune</mark>

<!-- Petit texte (mentions légales, etc.) -->
<small>Texte en petits caractères</small>

<!-- Texte supprimé -->
<del>Ancien prix : 50€</del>

<!-- Texte inséré -->
<ins>Nouveau prix : 35€</ins>

<!-- Citation courte inline -->
<p>Comme dit le proverbe : <q>Mieux vaut tard que jamais</q></p>

<!-- Citation longue (bloc) -->
<blockquote cite="https://source.com">
    Ceci est une citation longue qui s'affiche en bloc.
    Elle peut contenir plusieurs lignes.
</blockquote>

<!-- Code informatique -->
<code>console.log('Hello World');</code>

<!-- Bloc de code pré-formaté -->
<pre>
function hello() {
    console.log('Hello');
}
</pre>

<!-- Abbréviations -->
<abbr title="HyperText Markup Language">HTML</abbr>

<!-- Indice et exposant -->
H<sub>2</sub>O (eau)
E = mc<sup>2</sup> (Einstein)

<!-- Adresse -->
<address>
    123 Rue Example<br>
    75001 Paris, France
</address>
```

### Exemple complet de formatage

```html
<article>
    <h1>Recette de Cookies 🍪</h1>
    
    <p>
        <strong>Temps de préparation :</strong> <time datetime="PT30M">30 minutes</time><br>
        <strong>Portions :</strong> <data value="12">12 cookies</data>
    </p>
    
    <p>
        Cette recette <em>facile</em> et <em>rapide</em> vous permettra de faire
        des cookies <mark>délicieux</mark> en un rien de temps !
    </p>
    
    <blockquote>
        <p>« Les meilleurs cookies que j'ai jamais goûtés ! »</p>
        <footer>— <cite>Marie, cuisinière amateur</cite></footer>
    </blockquote>
    
    <p>
        <small>Note : Recette mise à jour le <time datetime="2024-01-15">15 janvier 2024</time></small>
    </p>
</article>
```

---

## Attributs HTML courants

### Attributs globaux

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `id` | Identifiant unique (un seul par page) | `<div id="header">` |
| `class` | Classe(s) CSS (réutilisable) | `<p class="intro highlight">` |
| `style` | Style CSS inline | `<p style="color: red; font-size: 16px;">` |
| `title` | Info-bulle au survol | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `lang` | Langue du contenu | `<span lang="en">Hello</span>` |
| `data-*` | Attributs personnalisés | `<div data-user-id="123" data-role="admin">` |
| `hidden` | Cache l'élément | `<div hidden>Contenu caché</div>` |
| `contenteditable` | Éditable par l'utilisateur | `<p contenteditable="true">Modifiez-moi</p>` |

### Exemples pratiques

```html
<!-- ID (unique) pour cibler avec CSS/JS -->
<div id="main-container">
    <!-- Classes (réutilisables) pour styling -->
    <article class="blog-post featured">
        <h2 class="post-title">Mon Article</h2>
        <p class="post-excerpt">Résumé de l'article...</p>
    </article>
</div>

<!-- Attributs data pour stocker des infos -->
<button 
    data-product-id="12345" 
    data-product-name="T-Shirt"
    data-price="29.99"
    onclick="addToCart(this)">
    Ajouter au panier
</button>

<!-- Title pour info-bulle -->
<button title="Cliquez pour sauvegarder">💾</button>

<!-- Lang pour changement de langue -->
<p>Je parle <span lang="fr">français</span> et <span lang="en">English</span>.</p>
```

---

## Bonnes pratiques

### ✅ À faire

1. **Utiliser des balises sémantiques appropriées**
```html
<!-- ✅ Bon : Balise sémantique -->
<article>
    <h2>Titre de l'article</h2>
    <p>Contenu...</p>
</article>

<!-- ❌ Mauvais : Div générique -->
<div class="article">
    <div class="title">Titre de l'article</div>
    <div class="content">Contenu...</div>
</div>
```

2. **Toujours inclure l'attribut `alt` pour les images**
```html
<!-- ✅ Bon -->
<img src="chat.jpg" alt="Chat roux assis sur un canapé">

<!-- ❌ Mauvais -->
<img src="chat.jpg">
```

3. **Fermer toutes les balises correctement**
```html
<!-- ✅ Bon -->
<p>Paragraphe 1</p>
<p>Paragraphe 2</p>

<!-- ❌ Mauvais -->
<p>Paragraphe 1
<p>Paragraphe 2
```

4. **Indenter le code pour la lisibilité**
```html
<!-- ✅ Bon : Bien indenté -->
<ul>
    <li>Élément 1</li>
    <li>Élément 2</li>
</ul>

<!-- ❌ Mauvais : Pas d'indentation -->
<ul>
<li>Élément 1</li>
<li>Élément 2</li>
</ul>
```

5. **Valider votre HTML**
- Utilisez le [W3C Validator](https://validator.w3.org/)
- Vérifiez les erreurs dans DevTools du navigateur

### ❌ À éviter

1. **Balises obsolètes**
```html
<!-- ❌ Obsolète -->
<font color="red">Texte rouge</font>
<center>Texte centré</center>
<marquee>Texte défilant</marquee>

<!-- ✅ Utilisez CSS à la place -->
<p style="color: red;">Texte rouge</p>
<p style="text-align: center;">Texte centré</p>
```

2. **Imbrication incorrecte**
```html
<!-- ❌ Mauvais : Imbrication incorrecte -->
<p><div>Texte</div></p>
<strong><p>Texte</p></strong>

<!-- ✅ Bon : Imbrication correcte -->
<div><p>Texte</p></div>
<p><strong>Texte</strong></p>
```

3. **Trop de divs**
```html
<!-- ❌ Mauvais : "Div soup" -->
<div class="header">
    <div class="nav">
        <div class="menu">...</div>
    </div>
</div>

<!-- ✅ Bon : Balises sémantiques -->
<header>
    <nav>
        <ul class="menu">...</ul>
    </nav>
</header>
```

---

## Erreurs courantes

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier `<!DOCTYPE html>` | Mode quirks, rendu incohérent | Toujours commencer par `<!DOCTYPE html>` |
| Pas de `lang` sur `<html>` | Accessibilité et SEO réduits | `<html lang="fr">` |
| `<div>` partout | HTML non sémantique | Utiliser `<header>`, `<nav>`, `<main>`, `<section>` |
| Balises non fermées | Rendu cassé | Vérifier chaque balise ouvrante/fermante |
| `<p>` contenant `<div>` | Imbrication invalide | `<p>` ne peut contenir que du texte/inline |

---

## Exercice pratique

Créez une page HTML complète avec :
1. Un titre principal `<h1>`
2. Deux sections avec `<h2>`
3. Des paragraphes avec du texte formaté (gras, italique)
4. Une liste non ordonnée

<details>
<summary>Voir la solution</summary>

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma page</title>
</head>
<body>
    <h1>Mon premier site</h1>
    
    <section>
        <h2>Introduction</h2>
        <p>Bienvenue sur <strong>mon site</strong>. C'est <em>génial</em> !</p>
    </section>
    
    <section>
        <h2>Mes hobbies</h2>
        <ul>
            <li>Programmation</li>
            <li>Lecture</li>
            <li>Musique</li>
        </ul>
    </section>
</body>
</html>
```
</details>

---

## Quiz de vérification

:::quiz
Q: Quelle balise définit le titre affiché dans l'onglet du navigateur ?
- [ ] `<h1>`
- [x] `<title>`
- [ ] `<header>`
> La balise `<title>` définit le titre qui apparaît dans l'onglet du navigateur et dans les résultats de recherche.

Q: Quelle est la bonne façon d'écrire une balise auto-fermante ?
- [ ] `<img src="photo.jpg">`
- [x] `<img src="photo.jpg" />`
- [ ] `</img src="photo.jpg">`
> Les balises auto-fermantes se terminent par ` />` pour indiquer qu'elles n'ont pas de contenu.

Q: Où place-t-on les métadonnées d'une page ?
- [ ] Dans `<body>`
- [x] Dans `<head>`
- [ ] Dans `<footer>`
> Le `<head>` contient les métadonnées (charset, viewport, title, links CSS...) qui ne sont pas affichées directement.

Q: Quelle balise est obsolète et ne doit plus être utilisée ?
- [ ] `<strong>`
- [x] `<font>`
- [ ] `<em>`
> La balise `<font>` est obsolète depuis HTML5. Utilisez CSS pour styliser le texte.
:::

---

## Prochaine étape

Découvrez les [listes, liens et images](./listes-liens-images.md) en détail.
