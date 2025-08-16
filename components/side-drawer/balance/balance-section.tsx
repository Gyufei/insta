import { HelpCircle } from 'lucide-react';
import { add, multiply } from 'safebase';

import { useMemo } from 'react';

import { APR_MONAD, G_MONAD, TokenPriceMap } from '@/config/tokens';

import { WithLoading } from '@/components/common/with-loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useApiAccountTokenBalance } from '@/lib/data/use-api-account-token-balance';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { cn } from '@/lib/utils';
import { formatBig, formatNumber } from '@/lib/utils/number';

import { TwitterLink } from './twitter-link';

export default function BalanceSection() {
  const { data: accountInfo } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  const { data: balanceData, isPending: isPendingBalance } = useApiAccountTokenBalance();
  const { data: priceData, isPending: isPendingPrice } = useTokenStationPrice();

  const { data: aprioriBalance, isPending: isPendingApr } = useAprioriBalance();
  const aprBalance = formatBig(aprioriBalance?.balance || '0');
  const aprPrice = TokenPriceMap[APR_MONAD.symbol];

  const { data: magmaBalance, isPending: isPendingMagma } = useMagmaBalance();
  const gMonBalance = formatBig(magmaBalance?.balance || '0');
  const gMonPrice = TokenPriceMap[G_MONAD.symbol];

  const isPending =
    Boolean(account) && (isPendingBalance || isPendingPrice || isPendingApr || isPendingMagma);

  const ethPrice = priceData?.eth_price;
  const monPrice = priceData?.mon_price;

  const priceValue = useMemo(() => {
    if (!account) {
      return '0';
    }

    let price = '0';

    if (!balanceData) {
      return price;
    }

    for (const bRes of balanceData) {
      if (bRes.network === 'MON') {
        if (bRes.token === 'MON') {
          price = add(price, multiply(bRes.formattedBalance, String(monPrice || 0)));
        }
        if (bRes.token === 'monUSD') {
          price = add(price, multiply(bRes.formattedBalance, String(1)));
        }
      } else if (['ETH', 'BASE'].includes(bRes.network)) {
        if (bRes.token === 'ETH') {
          price = add(price, multiply(bRes.formattedBalance, String(ethPrice || 0)));
        }
        if (['USDT', 'USDC'].includes(bRes.token)) {
          price = add(price, multiply(bRes.formattedBalance, String(1)));
        }
      }
    }

    if (aprBalance) {
      price = add(price, multiply(aprBalance, String(aprPrice)));
    }

    if (gMonBalance) {
      price = add(price, multiply(gMonBalance, String(gMonPrice)));
    }

    return price;
  }, [balanceData, account, monPrice, ethPrice, aprBalance, gMonBalance, aprPrice, gMonPrice]);

  return (
    <div className="pl-2 mt-6 mb-5 flex w-full flex-shrink-0 flex-col items-start">
      <div className="flex items-center justify-between w-full gap-2">
        <h3 className="flex items-center leading-none">
          <span className="text-primary font-medium">Balance</span>
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

        <TwitterLink />
      </div>
      <div className="mt-4 flex justify-between items-stretch w-full">
        <div
          className={cn(
            'h-10 font-medium text-primary flex items-end',
            String(priceValue).length > 8
              ? 'text-[28px] leading-[120%]'
              : 'text-[32px] leading-[140%]'
          )}
        >
          <WithLoading isLoading={isPending} className="h-8 w-8 mt-[5px]">
            <span>${Number(priceValue) > 0 ? formatNumber(priceValue) : '0.00'}</span>
          </WithLoading>
        </div>
      </div>
    </div>
  );
}
