'use client';
import { ClipboardCheck, ClipboardCopyIcon } from 'lucide-react';

import { NetworkConfigs } from '@/config/network-config';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSelectedAccount } from '@/lib/data/use-account';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

export function AccountAddressCopy({ className }: { className?: string }) {
  const { data: accountInfo } = useSelectedAccount();
  const network = NetworkConfigs.monadTestnet;
  const accountAddress = accountInfo?.sandbox_account || '';
  const { isCopied, copyToClipboard } = useCopyToClipboard(accountAddress);

  return (
    <div className={cn('mt-2 flex', className)}>
      <div className="scrollbar-hidden text-blue relative flex w-max min-w-20 items-center overflow-x-auto rounded-l-sm rounded-r-none border px-3 py-2 text-xs leading-5 transition duration-150 ease-in-out">
        <a
          href={`${network.blockExplorers.default.url}/address/${accountAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {accountAddress}
        </a>
      </div>
      <TooltipProvider>
        <Tooltip open={isCopied}>
          <TooltipTrigger asChild>
            <button
              onClick={copyToClipboard}
              className="text-primary hover:text-primary/50 active:text-primary/50 dark:border-gray/50 dark:bg-blue has-tooltip relative -ml-px inline-flex flex-shrink-0 cursor-pointer items-center rounded-r-sm border border-gray-300 bg-gray-50 px-2 py-2 transition duration-150 ease-in-out focus:border-blue-300 focus:ring-blue-300 focus:outline-none active:bg-gray-100"
            >
              {isCopied ? (
                <ClipboardCheck className="h-5 w-5 flex-shrink-0 dark:opacity-90" />
              ) : (
                <ClipboardCopyIcon className="h-5 w-5 flex-shrink-0 dark:opacity-90" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copied!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
