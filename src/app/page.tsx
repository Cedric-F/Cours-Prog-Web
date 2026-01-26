'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllNavigationItems, isSectionRead, getProgressPercentage } from '@/utils/navigation';
import structure from '@/data/structure.json';
import { useFavorites } from '@/hooks/useFavorites';

// Couleurs par axe - c'est un peu répétitif mais plus lisible que des computed styles
const axisColors: Record<string, { bg: string; border: string; text: string; darkBg: string; darkBorder: string; darkText: string }> = {
  'les-bases': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkBorder: 'dark:border-blue-700', darkText: 'dark:text-blue-300' },
  'frontend-avance': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkBorder: 'dark:border-purple-700', darkText: 'dark:text-purple-300' },
  'backend': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', darkBg: 'dark:bg-green-900/30', darkBorder: 'dark:border-green-700', darkText: 'dark:text-green-300' },
  'devops': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', darkBg: 'dark:bg-orange-900/30', darkBorder: 'dark:border-orange-700', darkText: 'dark:text-orange-300' },
};

interface SectionInfo {
  axisId: string;
  chapterId: string;
  sectionId: string;
  subsectionId?: string;
}

// Compter les sections par axe
function countSectionsByAxis() {
  const counts: Record<string, { total: number; sections: SectionInfo[] }> = {};
  
  structure.axes.forEach((axis: any) => {
    const sections: SectionInfo[] = [];
    
    axis.chapters.forEach((chapter: any) => {
      chapter.sections.forEach((section: any) => {
        if (section.subsections) {
          section.subsections.forEach((sub: any) => {
            sections.push({
              axisId: axis.id,
              chapterId: chapter.id,
              sectionId: section.id,
              subsectionId: sub.id
            });
          });
        } else {
          sections.push({
            axisId: axis.id,
            chapterId: chapter.id,
            sectionId: section.id
          });
        }
      });
    });
    
    counts[axis.id] = { total: sections.length, sections };
  });
  
  return counts;
}

export default function HomePage() {
  const items = getAllNavigationItems();
  const firstItem = items[0];
  const [isLoaded, setIsLoaded] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [axisProgressMap, setAxisProgressMap] = useState<Record<string, { completed: number; total: number; percentage: number }>>({});
  const [nextSection, setNextSection] = useState<typeof items[0] | null>(null);
  const [nextSectionByAxis, setNextSectionByAxis] = useState<Record<string, typeof items[0] | null>>({});
  const { favorites, isLoaded: favoritesLoaded, removeFavorite } = useFavorites();
  
  const axisCounts = countSectionsByAxis();
  const totalSections = Object.values(axisCounts).reduce((sum, a) => sum + a.total, 0);

  // Calculer la progression au chargement (côté client uniquement)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Progression globale
    setGlobalProgress(getProgressPercentage());
    
    // Progression par axe
    const progressMap: Record<string, { completed: number; total: number; percentage: number }> = {};
    
    Object.entries(axisCounts).forEach(([axisId, data]) => {
      const completed = data.sections.filter(s => 
        isSectionRead(s.axisId, s.chapterId, s.sectionId, s.subsectionId)
      ).length;
      
      progressMap[axisId] = {
        completed,
        total: data.total,
        percentage: data.total > 0 ? Math.round((completed / data.total) * 100) : 0
      };
    });
    
    setAxisProgressMap(progressMap);
    
    // Trouver la première section non lue (globale)
    let foundUnread = null;
    for (const item of items) {
      if (!isSectionRead(item.axisId, item.chapterId, item.sectionId, item.subsectionId)) {
        foundUnread = item;
        break;
      }
    }
    setNextSection(foundUnread || items[0]);
    
    // Trouver la première section non lue par axe
    const nextByAxis: Record<string, typeof items[0] | null> = {};
    structure.axes.forEach((axis: any) => {
      const axisItems = items.filter(item => item.axisId === axis.id);
      let found = null;
      for (const item of axisItems) {
        if (!isSectionRead(item.axisId, item.chapterId, item.sectionId, item.subsectionId)) {
          found = item;
          break;
        }
      }
      nextByAxis[axis.id] = found || axisItems[0] || null;
    });
    setNextSectionByAxis(nextByAxis);
    
    setIsLoaded(true);
  }, []);

  // Obtenir la progression d'un axe
  const getAxisProgress = (axisId: string) => {
    return axisProgressMap[axisId] || { completed: 0, total: 0, percentage: 0 };
  };

  // Compter le nombre total de sections lues
  const getTotalCompleted = () => {
    return Object.values(axisProgressMap).reduce((sum, a) => sum + a.completed, 0);
  };

  const allCompleted = isLoaded && getTotalCompleted() === totalSections;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              Prog Web
            </h1>
            <p className="text-base md:text-lg text-blue-100 mb-4 max-w-xl mx-auto">
              Votre parcours pour maîtriser le développement web moderne
            </p>
            
            {/* Barre de progression globale */}
            {isLoaded && (
              <div className="max-w-sm mx-auto mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span className="font-semibold">{getTotalCompleted()}/{totalSections} sections ({globalProgress}%)</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${globalProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {isLoaded && (
                <button
                  onClick={() => {
                    // Recalculer la prochaine section non lue au moment du clic
                    let target = null;
                    for (const item of items) {
                      if (!isSectionRead(item.axisId, item.chapterId, item.sectionId, item.subsectionId)) {
                        target = item;
                        break;
                      }
                    }
                    if (!target) target = items[0];
                    
                    const href = target.subsectionId
                      ? `/${target.axisId}/${target.chapterId}/${target.sectionId}/${target.subsectionId}`
                      : `/${target.axisId}/${target.chapterId}/${target.sectionId}`;
                    
                    window.location.href = href;
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {allCompleted ? 'Revoir le cours →' : globalProgress > 0 ? 'Continuer →' : 'Commencer →'}
                </button>
              )}
            </div>
            {isLoaded && nextSection && globalProgress > 0 && !allCompleted && (
              <p className="text-blue-100 text-xs mt-2">
                En cours : {nextSection.subsectionName || nextSection.sectionName}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Section - Above axis cards */}
      {favoritesLoaded && favorites.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-6 pb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Favoris
          </h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <div 
                key={fav.path}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all text-sm group"
              >
                <Link
                  href={fav.path}
                  className="text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {fav.title}
                </Link>
                <button
                  onClick={() => removeFavorite(fav.path)}
                  className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
                  title="Retirer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid des axes avec détails */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Explorer les contenus
          </h2>
          <Link
            href="/glossaire"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 
                     hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                     rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Glossaire
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {structure.axes.map((axis: any) => {
            const axisProgress = getAxisProgress(axis.id);
            const colors = axisColors[axis.id] || axisColors['les-bases'];
            
            // Premier chapitre/section de l'axe
            const firstChapter = axis.chapters[0];
            const firstSection = firstChapter?.sections[0];
            const firstLink = firstSection?.subsections?.[0]
              ? `/${axis.id}/${firstChapter.id}/${firstSection.id}/${firstSection.subsections[0].id}`
              : `/${axis.id}/${firstChapter?.id}/${firstSection?.id}`;
            
            return (
              <div 
                key={axis.id} 
                className={`p-4 rounded-lg bg-white dark:bg-gray-800 border ${colors.border} ${colors.darkBorder} hover:shadow-md dark:hover:shadow-gray-900/50 transition-all group`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {axis.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                      {axis.chapters.length} chapitres • {axisCounts[axis.id]?.total || 0} sections
                    </p>
                    
                    {/* Progression */}
                    <div className="mb-2">
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            axisProgress.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${axisProgress.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{axisProgress.percentage}%</span>
                    </div>
                    
                    {/* Liste des chapitres */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {axis.chapters.slice(0, 3).map((chapter: any) => (
                        <span key={chapter.id} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          {chapter.name}
                        </span>
                      ))}
                      {axis.chapters.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          +{axis.chapters.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const axisItems = items.filter(item => item.axisId === axis.id);
                          let target = null;
                          for (const item of axisItems) {
                            if (!isSectionRead(item.axisId, item.chapterId, item.sectionId, item.subsectionId)) {
                              target = item;
                              break;
                            }
                          }
                          if (!target) target = axisItems[0];
                          
                          const href = target.subsectionId
                            ? `/${target.axisId}/${target.chapterId}/${target.sectionId}/${target.subsectionId}`
                            : `/${target.axisId}/${target.chapterId}/${target.sectionId}`;
                          
                          window.location.href = href;
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${colors.bg} ${colors.darkBg} ${colors.text} ${colors.darkText} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {axisProgress.completed > 0 ? 'Continuer' : 'Commencer'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {isLoaded && nextSectionByAxis[axis.id] && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate flex-1">
                          {nextSectionByAxis[axis.id]?.sectionName || nextSectionByAxis[axis.id]?.subsectionName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-500 dark:text-gray-400">
          <p>Prog Web</p>
        </div>
      </footer>
    </div>
  );
}
