'use client';

import type React from 'react';
import { useState } from 'react';

import { BadgeHelpTooltip } from '@/components/common/badge-help';
import { NumberInput } from '@/components/common/number-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

interface PriceRangeSelectorProps {
  token0Symbol: string;
  token1Symbol: string;
  priceRangeMin: string;
  priceRangeMax: string;
  onMinPriceChange: (minPrice: string) => void;
  onMaxPriceChange: (maxPrice: string) => void;
}

export default function PriceRangeSelector({
  token0Symbol,
  token1Symbol,
  priceRangeMin,
  priceRangeMax,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeSelectorProps) {
  const [rangeType, setRangeType] = useState<'FULL' | 'CUSTOM'>('CUSTOM');

  const handleRangeTypeChange = (value: string) => {
    const newRangeType = value as 'FULL' | 'CUSTOM';
    setRangeType(newRangeType);

    if (newRangeType === 'FULL') {
      onMinPriceChange?.('0');
      onMaxPriceChange?.('∞');
    } else {
      onMinPriceChange?.('');
      onMaxPriceChange?.('');
    }
  };

  const handleMinPriceChange = (value: string) => {
    onMinPriceChange?.(value);
  };

  const handleMaxPriceChange = (value: string) => {
    onMaxPriceChange?.(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-medium text-primary">Price range</div>

      <Tabs value={rangeType} onValueChange={handleRangeTypeChange} className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-9 p-1 bg-transparent border border-border rounded-full">
          <TabsTrigger
            value="FULL"
            className={cn(
              'rounded-full text-sm font-medium h-6 [&_svg]:pointer-events-auto',
              rangeType === 'FULL' ? '!bg-gray-200 !text-black' : '!text-gray-400'
            )}
          >
            <span>Full range</span>
            <BadgeHelpTooltip content="Full range allows you to provide liquidity across the entire price range of the token pair, ensuring continuous market participation." />
          </TabsTrigger>
          <TabsTrigger
            value="CUSTOM"
            className={cn(
              'rounded-full text-sm font-medium h-6 [&_svg]:pointer-events-auto',
              rangeType === 'CUSTOM' ? '!bg-gray-200 !text-black' : '!text-gray-400'
            )}
          >
            <span>Custom range</span>
            <BadgeHelpTooltip content="Custom range allows you to concentrate your liquidity within a specific price range, potentially earning more fees but requiring active management." />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-grow flex-shrink relative bg-gray-100 p-2 justify-between overflow-hidden rounded-lg">
          <div className="flex flex-col gap-1 overflow-hidden flex-grow">
            <span className="text-sm text-gray-500">Min price</span>
            <NumberInput
              placeholder="0"
              value={priceRangeMin}
              onChange={handleMinPriceChange}
              disabled={rangeType === 'FULL'}
              className="font-normal !text-lg !bg-transparent text-black shadow-none focus-visible:ring-0 border-none outline-none p-0 w-full"
            />
            {token0Symbol && token1Symbol && (
              <span className="text-xs text-gray-500">
                {token0Symbol} = 1 {token1Symbol}
              </span>
            )}
          </div>
        </div>

        <div className="flex-grow flex-shrink relative bg-gray-100 p-2 justify-between overflow-hidden rounded-lg">
          <div className="flex flex-col gap-1 overflow-hidden flex-grow">
            <span className="text-sm text-gray-500">Max price</span>
            <NumberInput
              inputMode="decimal"
              placeholder="∞"
              value={priceRangeMax}
              onChange={handleMaxPriceChange}
              disabled={rangeType === 'FULL'}
              className="font-normal !text-lg !bg-transparent text-black shadow-none focus-visible:ring-0 border-none outline-none p-0 w-full"
            />
            {token0Symbol && token1Symbol && (
              <span className="text-xs text-gray-500">
                {token0Symbol} = 1 {token1Symbol}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
