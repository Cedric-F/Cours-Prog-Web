'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { structure } from '@/utils/navigation';
import { isSectionRead, getProgressPercentage } from '@/utils/navigation';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import InstallButton from './InstallButton';
import { useSidebar } from '@/hooks/useSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [openAxes, setOpenAxes] = useState<Record<string, boolean>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Update progress on mount and when pathname changes
    setProgress(getProgressPercentage());
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    close();
  }, [pathname]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  // TODO: voir si on ajoute des raccourcis pour naviguer avec les flèches ?
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
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={close}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        h-screen overflow-y-auto flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="block" onClick={close}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prog Web</h1>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Close button on mobile */}
              <button
                onClick={close}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fermer le menu"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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

          {/* Glossary link */}
          <Link
            href="/glossaire"
            className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Glossaire</span>
          </Link>
          
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
