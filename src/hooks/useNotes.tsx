'use client';

import { useState, useEffect, useCallback } from 'react';

const NOTES_KEY = 'progweb_notes';

interface Notes {
  [sectionPath: string]: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Notes>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [notes, isLoaded]);

  const getNote = useCallback((sectionPath: string): string => {
    return notes[sectionPath] || '';
  }, [notes]);

  const setNote = useCallback((sectionPath: string, content: string) => {
    setNotes(prev => ({
      ...prev,
      [sectionPath]: content
    }));
  }, []);

  const deleteNote = useCallback((sectionPath: string) => {
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[sectionPath];
      return newNotes;
    });
  }, []);

  const hasNote = useCallback((sectionPath: string): boolean => {
    return !!notes[sectionPath] && notes[sectionPath].trim().length > 0;
  }, [notes]);

  const getAllNotes = useCallback((): Notes => {
    return notes;
  }, [notes]);

  const getNotesCount = useCallback((): number => {
    return Object.values(notes).filter(note => note.trim().length > 0).length;
  }, [notes]);

  return {
    getNote,
    setNote,
    deleteNote,
    hasNote,
    getAllNotes,
    getNotesCount,
    isLoaded
  };
}
