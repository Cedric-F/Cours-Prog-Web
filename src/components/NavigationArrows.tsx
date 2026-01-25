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
    <div className="fixed bottom-8 left-80 right-0 flex justify-center gap-4 px-8 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-lg p-4 flex gap-4 pointer-events-auto border border-gray-200 dark:border-gray-700">
        {prev ? (
          <Link
            href={getUrl(prev)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-400">Précédent</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName(prev)}</div>
            </div>
          </Link>
        ) : (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg opacity-50 cursor-not-allowed">
            <div className="text-sm text-gray-400 dark:text-gray-500">Aucune section précédente</div>
          </div>
        )}

        {next ? (
          <Link
            href={getUrl(next)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs opacity-90">Suivant</div>
              <div className="text-sm font-medium">{getDisplayName(next)}</div>
            </div>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg opacity-50 cursor-not-allowed">
            <div className="text-sm text-gray-400 dark:text-gray-500">Aucune section suivante</div>
          </div>
        )}
      </div>
    </div>
  );
}
