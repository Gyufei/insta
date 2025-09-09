'use client';

import { Copy, Power } from 'lucide-react';
import { useDisconnect } from 'wagmi';

import Image from 'next/image';

import { NetworkConfigs } from '@/config/network-config';

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
  const network = NetworkConfigs.monadTestnet;
  const { isCopied, copyToClipboard } = useCopyToClipboard(walletAddress);
  const { disconnect } = useDisconnect();

  function handleCopyToClipboard(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    copyToClipboard();
  }

  function handleDisconnect() {
    disconnect();
  }

  if (!walletAddress) return null;

  return (
    <button
      className={cn(
        'flex h-14 flex-shrink-0 items-center cursor-pointer justify-center overflow-hidden rounded-sm border text-xs font-semibold whitespace-nowrap shadow-none transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50',
        isCurrent
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-[#ebebeb] bg-muted text-card-foreground hover:bg-muted/80',
        className
      )}
    >
      <div className="flex w-full flex-col" onClick={onClick}>
        <div className={cn('flex items-center justify-between')}>
          <div
            className={cn(
              'flex w-7 items-center justify-center text-center text-xs leading-none',
              isCurrent ? 'text-primary-foreground' : 'text-primary'
            )}
          >
            V3
          </div>
          <div
            className={cn(
              'flex h-7 flex-1 items-center justify-end border-r border-l text-center leading-none pr-4',
              isCurrent ? 'border-primary-foreground/50' : 'border-[#ebebeb]/50'
            )}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Power className="h-4 w-4" onClick={handleDisconnect} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disconnect</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="inline-flex h-full w-7 items-center justify-center dark:opacity-90">
            <Image
              src={network.icon.replace('monad', isCurrent ? 'monad-white' : 'monad-black')}
              width={24}
              height={24}
              alt="network"
            />
          </div>
        </div>
        <div className="h-7 flex items-stretch justify-between w-full">
          <div
            title={walletAddress || ''}
            className={cn(
              'flex-1 px-2 flex items-center justify-center text-center font-semibold shadow-inner outline-none select-all text-xs',
              isCurrent ? 'bg-primary-foreground text-primary' : 'bg-card text-card-foreground'
            )}
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
                    'h-full text-primary flex items-center justify-center px-1 cursor-pointer bg-white',
                    isCurrent ? 'text-primary' : 'text-gray-500'
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
      </div>
    </button>
  );
}
