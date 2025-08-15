'use client';

import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { ERROR_MESSAGES } from '@/config/const-msg';
import { MONAD, MonUSD } from '@/config/tokens';

import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAccounts, useSelectedAccount } from '@/lib/data/use-account';
import { useFaucetAirdrop } from '@/lib/data/use-faucet-airdrop';
import { ErrorVO } from '@/lib/model/error-vo';
import { cn, formatAddress } from '@/lib/utils';

export function FaucetContainer() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { mutate: faucetAirdrop, isPending } = useFaucetAirdrop();

  const { data: accounts } = useAccounts();
  const { data: currentAccount } = useSelectedAccount();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    currentAccount?.sandbox_account || null
  );

  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (isInit) {
      return;
    }

    if (currentAccount) {
      setSelectedAccount(currentAccount.sandbox_account);
      setIsInit(true);
    }
  }, [currentAccount, isInit]);

  const [selectedToken, setSelectedToken] = useState(MONAD.address);

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

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

    if (!selectedAccount) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ACCOUNT_ADDRESS_REQUIRED,
      });
      return;
    }

    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [address, accountInfo, selectedAccount]);

  const handleAirdrop = () => {
    faucetAirdrop({
      token_address: selectedToken,
      sandbox_account: selectedAccount || '',
    });
  };

  return (
    <div className={cn('border-[#ebebeb] w-full md:w-fit border rounded-[8px] px-5 py-4 mt-5')}>
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

      <h1 className="text-lg text-primary font-normal mt-4">Select Account Address</h1>
      <div className="relative w-full mt-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <Select
          value={selectedAccount || ''}
          onValueChange={(value) => {
            setSelectedAccount(value);
          }}
        >
          <SelectTrigger className="w-full pl-10 mt-3 shadow-none focus-visible:ring-0">
            <SelectValue placeholder="Select a account">
              {formatAddress(selectedAccount || '')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {accounts?.map((account) => (
              <SelectItem key={account.sandbox_account} value={account.sandbox_account}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    {account.id}
                  </div>
                  <span>{formatAddress(account.sandbox_account)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm mt-2 text-primary/60 font-normal">(Maximum 1 request every 24 hours)</p>

      <Button
        disabled={errorData.showError || isPending}
        className="h-8 w-full mt-4 bg-pro-blue/20 text-pro-blue hover:bg-pro-blue/30 hover:text-pro-blue"
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
    </div>
  );
}
