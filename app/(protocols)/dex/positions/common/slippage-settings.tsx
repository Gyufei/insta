'use client';

import { useEffect, useState } from 'react';

import { NumberInput } from '@/components/common/number-input';
import { Button } from '@/components/ui/button';

import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { cn } from '@/lib/utils';

interface SlippageSettingsProps {
  onSlippageChange: (value: string) => void;
}

const AutoSlippage = '2.5';

export function SlippageSettings({ onSlippageChange }: SlippageSettingsProps) {
  const [isAuto, setIsAuto] = useState(true);
  const [inputValue, setInputValue] = useState('0.50');
  const { trackEvent } = useEnhancedAnalytics();

  // 初始化仅在挂载时运行，避免父组件回调引用变化导致值被重置
  useEffect(() => {
    setInputValue(AutoSlippage);
    onSlippageChange(AutoSlippage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoClick = () => {
    setIsAuto(true);
    setInputValue(AutoSlippage);
    onSlippageChange(AutoSlippage);

    // Track slippage change
    trackEvent('SLIPPAGE_CHANGE', {
      event_category: 'trading',
      event_label: 'auto_slippage',
      value: parseFloat(AutoSlippage),
      include_user_id: true,
    });
  };

  const handleCustomSlippageChange = (value: string) => {
    let sanitized = value;

    // 规范化以点开头的输入，如 .5 -> 0.5
    if (sanitized.startsWith('.')) {
      sanitized = `0${sanitized}`;
    }

    // 钳制最大值为 100
    const num = parseFloat(sanitized);
    if (!Number.isNaN(num) && num > 100) {
      sanitized = '100';
    }

    setIsAuto(false);
    setInputValue(sanitized);
    onSlippageChange(sanitized);

    // Track slippage change
    trackEvent('SLIPPAGE_CHANGE', {
      event_category: 'trading',
      event_label: 'custom_slippage',
      value: parseFloat(sanitized) || 0,
      include_user_id: true,
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 mt-4 text-[16px]">
      <div className="text-[#131E40] font-medium">Max slippage</div>
      <div className="flex items-center p-1 gap-2 border border-gray-200 rounded-[8px] bg-white">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-16 px-1 rounded-[8px] font-normal',
            isAuto
              ? 'bg-[#6E75F9] text-accent hover:brightness-105 hover:text-accent hover:bg-[#6E75F9] dark:hover:bg-[#6E75F9]'
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
              decimalPlaces={2}
            />
          </div>
          <span className="text-sm font-bold text-gray-500 ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
