'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import glossaryData from '@/data/glossary.json';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export default function GlossairePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(glossaryData.terms.map((t: GlossaryTerm) => t.category));
    return ['Tous', ...Array.from(cats).sort()];
  }, []);

  // Filter and sort terms
  const filteredTerms = useMemo(() => {
    return glossaryData.terms
      .filter((term: GlossaryTerm) => {
        const matchesSearch = 
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tous' || term.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: GlossaryTerm[] } = {};
    filteredTerms.forEach((term: GlossaryTerm) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📖 Glossaire
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {glossaryData.terms.length} termes techniques du développement web
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[120px] z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un terme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Alphabet navigation */}
          <div className="flex flex-wrap gap-1 mt-4">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center text-sm font-medium
                         rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                         hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Terms list */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun terme trouvé pour "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {letters.map(letter => (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {letter}
                </h2>
                <div className="grid gap-4">
                  {groupedTerms[letter].map((term: GlossaryTerm) => (
                    <div 
                      key={term.term}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                               hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {term.term}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {term.definition}
                          </p>
                        </div>
                        <span className="shrink-0 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 
                                       text-gray-600 dark:text-gray-400 rounded">
                          {term.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
