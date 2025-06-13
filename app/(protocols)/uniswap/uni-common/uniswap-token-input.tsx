'use client';

import { useCallback, useMemo, useState } from 'react';

import { ERROR_MESSAGES } from '@/config/const-msg';
import { IToken } from '@/config/tokens';

import { ErrorVO } from '@/lib/model/error-vo';
import { cn } from '@/lib/utils';

import { SwapBaseTokenInput } from '../swap/swap-base-token-input';
import { SwapInputBalanceDisplay } from '../swap/swap-input-balance-display';
import { SwapTokenDisplay } from '../swap/swap-token-display';

interface SwapTokenInputProps {
  label: string | null;
  token: IToken | undefined;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  showMaxButton?: boolean;
  onShowTokenSelector?: () => void;
  onSetError?: (error: ErrorVO) => void;
  disabled?: boolean;
  className?: string;
}

export default function UniswapTokenInput({
  label,
  token,
  value,
  onChange,
  placeholder,
  showMaxButton = true,
  onShowTokenSelector,
  onSetError,
  disabled = false,
  className,
}: SwapTokenInputProps) {
  const [currentBalance, setCurrentBalance] = useState<string>('');

  const isExceedBalance = useMemo(
    () =>
      onSetError && token && currentBalance && parseFloat(value) > parseFloat(currentBalance)
        ? true
        : undefined,
    [onSetError, token, currentBalance, value]
  );

  const handleInput = useCallback(
    (val: string) => {
      if (val === value) return;

      onChange(val);

      if (!onSetError) return;

      if (token && currentBalance && parseFloat(val) > parseFloat(currentBalance)) {
        onSetError({
          showError: true,
          errorMessage: ERROR_MESSAGES.EXCEED_MAX_BALANCE,
        });
      } else {
        onSetError({
          showError: false,
          errorMessage: '',
        });
      }
    },
    [value, onChange, onSetError, token, currentBalance]
  );

  const handleMaxClick = useCallback(() => {
    if (currentBalance) {
      handleInput(currentBalance);
    }
  }, [currentBalance, handleInput]);

  const handleOutsideClick = useCallback(() => {
    if (!token && onShowTokenSelector) {
      onShowTokenSelector();
    }
  }, [token, onShowTokenSelector]);

  const handleBalanceChange = useCallback((balance: string) => {
    setCurrentBalance(balance);
  }, []);

  return (
    <div onClick={handleOutsideClick} className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-stretch flex-col pb-1 border rounded-2xl p-4 bg-primary-foreground">
        {label && <div className="text-xs text-gray-400">{label}</div>}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <SwapBaseTokenInput
              value={value}
              onChange={handleInput}
              placeholder={placeholder}
              disabled={disabled}
              isExceedBalance={isExceedBalance}
            />
          </div>
          <SwapTokenDisplay token={token} onClick={onShowTokenSelector} />
        </div>
        <SwapInputBalanceDisplay
          tokenAddress={token?.address || ''}
          showMaxButton={showMaxButton}
          onMaxClick={handleMaxClick}
          onBalanceChange={handleBalanceChange}
        />
      </div>
    </div>
  );
}
