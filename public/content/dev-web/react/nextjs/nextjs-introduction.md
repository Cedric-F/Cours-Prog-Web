# Introduction à Next.js

Le framework React pour la production avec rendu côté serveur.

---

## Ce que vous allez apprendre

- Comprendre les avantages de Next.js
- Créer un projet Next.js
- Maîtriser l'App Router
- Utiliser le Server-Side Rendering (SSR)

## Prérequis

- [React - Composants](../composants-jsx/jsx-composants-base.md)
- [React - Hooks](../hooks/hooks-base.md)
- [React Router](../routing/react-router.md)

---

## Pourquoi Next.js ?

### React seul (SPA)

```
┌──────────────────────────────────────────────────────┐
│  Navigateur                                          │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. Télécharge HTML vide                        │ │
│  │ 2. Télécharge JavaScript (~500KB+)             │ │
│  │ 3. Exécute React                               │ │
│  │ 4. Affiche la page                             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ⚠️ Page blanche pendant le chargement              │
│  ⚠️ SEO difficile (Google voit une page vide)       │
└──────────────────────────────────────────────────────┘
```

### Next.js (SSR/SSG)

```
┌──────────────────────────────────────────────────────┐
│  Serveur Next.js                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. Génère le HTML complet                      │ │
│  │ 2. Envoie la page prête                        │ │
│  └────────────────────────────────────────────────┘ │
│                          ↓                           │
│  Navigateur                                          │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. Affiche immédiatement le HTML               │ │
│  │ 2. Hydrate avec React                          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ✅ Affichage instantané                            │
│  ✅ SEO optimal                                     │
└──────────────────────────────────────────────────────┘
```

### Comparaison

| Fonctionnalité | React (CRA) | Next.js |
|----------------|-------------|---------|
| **Routing** | React Router manuel | Basé sur les fichiers |
| **SEO** | ⚠️ Difficile | ✅ Excellent |
| **Performance** | Client-side | SSR/SSG/ISR |
| **API Routes** | Backend séparé | ✅ Intégré |
| **Image Optimization** | Manuel | ✅ Automatique |
| **Déploiement** | Statique | Vercel optimisé |

---

## Créer un projet

```bash
# Créer un nouveau projet
npx create-next-app@latest mon-app

# Options recommandées :
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ App Router
# ✅ src/ directory
# ❌ Import alias (@/*)

cd mon-app
npm run dev
```

### Structure du projet (App Router)

```
mon-app/
├── src/
│   └── app/
│       ├── layout.tsx      # Layout racine
│       ├── page.tsx        # Page d'accueil (/)
│       ├── globals.css
│       ├── about/
│       │   └── page.tsx    # /about
│       ├── products/
│       │   ├── page.tsx    # /products
│       │   └── [id]/
│       │       └── page.tsx # /products/123
│       └── api/
│           └── hello/
│               └── route.ts # API /api/hello
├── public/
├── package.json
└── next.config.js
```

---

## Routing (App Router)

### Pages basiques

```tsx
// src/app/page.tsx → Route: /
export default function HomePage() {
  return (
    <main>
      <h1>Bienvenue</h1>
    </main>
  );
}

// src/app/about/page.tsx → Route: /about
export default function AboutPage() {
  return <h1>À propos</h1>;
}

// src/app/contact/page.tsx → Route: /contact
export default function ContactPage() {
  return <h1>Contact</h1>;
}
```

### Routes dynamiques

```tsx
// src/app/products/[id]/page.tsx → /products/123, /products/456, etc.
type Props = {
  params: { id: string }
};

export default function ProductPage({ params }: Props) {
  return <h1>Produit: {params.id}</h1>;
}
```

### Routes imbriquées

```tsx
// src/app/blog/[slug]/page.tsx → /blog/mon-article
// src/app/users/[userId]/posts/[postId]/page.tsx → /users/1/posts/42

type Props = {
  params: { userId: string; postId: string }
};

export default function UserPostPage({ params }: Props) {
  return <h1>User {params.userId} - Post {params.postId}</h1>;
}
```

### Catch-all routes

```tsx
// src/app/docs/[...slug]/page.tsx
// Matche: /docs/a, /docs/a/b, /docs/a/b/c

type Props = {
  params: { slug: string[] }
};

export default function DocsPage({ params }: Props) {
  // slug = ['a', 'b', 'c'] pour /docs/a/b/c
  return <h1>Docs: {params.slug.join(' > ')}</h1>;
}
```

---

## Layouts

### Layout racine

```tsx
// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Mon App',
  description: 'Description de mon app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header>Navigation...</header>
        <main>{children}</main>
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
```

### Layout imbriqué

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64">
        <nav>Sidebar Dashboard</nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

---

## Server vs Client Components

### Server Components (par défaut)

```tsx
// Exécuté côté SERVEUR
// ✅ Peut accéder à la base de données
// ✅ Peut utiliser des secrets
// ❌ Pas de useState, useEffect, onClick

// src/app/products/page.tsx
async function getProducts() {
  // Accès direct à la DB ou API
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Client Components

```tsx
// src/components/Counter.tsx
'use client'; // ← Directive obligatoire

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Quand utiliser quoi ?

| Server Component | Client Component |
|------------------|------------------|
| Fetch de données | Interactivité (onClick) |
| Accès secrets/DB | State (useState) |
| Gros bundles (charts) | Hooks navigateur |
| SEO critique | Formulaires |

### Composition

```tsx
// src/app/page.tsx (Server Component)
import Counter from '@/components/Counter'; // Client
import ProductList from '@/components/ProductList'; // Server

export default async function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <ProductList />  {/* Rendu serveur */}
      <Counter />      {/* Interactif côté client */}
    </div>
  );
}
```

---

## Data Fetching

### Dans Server Components

```tsx
// Fetch avec cache automatique
async function getData() {
  const res = await fetch('https://api.example.com/data');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Options de cache

```tsx
// Revalidation à intervalle (ISR)
fetch('https://...', { next: { revalidate: 3600 } }); // 1 heure

// Pas de cache
fetch('https://...', { cache: 'no-store' });

// Cache permanent (défaut)
fetch('https://...', { cache: 'force-cache' });
```

### Loading et Error states

```tsx
// src/app/products/loading.tsx
export default function Loading() {
  return <div>Chargement...</div>;
}

// src/app/products/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Une erreur est survenue</h2>
      <button onClick={() => reset()}>Réessayer</button>
    </div>
  );
}
```

---

## API Routes

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products
export async function GET() {
  const products = await db.products.findMany();
  return NextResponse.json(products);
}

// POST /api/products
export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await db.products.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}
```

### Route dynamique

```typescript
// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string }
};

// GET /api/products/123
export async function GET(request: NextRequest, { params }: Context) {
  const product = await db.products.findUnique({
    where: { id: parseInt(params.id) }
  });
  
  if (!product) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}

// DELETE /api/products/123
export async function DELETE(request: NextRequest, { params }: Context) {
  await db.products.delete({
    where: { id: parseInt(params.id) }
  });
  return new NextResponse(null, { status: 204 });
}
```

---

## Navigation

### Link Component

```tsx
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/about">À propos</Link>
      <Link href="/products/123">Produit 123</Link>
      
      {/* Prefetch désactivé */}
      <Link href="/heavy-page" prefetch={false}>
        Page lourde
      </Link>
    </nav>
  );
}
```

### Navigation programmatique

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/search?q=next');
  };
  
  const goBack = () => router.back();
  const refresh = () => router.refresh();
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

---

## Optimisation des images

```tsx
import Image from 'next/image';

export default function ProductCard() {
  return (
    <div>
      {/* Image locale */}
      <Image
        src="/images/product.jpg"
        alt="Produit"
        width={300}
        height={200}
      />
      
      {/* Image distante */}
      <Image
        src="https://example.com/image.jpg"
        alt="Produit"
        width={300}
        height={200}
      />
      
      {/* Image responsive */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        fill
        className="object-cover"
      />
    </div>
  );
}
```

### Configuration pour les domaines externes

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
  },
};
```

---

## Metadata et SEO

### Statique

```tsx
// src/app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos - Mon App',
  description: 'En savoir plus sur notre entreprise',
  openGraph: {
    title: 'À propos',
    description: 'Découvrez notre histoire',
    images: ['/og-about.jpg'],
  },
};

export default function AboutPage() {
  return <h1>À propos</h1>;
}
```

### Dynamique

```tsx
// src/app/products/[id]/page.tsx
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: `${product.name} - Mon Shop`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  return <h1>{product.name}</h1>;
}
```

---

## Déploiement sur Vercel

```bash
# 1. Pusher sur GitHub
git push origin main

# 2. Connecter à Vercel
# vercel.com → Import project → Sélectionner le repo

# 3. C'est tout ! 🎉
# Déploiement automatique à chaque push
```

### Variables d'environnement

```bash
# .env.local (développement)
DATABASE_URL=mongodb://localhost:27017/myapp
NEXTAUTH_SECRET=dev-secret

# Sur Vercel : Settings → Environment Variables
```

---

## ❌ Erreurs Courantes

### 1. useState dans un Server Component

```tsx
// ❌ Erreur : useState ne fonctionne pas côté serveur
export default function Page() {
  const [count, setCount] = useState(0); // 💥
  return <div>{count}</div>;
}

// ✅ Ajouter 'use client' ou extraire dans un composant client
'use client';
export default function Page() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### 2. Fetch côté client sans 'use client'

```tsx
// ❌ useEffect dans Server Component
export default function Page() {
  useEffect(() => {
    fetch('/api/data'); // 💥
  }, []);
}

// ✅ Fetch directement dans le Server Component
export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{/* ... */}</div>;
}
```

### 3. Import de Server Component dans Client

```tsx
// ❌ Ne pas importer un Server Component dans 'use client'
'use client';
import ServerComponent from './ServerComponent'; // ⚠️

// ✅ Passer en children
// Parent (server)
<ClientWrapper>
  <ServerComponent />
</ClientWrapper>
```

---

## 🏋️ Exercice Pratique

**Objectif** : Créer un blog avec Next.js

1. Créer un projet Next.js avec App Router
2. Page d'accueil listant les articles
3. Page dynamique `/blog/[slug]`
4. API route pour les articles

<details>
<summary>Structure suggérée</summary>

```
src/app/
├── layout.tsx
├── page.tsx         # Liste des articles
├── blog/
│   └── [slug]/
│       └── page.tsx # Article détail
└── api/
    └── posts/
        └── route.ts
```
</details>

---

## Quiz de vérification

1. Quel fichier définit une route `/about` ?
   - A) `routes/about.tsx`
   - B) `app/about/page.tsx` ✅
   - C) `pages/about.tsx`

2. Comment rendre un composant interactif ?
   - A) `'use server'`
   - B) `'use client'` ✅
   - C) `export const dynamic`

3. Où faire un fetch avec accès DB ?
   - A) Client Component
   - B) Server Component ✅
   - C) Les deux

---

## Pour aller plus loin

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Templates](https://vercel.com/templates)

---

## Prochaine étape

Retournez aux [projets](../../projets/consignes.md) pour appliquer ces connaissances !
