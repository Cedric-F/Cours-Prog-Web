'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Dynamic import to avoid SSR issues with Monaco
const CodePlayground = dynamic(() => import('./CodePlayground'), { ssr: false });

interface CodeBlockProps {
  language: string;
  children: string;
}

// Languages that support the playground
const PLAYGROUND_LANGUAGES = ['javascript', 'js', 'typescript', 'ts', 'html', 'css'];

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);

  const canPlay = PLAYGROUND_LANGUAGES.includes(language.toLowerCase());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="relative group">
        {/* Action buttons */}
        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {canPlay && (
            <button
              onClick={() => setShowPlayground(true)}
              className="p-2 rounded-lg bg-green-600/90 hover:bg-green-500 
                       text-white transition-all
                       focus:outline-none focus:ring-2 focus:ring-green-400"
              title="Essayer ce code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-gray-700/80 hover:bg-gray-600 
                     text-gray-300 hover:text-white transition-all
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={copied ? 'Copié !' : 'Copier le code'}
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>

        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>

      {/* Playground modal */}
      {showPlayground && (
        <CodePlayground
          initialCode={children}
          language={language.toLowerCase()}
          onClose={() => setShowPlayground(false)}
        />
      )}
    </>
  );
}
