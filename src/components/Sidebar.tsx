'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { structure } from '@/utils/navigation';
import { isSectionRead, getProgressPercentage } from '@/utils/navigation';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import InstallButton from './InstallButton';

export default function Sidebar() {
  const pathname = usePathname();
  const [openAxes, setOpenAxes] = useState<Record<string, boolean>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Update progress on mount and when pathname changes
    setProgress(getProgressPercentage());
  }, [pathname]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleAxis = (axisId: string) => {
    setOpenAxes(prev => ({ ...prev, [axisId]: !prev[axisId] }));
  };

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const isCurrentPath = (axisId: string, chapterId: string, sectionId: string, subsectionId?: string) => {
    if (subsectionId) {
      return pathname === `/${axisId}/${chapterId}/${sectionId}/${subsectionId}`;
    }
    return pathname === `/${axisId}/${chapterId}/${sectionId}`;
  };

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prog Web</h1>
            </Link>
            <ThemeToggle />
          </div>
          
          {/* Search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="mt-4 w-full flex items-center gap-3 px-3 py-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Rechercher...</span>
            <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">⌘K</kbd>
          </button>
          
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progression</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {structure.axes.map(axis => (
          <div key={axis.id} className="mb-2">
            {/* Axis Level */}
            <button
              onClick={() => toggleAxis(axis.id)}
              className="w-full flex items-center justify-between p-3 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>{axis.name}</span>
              <svg
                className={`w-5 h-5 transition-transform ${openAxes[axis.id] ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Chapters Level */}
            {openAxes[axis.id] && (
              <div className="ml-4 mt-1">
                {axis.chapters.map(chapter => (
                  <div key={chapter.id} className="mb-1">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="font-medium">{chapter.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${openChapters[chapter.id] ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Sections Level */}
                    {openChapters[chapter.id] && (
                      <div className="ml-4 mt-1">
                        {chapter.sections.map(section => {
                          // Section has subsections
                          if (section.subsections && section.subsections.length > 0) {
                            return (
                              <div key={section.id} className="mb-1">
                                <button
                                  onClick={() => toggleSection(section.id)}
                                  className="w-full flex items-center justify-between p-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <span className="text-sm font-medium">{section.name}</span>
                                  <svg
                                    className={`w-4 h-4 transition-transform ${openSections[section.id] ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>

                                {/* Subsections Level */}
                                {openSections[section.id] && (
                                  <div className="ml-4 mt-1">
                                    {section.subsections.map(subsection => {
                                      const isRead = isSectionRead(axis.id, chapter.id, section.id, subsection.id);
                                      const isCurrent = isCurrentPath(axis.id, chapter.id, section.id, subsection.id);

                                      return (
                                        <Link
                                          key={subsection.id}
                                          href={`/${axis.id}/${chapter.id}/${section.id}/${subsection.id}`}
                                          className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
                                            isCurrent
                                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-medium'
                                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                          }`}
                                        >
                                          {isRead && (
                                            <svg
                                              className="w-4 h-4 text-green-600 flex-shrink-0"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          )}
                                          <span className="flex-1">{subsection.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            // Section without subsections (legacy format)
                            const isRead = isSectionRead(axis.id, chapter.id, section.id);
                            const isCurrent = isCurrentPath(axis.id, chapter.id, section.id);

                            return (
                              <Link
                                key={section.id}
                                href={`/${axis.id}/${chapter.id}/${section.id}`}
                                className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
                                  isCurrent
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                {isRead && (
                                  <svg
                                    className="w-4 h-4 text-green-600 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                <span className="flex-1">{section.name}</span>
                              </Link>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Install Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <InstallButton />
      </div>
      </aside>
    </>
  );
}
