import { ApiPath } from './api-path';
// import { Fetcher } from '../fetcher';
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

    return {
      id: '123',
      sandbox_account: '0x9bb324E38B06f2A1208Ee4Cc6807636a2bc9a167',
      managers: ['0x370CfDbf56B50B1169557078bDC8fcE1477089b8'],
    };
    // return Fetcher<IAccountInfo>(url);
  }

  const queryResult = useQuery({
    queryKey: ['account', address],
    queryFn: () => getAccount(),
    enabled: !!address,
  });

  return queryResult;
}
