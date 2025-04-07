import { ApiPath } from './api-path';
import { Fetcher } from '../fetcher';
import { useQuery } from '@tanstack/react-query';
import { useGetAccount } from './use-get-account';

export interface IApriorBalance {
  balance: string;
}

export function useAprioriBalance() {
  const { data: accountInfo } = useGetAccount();
  const sandboxAccount = accountInfo?.sandbox_account;

  async function getAprioriBalance(): Promise<IApriorBalance | null> {
    if (!sandboxAccount) {
      return {
        balance: '0',
      };
    }

    const url = new URL(ApiPath.aprioriBalance);
    url.searchParams.set('sandbox_account', sandboxAccount);

    const res = await Fetcher<IApriorBalance>(url);

    return res;
  }

  const queryResult = useQuery({
    queryKey: ['apriorBalance', sandboxAccount],
    queryFn: () => getAprioriBalance(),
    enabled: !!sandboxAccount,
  });

  return queryResult;
}
