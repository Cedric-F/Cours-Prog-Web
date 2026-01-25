'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { NavigationItem } from '@/types';

interface ContentDisplayProps {
  content: string;
  currentItem: NavigationItem;
  onScrollToBottom: () => void;
}

export default function ContentDisplay({ content, currentItem, onScrollToBottom }: ContentDisplayProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
