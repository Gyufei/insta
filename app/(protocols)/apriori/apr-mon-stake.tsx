'use client';

import { CircleDollarSign } from 'lucide-react';
import { multiply } from 'safebase';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WithLoading } from '@/components/with-loading';

import { TokenData, TokenPriceMap } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-aprior-balance';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatBig, formatNumber } from '@/lib/utils/number';

export function AprMonStake() {
  const { setCurrentComponent } = useSideDrawerStore();

  const token = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const aprPrice = TokenPriceMap[token?.symbol];
  const { data: aprioriBalance, isLoading } = useAprioriBalance();
  const balance = formatBig(aprioriBalance?.balance || '0');
  const priceValue = aprioriBalance ? multiply(balance, String(aprPrice)) : '0';

  function handleDeposit() {
    setCurrentComponent({ name: 'AprioriDeposit' });
  }

  function handleWithdraw() {
    setCurrentComponent({ name: 'AprioriWithdraw' });
  }

  return (
    <div className="mt-4 grid w-full min-w-max grid-cols-1 gap-4 px-4 2xl:mt-6 2xl:gap-6 2xl:px-12">
      <Card className="relative flex flex-1 flex-shrink-0 flex-col shadow">
        <CardContent className="flex items-center px-4">
          <div className="flex h-12 w-12 items-center justify-center dark:opacity-90">
            <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
              <Image
                src="/icons/aprmon.svg"
                className="flex-grow object-contain"
                alt="aprmon"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="mx-4 flex flex-grow flex-col">
            <div className="mb-1 text-xl leading-none font-medium whitespace-nowrap">
              <WithLoading isLoading={isLoading}>${priceValue}</WithLoading>
            </div>
            <div className="flex leading-none whitespace-nowrap">
              <span className="text-sm text-gray-300">
                <WithLoading isLoading={isLoading}>{`${formatNumber(balance)} aprMon`}</WithLoading>
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hover:text-blue dark:hover:text-primary-foreground ml-1 flex h-4 w-4 cursor-pointer items-center justify-center text-xs leading-none text-gray-300 transition-colors duration-150">
                      <CircleDollarSign className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>${aprPrice} / aprMon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center justify-around gap-2 px-4">
          <Button
            onClick={handleDeposit}
            size="default"
            className="flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Deposit
          </Button>
          <Button
            onClick={handleWithdraw}
            size="default"
            className="flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Withdraw
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
