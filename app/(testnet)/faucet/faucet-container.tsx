'use client';

import { useQuery } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { ERROR_MESSAGES } from '@/config/const-msg';
import { MONAD, MonUSD } from '@/config/tokens';

import { WithLoading } from '@/components/common/with-loading';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useFaucetAirdrop } from '@/lib/data/use-faucet-airdrop';
import { useSaveXBind } from '@/lib/data/use-save-x-bind';
import { ErrorVO } from '@/lib/model/error-vo';
import { cn } from '@/lib/utils';
import { useTwitterSign } from '@/lib/utils/use-twitter-sign';

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

  const [selectedToken, setSelectedToken] = useState(MONAD.address);

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
  const [isDirty, setIsDirty] = useState(false);

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

    if (!isDirty) {
      setErrorData({
        showError: false,
        errorMessage: '',
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
  }, [address, accountInfo, addressValue, isDirty]);

  const handleAirdrop = () => {
    faucetAirdrop({
      wallet: addressValue,
      token_address: selectedToken,
    });
  };

  function handleGoTwitter() {
    const url = new URL(window.location.href);
    goTwitter(url.toString());
  }

  return (
    <div className={cn('border-border border rounded-3xl px-5 py-4 mt-5')}>
      <h1 className="text-lg text-primary font-normal">Select Token</h1>
      <Select value={selectedToken} onValueChange={setSelectedToken}>
        <SelectTrigger className="w-full mt-3 shadow-none focus-visible:ring-0">
          <SelectValue placeholder="Select a token" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MONAD.address}>
            <div className="flex items-center gap-2">
              <Image src={MONAD.logo} alt={MONAD.name} width={20} height={20} />
              <span>{MONAD.symbol}</span>
            </div>
          </SelectItem>
          <SelectItem value={MonUSD.address}>
            <div className="flex items-center gap-2">
              <Image src={MonUSD.logo} alt={MonUSD.name} width={20} height={20} />
              <span>{MonUSD.symbol}</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <h1 className="text-lg text-primary font-normal mt-4">Enter Wallet Address</h1>
      <div className="relative w-full mt-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <Input
          value={addressValue}
          onChange={(e) => {
            setAddressValue(e.target.value);
            setIsDirty(true);
          }}
          className={cn(
            'w-full pl-10 pr-3 text-primary outline-none shadow-none focus-visible:ring-0'
          )}
          placeholder="0x8ce78...2816"
        />
      </div>

      <p className="text-sm mt-2 text-primary/60 font-normal">(Maximum 1 request every 12 hours)</p>

      <Button
        disabled={errorData.showError || isPending}
        className="w-full mt-4 bg-pro-blue/20 text-pro-blue hover:bg-pro-blue/30 hover:text-pro-blue"
        size="lg"
        variant="outline"
        onClick={handleAirdrop}
      >
        {isPending ? 'Processing...' : 'Get Testnet Mon'}
      </Button>

      <ErrorMessage show={errorData.showError} message={errorData.errorMessage} className="mt-2" />

      <p className="text-sm text-left text-primary/60 mt-3 font-normal">
        Testnet tokens are for development purposes only,
        <br />
        they do not have real value.
      </p>

      <Separator className="my-4" />

      <div className="text-primary font-normal">
        Connect your X account to get more testnet tokens!
      </div>
      <Button
        disabled={isSavingXBind}
        variant="outline"
        className="w-full flex items-center gap-2 mt-2 text-primary"
        onClick={handleGoTwitter}
      >
        {isSavingXBind ? (
          <WithLoading isLoading={isSavingXBind} />
        ) : (
          <>
            <Image src="/icons/x.svg" alt="Twitter" width={16} height={16} />
          </>
        )}
        <span>Connect X</span>
      </Button>
    </div>
  );
}
