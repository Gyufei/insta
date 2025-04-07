'use client';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/lib/state/sidebar';

export default function SidebarToggle() {
  const { isOpen, setIsOpen } = useSidebarStore();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="hover:text-brand dark:hover:text-light flex h-10 w-10 items-center justify-center rounded-sm text-grey-pure transition-colors duration-150 focus:outline-none"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
} 