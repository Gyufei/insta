'use client';

import { CircleDollarSign } from 'lucide-react';
import { multiply } from 'safebase';

import Image from 'next/image';

import { IToken } from '@/config/tokens';

import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { formatBig, formatNumber } from '@/lib/utils/number';

interface TokenStakeCardProps {
  token: IToken;
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
    <div className="mt-4 grid w-full min-w-max grid-cols-2 gap-4 px-4 2xl:mt-6 2xl:gap-6 2xl:px-12">
      <Card className="relative flex flex-1 px-5 flex-shrink-0 gap-5 flex-col shadow-none outline-none">
        <CardContent className="px-0 flex items-center">
          <div className="flex h-12 w-12 items-center justify-center dark:opacity-90">
            <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
              <Image
                src={token.logo}
                className="flex-grow object-contain"
                alt={token.name}
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="mx-3 flex flex-grow flex-col">
            <div className="mb-1 text-xl leading-none font-medium whitespace-nowrap">
              <WithLoading
                isLoading={isLoading}
              >{`${formatNumber(formattedBalance)} ${token.symbol}`}</WithLoading>
            </div>
            <div className="flex items-center leading-none whitespace-nowrap">
              <span className="text-sm font-light text-gray-400">
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
        <CardFooter className="flex items-center px-0 justify-around gap-2">
          <Button
            onClick={onDeposit}
            size="default"
            variant="outline"
            className="hover:border-pro-blue/20 hover:bg-pro-blue/20 hover:text-pro-blue flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 shadow-none ease-out select-none focus:outline-none disabled:opacity-50"
          >
            {depositButtonText}
          </Button>
          <Button
            onClick={onWithdraw}
            size="default"
            variant="outline"
            className="hover:border-pro-blue/20 hover:bg-pro-blue/20 hover:text-pro-blue flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 shadow-none ease-out select-none focus:outline-none disabled:opacity-50"
          >
            {withdrawButtonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
