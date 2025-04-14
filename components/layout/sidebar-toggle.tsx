'use client';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/lib/state/sidebar';

export default function SidebarToggle() {
  const { isOpen, setIsOpen } = useSidebarStore();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="hover:text-primary dark:hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-sm text-gray-300 transition-colors duration-150 focus:outline-none"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
} 