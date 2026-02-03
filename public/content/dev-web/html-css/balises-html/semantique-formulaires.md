# Sémantique & Formulaires

Maîtrisez les balises sémantiques HTML5 pour structurer intelligemment vos pages et créez des formulaires interactifs professionnels.

---

## Balises sémantiques HTML5

Les balises sémantiques donnent du **sens** à votre structure HTML, améliorant :
- ✅ **SEO** : Meilleur référencement Google
- ✅ **Accessibilité** : Lecteurs d'écran comprennent la structure
- ✅ **Maintenabilité** : Code plus clair et organisé

### Structure sémantique complète

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Site Sémantique</title>
</head>
<body>
    <!-- En-tête principal du site -->
    <header>
        <h1>Mon Site Web</h1>
        <nav>
            <ul>
                <li><a href="/">Accueil</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Contenu principal (unique par page) -->
    <main>
        <!-- Article autonome (blog post, news) -->
        <article>
            <header>
                <h2>Titre de l'article</h2>
                <p class="meta">
                    <time datetime="2024-01-15">15 janvier 2024</time>
                    par <a href="/auteur/jean">Jean Dupont</a>
                </p>
            </header>
            
            <!-- Section thématique dans l'article -->
            <section>
                <h3>Introduction</h3>
                <p>Contenu de l'introduction...</p>
            </section>
            
            <section>
                <h3>Développement</h3>
                <p>Contenu principal...</p>
                
                <!-- Contenu annexe ou sidebar -->
                <aside>
                    <h4>Le saviez-vous ?</h4>
                    <p>Information complémentaire...</p>
                </aside>
            </section>
            
            <footer>
                <p>Tags : <a href="/tag/html">HTML</a>, <a href="/tag/css">CSS</a></p>
            </footer>
        </article>
        
        <!-- Autre article -->
        <article>
            <h2>Deuxième article</h2>
            <p>Contenu...</p>
        </article>
    </main>

    <!-- Sidebar globale du site -->
    <aside>
        <section>
            <h3>Articles récents</h3>
            <ul>
                <li><a href="/article1">Article 1</a></li>
                <li><a href="/article2">Article 2</a></li>
            </ul>
        </section>
        
        <section>
            <h3>Newsletter</h3>
            <form>
                <input type="email" placeholder="Votre email">
                <button type="submit">S'inscrire</button>
            </form>
        </section>
    </aside>

    <!-- Pied de page global -->
    <footer>
        <nav>
            <ul>
                <li><a href="/mentions-legales">Mentions légales</a></li>
                <li><a href="/cgv">CGV</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
        <p>&copy; 2024 Mon Site Web. Tous droits réservés.</p>
    </footer>
</body>
</html>
```

### Explication des balises sémantiques

| Balise | Usage | Exemple |
|--------|-------|---------|
| `<header>` | En-tête (page ou section) | Logo, menu, titre |
| `<nav>` | Navigation | Menu principal, liens |
| `<main>` | Contenu principal (1 seul) | Contenu unique de la page |
| `<article>` | Contenu autonome | Article de blog, news |
| `<section>` | Section thématique | Chapitre, groupe de contenu |
| `<aside>` | Contenu annexe | Sidebar, note, publicité |
| `<footer>` | Pied de page | Copyright, liens, contact |

### `<div>` vs Balises sémantiques

```html
<!-- ❌ Mauvais : Divs non sémantiques -->
<div class="header">
    <div class="nav">
        <div class="menu">...</div>
    </div>
</div>
<div class="main">
    <div class="article">
        <div class="title">Titre</div>
        <div class="content">Contenu</div>
    </div>
</div>
<div class="footer">...</div>

<!-- ✅ Bon : Balises sémantiques -->
<header>
    <nav>
        <ul class="menu">...</ul>
    </nav>
</header>
<main>
    <article>
        <h2>Titre</h2>
        <p>Contenu</p>
    </article>
</main>
<footer>...</footer>
```

### Autres balises sémantiques

```html
<!-- Date et heure -->
<time datetime="2024-01-15T14:30:00">15 janvier 2024 à 14h30</time>
<time datetime="2024-01-15">15/01/2024</time>

<!-- Figure avec légende (déjà vu) -->
<figure>
    <img src="graph.jpg" alt="Graphique">
    <figcaption>Figure 1 : Résultats 2024</figcaption>
</figure>

<!-- Détails extensibles (accordion) -->
<details>
    <summary>Cliquez pour plus d'infos</summary>
    <p>Contenu caché par défaut</p>
</details>

<!-- Dialog / Modale -->
<dialog open>
    <h2>Titre de la modale</h2>
    <p>Contenu...</p>
    <button>Fermer</button>
</dialog>

<!-- Adresse de contact -->
<address>
    <a href="mailto:contact@example.com">contact@example.com</a><br>
    123 Rue Example<br>
    75001 Paris, France
</address>

<!-- Marquage de contenu -->
<mark>Texte surligné</mark>

<!-- Progression (barre de progression) -->
<progress value="70" max="100">70%</progress>

<!-- Mesure dans une échelle -->
<meter value="0.7" min="0" max="1">70%</meter>
```

---

## Formulaires HTML

### Formulaire basique

```html
<form action="/submit" method="POST">
    <!-- Champ texte -->
    <label for="name">Nom :</label>
    <input type="text" id="name" name="name" required>
    
    <!-- Email -->
    <label for="email">Email :</label>
    <input type="email" id="email" name="email" required>
    
    <!-- Zone de texte -->
    <label for="message">Message :</label>
    <textarea id="message" name="message" rows="5" required></textarea>
    
    <!-- Bouton d'envoi -->
    <button type="submit">Envoyer</button>
</form>
```

### Types d'inputs

```html
<!-- Texte simple -->
<input type="text" name="username" placeholder="Nom d'utilisateur">

<!-- Email (validation auto) -->
<input type="email" name="email" placeholder="email@example.com">

<!-- Mot de passe (masqué) -->
<input type="password" name="password" placeholder="Mot de passe">

<!-- Nombre -->
<input type="number" name="age" min="18" max="120" step="1">

<!-- Téléphone -->
<input type="tel" name="phone" placeholder="01 23 45 67 89">

<!-- URL -->
<input type="url" name="website" placeholder="https://example.com">

<!-- Date -->
<input type="date" name="birthday" min="1900-01-01" max="2024-12-31">

<!-- Heure -->
<input type="time" name="appointment">

<!-- Couleur -->
<input type="color" name="color" value="#ff0000">

<!-- Fichier -->
<input type="file" name="avatar" accept="image/*">

<!-- Plage (slider) -->
<input type="range" name="volume" min="0" max="100" value="50">

<!-- Recherche -->
<input type="search" name="search" placeholder="Rechercher...">

<!-- Checkbox (case à cocher) -->
<input type="checkbox" id="agree" name="agree" required>
<label for="agree">J'accepte les conditions</label>

<!-- Radio buttons (choix unique) -->
<input type="radio" id="male" name="gender" value="male">
<label for="male">Homme</label>

<input type="radio" id="female" name="gender" value="female">
<label for="female">Femme</label>

<!-- Hidden (caché) -->
<input type="hidden" name="user_id" value="12345">
```

### Textarea (zone de texte)

```html
<label for="bio">Biographie :</label>
<textarea 
    id="bio" 
    name="bio" 
    rows="10" 
    cols="50"
    placeholder="Parlez-nous de vous..."
    maxlength="500">
</textarea>
```

### Select (liste déroulante)

```html
<!-- Select simple -->
<label for="country">Pays :</label>
<select id="country" name="country" required>
    <option value="">-- Choisir un pays --</option>
    <option value="fr">France</option>
    <option value="be">Belgique</option>
    <option value="ch">Suisse</option>
    <option value="ca">Canada</option>
</select>

<!-- Select avec groupes -->
<label for="car">Voiture :</label>
<select id="car" name="car">
    <optgroup label="Françaises">
        <option value="peugeot">Peugeot</option>
        <option value="renault">Renault</option>
    </optgroup>
    <optgroup label="Allemandes">
        <option value="vw">Volkswagen</option>
        <option value="bmw">BMW</option>
    </optgroup>
</select>

<!-- Select multiple -->
<label for="skills">Compétences (maintenir Ctrl) :</label>
<select id="skills" name="skills[]" multiple size="5">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
    <option value="php">PHP</option>
    <option value="python">Python</option>
</select>
```

### Boutons

```html
<!-- Bouton de soumission -->
<button type="submit">Envoyer le formulaire</button>

<!-- Bouton de réinitialisation -->
<button type="reset">Réinitialiser</button>

<!-- Bouton générique (JavaScript) -->
<button type="button" onclick="doSomething()">Cliquez-moi</button>

<!-- Input button (moins recommandé) -->
<input type="submit" value="Envoyer">
<input type="reset" value="Réinitialiser">
<input type="button" value="Cliquer" onclick="doSomething()">
```

### Attributs de formulaire

```html
<!-- Champ requis -->
<input type="text" name="username" required>

<!-- Placeholder -->
<input type="text" placeholder="Entrez votre nom">

<!-- Valeur par défaut -->
<input type="text" value="Jean Dupont">

<!-- Désactivé -->
<input type="text" disabled>

<!-- Lecture seule -->
<input type="text" readonly value="Impossible de modifier">

<!-- Autocomplétion -->
<input type="text" name="name" autocomplete="name">
<input type="email" name="email" autocomplete="email">

<!-- Autofocus (focus automatique) -->
<input type="text" name="search" autofocus>

<!-- Min/Max (nombre, date) -->
<input type="number" min="1" max="100">

<!-- Pattern (regex validation) -->
<input type="text" pattern="[A-Z]{3}[0-9]{3}" title="Format: ABC123">

<!-- Maxlength -->
<input type="text" maxlength="50">
```

### Fieldset et Legend (grouper des champs)

```html
<form>
    <fieldset>
        <legend>Informations personnelles</legend>
        
        <label for="fname">Prénom :</label>
        <input type="text" id="fname" name="fname">
        
        <label for="lname">Nom :</label>
        <input type="text" id="lname" name="lname">
    </fieldset>
    
    <fieldset>
        <legend>Adresse</legend>
        
        <label for="street">Rue :</label>
        <input type="text" id="street" name="street">
        
        <label for="city">Ville :</label>
        <input type="text" id="city" name="city">
    </fieldset>
    
    <button type="submit">Envoyer</button>
</form>
```

### Datalist (autocomplete personnalisé)

```html
<label for="browser">Navigateur :</label>
<input list="browsers" id="browser" name="browser">

<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

---

## Formulaire complet exemple

### Formulaire d'inscription

```html
<form action="/register" method="POST" enctype="multipart/form-data">
    <h2>Inscription</h2>
    
    <!-- Informations personnelles -->
    <fieldset>
        <legend>Informations personnelles</legend>
        
        <div class="form-group">
            <label for="firstname">Prénom * :</label>
            <input 
                type="text" 
                id="firstname" 
                name="firstname" 
                required 
                minlength="2"
                autofocus>
        </div>
        
        <div class="form-group">
            <label for="lastname">Nom * :</label>
            <input 
                type="text" 
                id="lastname" 
                name="lastname" 
                required 
                minlength="2">
        </div>
        
        <div class="form-group">
            <label for="birthdate">Date de naissance :</label>
            <input 
                type="date" 
                id="birthdate" 
                name="birthdate"
                min="1900-01-01" 
                max="2024-12-31">
        </div>
        
        <div class="form-group">
            <label>Genre :</label>
            <input type="radio" id="male" name="gender" value="male">
            <label for="male">Homme</label>
            
            <input type="radio" id="female" name="gender" value="female">
            <label for="female">Femme</label>
            
            <input type="radio" id="other" name="gender" value="other">
            <label for="other">Autre</label>
        </div>
    </fieldset>
    
    <!-- Compte -->
    <fieldset>
        <legend>Compte</legend>
        
        <div class="form-group">
            <label for="email">Email * :</label>
            <input 
                type="email" 
                id="email" 
                name="email" 
                required
                autocomplete="email">
        </div>
        
        <div class="form-group">
            <label for="username">Nom d'utilisateur * :</label>
            <input 
                type="text" 
                id="username" 
                name="username" 
                required
                pattern="[a-zA-Z0-9_]{3,20}"
                title="3-20 caractères alphanumériques et underscore">
        </div>
        
        <div class="form-group">
            <label for="password">Mot de passe * :</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                required
                minlength="8"
                autocomplete="new-password">
            <small>Au moins 8 caractères</small>
        </div>
        
        <div class="form-group">
            <label for="password2">Confirmer mot de passe * :</label>
            <input 
                type="password" 
                id="password2" 
                name="password2" 
                required
                autocomplete="new-password">
        </div>
    </fieldset>
    
    <!-- Préférences -->
    <fieldset>
        <legend>Préférences</legend>
        
        <div class="form-group">
            <label for="country">Pays :</label>
            <select id="country" name="country">
                <option value="">-- Sélectionner --</option>
                <option value="fr">France</option>
                <option value="be">Belgique</option>
                <option value="ch">Suisse</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="bio">Bio (optionnel) :</label>
            <textarea 
                id="bio" 
                name="bio" 
                rows="5" 
                maxlength="500"
                placeholder="Parlez-nous de vous..."></textarea>
            <small>500 caractères max</small>
        </div>
        
        <div class="form-group">
            <label for="avatar">Photo de profil :</label>
            <input 
                type="file" 
                id="avatar" 
                name="avatar" 
                accept="image/png, image/jpeg">
        </div>
        
        <div class="form-group">
            <input type="checkbox" id="newsletter" name="newsletter" checked>
            <label for="newsletter">Je souhaite recevoir la newsletter</label>
        </div>
        
        <div class="form-group">
            <input type="checkbox" id="terms" name="terms" required>
            <label for="terms">
                J'accepte les <a href="/cgu" target="_blank">conditions générales</a> *
            </label>
        </div>
    </fieldset>
    
    <!-- Boutons -->
    <div class="form-actions">
        <button type="reset">Réinitialiser</button>
        <button type="submit">S'inscrire</button>
    </div>
    
    <p><small>* Champs obligatoires</small></p>
</form>
```

### Formulaire de contact

```html
<form action="/contact" method="POST">
    <h2>Contactez-nous</h2>
    
    <div class="form-group">
        <label for="name">Nom * :</label>
        <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email * :</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="subject">Sujet :</label>
        <select id="subject" name="subject" required>
            <option value="">-- Choisir un sujet --</option>
            <option value="info">Demande d'information</option>
            <option value="support">Support technique</option>
            <option value="commercial">Question commerciale</option>
            <option value="autre">Autre</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="message">Message * :</label>
        <textarea id="message" name="message" rows="8" required></textarea>
    </div>
    
    <button type="submit">Envoyer</button>
</form>
```

---

## Validation et accessibilité

### Validation HTML5

```html
<!-- Email valide -->
<input type="email" required>

<!-- URL valide -->
<input type="url" required>

<!-- Nombre dans une plage -->
<input type="number" min="1" max="100" required>

<!-- Longueur min/max -->
<input type="text" minlength="3" maxlength="20" required>

<!-- Pattern regex -->
<input 
    type="text" 
    pattern="[0-9]{5}" 
    title="Code postal à 5 chiffres"
    required>

<!-- Fichier avec types acceptés -->
<input type="file" accept=".pdf,.doc,.docx" required>
```

### Messages de validation personnalisés

```html
<form id="myForm">
    <input 
        type="text" 
        id="username" 
        required 
        pattern="[a-zA-Z0-9]{5,15}">
    <button type="submit">Envoyer</button>
</form>

<script>
const input = document.getElementById('username');
input.addEventListener('invalid', function() {
    if (input.validity.valueMissing) {
        input.setCustomValidity('Veuillez entrer un nom d\'utilisateur');
    } else if (input.validity.patternMismatch) {
        input.setCustomValidity('5-15 caractères alphanumériques');
    }
});
input.addEventListener('input', function() {
    input.setCustomValidity(''); // Reset
});
</script>
```

### Accessibilité des formulaires

```html
<!-- ✅ Bon : Label associé avec for/id -->
<label for="email">Email :</label>
<input type="email" id="email" name="email">

<!-- ✅ Bon : Label englobant -->
<label>
    Email :
    <input type="email" name="email">
</label>

<!-- ✅ Bon : aria-label pour boutons icônes -->
<button type="submit" aria-label="Envoyer le formulaire">
    <svg>...</svg>
</button>

<!-- ✅ Bon : Description avec aria-describedby -->
<label for="password">Mot de passe :</label>
<input 
    type="password" 
    id="password" 
    aria-describedby="password-help">
<small id="password-help">Au moins 8 caractères avec majuscule et chiffre</small>

<!-- ✅ Bon : Erreur avec aria-invalid -->
<input 
    type="email" 
    aria-invalid="true" 
    aria-describedby="email-error">
<span id="email-error" role="alert">Email invalide</span>
```

---

**Prochaine section** : Apprenez à styliser tout ça avec les sélecteurs CSS !
