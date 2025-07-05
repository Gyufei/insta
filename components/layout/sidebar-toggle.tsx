'use client';

import { Menu } from 'lucide-react';

import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export default function SidebarToggle() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 bg-transparent border-black/10"
      onClick={() => setOpenMobile(!openMobile)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
