# Upload de Fichiers

Gérez l'upload de fichiers (images, documents) dans votre application Node.js/Express.

---

## 📚 Ce que vous allez apprendre

- Configurer Multer pour l'upload
- Valider les fichiers (type, taille)
- Stocker localement ou sur le cloud
- Gérer les images (redimensionnement)

## ⚠️ Prérequis

- [Express.js - Base](../express/express-base.md)
- [Middleware & Routing](../express/middleware-routing.md)

---

## Multer - Configuration de base

### Installation

```bash
npm install multer
```

### Upload simple

```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de destination
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + nom original
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
```

### Utilisation dans une route

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Upload d'un seul fichier
router.post('/products', upload.single('image'), (req, res) => {
  console.log(req.file);
  // {
  //   fieldname: 'image',
  //   originalname: 'photo.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'uploads/',
  //   filename: '1706123456789-photo.jpg',
  //   path: 'uploads/1706123456789-photo.jpg',
  //   size: 54321
  // }
  
  res.json({
    message: 'Fichier uploadé',
    filename: req.file.filename
  });
});
```

### Côté client (React)

```jsx
function ProductForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Prévisualisation
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', 'Mon produit');
    formData.append('price', 99);
    formData.append('image', file); // Le fichier
    
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData
      // PAS de Content-Type header ! FormData le gère
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" />
      <input type="number" name="price" />
      
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange} 
      />
      
      {preview && <img src={preview} alt="Preview" width="200" />}
      
      <button type="submit">Créer</button>
    </form>
  );
}
```

---

## Validation des fichiers

### Filtre par type MIME

```javascript
const fileFilter = (req, file, cb) => {
  // Types autorisés
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accepter
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});
```

### Gestion des erreurs Multer

```javascript
// middleware/handleUploadError.js
const multer = require('multer');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5 MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Trop de fichiers' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  
  next();
};

module.exports = handleUploadError;
```

```javascript
// Utilisation
router.post(
  '/products',
  upload.single('image'),
  handleUploadError,
  createProduct
);
```

---

## Upload multiple

### Plusieurs fichiers du même champ

```javascript
// Jusqu'à 5 images
router.post('/gallery', upload.array('images', 5), (req, res) => {
  console.log(req.files); // Array de fichiers
  
  const filenames = req.files.map(f => f.filename);
  res.json({ files: filenames });
});
```

### Plusieurs champs différents

```javascript
const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
  { name: 'document', maxCount: 1 }
]);

router.post('/profile', uploadFields, (req, res) => {
  console.log(req.files.avatar);    // Array avec 1 fichier
  console.log(req.files.gallery);   // Array avec jusqu'à 5 fichiers
  console.log(req.files.document);  // Array avec 1 fichier
});
```

---

## Servir les fichiers statiques

```javascript
// app.js
const express = require('express');
const path = require('path');

const app = express();

// Servir le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Maintenant accessible via: http://localhost:3000/uploads/image.jpg
```

### Dans la base de données

```javascript
// Sauvegarder le chemin relatif
const product = await Product.create({
  name: req.body.name,
  image: `/uploads/${req.file.filename}` // Chemin accessible
});

// Côté client
<img src={`http://localhost:3000${product.image}`} alt={product.name} />
```

---

## Cloudinary (stockage cloud)

### Pourquoi le cloud ?

| Local | Cloud (Cloudinary) |
|-------|-------------------|
| ❌ Perte si serveur crash | ✅ Réplication automatique |
| ❌ Pas de CDN | ✅ CDN global rapide |
| ❌ Pas de transformations | ✅ Redimensionnement à la volée |
| ❌ Gestion manuelle | ✅ API puissante |

### Installation

```bash
npm install cloudinary multer-storage-cloudinary
```

### Configuration

```javascript
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage pour Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mon-app/products', // Dossier sur Cloudinary
    allowed_formats: ['jpg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
```

### Utilisation

```javascript
const { upload } = require('../config/cloudinary');

router.post('/products', upload.single('image'), async (req, res) => {
  console.log(req.file);
  // {
  //   path: 'https://res.cloudinary.com/xxx/image/upload/v123/mon-app/products/abc123.jpg',
  //   filename: 'mon-app/products/abc123',
  //   ...
  // }
  
  const product = await Product.create({
    name: req.body.name,
    image: req.file.path // URL Cloudinary
  });
  
  res.json(product);
});
```

### Supprimer une image

```javascript
const { cloudinary } = require('../config/cloudinary');

router.delete('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product.image) {
    // Extraire le public_id de l'URL
    const publicId = product.image.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }
  
  await product.deleteOne();
  res.json({ message: 'Produit supprimé' });
});
```

### Transformations à la volée

```javascript
// Générer des URLs avec transformations
const imageUrl = cloudinary.url('mon-app/products/abc123', {
  width: 300,
  height: 300,
  crop: 'fill',
  gravity: 'face', // Centre sur les visages
  quality: 'auto',
  fetch_format: 'auto'
});

// Thumbnail
const thumbnail = cloudinary.url('mon-app/products/abc123', {
  width: 150,
  height: 150,
  crop: 'thumb'
});
```

---

## Redimensionnement local avec Sharp

### Installation

```bash
npm install sharp
```

### Middleware de traitement

```javascript
// middleware/processImage.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const processImage = async (req, res, next) => {
  if (!req.file) return next();
  
  const filename = `processed-${Date.now()}.webp`;
  const outputPath = path.join('uploads', filename);
  
  try {
    await sharp(req.file.path)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    // Supprimer l'original
    await fs.unlink(req.file.path);
    
    // Mettre à jour req.file
    req.file.filename = filename;
    req.file.path = outputPath;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = processImage;
```

### Utilisation

```javascript
const processImage = require('../middleware/processImage');

router.post(
  '/products',
  upload.single('image'),
  processImage,  // Traitement après upload
  createProduct
);
```

### Générer des thumbnails

```javascript
const generateThumbnails = async (req, res, next) => {
  if (!req.file) return next();
  
  const baseName = path.parse(req.file.filename).name;
  
  const sizes = [
    { name: 'thumb', width: 150, height: 150 },
    { name: 'medium', width: 400, height: 400 },
    { name: 'large', width: 800, height: 800 }
  ];
  
  req.thumbnails = {};
  
  for (const size of sizes) {
    const filename = `${baseName}-${size.name}.webp`;
    const outputPath = path.join('uploads', filename);
    
    await sharp(req.file.path)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    req.thumbnails[size.name] = `/uploads/${filename}`;
  }
  
  next();
};
```

---

## Structure de dossiers recommandée

```
project/
├── uploads/                  # Fichiers uploadés
│   ├── products/
│   ├── avatars/
│   └── temp/
├── middleware/
│   ├── upload.js            # Config Multer
│   ├── processImage.js      # Sharp
│   └── handleUploadError.js
├── config/
│   └── cloudinary.js        # Config cloud
├── routes/
│   └── products.js
└── .env
```

---

## Variables d'environnement

```env
# .env
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijk

# Ou pour stockage local
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

## ❌ Erreurs Courantes

### 1. Oublier le Content-Type multipart

```jsx
// ❌ Content-Type incorrect
fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // NON !
  body: formData
});

// ✅ Laisser le navigateur gérer
fetch('/api/upload', {
  method: 'POST',
  body: formData  // Pas de Content-Type header
});
```

### 2. Nom de champ incorrect

```html
<!-- Côté client -->
<input type="file" name="photo" />
```

```javascript
// ❌ Nom différent
upload.single('image')  // Ne trouvera pas le fichier

// ✅ Même nom
upload.single('photo')
```

### 3. Dossier uploads non créé

```javascript
// ❌ Erreur si le dossier n'existe pas
// ENOENT: no such file or directory

// ✅ Créer le dossier au démarrage
const fs = require('fs');
const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

### 4. Exposer des fichiers sensibles

```javascript
// ❌ Tout le dossier accessible
app.use('/files', express.static('uploads'));

// ✅ Vérifier l'authentification
app.use('/files', authMiddleware, express.static('uploads'));

// Ou mieux : route spécifique
app.get('/files/:filename', authMiddleware, (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});
```

---

## 🏋️ Exercices Pratiques

### Exercice 1 : Upload d'avatar

**Objectif** : Permettre aux utilisateurs de changer leur avatar

1. Route POST `/api/users/avatar`
2. Valider : images uniquement, max 2MB
3. Redimensionner à 200x200
4. Mettre à jour l'utilisateur en BDD

<details>
<summary>💡 Solution</summary>

```javascript
// middleware/avatarUpload.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const processAvatar = async (req, res, next) => {
  if (!req.file) return next();
  
  const filename = `avatar-${req.user.id}-${Date.now()}.webp`;
  const outputPath = path.join('uploads/avatars', filename);
  
  await sharp(req.file.buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 90 })
    .toFile(outputPath);
  
  req.avatarPath = `/uploads/avatars/${filename}`;
  next();
};

module.exports = { upload, processAvatar };

// routes/users.js
router.post(
  '/avatar',
  auth,
  upload.single('avatar'),
  processAvatar,
  async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
      avatar: req.avatarPath
    });
    
    res.json({ avatar: req.avatarPath });
  }
);
```
</details>

### Exercice 2 : Galerie de produit

**Objectif** : Upload multiple d'images pour un produit

1. Route POST `/api/products/:id/images`
2. Maximum 5 images par produit
3. Générer un thumbnail pour chaque image

<details>
<summary>💡 Solution</summary>

```javascript
router.post(
  '/products/:id/images',
  auth,
  upload.array('images', 5),
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    const images = [];
    
    for (const file of req.files) {
      const baseName = `product-${product._id}-${Date.now()}`;
      
      // Image principale
      const mainPath = path.join('uploads/products', `${baseName}.webp`);
      await sharp(file.path)
        .resize(800, 800, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(mainPath);
      
      // Thumbnail
      const thumbPath = path.join('uploads/products', `${baseName}-thumb.webp`);
      await sharp(file.path)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbPath);
      
      images.push({
        main: `/uploads/products/${baseName}.webp`,
        thumbnail: `/uploads/products/${baseName}-thumb.webp`
      });
      
      // Supprimer l'original
      await fs.unlink(file.path);
    }
    
    product.images.push(...images);
    await product.save();
    
    res.json({ images });
  }
);
```
</details>

---

## ✅ Quiz Rapide

1. Quel package gère l'upload de fichiers avec Express ?
   - A) express-upload
   - B) multer ✅
   - C) formidable

2. Comment envoyer un fichier depuis le client ?
   - A) JSON.stringify()
   - B) FormData ✅
   - C) Base64

3. Quel package permet le redimensionnement d'images ?
   - A) jimp
   - B) sharp ✅
   - C) imagemagick

4. Pourquoi utiliser le stockage cloud ?
   - A) C'est moins cher
   - B) CDN + réplication + transformations ✅
   - C) C'est obligatoire

---

## 🔗 Pour aller plus loin

- [Multer Documentation](https://github.com/expressjs/multer)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

## ➡️ Prochaine étape

Découvrez les [variables d'environnement](./variables-environnement.md) pour sécuriser vos configurations.
