import { useEffect, useMemo, useRef } from 'react';

import { useAccountStore } from '../../state/account';
import { useAccounts } from './use-account';

export function useSelectedAccount() {
  const { data: accountInfo, isLoading, isSuccess } = useAccounts();
  const {
    currentAccountAddress,
    currentAccountType,
    setCurrentAccountType,
    setCurrentAccountAddress,
  } = useAccountStore();

  // Track if we've already set EOA mode to prevent infinite loops
  const hasSetEOAMode = useRef(false);

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
    // Only set EOA mode once when we successfully fetch empty account data
    // and we're not already in EOA mode
    if (isSuccess && accountInfo && accountInfo.length === 0 && currentAccountType !== 'EOA' && !hasSetEOAMode.current) {
      hasSetEOAMode.current = true;
      setCurrentAccountType('EOA');
    }

    // Reset the flag if accounts are found (user created an account)
    if (accountInfo && accountInfo.length > 0) {
      hasSetEOAMode.current = false;
    }
  }, [accountInfo, isSuccess, currentAccountType, setCurrentAccountType]);

  return {
    isLoading,
    isSuccess,
    data: selectedAccount,
  };
}
