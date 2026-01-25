# Projet - Application Météo avec API

## 🎯 Objectif

Créer une application web de consultation météo en utilisant **HTML, CSS et JavaScript** avec appel à une **API météo externe**. Ce projet vous permettra de maîtriser les requêtes HTTP, la manipulation de données JSON, les Promises et async/await.

## 🌤️ Description du Projet

L'application permet à l'utilisateur de rechercher la météo d'une ville et d'afficher les informations météorologiques actuelles ainsi que les prévisions. Les données proviennent d'une API externe (OpenWeatherMap, WeatherAPI, ou équivalent).

## 🎨 Contraintes Techniques

### Obligatoire
- **HTML5** : Structure sémantique
- **CSS3** : Stylisation responsive
- **JavaScript ES6+** : Fetch API, async/await, Promises
- **API Météo** : OpenWeatherMap (gratuit) ou équivalent
- **Pas de framework** : Vanilla JavaScript uniquement (ou React si vous préférez)

### Technologies Autorisées
- HTML5
- CSS3 / Sass
- JavaScript Vanilla ou React
- Fetch API ou Axios
- OpenWeatherMap API, WeatherAPI, ou autre API gratuite

## 📝 Fonctionnalités Minimum Attendues

### Fonctionnalités de Base (Obligatoires)
1. **Recherche de ville**
   - Input pour saisir le nom d'une ville
   - Bouton de recherche ou validation par "Entrée"
   - Gestion des erreurs (ville introuvable, erreur réseau)

2. **Affichage météo actuelle**
   - Nom de la ville et pays
   - Température actuelle
   - Description de la météo (ensoleillé, nuageux, pluvieux...)
   - Icône représentant les conditions météo
   - Température ressentie
   - Humidité
   - Vitesse du vent

3. **Interface responsive**
   - Adaptation mobile, tablette, desktop
   - Design moderne et épuré

4. **État de chargement**
   - Indicateur de chargement pendant la requête API
   - Message d'erreur si la requête échoue

### Fonctionnalités Bonus (Optionnelles)
- **Prévisions sur plusieurs jours** : 5-7 jours avec températures min/max
- **Géolocalisation** : Détecter la position de l'utilisateur automatiquement
- **Historique de recherche** : Villes récemment consultées (localStorage)
- **Favoris** : Sauvegarder des villes favorites
- **Graphiques** : Évolution de la température (Chart.js ou Canvas)
- **Changement d'unités** : Basculer entre Celsius et Fahrenheit
- **Fond dynamique** : Change selon la météo (soleil → fond bleu, pluie → fond gris)
- **Animations** : Pluie, neige, soleil animés en CSS/Canvas
- **Mode sombre/clair**
- **Détails avancés** : Pression atmosphérique, UV index, lever/coucher du soleil
- **Autocomplete** : Suggestions de villes pendant la saisie

## 💡 Suggestions et Pistes

### Choix de l'API

**OpenWeatherMap (Recommandé)**
- Gratuit jusqu'à 1000 appels/jour
- Documentation : https://openweathermap.org/api
- Inscription : https://openweathermap.org/appid
- Endpoints utiles :
  - Météo actuelle : `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=fr`
  - Prévisions 5 jours : `https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric&lang=fr`

**Alternatives :**
- WeatherAPI : https://www.weatherapi.com/
- Weatherbit : https://www.weatherbit.io/
- Open-Meteo : https://open-meteo.com/ (sans clé API !)

### Structure HTML

```html
<div class="app-container">
  <header>
    <h1>☀️ Météo App</h1>
  </header>
  
  <div class="search-section">
    <input 
      type="text" 
      id="city-input" 
      placeholder="Entrez une ville..."
    />
    <button id="search-btn">Rechercher</button>
  </div>
  
  <div id="loading" class="hidden">Chargement...</div>
  <div id="error" class="hidden"></div>
  
  <div id="weather-display" class="hidden">
    <h2 id="city-name"></h2>
    <div class="current-weather">
      <img id="weather-icon" alt="Icône météo">
      <p id="temperature"></p>
      <p id="description"></p>
    </div>
    <div class="weather-details">
      <p>Ressenti: <span id="feels-like"></span></p>
      <p>Humidité: <span id="humidity"></span></p>
      <p>Vent: <span id="wind"></span></p>
    </div>
  </div>
  
  <div id="forecast-section" class="hidden">
    <!-- Prévisions 5 jours -->
  </div>
</div>
```

### JavaScript - Appel API

```javascript
const API_KEY = 'VOTRE_CLE_API'; // À remplacer !
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
  try {
    // Afficher le loader
    showLoading();
    hideError();
    
    // Appel API
    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
    );
    
    // Vérifier le statut
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ville introuvable');
      }
      throw new Error('Erreur lors de la récupération des données');
    }
    
    // Parser JSON
    const data = await response.json();
    
    // Afficher les données
    displayWeather(data);
    
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

function displayWeather(data) {
  // Extraire les données
  const cityName = `${data.name}, ${data.sys.country}`;
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed * 3.6); // m/s vers km/h
  
  // Afficher dans le DOM
  document.getElementById('city-name').textContent = cityName;
  document.getElementById('temperature').textContent = `${temp}°C`;
  document.getElementById('description').textContent = description;
  document.getElementById('weather-icon').src = 
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById('feels-like').textContent = `${feelsLike}°C`;
  document.getElementById('humidity').textContent = `${humidity}%`;
  document.getElementById('wind').textContent = `${windSpeed} km/h`;
  
  // Afficher la section
  document.getElementById('weather-display').classList.remove('hidden');
}

function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

// Event listener
document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (city) {
    getWeather(city);
  }
});

// Recherche avec touche Entrée
document.getElementById('city-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = e.target.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});
```

### Exemple de Réponse API

```json
{
  "name": "Paris",
  "sys": { "country": "FR" },
  "main": {
    "temp": 15.2,
    "feels_like": 14.5,
    "humidity": 72,
    "pressure": 1013
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "nuageux",
      "icon": "04d"
    }
  ],
  "wind": {
    "speed": 3.5
  }
}
```

### Géolocalisation (Bonus)

```javascript
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
          `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        displayWeather(data);
      },
      (error) => {
        showError('Impossible de récupérer votre position');
      }
    );
  } else {
    showError('La géolocalisation n\'est pas supportée');
  }
}
```

### Stylisation CSS

```css
.app-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.search-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.search-section input {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
}

.search-section button {
  padding: 12px 24px;
  background: #fff;
  color: #667eea;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.current-weather {
  text-align: center;
  margin: 30px 0;
}

.current-weather img {
  width: 100px;
  height: 100px;
}

#temperature {
  font-size: 3rem;
  font-weight: bold;
  margin: 10px 0;
}

#description {
  font-size: 1.2rem;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.hidden {
  display: none;
}

#error {
  background: rgba(255, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  margin: 10px 0;
}

#loading {
  text-align: center;
  font-size: 1.2rem;
  margin: 20px 0;
}
```

## 🚀 Étapes Suggérées

1. **Inscription à l'API**
   - Créer un compte sur OpenWeatherMap
   - Récupérer votre clé API
   - Tester l'API avec Postman ou le navigateur

2. **HTML/CSS de base**
   - Créer la structure HTML
   - Styliser l'interface
   - Rendre responsive

3. **JavaScript - Connexion API**
   - Créer la fonction `getWeather(city)`
   - Tester avec `console.log()` pour voir les données
   - Gérer les erreurs (try/catch)

4. **Affichage des données**
   - Extraire les données de la réponse JSON
   - Afficher dans le DOM
   - Formater (arrondis, unités...)

5. **États et UX**
   - Ajouter le loader pendant la requête
   - Afficher les erreurs proprement
   - Gérer les cas limites (ville vide, caractères spéciaux...)

6. **Fonctionnalités bonus**
   - Prévisions 5 jours
   - Géolocalisation
   - localStorage pour favoris
   - Animations

## 📦 Livrables

- **index.html** : Structure de l'application
- **style.css** : Styles
- **script.js** : Logique et appels API
- **.env ou config.js** : Clé API (ne JAMAIS commit la clé sur Git public !)
- **README.md** : Documentation avec instructions d'utilisation

## ✅ Critères d'Évaluation

- **Appel API** : Requête correcte, gestion erreurs, async/await
- **Parsing JSON** : Extraction et affichage des bonnes données
- **UX** : Loader, messages d'erreur, interface claire
- **Code JavaScript** : Propre, modulaire, commenté
- **Design** : Interface moderne et responsive
- **Gestion d'erreurs** : Tous les cas gérés (réseau, ville introuvable...)

## 🎓 Compétences Travaillées

- **Fetch API** : Requêtes HTTP asynchrones
- **Async/Await** : Gestion de l'asynchrone
- **Promises** : Compréhension du flux asynchrone
- **JSON** : Parsing et manipulation de données
- **API REST** : Consommation d'API tierce
- **Gestion d'erreurs** : Try/catch, status codes HTTP
- **DOM Manipulation** : Affichage dynamique des données
- **Geolocation API** : Accès à la position de l'utilisateur (bonus)
- **localStorage** : Persistance de données (bonus)

## 📚 Ressources Utiles

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [MDN - Fetch API](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)
- [MDN - Async/Await](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN - Geolocation API](https://developer.mozilla.org/fr/docs/Web/API/Geolocation_API)
- [HTTP Status Codes](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)

## ⚠️ Sécurité

**Ne JAMAIS exposer votre clé API publiquement !**
- Ne commitez pas votre clé API sur GitHub
- Utilisez des variables d'environnement
- Pour un projet frontend pur, la clé sera visible (limitation). En production, utilisez un backend pour sécuriser la clé.

---

**Bon développement ! 🌦️**
