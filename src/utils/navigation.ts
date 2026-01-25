import structureData from '@/data/structure.json';
import { LearningStructure, NavigationItem } from '@/types';

export const structure: LearningStructure = structureData as LearningStructure;

export function getAllNavigationItems(): NavigationItem[] {
  const items: NavigationItem[] = [];
  
  structure.axes.forEach(axis => {
    axis.chapters.forEach(chapter => {
      chapter.sections.forEach(section => {
        // If section has subsections, add each subsection
        if (section.subsections && section.subsections.length > 0) {
          section.subsections.forEach(subsection => {
            items.push({
              axisId: axis.id,
              chapterId: chapter.id,
              sectionId: section.id,
              subsectionId: subsection.id,
              axisName: axis.name,
              chapterName: chapter.name,
              sectionName: section.name,
              subsectionName: subsection.name,
              file: subsection.file
            });
          });
        } else {
          // Section without subsections (legacy format)
          items.push({
            axisId: axis.id,
            chapterId: chapter.id,
            sectionId: section.id,
            axisName: axis.name,
            chapterName: chapter.name,
            sectionName: section.name,
            file: section.file!
          });
        }
      });
    });
  });
  
  return items;
}

export function findNavigationItem(axisId: string, chapterId: string, sectionId: string, subsectionId?: string): NavigationItem | null {
  const items = getAllNavigationItems();
  return items.find(
    item => item.axisId === axisId && 
            item.chapterId === chapterId && 
            item.sectionId === sectionId &&
            (subsectionId ? item.subsectionId === subsectionId : !item.subsectionId)
  ) || null;
}

export function getAdjacentSections(currentItem: NavigationItem): { prev: NavigationItem | null; next: NavigationItem | null } {
  const items = getAllNavigationItems();
  const currentIndex = items.findIndex(
    item => item.axisId === currentItem.axisId && 
            item.chapterId === currentItem.chapterId && 
            item.sectionId === currentItem.sectionId &&
            item.subsectionId === currentItem.subsectionId
  );
  
  return {
    prev: currentIndex > 0 ? items[currentIndex - 1] : null,
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null
  };
}

export function markSectionAsRead(axisId: string, chapterId: string, sectionId: string, subsectionId?: string): void {
  if (typeof window === 'undefined') return;
  
  const key = subsectionId 
    ? `read_${axisId}_${chapterId}_${sectionId}_${subsectionId}`
    : `read_${axisId}_${chapterId}_${sectionId}`;
  localStorage.setItem(key, 'true');
}

export function isSectionRead(axisId: string, chapterId: string, sectionId: string, subsectionId?: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = subsectionId 
    ? `read_${axisId}_${chapterId}_${sectionId}_${subsectionId}`
    : `read_${axisId}_${chapterId}_${sectionId}`;
  return localStorage.getItem(key) === 'true';
}

export function getProgressPercentage(): number {
  if (typeof window === 'undefined') return 0;
  
  const items = getAllNavigationItems();
  const readCount = items.filter(item => 
    isSectionRead(item.axisId, item.chapterId, item.sectionId, item.subsectionId)
  ).length;
  
  return items.length > 0 ? Math.round((readCount / items.length) * 100) : 0;
}
