import { useEffect, useMemo } from 'react';

import { useAccountStore } from '../../state/account';
import { useAccounts } from './use-account';

export function useSelectedAccount() {
  const { data: accountInfo, isLoading, isSuccess } = useAccounts();
  const {
    currentAccountAddress,
    setCurrentAccountType,
    setCurrentAccountAddress,
  } = useAccountStore();

  const findAccountByAddress = useMemo(() => {
    return (address: string | null) => {
      if (!address || !accountInfo) return null;
      return accountInfo.find((account) => account.sandbox_account === address) || null;
    };
  }, [accountInfo]);

  const selectedAccount = useMemo(() => {
    return findAccountByAddress(currentAccountAddress);
  }, [currentAccountAddress, findAccountByAddress]);

  useEffect(() => {
    const findAccount = findAccountByAddress(currentAccountAddress);

    if (!findAccount && accountInfo && accountInfo.length > 0) {
      const firstAccount = accountInfo[0];
      setCurrentAccountAddress(firstAccount.sandbox_account);
    }
  }, [currentAccountAddress, accountInfo, setCurrentAccountAddress, findAccountByAddress]);

  useEffect(() => {
    if (isSuccess && accountInfo && !accountInfo.length) {
      setCurrentAccountType('EOA');
    }
  }, [accountInfo, isSuccess, setCurrentAccountType]);

  return {
    isLoading,
    isSuccess,
    data: selectedAccount,
  };
}
