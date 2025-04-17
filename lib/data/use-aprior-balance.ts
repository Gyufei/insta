import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IApriorBalance {
  balance: string;
}

export function useAprioriBalance() {
  return createQueryHook<IApriorBalance>(
    ApiPath.aprioriBalance,
    (account) => ['aprior', 'balance', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
