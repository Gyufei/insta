'use client';

import { Copy } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { cn, formatAddress } from '@/lib/utils';
import { useCopyToClipboard } from '@/lib/utils/use-copy-to-clipboard';

export function WalletCard({
  walletAddress,
  className,
  isCurrent,
  onClick,
}: {
  walletAddress: string;
  className?: string;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(walletAddress);

  function handleCopyToClipboard(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    copyToClipboard();
  }

  if (!walletAddress) return null;

  return (
    <div
      className={cn(
        'flex w-full h-12 items-center cursor-pointer justify-between overflow-hidden rounded-[8px] border text-xs whitespace-nowrap shadow-none transition-colors duration-75 ease-out select-none bg-white px-4',
        isCurrent ? 'border-[#6E75F9]' : 'border-[#ebebeb]',
        className
      )}
      onClick={onClick}
    >
      <div
        title={walletAddress || ''}
        className={cn('flex-1 flex items-center text-sm font-normal leading-[140%] text-[#131E40]')}
      >
        {formatAddress(walletAddress || '', {
          prefix: 12,
          suffix: 12,
        })}
      </div>
      <TooltipProvider>
        <Tooltip open={isCopied}>
          <TooltipTrigger asChild>
            <div
              onClick={handleCopyToClipboard}
              className={cn(
                'h-full text-primary flex items-center justify-center cursor-pointer',
                isCurrent ? 'text-primary' : 'text-[#A5ADC6]'
              )}
            >
              <Copy className="h-4 w-4 flex-shrink-0 dark:opacity-90" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copied!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
