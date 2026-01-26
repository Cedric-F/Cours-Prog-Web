'use client';

import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';

interface PersonalNotesProps {
  sectionPath: string;
}

export default function PersonalNotes({ sectionPath }: PersonalNotesProps) {
  const { getNote, setNote, deleteNote, hasNote, isLoaded } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Load note when section changes
  useEffect(() => {
    if (isLoaded) {
      const existingNote = getNote(sectionPath);
      setNoteContent(existingNote);
      setIsSaved(true);
      // Auto-open if there's an existing note
      if (existingNote) {
        setIsOpen(true);
      }
    }
  }, [sectionPath, isLoaded, getNote]);

  const handleSave = () => {
    if (noteContent.trim()) {
      setNote(sectionPath, noteContent);
    } else {
      deleteNote(sectionPath);
    }
    setIsSaved(true);
  };

  const handleChange = (value: string) => {
    setNoteContent(value);
    setIsSaved(false);
  };

  const handleDelete = () => {
    if (confirm('Supprimer cette note ?')) {
      deleteNote(sectionPath);
      setNoteContent('');
      setIsSaved(true);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Notes personnelles</span>
        {hasNote(sectionPath) && (
          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            Note
          </span>
        )}
        {!isSaved && (
          <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
            Non sauvegardé
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <textarea
            value={noteContent}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Écrivez vos notes ici... (Markdown supporté)"
            className="w-full h-32 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-y"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isSaved 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </span>
            </button>
            {hasNote(sectionPath) && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </span>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Vos notes sont sauvegardées localement dans votre navigateur.
          </p>
        </div>
      )}
    </div>
  );
}
