import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  isCollapsed?: boolean;
}

export function ToggleTheme({ className, isCollapsed = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={cn('flex w-full items-center justify-center', isCollapsed ? 'px-1' : 'px-8')}>
      {isCollapsed ? (
        <div
          className={cn(
            'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-all duration-300',
            isDark ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-gray-700',
            className
          )}
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
        >
          {isDark ? (
            <Moon className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Sun className="h-4 w-4" strokeWidth={1.5} />
          )}
        </div>
      ) : (
        <div
          className={cn(
            'flex h-7 w-14 cursor-pointer rounded-full p-1 transition-all duration-300',
            isDark ? 'border border-zinc-800 bg-zinc-950' : 'border border-zinc-200 bg-white',
            className
          )}
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
        >
          <div className="flex w-full items-center justify-between">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300',
                isDark
                  ? 'translate-x-0 transform bg-zinc-800'
                  : 'translate-x-7 transform bg-gray-200'
              )}
            >
              {isDark ? (
                <Moon className="h-3 w-3 text-white" strokeWidth={1.5} />
              ) : (
                <Sun className="h-3 w-3 text-gray-700" strokeWidth={1.5} />
              )}
            </div>
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300',
                isDark ? 'bg-transparent' : '-translate-x-7 transform'
              )}
            >
              {isDark ? (
                <Sun className="h-3 w-3 text-gray-500" strokeWidth={1.5} />
              ) : (
                <Moon className="h-3 w-3 text-black" strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
