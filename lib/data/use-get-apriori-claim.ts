import { ApiPath } from './api-path';
import { Fetcher } from '../fetcher';
import { useQuery } from '@tanstack/react-query';
import { useGetAccount } from './use-get-account';

export interface IAprioriClaim {
  request_id: string;
  sandbox_account: string;
  token_amount: string;
  request_at: number;
  status: string;
}

export function useGetAprioriClaim() {
  const { data: accountInfo } = useGetAccount();
  const sandboxAccount = accountInfo?.sandbox_account;

  async function getAprioriClaim(): Promise<IAprioriClaim[]> {
    if (!sandboxAccount) {
      return [];
    }

    const url = new URL(ApiPath.aprioriRequestClaim);
    url.searchParams.set('sandbox_account', sandboxAccount);

    const res = await Fetcher<IAprioriClaim[]>(url);

    return res || [];
  }

  const queryResult = useQuery({
    queryKey: ['aprioriClaim', sandboxAccount],
    queryFn: () => getAprioriClaim(),
    enabled: !!sandboxAccount,
  });

  return queryResult;
}
