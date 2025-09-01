import { X } from 'lucide-react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';

export function MobileBalanceHeader() {
  const { setIsOpen } = useSideDrawerStore();

  return (
    <div className={cn('h-16  md:hidden flex items-center justify-between px-4')}>
      <Image
        src="https://cdn.tadle.com/images/logo-black.svg"
        alt="logo"
        width={70}
        height={20}
        className=""
      />
      <Button
        onClick={() => setIsOpen(false)}
        variant="ghost"
        size="icon"
        className="h-9 w-9 bg-transparent"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
