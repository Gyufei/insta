'use client';

import { ERROR_MESSAGES } from '@/config/const-msg';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { WithLoading } from '@/components/common/with-loading';

import { useSelectedAccount } from '@/lib/data/use-account';
import { ErrorVO } from '@/lib/model/error-vo';

import { ErrorMessage } from './error-message';

interface ActionButtonProps {
  disabled: boolean;
  onClick: () => void;
  isPending: boolean;
  children: React.ReactNode;
  error?: ErrorVO | undefined;
  checkFlag?:
    | {
        address: boolean;
        accountInfo: boolean;
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
  checkFlag = { address: true, accountInfo: true },
  ...rest
}: ActionButtonProps) {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();

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
      ...internalErrorData,
      ...error,
    };
  }, [error, internalErrorData]);

  useEffect(() => {
    if (checkFlag.address && !address) {
      setInternalDisabled(true);
      setInternalErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
      return;
    }

    if (checkFlag.accountInfo && !accountInfo) {
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
  }, [checkFlag.address, checkFlag.accountInfo, address, accountInfo]);

  function handleClick() {
    if (isDisabled || isPending) return;
    onClick();
  }

  return (
    <>
      <div className="mt-6 flex flex-shrink-0">
        <Button
          disabled={isDisabled}
          onClick={handleClick}
          className="w-full"
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

      <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
    </>
  );
}
