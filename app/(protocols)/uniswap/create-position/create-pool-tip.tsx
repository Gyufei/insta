import { Info } from 'lucide-react';

import { BadgeHelpTooltip } from '@/components/common/badge-help';

import { cn } from '@/lib/utils';

export function CreatePoolTip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center basis-auto box-border relative min-h-0 min-w-0 shrink-0 flex-row gap-4 p-2 rounded-lg bg-gray-200',
        className
      )}
    >
      <BadgeHelpTooltip
        icon={<Info className="w-4 h-4 text-muted-foreground" />}
        content="Your selections will create a new liquidity pool which may result in lower initial
          liquidity and increased volatility. Consider adding to an existing pool to minimize these
          risks."
      />
      <span className="inline-block box-border whitespace-pre-wrap m-0 text-muted-foreground break-words text-xs leading-relaxed font-medium">
        Creating new pool
      </span>
    </div>
  );
}
