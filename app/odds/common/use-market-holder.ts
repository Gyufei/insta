import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface IMarketHolder {
  '0': IHolder[];
  '1': IHolder[];
}

export interface IHolder {
  user_name: string;
  user_avatar: string;
  shares: string;
}

export function useMarketHolder(mId: string) {
  return createQueryHook<IMarketHolder>(
    ApiPath.oddsMarketHolder.replace('{marketId}', mId),
    () => ['market', 'holder', mId],
    (url) => {
      if (!mId) {
        return null;
      }

      return url;
    },
    {
      withAccount: false,
    }
  )();
}
