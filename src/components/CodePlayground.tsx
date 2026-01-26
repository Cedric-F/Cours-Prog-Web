'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodePlaygroundProps {
  initialCode: string;
  language: string;
  onClose: () => void;
}

export default function CodePlayground({ initialCode, language, onClose }: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'console'>('output');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput('');

    if (language === 'javascript' || language === 'js') {
      // Run JavaScript in a sandboxed way
      try {
        const logs: string[] = [];
        const originalConsole = { ...console };
        
        // Create sandboxed console
        const sandboxConsole = {
          log: (...args: any[]) => logs.push(args.map(a => JSON.stringify(a, null, 2)).join(' ')),
          error: (...args: any[]) => logs.push('❌ ' + args.map(a => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('⚠️ ' + args.map(a => String(a)).join(' ')),
          info: (...args: any[]) => logs.push('ℹ️ ' + args.map(a => String(a)).join(' ')),
        };

        // Execute code with sandboxed console
        const fn = new Function('console', code);
        const result = fn(sandboxConsole);
        
        if (result !== undefined) {
          logs.push('→ ' + JSON.stringify(result, null, 2));
        }
        
        setOutput(logs.join('\n') || 'Code exécuté (aucune sortie)');
        setActiveTab('console');
      } catch (error: any) {
        setOutput('❌ Erreur: ' + error.message);
        setActiveTab('console');
      }
    } else if (language === 'html' || language === 'css') {
      // Render HTML/CSS in iframe using srcdoc
      let content = code;
      if (language === 'css') {
        content = `<style>${code}</style><div class="demo">Démo CSS</div>`;
      }
      
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              padding: 1rem; 
              margin: 0;
              background: white;
              color: #1f2937;
            }
            .demo {
              padding: 2rem;
              text-align: center;
              border: 2px dashed #ccc;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `;
      
      setHtmlOutput(fullHtml);
      setActiveTab('output');
    } else if (language === 'typescript' || language === 'ts') {
      // For TypeScript, strip types and run as JavaScript
      try {
        const logs: string[] = [];
        const sandboxConsole = {
          log: (...args: any[]) => logs.push(args.map(a => JSON.stringify(a, null, 2)).join(' ')),
          error: (...args: any[]) => logs.push('❌ ' + args.map(a => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('⚠️ ' + args.map(a => String(a)).join(' ')),
          info: (...args: any[]) => logs.push('ℹ️ ' + args.map(a => String(a)).join(' ')),
        };

        // Strip TypeScript-specific syntax to convert to valid JavaScript
        let jsCode = code
          // Remove interface declarations
          .replace(/interface\s+\w+\s*(\{[\s\S]*?\})/gm, '')
          // Remove type alias declarations
          .replace(/type\s+\w+\s*=\s*[^;]+;/gm, '')
          // Remove type annotations after colons (variables, parameters, return types)
          .replace(/:\s*[\w\[\]<>,\s|&'"{}]+(?=\s*[=,\)\{;])/g, '')
          // Remove generic type parameters <T>, <T, U>, etc.
          .replace(/<[\w\s,]+>(?=\s*\()/g, '')
          // Remove 'as Type' assertions
          .replace(/\s+as\s+\w+[\[\]<>,\s]*/g, '')
          // Remove readonly keyword
          .replace(/\breadonly\s+/g, '')
          // Remove access modifiers (public, private, protected)
          .replace(/\b(public|private|protected)\s+/g, '')
          // Remove abstract keyword
          .replace(/\babstract\s+/g, '')
          // Remove implements clause
          .replace(/\s+implements\s+[\w,\s]+(?=\s*\{)/g, '')
          // Remove non-null assertions (!)
          .replace(/!(?=\.|\[|\))/g, '')
          // Clean up any double spaces
          .replace(/  +/g, ' ');
        
        const fn = new Function('console', jsCode);
        const result = fn(sandboxConsole);
        
        if (result !== undefined) {
          logs.push('→ ' + JSON.stringify(result, null, 2));
        }
        
        setOutput(logs.join('\n') || 'Code exécuté (aucune sortie)');
        setActiveTab('console');
      } catch (error: any) {
        setOutput('❌ Erreur: ' + error.message + '\n\n💡 Note: Le transpileur TypeScript est simplifié. Certaines syntaxes complexes peuvent ne pas fonctionner.');
        setActiveTab('console');
      }
    } else {
      setOutput(`⚠️ L'exécution n'est pas supportée pour le langage "${language}"`);
      setActiveTab('console');
    }

    setIsRunning(false);
  }, [code, language]);

  // Auto-exécuter le code à l'ouverture
  useEffect(() => {
    // Petit délai pour s'assurer que le composant est bien monté
    const timer = setTimeout(() => {
      runCode();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setHtmlOutput('');
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      javascript: 'JavaScript',
      js: 'JavaScript',
      typescript: 'TypeScript',
      ts: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
    };
    return labels[lang] || lang.toUpperCase();
  };

  const canRun = ['javascript', 'js', 'typescript', 'ts', 'html', 'css'].includes(language);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
              {getLanguageLabel(language)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetCode}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
            {canRun && (
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Exécuter
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <Editor
              height="100%"
              language={language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Output panel */}
          <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('output')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'output'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Aperçu
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'console'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Console
              </button>
            </div>

            {/* Output content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'output' ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlOutput || '<html><body style="font-family: system-ui; padding: 1rem; color: #6b7280;">Cliquez sur "Exécuter" pour voir l\'aperçu</body></html>'}
                  className="w-full h-full bg-white"
                  title="Output"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {output || 'Cliquez sur "Exécuter" pour voir le résultat'}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer with keyboard shortcut hint */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
          Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Échap</kbd> pour fermer
        </div>
      </div>
    </div>
  );
}
