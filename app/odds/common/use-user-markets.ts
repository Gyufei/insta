import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { IMarketsResponse } from './use-markets';
import { useOddsUserInfo } from './use-user-info';

export function useUserMarkets() {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  return createQueryHook<IMarketsResponse>(
    ApiPath.oddsUserMarkets,
    () => ['user', 'markets'],
    (url) => {
      if (!userId) {
        return null;
      }
      url.searchParams.set('user_id', userId);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
