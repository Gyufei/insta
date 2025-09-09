'use client';

import { useEffect, useState } from 'react';

import { NumberInput } from '@/components/common/number-input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface SlippageSettingsProps {
  onSlippageChange: (value: string) => void;
}

const AutoSlippage = '1';

export function SlippageSettings({ onSlippageChange }: SlippageSettingsProps) {
  const [isAuto, setIsAuto] = useState(true);
  const [inputValue, setInputValue] = useState('0.50');

  useEffect(() => {
    setInputValue(AutoSlippage);
    onSlippageChange(AutoSlippage);
  }, [onSlippageChange]);

  const handleAutoClick = () => {
    setIsAuto(true);
    setInputValue(AutoSlippage);
    onSlippageChange(AutoSlippage);
  };

  const handleCustomSlippageChange = (value: string) => {
    setIsAuto(false);
    setInputValue(value);
    onSlippageChange(value);
  };

  return (
    <div className="flex items-center justify-between gap-2 mt-2 text-sm">
      <div className="text-muted-foreground font-medium">Max slippage</div>
      <div className="flex items-center p-1 gap-2 border border-gray-200 rounded-xl">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-6 px-2 rounded-lg font-normal',
            isAuto
              ? 'bg-accent-foreground text-accent hover:brightness-105 hover:text-accent hover:bg-accent-foreground/90 dark:hover:bg-accent-foreground/90'
              : 'bg-gray-300 text-muted-foreground hover:brightness-105 hover:text-muted-foreground hover:bg-gray-300/90 dark:hover:bg-gray-300/90'
          )}
          onClick={handleAutoClick}
        >
          Auto
        </Button>
        <div className="flex items-center flex-1">
          <div className="relative flex items-center">
            <NumberInput
              value={inputValue}
              onChange={(v) => handleCustomSlippageChange(v)}
              className="!w-[44px] h-6 pr-0 pl-0 text-primary text-right border-none shadow-none focus-visible:ring-0 !bg-transparent"
              min="0"
              step="0.1"
            />
          </div>
          <span className="text-sm font-bold text-gray-500 ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
