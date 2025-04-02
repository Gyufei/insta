import { ApiPath } from '../data/api-path';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { useAppKitAccount } from '@reown/appkit/react';

export interface IAccountInfo {
  id: string;
  sandbox_account: string;
  managers: string[];
}

export function useGetAccount() {
  const { address } = useAppKitAccount();

  async function getAccount(): Promise<IAccountInfo | null> {
    if (!address) {
      return null;
    }

    return {
      id: '1123',
      sandbox_account: '0x9bb324E38B06f2A1208Ee4Cc6807636a2bc9a167',
      managers: ['0x370CfDbf56B50B1169557078bDC8fcE1477089b8'],
    } as IAccountInfo;

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
