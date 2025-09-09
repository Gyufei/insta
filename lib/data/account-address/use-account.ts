import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';


import { Fetcher } from '../../fetcher';
import { ApiPath } from '../api-path';

export type IAccountInfo = {
  id: string;
  sandbox_account: string;
  managers: string[];
};

export function useAccounts() {
  const { address } = useAccount();
  // console.log('fake', fake);
  // const address = '0x28d919c2EEb49481D9b7B3e87F728aBd40D9404E';

  async function getAccounts(): Promise<IAccountInfo[]> {
    if (!address) {
      return [];
    }

    const url = new URL(ApiPath.account);
    url.searchParams.set('manager', address);
    const res = await Fetcher<IAccountInfo[]>(url);

    return res || [];
  }

  const queryResult = useQuery({
    queryKey: ['accounts', address],
    queryFn: () => getAccounts(),
    enabled: !!address,
  });

  return queryResult;
}

