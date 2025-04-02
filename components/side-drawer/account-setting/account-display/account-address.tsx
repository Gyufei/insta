import { useState, useEffect } from 'react';
import { ClipboardCheck, ClipboardCopyIcon } from 'lucide-react';
import { toast } from 'sonner';

import { NetworkConfigs } from '@/config/network-config';
import { IAccountInfo } from '@/lib/data/use-get-account';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AccountAddress({ accountInfo }: { accountInfo: IAccountInfo }) {
  const network = NetworkConfigs.monadTestnet;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountInfo.sandbox_account);
      setIsCopied(true);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="mt-6 px-8">
      <label
        htmlFor="dsa-address"
        className="text-12 text-navi-pure-light dark:text-light font-semibold"
      >
        Account address
      </label>
      <div className="mt-2 flex rounded-sm shadow-sm">
        <div className="scrollbar-hidden text-ocean-blue-pure relative flex w-max items-center overflow-x-auto rounded-l-sm rounded-r-none border px-3 py-2 text-xs leading-5 transition duration-150 ease-in-out">
          <a
            href={`${network.blockExplorers.default.url}/address/${accountInfo.sandbox_account}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {accountInfo.sandbox_account}
          </a>
        </div>
        <TooltipProvider>
          <Tooltip open={isCopied}>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="text-navi-pure hover:text-navi-pure-light active:text-navi-pure dark:border-grey-pure/50 dark:bg-ocean-blue-pure dark:text-light has-tooltip relative -ml-px inline-flex flex-shrink-0 cursor-pointer items-center rounded-r-sm border border-gray-300 bg-gray-50 px-2 py-2 transition duration-150 ease-in-out focus:border-blue-300 focus:ring-blue-300 focus:outline-none active:bg-gray-100"
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
    </div>
  );
}
