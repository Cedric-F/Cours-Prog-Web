# Optimisation des Assets

Maîtrisez l'**optimisation des images, fonts et autres assets** pour des pages ultra-rapides et légères.

---

## Optimisation des Images

### Formats modernes

| Format | Compression | Transparence | Animation | Support |
|--------|-------------|--------------|-----------|---------|
| **JPEG** | Avec perte | ❌ | ❌ | 100% |
| **PNG** | Sans perte | ✅ | ❌ | 100% |
| **WebP** | Meilleure | ✅ | ✅ | 97% |
| **AVIF** | La meilleure | ✅ | ✅ | 85% |
| **SVG** | Vectoriel | ✅ | ✅ | 100% |

### Balise `<picture>` avec fallback

```html
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero" width="1200" height="600">
</picture>
```

### Responsive avec `srcset`

```html
<img
  srcset="
    /image-400w.jpg 400w,
    /image-800w.jpg 800w,
    /image-1200w.jpg 1200w,
    /image-1600w.jpg 1600w
  "
  sizes="
    (max-width: 400px) 400px,
    (max-width: 800px) 800px,
    (max-width: 1200px) 1200px,
    1600px
  "
  src="/image-800w.jpg"
  alt="Responsive Image"
  loading="lazy"
/>
```

### Lazy Loading natif

```html
<!-- Chargé immédiatement (above the fold) -->
<img src="/hero.jpg" alt="Hero" loading="eager" fetchpriority="high">

<!-- Chargé quand proche du viewport -->
<img src="/image.jpg" alt="Image" loading="lazy">
```

---

## Compression d'images

### Outils CLI

```bash
# ImageMagick
convert input.jpg -quality 85 -strip output.jpg

# cwebp (WebP)
cwebp -q 80 input.jpg -o output.webp

# avif (AVIF)
avifenc --min 0 --max 63 -a end-usage=q -a cq-level=23 input.jpg output.avif

# Batch avec Sharp (Node.js)
npm install sharp
```

### Script Node.js avec Sharp

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
    
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, path.extname(file));
    
    // WebP
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${baseName}.webp`));
    
    // AVIF
    await sharp(inputPath)
      .avif({ quality: 65 })
      .toFile(path.join(outputDir, `${baseName}.avif`));
    
    // JPEG optimisé
    await sharp(inputPath)
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(outputDir, `${baseName}.jpg`));
    
    console.log(`✅ ${file} optimisé`);
  }
}

optimizeImages('./images', './optimized');
```

### Responsive images

```javascript
const sharp = require('sharp');

const widths = [400, 800, 1200, 1600];

async function generateResponsive(inputPath) {
  for (const width of widths) {
    await sharp(inputPath)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(`image-${width}w.webp`);
    
    console.log(`✅ ${width}px généré`);
  }
}

generateResponsive('./hero.jpg');
```

---

## Optimisation Next.js Image

### next/image (automatique)

```javascript
import Image from 'next/image';

export default function Page() {
  return (
    <>
      {/* Optimisation automatique */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        priority // Préchargé
      />
      
      {/* Lazy load */}
      <Image
        src="/image.jpg"
        alt="Image"
        width={800}
        height={600}
        loading="lazy"
      />
      
      {/* Image externe */}
      <Image
        src="https://example.com/image.jpg"
        alt="External"
        width={800}
        height={600}
      />
    </>
  );
}
```

### Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['example.com'], // Images externes autorisées
    minimumCacheTTL: 60 * 60 * 24 * 365 // 1 an
  }
};
```

---

## Optimisation des Fonts

### font-display

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap; /* Affiche le fallback puis swap */
  font-weight: 400;
  font-style: normal;
}
```

**Options** :
- `auto` : Comportement par défaut du navigateur
- `block` : Texte invisible pendant 3s (FOIT)
- `swap` : Texte visible immédiatement avec fallback (FOUT) ✅
- `fallback` : Court blocage (100ms), puis fallback
- `optional` : Fallback si la font n'est pas en cache

### Sous-ensembles (subsets)

```css
/* Latin uniquement (plus léger) */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Variable Fonts

```css
/* 1 fichier pour tous les poids */
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900; /* Variable de 100 à 900 */
}

.text {
  font-family: 'InterVariable';
  font-weight: 450; /* N'importe quelle valeur */
}
```

### Google Fonts optimisé

```html
<!-- ❌ Mauvais : Bloque le rendering -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

<!-- ✅ Bon : Préconnexion -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

<!-- 🚀 Meilleur : Préchargement -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
```

### Next.js Font Optimization

```javascript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700']
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Optimisation SVG

### Minification avec SVGO

```bash
npm install -g svgo

svgo input.svg -o output.svg
```

### Inline SVG

```html
<!-- ❌ Requête HTTP supplémentaire -->
<img src="/icon.svg" alt="Icon">

<!-- ✅ Inline (pas de requête) -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>
```

### Sprite SVG

```html
<!-- sprite.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </symbol>
  
  <symbol id="icon-user" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </symbol>
</svg>

<!-- Utilisation -->
<svg class="icon"><use href="#icon-home"/></svg>
<svg class="icon"><use href="#icon-user"/></svg>
```

---

## Optimisation CSS

### Critical CSS

```html
<style>
  /* CSS critique inline pour le above-the-fold */
  body { margin: 0; font-family: sans-serif; }
  .hero { height: 100vh; background: #4285f4; }
</style>

<!-- CSS non critique différé -->
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/styles.css"></noscript>
```

### PurgeCSS (supprimer le CSS inutilisé)

```bash
npm install --save-dev @fullhuman/postcss-purgecss
```

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
```

---

## Optimisation JavaScript

### Code Splitting

```javascript
// ❌ Bundle unique de 500 KB
import HeavyLib from 'heavy-lib';

// ✅ Chargé à la demande
button.addEventListener('click', async () => {
  const { default: HeavyLib } = await import('heavy-lib');
  HeavyLib.doSomething();
});
```

### Terser (minification)

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ]
  }
};
```

---

## Compression Gzip / Brotli

### Express.js

```javascript
const compression = require('compression');

app.use(compression({
  level: 6, // 0-9
  threshold: 0
}));
```

### Nginx

```nginx
# Gzip
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Brotli (module supplémentaire requis)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

---

## CDN (Content Delivery Network)

### Cloudflare

```html
<!-- Images via CDN -->
<img src="https://cdn.example.com/image.jpg" alt="Image">

<!-- Fonts via CDN -->
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
```

### Configuration DNS

```
CNAME cdn.example.com -> example.cloudflare.com
```

---

## Monitoring

### Lighthouse CI

```bash
npm install -g @lhci/cli

lhci autorun --collect.url=https://example.com
```

### Bundle Size Tracking

```bash
npm install --save-dev size-limit

# package.json
{
  "size-limit": [
    {
      "path": "dist/bundle.js",
      "limit": "50 KB"
    }
  ]
}

npm run size
```

---

## Checklist d'optimisation

### Images
- ✅ Format WebP/AVIF
- ✅ Responsive (srcset)
- ✅ Lazy loading
- ✅ Compression (80-85% qualité)
- ✅ Dimensions exactes (width/height)

### Fonts
- ✅ font-display: swap
- ✅ Subsets (latin uniquement)
- ✅ Variable fonts si possible
- ✅ Préconnexion (preconnect)
- ✅ Limiter à 2-3 fonts

### CSS
- ✅ Critical CSS inline
- ✅ PurgeCSS pour supprimer l'inutilisé
- ✅ Minification
- ✅ Différer le non-critique

### JavaScript
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification (Terser)
- ✅ Defer / async pour scripts
- ✅ Compression Gzip/Brotli

### Général
- ✅ CDN pour assets statiques
- ✅ Cache headers (1 an pour assets immutables)
- ✅ HTTP/2 ou HTTP/3
- ✅ Lighthouse score > 90

---

## Exercice pratique

Optimisez un site web :
- Convertir toutes les images en WebP + AVIF
- Générer 4 tailles responsive (400, 800, 1200, 1600)
- Optimiser les fonts (swap + subset)
- Critical CSS inline
- Code splitting
- Score Lighthouse 100/100

**Objectif** : Réduire le poids total de 5 MB → 500 KB !

---

**Prochaine étape** : [Lazy Loading](../chargement-ressources/lazy-loading.md) pour charger intelligemment !
