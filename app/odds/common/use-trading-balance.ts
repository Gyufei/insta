import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface ITradingBalance {
  balance: string;
}

export function useTradingBalance() {
  return createQueryHook<ITradingBalance>(
    ApiPath.oddsTradingBalance,
    (account) => ['odds', 'trading_balance', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('user_id', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
