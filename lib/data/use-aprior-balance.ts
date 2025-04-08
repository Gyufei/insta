import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IApriorBalance {
  balance: string;
}

export function useAprioriBalance() {
  return createQueryHook<IApriorBalance>(
    ApiPath.aprioriBalance,
    (account) => ['apriorBalance', account ?? ''],
    (url, account) => {
      if (!account) {
        return url;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    }
  )();
} 