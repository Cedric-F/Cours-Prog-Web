'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContentDisplay from '@/components/ContentDisplay';
import NavigationArrows from '@/components/NavigationArrows';
import TableOfContents from '@/components/TableOfContents';
import { findNavigationItem, getAdjacentSections, markSectionAsRead } from '@/utils/navigation';
import { NavigationItem } from '@/types';

export default function SubsectionPage() {
  const params = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<NavigationItem | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [adjacentSections, setAdjacentSections] = useState<{ prev: NavigationItem | null; next: NavigationItem | null }>({ prev: null, next: null });

  useEffect(() => {
    const axisId = params.axis as string;
    const chapterId = params.chapter as string;
    const sectionId = params.section as string;
    const subsectionId = params.subsection as string;

    const item = findNavigationItem(axisId, chapterId, sectionId, subsectionId);
    
    if (!item) {
      setError('Sous-section introuvable');
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
        setError(err.message);
        setLoading(false);
      });
  }, [params]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    
    if (isAtBottom && currentItem && !showNavigation) {
      setShowNavigation(true);
      markSectionAsRead(currentItem.axisId, currentItem.chapterId, currentItem.sectionId, currentItem.subsectionId);
      
      // Trigger storage event manually for same-tab updates
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleScrollToBottom = () => {
    if (currentItem) {
      markSectionAsRead(currentItem.axisId, currentItem.chapterId, currentItem.sectionId, currentItem.subsectionId);
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
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{currentItem.axisName}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900 dark:text-white">{currentItem.chapterName}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{currentItem.sectionName}</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 dark:text-blue-400">{currentItem.subsectionName}</span>
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
