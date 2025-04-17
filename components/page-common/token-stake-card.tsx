'use client';

import { CircleDollarSign } from 'lucide-react';
import { multiply } from 'safebase';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WithLoading } from '@/components/with-loading';

import { TokenData } from '@/lib/data/tokens';
import { formatBig, formatNumber } from '@/lib/utils/number';

interface TokenStakeCardProps {
  token: (typeof TokenData)[0];
  tokenPrice: number;
  balance: string;
  isLoading: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  depositButtonText?: string;
  withdrawButtonText?: string;
}

export function TokenStakeCard({
  token,
  tokenPrice,
  balance,
  isLoading,
  onDeposit,
  onWithdraw,
  depositButtonText = 'Deposit',
  withdrawButtonText = 'Withdraw',
}: TokenStakeCardProps) {
  const formattedBalance = formatBig(balance || '0');
  const priceValue = balance ? multiply(formattedBalance, String(tokenPrice)) : '0';

  return (
    <div className="mt-4 grid w-full min-w-max grid-cols-1 gap-4 px-4 2xl:mt-6 2xl:gap-6 2xl:px-12">
      <Card className="relative flex flex-1 flex-shrink-0 flex-col shadow">
        <CardContent className="flex items-center px-4">
          <div className="flex h-12 w-12 items-center justify-center dark:opacity-90">
            <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
              <Image
                src={token.iconUrl}
                className="flex-grow object-contain"
                alt={token.name}
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="mx-4 flex flex-grow flex-col">
            <div className="mb-1 text-xl leading-none font-medium whitespace-nowrap">
              <WithLoading
                isLoading={isLoading}
              >{`${formatNumber(formattedBalance)} ${token.symbol}`}</WithLoading>
            </div>
            <div className="flex items-center leading-none whitespace-nowrap">
              <span className="text-sm text-gray-300">
                <WithLoading isLoading={isLoading}>${priceValue}</WithLoading>
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hover:text-blue dark:hover:text-primary-foreground ml-1 flex h-4 w-4 cursor-pointer items-center justify-center text-xs leading-none text-gray-300 transition-colors duration-150">
                      <CircleDollarSign className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      ${tokenPrice} / {token.symbol}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center justify-around gap-2 px-4">
          <Button
            onClick={onDeposit}
            size="default"
            className="flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            {depositButtonText}
          </Button>
          <Button
            onClick={onWithdraw}
            size="default"
            className="flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            {withdrawButtonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
