import Image from 'next/image';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface ButtonWithCheckProps {
  label: string;
  value: string;
  activeTab: string;
  onClick: () => void;
  className?: string;
}

export function ButtonWithCheck({
  label,
  value,
  activeTab,
  onClick,
  className,
}: ButtonWithCheckProps) {
  const isActive = activeTab === value;

  return (
    <div className="flex">
      <Button
        variant="outline"
        className={cn(
          'relative flex flex-1 rounded-[8px] cursor-pointer items-center gap-2 border px-4 py-3 outline-none select-none focus:outline-none',
          isActive ? 'border-[#6E75F9] ' : 'border-[#EBEBEB] hover:border-[#6E75F9]',
          className
        )}
        onClick={onClick}
      >
        <p className="text-sm leading-none font-medium">{label}</p>
        {isActive && (
          <Image
            alt="check"
            src="/icons/check.svg"
            width="16"
            height="16"
            className="absolute -top-[6px] -right-[6px]"
          />
        )}
      </Button>
    </div>
  );
}
