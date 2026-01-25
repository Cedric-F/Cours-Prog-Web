'use client';

import { ThemeProvider } from '@/hooks/useTheme';
import Sidebar from './Sidebar';
import PWARegister from './PWARegister';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <PWARegister />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
