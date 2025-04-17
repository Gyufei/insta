import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IMagmaBalance {
  balance: string;
}

export function useMagmaBalance() {
  return createQueryHook<IMagmaBalance>(
    ApiPath.magmaBalance,
    (account) => ['magma', 'balance', account ?? ''],
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