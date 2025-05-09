import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { IMarketsResponse } from './use-markets';

export function useUserMarkets() {
  return createQueryHook<IMarketsResponse>(
    ApiPath.oddsUserMarkets,
    () => ['user', 'markets'],
    (url, account) => {
      if (!account) {
        return null;
      }

      url.searchParams.set('user_id', account);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
