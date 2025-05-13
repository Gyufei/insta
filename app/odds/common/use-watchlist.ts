import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { useUserInfo } from './use-user-info';

export interface WatchListResponse {
  markets: string[];
}

export function useWatchList() {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  return createQueryHook<WatchListResponse>(
    ApiPath.oddsWatchListGet,
    () => ['watchList', userId || ''],
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
