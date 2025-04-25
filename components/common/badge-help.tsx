'use client';

import { CircleHelp } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeHelpTooltipProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  icon?: React.ReactNode;
}

export function BadgeHelpTooltip({ content, side = 'right', icon }: BadgeHelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon ?? <CircleHelp className="w-4 h-4" />}</TooltipTrigger>
        <TooltipContent side={side} className="max-w-[300px]">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
