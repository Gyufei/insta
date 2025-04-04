import { ApiPath } from '../data/api-path';
import { Fetcher } from '../fetcher';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export interface IAccountInfo {
  id: string;
  sandbox_account: string;
  managers: string[];
}

export function useGetAccount() {
  const { address } = useAccount();

  async function getAccount(): Promise<IAccountInfo | null> {
    if (!address) {
      return null;
    }


    const url = new URL(ApiPath.account);
    url.searchParams.set('address', address);

    const res = await Fetcher<IAccountInfo>(url);

    return res;
  }

  const queryResult = useQuery({
    queryKey: ['account', address],
    queryFn: () => getAccount(),
  });

  return queryResult;
}
