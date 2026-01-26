'use client';

interface ExportPDFButtonProps {
  title: string;
}

export default function ExportPDFButton({ title }: ExportPDFButtonProps) {
  const handleExport = () => {
    // Create a custom print stylesheet
    const printStyles = `
      @media print {
        /* Hide sidebar, navigation, and other non-content elements */
        nav, .sidebar, .table-of-contents, .navigation-arrows, .personal-notes,
        .mobile-header, button, .no-print {
          display: none !important;
        }
        
        /* Reset page layout */
        body {
          margin: 0;
          padding: 0;
          background: white !important;
        }
        
        /* Content styling */
        .markdown-content {
          padding: 2rem !important;
          max-width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }
        
        /* Ensure code blocks don't overflow */
        pre, code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          max-width: 100% !important;
        }
        
        /* Page breaks */
        h1, h2 {
          page-break-after: avoid;
        }
        
        pre, blockquote, table {
          page-break-inside: avoid;
        }
        
        /* Hide scroll indicators */
        ::-webkit-scrollbar {
          display: none !important;
        }
      }
    `;

    // Add print styles temporarily
    const styleSheet = document.createElement('style');
    styleSheet.id = 'print-styles';
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);

    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = title;

    // Trigger print dialog
    window.print();

    // Restore original title and remove print styles
    setTimeout(() => {
      document.title = originalTitle;
      const printStyleSheet = document.getElementById('print-styles');
      if (printStyleSheet) {
        printStyleSheet.remove();
      }
    }, 100);
  };

  return (
    <button
      onClick={handleExport}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-print"
      title="Exporter en PDF"
    >
      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
}
