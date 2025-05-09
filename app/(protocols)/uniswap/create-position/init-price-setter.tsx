'use client';

import { divide, utils } from 'safebase';

import type React from 'react';
import { useState } from 'react';

import { BadgeHelpTooltip } from '@/components/common/badge-help';
import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { NumberInput } from '@/components/common/number-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { IToken } from '@/config/tokens';
import { cn } from '@/lib/utils';

import { PairTokenSelected } from '../uni-common/use-token-selector';

interface InitialPriceSetterProps {
  token0: IToken | undefined;
  token1: IToken | undefined;
  onPriceChange: (price: string) => void;
}

export default function InitialPriceSetter({
  token0,
  token1,
  onPriceChange,
}: InitialPriceSetterProps) {
  const [price, setPrice] = useState('');
  const [price2, setPrice2] = useState('');

  const [currentCheckToken, setCurrentCheckToken] = useState<string>(
    String(PairTokenSelected.Token0)
  );

  const handlePriceChange = (newPrice: string) => {
    if (currentCheckToken === String(PairTokenSelected.Token0)) {
      setPrice(newPrice);
      if (newPrice) {
        const reciprocal = utils.roundResult(divide(String(1), newPrice), 8);
        setPrice2(reciprocal);
      } else {
        setPrice2('');
      }
      onPriceChange(newPrice);
    } else {
      setPrice2(newPrice);
      if (newPrice) {
        const reciprocal = utils.roundResult(divide(String(1), newPrice), 8);
        setPrice(reciprocal);
        onPriceChange(reciprocal);
      } else {
        setPrice('');
        onPriceChange('');
      }
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentCheckToken(value);
  };

  const displayToken = currentCheckToken === String(PairTokenSelected.Token0) ? token0 : token1;
  const otherToken = currentCheckToken === String(PairTokenSelected.Token0) ? token1 : token0;
  const currentPrice = currentCheckToken === String(PairTokenSelected.Token0) ? price : price2;

  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center gap-2">
        <span className="text-lg font-medium text-primary">Set initial price</span>
        <BadgeHelpTooltip content="When creating a new pool, you must set the starting exchange rate for both tokens. This rate will reflect the initial market price." />
      </div>

      <div className="bg-gray-100 p-2 rounded-xl flex flex-col gap-1 cursor-pointer">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500">Initial price</span>
          <Tabs value="token0" onValueChange={handleTabChange}>
            <TabsList className="bg-transparent border border-gray-300 rounded-full">
              <TabsTrigger
                value={String(PairTokenSelected.Token0)}
                className={cn(
                  'h-6 rounded-full flex items-center gap-1 !data-[state=active]:bg-gray-500',
                  currentCheckToken === String(PairTokenSelected.Token0)
                    ? '!bg-gray-200 !text-black'
                    : '!text-gray-400'
                )}
              >
                <div className="h-4 w-4">
                  <LogoWithPlaceholder
                    src={token0?.logo}
                    className="h-4 w-4 object-contain rounded-[10px] z-10"
                    width={16}
                    height={16}
                    name={token0?.symbol ?? ''}
                  />
                </div>
                <span className="text-xs">{token0?.symbol}</span>
              </TabsTrigger>

              <TabsTrigger
                value={String(PairTokenSelected.Token1)}
                className={cn(
                  'h-6 rounded-full flex items-center gap-1',
                  currentCheckToken === String(PairTokenSelected.Token1)
                    ? '!bg-gray-200 !text-black'
                    : '!text-gray-400'
                )}
              >
                <div className="relative h-4 w-4">
                  <LogoWithPlaceholder
                    src={token1?.logo}
                    className="h-4 w-4 object-contain rounded-[10px] z-10"
                    width={16}
                    height={16}
                    name={token1?.symbol ?? ''}
                  />
                </div>
                <span className="text-xs">{token1?.symbol}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <NumberInput
          placeholder="0"
          value={currentPrice}
          onChange={(value) => handlePriceChange(value)}
          className="!text-2xl font-normal shadow-none focus-visible:ring-0 text-gray-900 !bg-transparent border-none outline-none p-0 w-full"
        />

        {otherToken && displayToken && (
          <div className="flex justify-between items-center sm:flex-row flex-col">
            <span className="text-xs text-gray-500">
              {otherToken?.symbol} = 1 {displayToken?.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
