import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { IActivity } from './use-market-activities';

export interface IMarketItemActivity {
  activities: IActivity[];
}

export function useMarketItemActivity(mId: string) {
  return createQueryHook<IMarketItemActivity>(
    ApiPath.oddsMarketItemActivity.replace('{marketId}', mId),
    () => ['market', 'activities', mId],
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
