import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useEffect, useMemo } from 'react';

import { Fetcher } from '../fetcher';
import { useAccountStore } from '../state/account';
import { ApiPath } from './api-path';

export type IAccountInfo = {
  id: string;
  sandbox_account: string;
  managers: string[];
};

export function useAccounts() {
  const { address } = useAccount();
  // console.log('fake', fake);
  // const address = '0x5E7a4ff62f25Fa8B46975E25E92EE9Dd7D6d80A7';

  async function getAccounts(): Promise<IAccountInfo[]> {
    if (!address) {
      return [];
    }

    const url = new URL(ApiPath.account);
    url.searchParams.set('manager', address);
    const res = await Fetcher<IAccountInfo[]>(url);

    return res as unknown as IAccountInfo[];
  }

  const queryResult = useQuery({
    queryKey: ['accounts', address],
    queryFn: () => getAccounts(),
    enabled: !!address,
  });

  return queryResult;
}

export function useSelectedAccount() {
  const { data: accountInfo, isLoading } = useAccounts();
  const { currentAccountAddress, setCurrentAccountAddress } = useAccountStore();

  const selectedAccount = useMemo(() => {
    if (!currentAccountAddress) return null;
    return (
      accountInfo?.find((account) => account.sandbox_account === currentAccountAddress) || null
    );
  }, [currentAccountAddress, accountInfo]);

  useEffect(() => {
    const findAccount = currentAccountAddress
      ? accountInfo?.find((account) => account.sandbox_account === currentAccountAddress)
      : null;

    if (!findAccount && accountInfo && accountInfo.length > 0) {
      const firstAccount = accountInfo[0];
      setCurrentAccountAddress(firstAccount.sandbox_account);
    }
  }, [currentAccountAddress, accountInfo, setCurrentAccountAddress]);

  return {
    isLoading,
    data: selectedAccount,
  };
}
