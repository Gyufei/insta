import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAprioriClaim {
  request_id: string;
  sandbox_account: string;
  token_amount: string;
  request_at: number;
  status: string;
}

export function useGetAprioriClaim() {
  return createQueryHook<IAprioriClaim[]>(
    ApiPath.aprioriRequestClaim,
    (account) => ['aprioriClaim', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    }
  )();
}
