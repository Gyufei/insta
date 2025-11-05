'use client';

import { CircleAlert, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';



import { useEffect, useMemo, useState } from 'react';



import Image from 'next/image';



import { MONAD, MonUSD } from '@/config/tokens';



import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



import { useAccounts } from '@/lib/data/account-address/use-account';
import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useCreateAccount } from '@/lib/data/use-create-account';
import { useFaucetAirdrop } from '@/lib/data/use-faucet-airdrop';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { eventBus } from '@/lib/state/eventBus';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn, formatAddress } from '@/lib/utils';
import { useWalletConnect } from '@/lib/web3/use-wallet-connect';

export function FaucetContainer() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();

  const { isPending: isCreatePending } = useCreateAccount();
  const { setCurrentComponent } = useSideDrawerStore();
  const { mutate: faucetAirdrop, isPending } = useFaucetAirdrop();
  const { trackEvent } = useEnhancedAnalytics();

  const { data: accounts } = useAccounts();
  const { data: currentAccount } = useSelectedAccount();
  const { openWeb3Modal } = useWalletConnect();

  const [selectOpen, setSelectOpen] = useState(false);
  const [monAddress, setMonAddress] = useState<string | null>(
    currentAccount?.sandbox_account || null
  );
  const [monUSDAddress, setMonUSDAddress] = useState<string | null>(
    currentAccount?.sandbox_account || null
  );

  const [inputAddress, setInputAddress] = useState<string | null>(null);
  const [inputValid, setInputValid] = useState(true);

  const [selectedToken, setSelectedToken] = useState(MonUSD.address);
  const isCheckMon = selectedToken === MONAD.address;
  const isCheckMonUSD = selectedToken === MonUSD.address;
  const selectedAccount = isCheckMon ? monAddress : isCheckMonUSD ? monUSDAddress : '';

  const accountsOptions = useMemo(() => {
    const options = [];
    for (const account of accounts || []) {
      if (account.sandbox_account) {
        options.push({
          label: account.sandbox_account || '',
          value: account.sandbox_account || '',
          wallet_type: 'DSA',
        });
      }
    }
    if (isCheckMon) {
      return options;
    }

    if (address) {
      options.push({
        label: address || '',
        value: address || '',
        wallet_type: 'EOA',
      });
    }
    return options;
  }, [accounts, address, isCheckMon]);

  const isDSA = useMemo(() => {
    return (
      accountsOptions.find((account) => account.value === selectedAccount)?.wallet_type === 'DSA'
    );
  }, [selectedAccount, accountsOptions]);

  const tipContent = useMemo(() => {
    const EoaText = '50 $monUSD / 7 days. But 200 $monUSD / 1 day with DSA Account';

    if (!address) {
      if (isCheckMon) {
        return 'Please connect wallet first .';
      }
      if (isCheckMonUSD) {
        return EoaText;
      }
    } else {
      if (isCheckMon) {
        return 'DSA Account only. Maximum 1 request / 24 hours.';
      }
      if (isCheckMonUSD) {
        if (isDSA) {
          return '200 $monUSD / 1 day';
        } else {
          return EoaText;
        }
      }
    }
  }, [address, isCheckMon, isCheckMonUSD, isDSA]);

  function handleJumpTo({ addr }: { addr: string }) {
    setSelectedToken(MonUSD.address);
    setMonUSDAddress(addr);
  }

  useEffect(() => {
    const addrData = sessionStorage.getItem('claim-monUsd');
    if (addrData) {
      const addr = JSON.parse(addrData).address;
      setTimeout(() => {
        handleJumpTo({ addr });
      }, 1000);
      sessionStorage.removeItem('claim-monUsd');
    }
  }, []);

  useEffect(() => {
    const unSub = eventBus.subscribe(
      'claim-monUsd',
      (data: { name: string; props: { address: string } }) => {
        if (data.name === 'ClaimMonUsd') {
          handleJumpTo({ addr: data.props.address });
        }
      }
    );

    return () => unSub();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      setMonAddress(currentAccount.sandbox_account);
      if (!monUSDAddress || isDSA) {
        setMonUSDAddress(currentAccount.sandbox_account);
      }
    }
  }, [currentAccount]);

  useEffect(() => {
    if (!accountsOptions.length) return;

    const isMonUSDExist = accountsOptions.find((account) => account.value === monUSDAddress);
    const isMonExist = accountsOptions.find((account) => account.value === monAddress);

    if (!isMonUSDExist) {
      setMonUSDAddress(accountsOptions[0].value);
    }

    if (!isMonExist) {
      setMonAddress(accountsOptions[0].value);
    }
  }, [isCheckMonUSD, currentAccount, accountsOptions, monAddress, monUSDAddress]);

  const handleCreateAccount = () => {
    if (!address) return;
    setCurrentComponent({ name: 'AccountSetting' });
  };

  const handleSelectAddress = (address: string) => {
    if (isCheckMon) {
      setMonAddress(address);
    } else if (isCheckMonUSD) {
      setMonUSDAddress(address);
    }
    setSelectOpen(false);
  };

  const handleConnectWallet = () => {
    openWeb3Modal();
  };

  const handleInputChange = (value: string) => {
    setInputAddress(value);
    if (!value) {
      setInputValid(true);
      return;
    }
    const isAddr = isAddress(value);
    if (isAddr) {
      setInputValid(true);
    } else {
      setInputValid(false);
    }
  };

  const handleAirdrop = () => {
    if (!address && isCheckMonUSD) {
      if (!inputAddress) {
        toast.warning('Please input wallet address');
        setInputValid(false);
        return;
      }
      if (!isAddress(inputAddress)) {
        toast.warning('Invalid wallet address');
        setInputValid(false);
        return;
      }
    }

    const wallet = !address ? inputAddress : isDSA ? address : selectedAccount || '';

    const tokenSymbol = selectedToken === MONAD.address ? 'MON' : 'MonUSD';

    // Track faucet claim attempt
    trackEvent('FAUCET_CLAIM', {
      event_category: 'faucet',
      event_label: 'faucet_claim_attempt',
      include_user_id: true,
      custom_parameters: {
        token: tokenSymbol,
        wallet_type: isDSA ? 'DSA' : 'EOA',
        has_wallet_connected: !!address,
      },
    });

    faucetAirdrop(
      {
        wallet,
        wallet_type: isDSA ? 'DSA' : 'EOA',
        token_address: selectedToken,
        sandbox_account: isDSA ? selectedAccount : currentAccount?.sandbox_account || '',
      },
      {
        onSuccess: () => {
          // Track successful claim
          trackEvent('FAUCET_CLAIM', {
            event_category: 'faucet',
            event_label: 'faucet_claim_success',
            include_user_id: true,
            custom_parameters: {
              token: tokenSymbol,
              wallet_type: isDSA ? 'DSA' : 'EOA',
            },
          });
        },
        onError: (error: Error) => {
          // Track failed claim
          trackEvent('ERROR_OCCURRED', {
            event_category: 'faucet',
            event_label: 'faucet_claim_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              token: tokenSymbol,
              wallet_type: isDSA ? 'DSA' : 'EOA',
            },
          });
        },
      }
    );
  };

  return (
    <div className={cn('border-[#ebebeb] w-full md:w-[450px] border rounded-[8px] px-5 py-4 mt-5')}>
      <h1 className="text-lg text-primary font-normal">Token</h1>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          className={cn(
            'hidden relative flex-1 rounded-[8px] text-sm cursor-pointer items-center gap-2 border px-4 py-3 outline-none select-none focus:outline-none',
            isCheckMon ? 'border-[#6E75F9] ' : 'border-[#EBEBEB] hover:border-[#6E75F9]'
          )}
          onClick={() => setSelectedToken(MONAD.address)}
        >
          <div className="flex items-center gap-2">
            <Image src={MONAD.logo} alt={MONAD.name} width={16} height={16} />
            <p className="leading-none font-medium">{MONAD.symbol}</p>
          </div>
          {selectedToken === MONAD.address && (
            <Image
              alt="check"
              src="/icons/check.svg"
              width="16"
              height="16"
              className="absolute -top-[6px] -right-[6px]"
            />
          )}
        </Button>
        <Button
          variant="outline"
          className={cn(
            'relative flex flex-1 rounded-[8px] text-sm cursor-pointer items-center justify-start gap-2 border px-4 py-3 outline-none select-none focus:outline-none',
            'border-[#EBEBEB] bg-white hover:bg-white cursor-auto hover:border-[#6E75F9]'
          )}
          onClick={() => setSelectedToken(MonUSD.address)}
        >
          <div className="flex items-center gap-2">
            <Image src={MonUSD.logo} alt={MonUSD.name} width={16} height={16} />
            <p className="leading-none font-medium">{MonUSD.symbol}</p>
          </div>
          {selectedToken === MonUSD.address && (
            <Image
              alt="check"
              src="/icons/check.svg"
              width="16"
              height="16"
              className="hidden absolute -top-[6px] -right-[6px]"
            />
          )}
        </Button>
      </div>

      {!(isCheckMon && address && !accountInfo?.sandbox_account) && (
        <h1 className="text-lg text-primary font-normal mt-4">
          {isCheckMonUSD ? 'Select Account / Wallet' : 'Select Account'}
        </h1>
      )}
      <div className="relative w-full mt-3">
        {(!isCheckMon || (isCheckMon && address && accountInfo?.sandbox_account)) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        )}
        {!address ? (
          isCheckMon ? (
            <div className="border border-[#FC4E08] p-3 rounded-[8px] text-xs font-medium gap-2 bg-[#FEEDE6] text-[#FC4E08] h-10 flex items-center">
              <CircleAlert className="w-4 h-4" />
              <span className="text-sm">Please connect wallet first</span>
            </div>
          ) : (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Input Wallet Address"
              className={cn('pl-10', !inputValid && 'border-destructive')}
              value={inputAddress || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              aria-invalid={!inputValid}
            />
          )
        ) : isCheckMon && !accountInfo?.sandbox_account ? (
          <></>
        ) : (
          <Select
            value={selectedAccount || ''}
            onValueChange={(value) => {
              handleSelectAddress(value);
            }}
            open={selectOpen}
            onOpenChange={(open) => setSelectOpen(open)}
            disabled={accountsOptions.length === 0}
          >
            <SelectTrigger className="w-full pl-10 mt-2 shadow-none focus-visible:ring-0">
              <SelectValue placeholder="Select a account">
                {formatAddress(selectedAccount || '', {
                  prefix: 12,
                  suffix: 12,
                })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {accountsOptions?.map((account) => (
                <SelectItem key={account.value} value={account.value} hideCheck asChild>
                  <div
                    className={cn(
                      'w-full flex justify-between items-center rounded-xs hover:bg-[#fafafa] cursor-pointer',
                      selectedAccount === account.value && 'bg-[#fafafa]'
                    )}
                    onClick={() => handleSelectAddress(account.value)}
                  >
                    <div className="flex items-center gap-2 h-8">
                      {selectedAccount === account.value ? (
                        <Image src="/icons/check-main.svg" alt="check" width={14} height={14} />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                      <span
                        className={cn(
                          'text-black text-sm',
                          selectedAccount === account.value && 'text-primary'
                        )}
                      >
                        {formatAddress(account.value, {
                          prefix: 12,
                          suffix: 12,
                        })}
                      </span>
                    </div>
                    <div className="bg-[#6E75F910] text-xs text-[#6E75F9] px-2 h-5 flex items-center justify-center">
                      {account.wallet_type}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {(!isCheckMon || (isCheckMon && address)) && (
        <p className="text-xs mt-2 text-[#A5ADC6] font-normal">{tipContent}</p>
      )}

      {!address && (
        <Button
          onClick={handleConnectWallet}
          className="w-full mt-4 bg-[#6E75F9] h-10 text-white hover:bg-[#6E75F9]/80"
        >
          <div className="flex items-center justify-center">
            <div className="text-white">Connect Wallet</div>
          </div>
        </Button>
      )}

      {address && !accountInfo?.sandbox_account && (
        <Button
          onClick={handleCreateAccount}
          disabled={isCreatePending}
          className="w-full mt-4 bg-[#6E75F9] h-10 text-white hover:bg-[#6E75F9]/80 outline-none"
        >
          <div className="flex flex-col">
            <div className="text-white">
              {isCreatePending ? 'Creating...' : 'Create DSA Account'}
            </div>
            <div className="text-[10px] text-white opacity-50">
              {isCheckMon ? 'for receive MON' : 'for 30×  monUSD'}
            </div>
          </div>
        </Button>
      )}

      {(isCheckMonUSD || (address && isCheckMon && accountInfo?.sandbox_account)) && (
        <Button
          disabled={isPending}
          className="h-10 w-full mt-4 bg-pro-blue/20 text-pro-blue hover:bg-pro-blue/30 hover:text-pro-blue"
          variant="outline"
          onClick={handleAirdrop}
        >
          {isPending ? 'Processing...' : isCheckMon ? 'Get $MON' : 'Get $monUSD '}
        </Button>
      )}
    </div>
  );
}