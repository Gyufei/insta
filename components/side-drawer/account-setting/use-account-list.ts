import { useAccount } from 'wagmi';

import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useAccounts, useSelectedAccount } from '@/lib/data/use-account';
import { useCreateAccount } from '@/lib/data/use-create-account';
import { useAccountStore } from '@/lib/state/account';
import { useWalletBalance } from '@/lib/web3/use-wallet-balance';

const GAS_LIMIT_FOR_CREATE_ACCOUNT = 0.0161845008;

export function useAccountList() {
  const { address } = useAccount();
  const { data: allAccounts } = useAccounts();
  const { data: currAccountInfo } = useSelectedAccount();
  const { setCurrentAccountAddress } = useAccountStore();
  const { mutateAsync: createAccount, isPending: isCreatePending } = useCreateAccount();

  const { balance: monadBalance } = useWalletBalance(NetworkConfigs.monadTestnet.id);

  const tooLessGasForCreate = useMemo(() => {
    return !address || Number(monadBalance) < GAS_LIMIT_FOR_CREATE_ACCOUNT;
  }, [address, monadBalance]);

  async function handleCreateAccount() {
    if (!address) return;
    await createAccount(address);
  }

  function handleToggleAccount(accAddr: string) {
    if (currAccountInfo?.sandbox_account === accAddr) return;
    setCurrentAccountAddress(accAddr);
  }

  return {
    allAccounts,
    currAccountInfo,
    isCreatePending,
    handleCreateAccount,
    handleToggleAccount,
    tooLessGasForCreate,
  };
}
