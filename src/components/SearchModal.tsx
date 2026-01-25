'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  axisId: string;
  chapterId: string;
  sectionId: string;
  subsectionId?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].path);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [results, selectedIndex, router, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">{part}</mark> : part
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher dans les contenus..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          {isLoading && (
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
            Échap
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tapez au moins 2 caractères pour rechercher</p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucun résultat pour "{query}"</p>
            </div>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li key={result.path}>
                  <button
                    onClick={() => {
                      router.push(result.path);
                      onClose();
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {highlightMatch(result.title, query)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {highlightMatch(result.excerpt, query)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {result.path}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
              <span>naviguer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
              <span>ouvrir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
