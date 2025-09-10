import { useAccount } from 'wagmi';

import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useAccounts } from '@/lib/data/account-address/use-account';
import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useCreateAccount } from '@/lib/data/use-create-account';
import { useAccountStore } from '@/lib/state/account';
import { useRPCNativeBalance } from '@/lib/data/balance/use-rpc-native-balance';

const GAS_LIMIT_FOR_CREATE_ACCOUNT = 0.0161845008;

export function useAccountList() {
  const { address } = useAccount();
  const { data: allAccounts } = useAccounts();
  const { data: currAccountInfo } = useSelectedAccount();
  const { setCurrentAccountAddress } = useAccountStore();
  const { mutateAsync: createAccount, isPending: isCreatePending } = useCreateAccount();
  const { currentAccountType, setCurrentAccountType } = useAccountStore();

  const { balance: monadBalance } = useRPCNativeBalance(NetworkConfigs.monadTestnet.id, address || '');

  const tooLessGasForCreate = useMemo(() => {
    return !address || Number(monadBalance) < GAS_LIMIT_FOR_CREATE_ACCOUNT;
  }, [address, monadBalance]);

  const currentAccount = useMemo(() => {
    if (currentAccountType === 'EOA') {
      return {
        sandbox_account: address,
        id: 'EOA',
      };
    }

    return currAccountInfo;
  }, [currAccountInfo, currentAccountType, address]);

  async function handleCreateAccount() {
    if (!address) return;
    await createAccount(address);
  }

  function handleToggleAccount(accAddr: string) {
    setCurrentAccountType('DSA');
    if (currAccountInfo?.sandbox_account === accAddr) return;
    setCurrentAccountAddress(accAddr);
  }

  return {
    allAccounts,
    currAccountInfo: currentAccount,
    isCreatePending,
    handleCreateAccount,
    handleToggleAccount,
    tooLessGasForCreate,
  };
}
