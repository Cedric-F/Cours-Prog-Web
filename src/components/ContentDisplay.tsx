'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { NavigationItem } from '@/types';
import PersonalNotes from './PersonalNotes';

interface ContentDisplayProps {
  content: string;
  currentItem: NavigationItem;
  onScrollToBottom: () => void;
}

// Calculate reading time based on word count (average 180 words/min for technical content)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 180;
  const text = content.replace(/```[\s\S]*?```/g, ''); // Remove code blocks
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default function ContentDisplay({ content, currentItem, onScrollToBottom }: ContentDisplayProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate reading time
  const readingTime = useMemo(() => calculateReadingTime(content), [content]);

  // Current section path for notes
  const sectionPath = `${currentItem.axisId}/${currentItem.chapterId}/${currentItem.sectionId}`;

  // Generate ID from heading text
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    setHasScrolledToBottom(false);

    if (!contentRef.current) return;

    // Create a sentinel element at the bottom
    const sentinel = document.createElement('div');
    sentinel.id = 'bottom-sentinel';
    contentRef.current.appendChild(sentinel);

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrolledToBottom) {
            setHasScrolledToBottom(true);
            onScrollToBottom();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      const existingSentinel = document.getElementById('bottom-sentinel');
      if (existingSentinel) {
        existingSentinel.remove();
      }
    };
  }, [content, currentItem, hasScrolledToBottom, onScrollToBottom]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none markdown-content p-8 overflow-y-auto h-full"
    >
      {/* Reading time indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 not-prose">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{readingTime} min de lecture</span>
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h2({ node, children, ...props }: any) {
            const text = String(children);
            const id = generateId(text);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }: any) {
            const text = String(children);
            const id = generateId(text);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          // Support for iframe embeds (CodeSandbox, StackBlitz, etc.)
          iframe({ node, ...props }: any) {
            return (
              <div className="not-prose my-6">
                <iframe
                  {...props}
                  className="w-full h-[500px] rounded-lg border border-gray-200 dark:border-gray-700"
                  loading="lazy"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Personal Notes Section */}
      <PersonalNotes sectionPath={sectionPath} />
    </div>
  );
}
