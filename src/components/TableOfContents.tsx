'use client';

import { useState, useEffect, useRef } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Create ID from text (same logic as react-markdown)
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Only include h2 and h3 (level 2 and 3)
      if (level >= 2 && level <= 3) {
        items.push({ id, text, level });
      }
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const scrollContainer = document.querySelector('.markdown-content');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const headings = document.querySelectorAll('h2[id], h3[id]');
      const scrollTop = scrollContainer.scrollTop;
      
      let currentActiveId = '';
      
      // Find the heading that's currently at the top of the viewport
      for (const heading of Array.from(headings)) {
        const rect = heading.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // Check if heading is visible and near the top of container
        if (rect.top >= containerRect.top && rect.top <= containerRect.top + 150) {
          currentActiveId = heading.id;
          break;
        }
        
        // If we've scrolled past this heading, keep it as candidate
        if (rect.top < containerRect.top + 150) {
          currentActiveId = heading.id;
        }
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    // Initial call
    handleScroll();
    
    // Listen to scroll events
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Find the scrollable container (the content div with overflow-y-auto)
      const scrollContainer = document.querySelector('.markdown-content');
      
      if (scrollContainer) {
        const offset = 20; // Small offset from top
        const elementTop = element.offsetTop;
        
        scrollContainer.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      } else {
        // Fallback to window scroll if container not found
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      // Update URL without page reload
      window.history.pushState({}, '', `#${id}`);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-screen overflow-y-auto sticky top-0 hidden xl:block">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
          Sur cette page
        </h3>
        <nav>
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    activeId === item.id
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
