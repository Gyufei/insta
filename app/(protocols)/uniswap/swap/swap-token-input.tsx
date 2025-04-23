'use client';

import { ChevronDown } from 'lucide-react';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { ERROR_MESSAGES } from '@/config/const-msg';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WithLoading } from '@/components/with-loading';

import { IToken } from '@/lib/data/tokens';
import { ErrorVO } from '@/lib/model/error-vo';
import { cn } from '@/lib/utils';

import { useGetBalance } from './use-get-balance';

interface TokenDisplayProps {
  token: IToken | undefined;
  onClick: () => void;
}

const TokenDisplay = ({ token, onClick }: TokenDisplayProps) => {
  return (
    <div
      className="flex rounded-full border border-border p-1 text-primary gap-1 cursor-pointer items-center"
      onClick={onClick}
    >
      {token ? (
        <>
          <Image
            src={token.logo}
            alt={token.symbol}
            width={16}
            height={16}
            loading="lazy"
            priority={false}
          />
          <div className="flex flex-col">
            <div className="text-sm font-medium">{token.symbol}</div>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm font-medium">Select token</div>
        </div>
      )}
      <ChevronDown className="h-4 w-4" />
    </div>
  );
};

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  isExceedBalance?: boolean;
}

const INPUT_SIZE_CLASSES = {
  sm: 'md:text-sm',
  md: 'md:text-base',
  lg: 'md:text-lg',
  xl: 'md:text-xl',
  '2xl': 'md:text-2xl',
};

const getInputSizeClass = (value: string) => {
  if (value.length <= 6) return INPUT_SIZE_CLASSES['2xl'];
  if (value.length <= 8) return INPUT_SIZE_CLASSES.xl;
  if (value.length <= 10) return INPUT_SIZE_CLASSES.lg;
  if (value.length <= 15) return INPUT_SIZE_CLASSES.md;
  return INPUT_SIZE_CLASSES.sm;
};

const TokenInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  isExceedBalance,
}: TokenInputProps) => {
  const inputSizeClass = useMemo(() => getInputSizeClass(value), [value]);

  return (
    <Input
      placeholder={placeholder}
      className={cn(
        inputSizeClass,
        'text-primary disabled:opacity-100 !h-10 px-0 leading-10 border-none shadow-none dark:bg-transparent !bg-transparent focus-visible:ring-0',
        isExceedBalance && 'text-red-500'
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

interface BalanceDisplayProps {
  tokenAddress: string;
  showMaxButton?: boolean;
  onMaxClick: () => void;
  onBalanceChange?: (balance: string) => void;
}

function BalanceDisplay({
  tokenAddress,
  showMaxButton,
  onMaxClick,
  onBalanceChange,
}: BalanceDisplayProps) {
  const [enableQuery, setEnableQuery] = useState(false);
  const { balance, isBalancePending } = useGetBalance(tokenAddress, enableQuery);

  useEffect(() => {
    if (tokenAddress) {
      setEnableQuery(true);
    }
  }, [tokenAddress]);

  // 当 balance 变化时通知父组件
  useEffect(() => {
    if (balance && onBalanceChange) {
      onBalanceChange(balance);
    }
  }, [balance, onBalanceChange]);

  return (
    <div className="flex justify-end items-center gap-1 my-1">
      <WithLoading isLoading={isBalancePending}>
        <span className="text-xs text-gray-400">{balance === '0' ? '0.00' : balance}</span>
      </WithLoading>
      {showMaxButton && (
        <Button variant="outline" size="sm" className="h-5 px-1 text-xs" onClick={onMaxClick}>
          Max
        </Button>
      )}
    </div>
  );
}

interface SwapTokenInputProps {
  label: string;
  token: IToken | undefined;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  showMaxButton?: boolean;
  onShowTokenSelector: () => void;
  onSetError?: (error: ErrorVO) => void;
  disabled?: boolean;
  className?: string;
}

export default function SwapTokenInput({
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

      if (val === '' || /^\d*\.?\d*$/.test(val)) {
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
    if (!token) {
      onShowTokenSelector();
    }
  }, [token, onShowTokenSelector]);

  const handleBalanceChange = useCallback((balance: string) => {
    setCurrentBalance(balance);
  }, []);

  return (
    <div onClick={handleOutsideClick} className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-stretch flex-col pb-1 border rounded-2xl bg-muted p-4 focus-within:bg-primary-foreground">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <TokenInput
              value={value}
              onChange={handleInput}
              placeholder={placeholder}
              disabled={disabled}
              isExceedBalance={isExceedBalance}
            />
          </div>
          <TokenDisplay token={token} onClick={onShowTokenSelector} />
        </div>
        <BalanceDisplay
          tokenAddress={token?.address || ''}
          showMaxButton={showMaxButton}
          onMaxClick={handleMaxClick}
          onBalanceChange={handleBalanceChange}
        />
      </div>
    </div>
  );
}
