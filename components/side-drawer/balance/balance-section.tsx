import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccountBalance } from '@/lib/web3/use-account-balance';
import { multiply } from 'safebase';
import { TokenPriceMap } from '@/lib/data/tokens';
import { formatNumber } from '@/lib/utils/number';
import { WithLoading } from '@/components/with-loading';
export default function BalanceSection() {
  const { balance, isPending } = useAccountBalance();
  const priceValue = multiply(balance, String(TokenPriceMap['MON'] || 0));

  return (
    <div className="mt-6 mb-2 flex w-full flex-shrink-0 flex-col items-center px-8 text-center sm:mb-10">
      <h3 className="flex items-center leading-none">
        Balance
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-grey-pure hover:text-ocean-blue-pure dark:hover:text-light ml-1 flex h-4 w-4 cursor-pointer items-center justify-center leading-none transition-colors duration-150">
                <HelpCircle className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current account balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      <div className="mt-4 text-[32px] font-semibold">
        <WithLoading isPending={!!isPending} className="h-8 w-8">
          ${Number(priceValue) > 0 ? formatNumber(priceValue) : '0.00'}
        </WithLoading>
      </div>
    </div>
  );
}
