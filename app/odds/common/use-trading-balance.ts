import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { useOddsUserInfo } from './use-user-info';

export interface ITradingBalance {
  balance: string;
}

export function useTradingBalance() {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  return createQueryHook<ITradingBalance>(
    ApiPath.oddsTradingBalance,
    (account) => ['odds', 'trading_balance', account ?? ''],
    (url) => {
      if (!userId) {
        return null;
      }
      url.searchParams.set('user_id', userId);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
