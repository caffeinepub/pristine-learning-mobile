import React from 'react';
import {
  Home,
  CalendarDays,
  Wallet,
  Sparkles,
  BarChart3,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/' },
  { label: 'Sessions', icon: <CalendarDays className="w-5 h-5" />, path: '/sessions' },
  { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/wallet' },
  { label: 'AI', icon: <Sparkles className="w-5 h-5" />, path: '/ai-assistant' },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
  { label: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile' },
  { label: 'Admin', icon: <ShieldCheck className="w-5 h-5" />, path: '/admin', adminOnly: true },
];

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function BottomNav({ currentPath, onNavigate }: BottomNavProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return !!identity && isAdmin === true;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {visibleItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 px-1 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-primary/10' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
