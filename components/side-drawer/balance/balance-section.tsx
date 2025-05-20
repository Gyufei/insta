import { HelpCircle } from 'lucide-react';
import { multiply } from 'safebase';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WithLoading } from '@/components/common/with-loading';

import { TokenPriceMap } from '@/config/tokens';
import { formatNumber } from '@/lib/utils/number';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

export default function BalanceSection() {
  const { balance, isPending } = useAccountBalance();
  const priceValue = multiply(balance, String(TokenPriceMap['MON'] || 0));

  return (
    <div className="pl-2 mt-6 mb-5 flex w-full flex-shrink-0 flex-col items-start">
      <h3 className="flex items-center leading-none">
        <span className="text-primary">Balance</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-primary hover:text-muted-foreground ml-1 flex h-4 w-4 cursor-pointer items-center justify-center text-xs leading-none transition-colors duration-150">
                <HelpCircle className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current account balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      <div className="mt-4 text-[32px] h-10 font-semibold text-primary">
        <WithLoading isLoading={isPending} className="h-8 w-8 mt-[5px]">
          <span>${Number(priceValue) > 0 ? formatNumber(priceValue) : '0.00'}</span>
        </WithLoading>
      </div>
    </div>
  );
}
