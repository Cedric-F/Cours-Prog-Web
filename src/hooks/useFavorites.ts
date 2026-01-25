'use client';

import { useState, useEffect } from 'react';

interface Favorite {
  path: string;
  title: string;
  addedAt: number;
}

const STORAGE_KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveFavorites = (newFavorites: Favorite[]) => {
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    }
  };

  // Add a favorite
  const addFavorite = (path: string, title: string) => {
    if (!favorites.some(f => f.path === path)) {
      saveFavorites([...favorites, { path, title, addedAt: Date.now() }]);
    }
  };

  // Remove a favorite
  const removeFavorite = (path: string) => {
    saveFavorites(favorites.filter(f => f.path !== path));
  };

  // Toggle favorite
  const toggleFavorite = (path: string, title: string) => {
    if (isFavorite(path)) {
      removeFavorite(path);
    } else {
      addFavorite(path, title);
    }
  };

  // Check if path is favorite
  const isFavorite = (path: string) => {
    return favorites.some(f => f.path === path);
  };

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
