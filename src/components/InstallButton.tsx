'use client';

import { usePWA } from '@/hooks/usePWA';

export default function InstallButton() {
  const { isInstallable, isInstalled, install } = usePWA();

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 dark:text-green-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>App installée</span>
      </div>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={install}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
      title="Installer l'application"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Installer l'app</span>
    </button>
  );
}
