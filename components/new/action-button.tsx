'use client';

import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import { ERROR_MESSAGES } from '@/config/const-msg';

import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { ErrorVO } from '@/lib/model/error-vo';
import { useAccountStore } from '@/lib/state/account';
import { cn } from '@/lib/utils';

import { ErrorMessage } from './error-message';

interface ActionButtonProps {
  disabled: boolean;
  onClick: () => void;
  isPending: boolean;
  children: React.ReactNode;
  error?: ErrorVO | undefined;
  className?: string;
  exchangeRate?: string;
  // Button height: discrete sizes to ensure Tailwind safelist
  height?: 'sm' | 'md' | 'lg' | 'xl';
  checkFlag?:
    | {
        address: boolean;
        accountInfo: boolean;
        onlyDSA: boolean;
      }
    | undefined;
  [key: string]: unknown;
}

export function ActionButton({
  disabled,
  onClick,
  isPending,
  children,
  error,
  checkFlag = { address: true, accountInfo: true, onlyDSA: true },
  className,
  exchangeRate,
  height = 'md',
  ...rest
}: ActionButtonProps) {
  const { address } = useAccount();
  const { data: accountInfo, isLoading: isAccountLoading } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

  const [internalDisabled, setInternalDisabled] = useState(disabled);
  const [internalErrorData, setInternalErrorData] = useState({
    showError: false,
    errorMessage: '',
  });

  const isDisabled = useMemo(() => {
    return disabled || internalDisabled;
  }, [disabled, internalDisabled]);

  const errorData = useMemo(() => {
    return {
      showError: error?.showError || internalErrorData.showError,
      errorMessage: error?.showError ? error?.errorMessage : internalErrorData.errorMessage,
    };
  }, [error, internalErrorData]);

  useEffect(() => {
    if (checkFlag.onlyDSA && currentAccountType === 'EOA') {
      setInternalDisabled(true);
      setInternalErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ONLY_DSA_ACCOUNT,
      });
      return;
    }

    if (checkFlag.address && !address) {
      setInternalDisabled(true);
      setInternalErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
      return;
    }

    // Only show account not created error if not loading and accountInfo is null
    if (checkFlag.accountInfo && !isAccountLoading && !accountInfo) {
      setInternalDisabled(true);
      setInternalErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ACCOUNT_NOT_CREATED,
      });
      return;
    }

    setInternalDisabled(false);
    setInternalErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [
    checkFlag.address,
    checkFlag.accountInfo,
    address,
    accountInfo,
    isAccountLoading,
    currentAccountType,
  ]);

  function handleClick() {
    if (isDisabled || isPending) return;
    onClick();
  }

  return (
    <>
      <div className={cn('mt-5 flex flex-shrink-0', className)}>
        <Button
          disabled={isDisabled}
          onClick={handleClick}
          className={cn(
            'w-full bg-[#6E75F9] hover:bg-[#5A61E8] text-white font-medium py-3 rounded-lg mb-3 mt-5 text-base',
            // Map height to Tailwind classes so they are statically present in the safelist
            height === 'sm' && 'h-10',
            height === 'md' && 'h-12',
            height === 'lg' && 'h-14',
            height === 'xl' && 'h-16'
          )}
          variant="default"
          size="sm"
          {...rest}
        >
          <div className="flex w-full items-center justify-center truncate">
            <WithLoading isLoading={!!isPending} className="mr-2" />
            <div className="flex items-center truncate py-0.5">{children}</div>
          </div>
        </Button>
      </div>

      {/* Exchange Rate */}
      {exchangeRate && (
        <div className="text-sm text-[#999999] text-center flex justify-between px-1">
          Exchange rate: <span className="text-black font-medium">{exchangeRate}</span>
        </div>
      )}

      <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
    </>
  );
}
