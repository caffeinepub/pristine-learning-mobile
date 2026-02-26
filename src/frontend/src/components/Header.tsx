import React from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border shadow-xs flex items-center justify-between px-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
          <img
            src="/assets/generated/pristine-logo.dim_256x256.png"
            alt="Pristine Learning"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <GraduationCap className="w-5 h-5 text-primary hidden" />
        </div>
        <div>
          <h1 className="font-serif text-sm font-semibold text-foreground leading-tight">
            Pristine Learning
          </h1>
          <p className="text-[10px] text-muted-foreground leading-tight">Teacher Dashboard</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleDark}
        className="h-8 w-8 rounded-full"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-warm-400" />
        ) : (
          <Moon className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </header>
  );
}
