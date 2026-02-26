import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useDarkMode } from '../hooks/useDarkMode';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Layout({ children, currentPath, onNavigate }: LayoutProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isDark={isDark} onToggleDark={toggle} />
      <main className="flex-1 pt-14 pb-16 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full min-h-full">
          {children}
        </div>
      </main>
      <BottomNav currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
}
