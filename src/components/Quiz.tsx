'use client';

import { useState, useMemo } from 'react';

interface QuizQuestion {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Quiz({ questions }: QuizProps) {
  // Shuffle questions and options on mount
  const shuffledQuestions = useMemo(() => {
    return shuffleArray(questions).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, [questions]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(shuffledQuestions.length).fill(null)
  );
  const [showResults, setShowResults] = useState<boolean[]>(
    new Array(shuffledQuestions.length).fill(false)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResults[currentQuestion]) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleValidate = () => {
    if (selectedAnswers[currentQuestion] === null) return;
    
    const newShowResults = [...showResults];
    newShowResults[currentQuestion] = true;
    setShowResults(newShowResults);
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(shuffledQuestions.length).fill(null));
    setShowResults(new Array(shuffledQuestions.length).fill(false));
    setQuizCompleted(false);
  };

  const getScore = () => {
    return shuffledQuestions.reduce((score, q, index) => {
      const selected = selectedAnswers[index];
      if (selected !== null && q.options[selected]?.isCorrect) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const question = shuffledQuestions[currentQuestion];
  const isAnswered = showResults[currentQuestion];
  const selectedIndex = selectedAnswers[currentQuestion];

  if (quizCompleted) {
    const score = getScore();
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    
    return (
      <div className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-5xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz terminé !
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Score : <span className="font-bold text-blue-600 dark:text-blue-400">{score}/{shuffledQuestions.length}</span> ({percentage}%)
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Recommencer
            </button>
            <button
              onClick={() => setQuizCompleted(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
            >
              Revoir les réponses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="font-semibold text-gray-900 dark:text-white">Quiz</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentQuestion + 1}/{shuffledQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {question.question}
      </h4>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = option.isCorrect;
          
          let optionClass = 'border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500';
          
          if (isAnswered) {
            if (isCorrect) {
              optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
            } else if (isSelected && !isCorrect) {
              optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            }
          } else if (isSelected) {
            optionClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${optionClass} ${
                isAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isAnswered && isCorrect 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : isAnswered && isSelected && !isCorrect
                    ? 'border-red-500 bg-red-500 text-white'
                    : isSelected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isAnswered && isCorrect && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && question.explanation && (
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          ← Précédent
        </button>

        <div className="flex gap-2">
          {!isAnswered ? (
            <button
              onClick={handleValidate}
              disabled={selectedIndex === null}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedIndex === null
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {currentQuestion === shuffledQuestions.length - 1 ? 'Voir le score' : 'Suivant →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Parser for quiz markdown syntax
export function parseQuizFromMarkdown(content: string): { 
  contentParts: string[]; 
  quizzes: QuizQuestion[][] 
} {
  // Normalize line endings to LF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  
  // Support both :::quiz and ::: quiz variations
  const quizRegex = /:::\s*quiz\s*\n([\s\S]*?):::/g;
  const quizzes: QuizQuestion[][] = [];
  const contentParts: string[] = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = quizRegex.exec(normalizedContent)) !== null) {
    // Add content before this quiz
    contentParts.push(normalizedContent.slice(lastIndex, match.index));
    
    // Parse quiz content
    const questions = parseQuizContent(match[1]);
    if (questions.length > 0) {
      quizzes.push(questions);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining content after last quiz
  contentParts.push(normalizedContent.slice(lastIndex));

  return { contentParts, quizzes };
}

function parseQuizContent(content: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const questionBlocks = content.split(/\nQ:\s*/).filter(Boolean);

  for (const block of questionBlocks) {
    const lines = block.trim().split('\n');
    const questionText = lines[0]?.trim();
    
    if (!questionText) continue;

    const options: { text: string; isCorrect: boolean }[] = [];
    let explanation = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse options: - [x] correct or - [ ] incorrect
      const optionMatch = line.match(/^-\s*\[(x| )\]\s*(.+)$/i);
      if (optionMatch) {
        options.push({
          isCorrect: optionMatch[1].toLowerCase() === 'x',
          text: optionMatch[2].trim()
        });
        continue;
      }

      // Parse explanation: > text
      if (line.startsWith('>')) {
        explanation = line.slice(1).trim();
      }
    }

    if (options.length > 0) {
      questions.push({
        question: questionText,
        options,
        explanation: explanation || undefined
      });
    }
  }

  return questions;
}
