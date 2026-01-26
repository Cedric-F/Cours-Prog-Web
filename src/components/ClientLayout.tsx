'use client';

import { ThemeProvider } from '@/hooks/useTheme';
import { SidebarProvider } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import PWARegister from './PWARegister';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <PWARegister />
        <MobileHeader />
        <div className="flex h-screen overflow-hidden pt-14 md:pt-0">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
