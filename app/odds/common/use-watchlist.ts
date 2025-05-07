import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface WatchListResponse {
  markets: string[];
}

export function useWatchList() {
  return createQueryHook<WatchListResponse>(
    ApiPath.oddsWatchListGet,
    (account) => ['watchList', account || ''],
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
