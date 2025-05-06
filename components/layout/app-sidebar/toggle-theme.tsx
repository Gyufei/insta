import { Moon, Sun } from 'lucide-react';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ToggleTheme({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div
      className={cn(
        'flex w-[72px] h-9 rounded-[8px] border border-border bg-primary-foreground transition-all duration-300',
        className
      )}
    >
      {/* 亮色模式按钮 */}
      <button
        className={cn(
          'flex-1 flex items-center justify-center transition-all duration-300 h-full',
          !isDark ? 'bg-primary-foreground border-r border-border rounded-[8px]' : 'bg-transparent'
        )}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        onClick={() => setTheme(false)}
        aria-label="Light"
      >
        <Sun
          className={cn('h-5 w-5', !isDark ? 'text-primary' : 'text-gray-400')}
          strokeWidth={2}
        />
      </button>
      {/* 暗色模式按钮 */}
      <button
        className={cn(
          'flex-1 flex items-center justify-center transition-all duration-300 h-full',
          isDark ? 'bg-primary-foreground border-l border-border rounded-[8px]' : 'bg-transparent'
        )}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        onClick={() => setTheme(true)}
        aria-label="Dark"
      >
        <Moon
          className={cn('h-5 w-5', isDark ? 'text-primary' : 'text-gray-400')}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
