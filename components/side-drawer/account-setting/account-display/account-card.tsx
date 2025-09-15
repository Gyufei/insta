'use client';

import { Copy } from 'lucide-react';

import Image from 'next/image';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { IAccountInfo } from '@/lib/data/account-address/use-account';
import { cn, formatAddress } from '@/lib/utils';
import { useCopyToClipboard } from '@/lib/utils/use-copy-to-clipboard';

export function AccountCard({
  accountInfo,
  className,
  isCurrent,
  onClick,
}: {
  accountInfo: IAccountInfo;
  className?: string;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(accountInfo.sandbox_account);

  function handleCopyToClipboard(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    copyToClipboard();
  }

  if (!accountInfo) return null;

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-[8px] cursor-pointer border transition-colors duration-75 ease-out px-4 bg-white',
        isCurrent ? 'border-[#6E75F9]' : 'border-[#ebebeb]',
        className
      )}
    >
      <div className="flex w-full flex-col" onClick={onClick}>
        <div className={cn('flex items-center justify-between py-3 border-b border-[#ebebeb]')}>
          <div className="text-sm font-medium leading-[140%] text-primary">#{accountInfo?.id}</div>

          <div className="flex gap-1 group text-sm font-medium leading-[140%] text-[#A5ADC6]">
            <Image src="/icons/avatar-gray.svg" alt="avatar" width={16} height={16} />
            <div className="group-hover:inline-block hidden">
              {formatAddress(accountInfo?.managers[0] || '', {
                prefix: 6,
                suffix: 4,
              })}
            </div>
            <div>V3</div>
          </div>
        </div>
        <div className="pt-4 pb-[20px] flex justify-between w-full">
          <div
            title={accountInfo?.sandbox_account || ''}
            className={cn('flex items-center font-normal select-none text-sm')}
          >
            {formatAddress(accountInfo?.sandbox_account || '', {
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
                    'text-primary flex items-center justify-center px-1 cursor-pointer bg-white',
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
      </div>
    </div>
  );
}
