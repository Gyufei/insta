import { ApiPath } from './api-path';
import { Fetcher } from '../fetcher';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export type IAccountInfo = {
  id: string;
  sandbox_account: string;
  managers: string[];
};

export function useGetAccounts() {
  const { address } = useAccount();

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

const CurrentAccountAddressKey = 'Current_Account_Address';

export function useSelectedAccount() {
  const { data: accountInfo, isLoading } = useGetAccounts();
  const selectedAccountAddress = localStorage.getItem(CurrentAccountAddressKey);
  let selectedAccount = null;

  if (!selectedAccountAddress && accountInfo && accountInfo.length > 0) {
    selectedAccount = accountInfo[0];
    localStorage.setItem('Current_Account_Address', selectedAccount.id);
  } else if (selectedAccountAddress && accountInfo) {
    selectedAccount = accountInfo.find((account) => account.id === selectedAccountAddress);
  }

  const setSelectedAccountById = (accountId: string) => {
    const address = accountInfo?.find((account) => account.id === accountId)?.sandbox_account;
    if (address) {
      localStorage.setItem(CurrentAccountAddressKey, address);
    }
  };

  const setSelectedAccountByAddress = (accountAddress: string) => {
    localStorage.setItem(CurrentAccountAddressKey, accountAddress);
  };

  return {
    isLoading,
    data: selectedAccount,
    setSelectedAccountById,
    setSelectedAccountByAddress,
  };
}
