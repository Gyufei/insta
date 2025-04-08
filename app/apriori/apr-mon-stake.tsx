'use client';

import { CircleDollarSign } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TokenData, TokenPriceMap } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-aprior-balance';
import { multiply } from 'safebase';
import { WithLoading } from '@/components/with-loading';
import { formatBig, formatNumber } from '@/lib/utils/number';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function AprMonStake() {
  const { setCurrentComponent } = useSideDrawerStore();

  const token = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const aprPrice = TokenPriceMap[token?.symbol];
  const { data: aprioriBalance, isLoading } = useAprioriBalance();
  const balance = formatBig(aprioriBalance?.balance || '0');
  const priceValue = aprioriBalance ? multiply(balance, aprPrice) : '0';

  function handleDeposit() {
    setCurrentComponent({ name: 'AprioriDeposit' });
  }

  function handleWithdraw() {
    setCurrentComponent({ name: 'AprioriWithdraw' });
  }

  return (
    <div className="mt-4 grid w-full min-w-max grid-cols-1 gap-4 px-4 2xl:mt-6 2xl:gap-6 2xl:px-12">
      <div className="dark:bg-dark-500 relative flex flex-1 flex-shrink-0 flex-col rounded bg-white px-4 py-6 shadow dark:shadow-none">
        <div data-v-7afb5e18="" className="flex items-center">
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
              <span className="text-grey-pure text-sm">
                <WithLoading isLoading={isLoading}>{`${formatNumber(balance)} aprMon`}</WithLoading>
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-grey-pure hover:text-ocean-blue-pure dark:hover:text-light ml-1 flex h-4 w-4 cursor-pointer items-center justify-center text-xs leading-none transition-colors duration-150">
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
        </div>
        <div className="mt-4 flex w-full items-center justify-center">
          <hr className="bg-grey-light dark:bg-grey-light/10 mt-0 w-full" />
        </div>
        <div className="mt-6 flex items-center justify-around gap-2 px-4">
          <button
            onClick={handleDeposit}
            className="bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/15 hover:bg-ocean-blue-pure/20 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/40 dark:active:bg-ocean-blue-pure/40 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            className="bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/15 hover:bg-ocean-blue-pure/20 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/40 dark:active:bg-ocean-blue-pure/40 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
