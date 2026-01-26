'use client';

import Link from 'next/link';
import { NavigationItem } from '@/types';

interface NavigationArrowsProps {
  prev: NavigationItem | null;
  next: NavigationItem | null;
  visible: boolean;
}

export default function NavigationArrows({ prev, next, visible }: NavigationArrowsProps) {
  if (!visible) return null;

  const getUrl = (item: NavigationItem) => {
    if (item.subsectionId) {
      return `/${item.axisId}/${item.chapterId}/${item.sectionId}/${item.subsectionId}`;
    }
    return `/${item.axisId}/${item.chapterId}/${item.sectionId}`;
  };

  const getDisplayName = (item: NavigationItem) => {
    return item.subsectionName || item.sectionName;
  };

  return (
    <div className="fixed bottom-8 left-0 md:left-80 right-0 flex justify-center gap-2 md:gap-4 px-4 md:px-8 pointer-events-none z-30">
      <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-lg p-2 md:p-4 flex gap-2 md:gap-4 pointer-events-auto border border-gray-200 dark:border-gray-700 max-w-full">
        {prev ? (
          <Link
            href={getUrl(prev)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-gray-500 dark:text-gray-400">Précédent</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white max-w-[120px] truncate">{getDisplayName(prev)}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg opacity-50 cursor-not-allowed">
            <div className="text-sm text-gray-400 dark:text-gray-500">Aucune section précédente</div>
          </div>
        )}

        {next ? (
          <Link
            href={getUrl(next)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs opacity-90">Suivant</div>
              <div className="text-sm font-medium max-w-[120px] truncate">{getDisplayName(next)}</div>
            </div>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className="hidden sm:block px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg opacity-50 cursor-not-allowed">
            <div className="text-sm text-gray-400 dark:text-gray-500">Aucune section suivante</div>
          </div>
        )}
      </div>
    </div>
  );
}
