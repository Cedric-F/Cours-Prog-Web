'use client';

import { useState, useEffect } from 'react';

interface ProgressData {
  completedSections: string[];
  lastVisited: {
    path: string;
    title: string;
    timestamp: number;
  } | null;
  recentSections: Array<{
    path: string;
    title: string;
    timestamp: number;
  }>;
}

const STORAGE_KEY = 'learning-progress';
const MAX_RECENT = 5;

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({
    completedSections: [],
    lastVisited: null,
    recentSections: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing progress:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveProgress = (newProgress: ProgressData) => {
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }
  };

  // Marquer une section comme complétée
  const markComplete = (sectionPath: string) => {
    if (!progress.completedSections.includes(sectionPath)) {
      saveProgress({
        ...progress,
        completedSections: [...progress.completedSections, sectionPath],
      });
    }
  };

  // Marquer comme non complétée
  const markIncomplete = (sectionPath: string) => {
    saveProgress({
      ...progress,
      completedSections: progress.completedSections.filter(p => p !== sectionPath),
    });
  };

  // Toggle completion
  const toggleComplete = (sectionPath: string) => {
    if (progress.completedSections.includes(sectionPath)) {
      markIncomplete(sectionPath);
    } else {
      markComplete(sectionPath);
    }
  };

  // Enregistrer une visite
  const recordVisit = (path: string, title: string) => {
    const visit = { path, title, timestamp: Date.now() };
    
    // Filtrer les doublons et limiter
    const filtered = progress.recentSections
      .filter(s => s.path !== path)
      .slice(0, MAX_RECENT - 1);

    saveProgress({
      ...progress,
      lastVisited: visit,
      recentSections: [visit, ...filtered],
    });
  };

  // Vérifier si une section est complétée
  const isComplete = (sectionPath: string) => {
    return progress.completedSections.includes(sectionPath);
  };

  // Statistiques
  const getStats = (totalSections: number) => {
    const completed = progress.completedSections.length;
    const percentage = totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0;
    return { completed, total: totalSections, percentage };
  };

  return {
    progress,
    isLoaded,
    markComplete,
    markIncomplete,
    toggleComplete,
    recordVisit,
    isComplete,
    getStats,
  };
}
