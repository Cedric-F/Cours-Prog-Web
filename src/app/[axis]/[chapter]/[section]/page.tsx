'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContentDisplay from '@/components/ContentDisplay';
import NavigationArrows from '@/components/NavigationArrows';
import TableOfContents from '@/components/TableOfContents';
import ExportPDFButton from '@/components/ExportPDFButton';
import { findNavigationItem, getAdjacentSections, markSectionAsRead } from '@/utils/navigation';
import { NavigationItem } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';

export default function SectionPage() {
  const params = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<NavigationItem | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [adjacentSections, setAdjacentSections] = useState<{ prev: NavigationItem | null; next: NavigationItem | null }>({ prev: null, next: null });
  const { toggleFavorite, isFavorite, isLoaded: favoritesLoaded } = useFavorites();

  // Current path for favorites
  const currentPath = currentItem 
    ? `/${currentItem.axisId}/${currentItem.chapterId}/${currentItem.sectionId}`
    : '';
  const currentTitle = currentItem?.sectionName || '';

  useEffect(() => {
    const axisId = params.axis as string;
    const chapterId = params.chapter as string;
    const sectionId = params.section as string;

    const item = findNavigationItem(axisId, chapterId, sectionId);
    
    if (!item) {
      setError('Section introuvable');
      setLoading(false);
      return;
    }

    setCurrentItem(item);
    setShowNavigation(false);
    
    // Get adjacent sections
    const adjacent = getAdjacentSections(item);
    setAdjacentSections(adjacent);

    // Load markdown content
    fetch(`/content/${item.file}`)
      .then(res => {
        if (!res.ok) throw new Error('Fichier introuvable');
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError(`Erreur de chargement: ${err.message}`);
        setLoading(false);
      });
  }, [params]);

  const handleScrollToBottom = () => {
    if (currentItem) {
      markSectionAsRead(currentItem.axisId, currentItem.chapterId, currentItem.sectionId);
      setShowNavigation(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Erreur</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="relative h-full bg-gray-50 dark:bg-gray-900 flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">{currentItem.axisName}</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900 dark:text-white">{currentItem.chapterName}</span>
              <span className="mx-2">/</span>
              <span className="text-blue-600 dark:text-blue-400">{currentItem.sectionName}</span>
            </div>
            {/* Favorite button */}
            <div className="flex items-center gap-2">
              <ExportPDFButton title={`${currentItem.sectionName} - ProgWeb`} />
              {favoritesLoaded && (
              <button
                onClick={() => toggleFavorite(currentPath, currentTitle)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isFavorite(currentPath) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isFavorite(currentPath) ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400 hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-4rem)] overflow-hidden">
          <ContentDisplay 
            content={content} 
            currentItem={currentItem}
            onScrollToBottom={handleScrollToBottom}
          />
        </div>

        {/* Navigation Arrows */}
        <NavigationArrows 
          prev={adjacentSections.prev}
          next={adjacentSections.next}
          visible={showNavigation}
        />
      </div>

      {/* Table of Contents */}
      <TableOfContents content={content} />
    </div>
  );
}
