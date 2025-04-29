'use client';

import { useQuery } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { ERROR_MESSAGES } from '@/config/const-msg';

import { WithLoading } from '@/components/common/with-loading';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useFaucetAirdrop } from '@/lib/data/use-faucet-airdrop';
import { useSaveXBind } from '@/lib/data/use-save-x-bind';
import { ErrorVO } from '@/lib/model/error-vo';
import { cn } from '@/lib/utils';
import { useTwitterSign } from '@/lib/utils/use-twitter-sign';
import { isAddress } from 'viem';

export function FaucetContainer() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { mutate: faucetAirdrop, isPending } = useFaucetAirdrop();

  const { code, error, goTwitter, removeXVerifyCode } = useTwitterSign();
  const {
    mutate: saveXBind,
    isSuccess: isSaveXBindSuccess,
    isPending: isSavingXBind,
  } = useSaveXBind();

  useQuery({
    queryKey: code ? ['save-twitter', code] : [],
    queryFn: () =>
      saveXBind({
        code: code!,
        redirect_uri: 'http://localhost:3000/faucet',
      }),
    enabled: !!code,
  });

  const [addressValue, setAddressValue] = useState('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (isSaveXBindSuccess) {
      removeXVerifyCode();
    }
  }, [isSaveXBindSuccess, removeXVerifyCode]);

  useEffect(() => {
    if (error) {
      setErrorData({
        showError: true,
        errorMessage: error as string,
      });
    }
  }, [error]);

  useEffect(() => {
    if (!address) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
      return;
    }

    if (!accountInfo) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ACCOUNT_NOT_CREATED,
      });
      return;
    }

    if (!addressValue) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_ADDRESS_REQUIRED,
      });
      return;
    }

    if (!isAddress(addressValue)) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.INVALID_WALLET_ADDRESS,
      });
      return;
    }

    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [address, accountInfo, addressValue]);

  const handleAirdrop = () => {
    faucetAirdrop({ wallet: addressValue });
  };

  function handleGoTwitter() {
    const url = new URL(window.location.href);
    goTwitter(url.toString());
  }

  return (
    <div className={cn('border-border border rounded-3xl px-5 py-4 mt-5 max-w-lg mx-auto')}>
      <h1 className="text-xl text-primary font-medium">Enter wallet address</h1>
      <div className="relative w-full mt-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <Input
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          className={cn(
            'w-full pl-10 pr-3 text-primary outline-none shadow-none focus-visible:ring-0'
          )}
          placeholder="0x8ce78...2816"
        />
      </div>

      <p className="text-sm mt-2 text-primary/60">(Maximum 1 request every 12 hours)</p>

      <Button
        disabled={errorData.showError || isPending}
        className="w-full mt-4"
        size="lg"
        onClick={handleAirdrop}
      >
        {isPending ? 'Processing...' : 'Get Testnet Mon'}
      </Button>
      <ErrorMessage show={errorData.showError} message={errorData.errorMessage} className="mt-2" />

      <p className="text-sm text-left text-primary/60 mt-3">
        Testnet tokens are for development purposes only,
        <br />
        they do not have real value.
      </p>

      <div className="mt-10 text-primary">Connect your X account to get more testnet tokens!</div>
      <Button
        disabled={isSavingXBind}
        variant="outline"
        className="w-full flex items-center gap-2 mt-2 text-primary"
        onClick={handleGoTwitter}
      >
        <WithLoading isLoading={isSavingXBind} />
        <span>Connect</span>
        <Image src="/icons/x.svg" alt="Twitter" width={16} height={16} />
      </Button>
    </div>
  );
}
