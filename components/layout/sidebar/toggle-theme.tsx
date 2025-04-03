import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ToggleTheme({ isCollapsed }: { isCollapsed: boolean }) {
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
    <div className="flex w-full items-center justify-center px-8">
      <div
        onClick={toggleTheme}
        className="hover:text-brand dark:hover:text-light flex w-full cursor-pointer items-center justify-between px-6 leading-none transition-colors duration-150"
      >
        {isDark ? <Sun className="h-5" /> : <Moon className="h-5" />}
        {!isCollapsed && (
          <div className="ml-4 whitespace-nowrap">
            {isDark ? 'Switch to light' : 'Switch to dark'}
          </div>
        )}
      </div>
    </div>
  );
}
