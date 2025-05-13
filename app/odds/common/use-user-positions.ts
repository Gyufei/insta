import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { useUserInfo } from './use-user-info';

interface IMarket {
  id: string;
  title: string;
  image_url: string;
  volume: string;
}

interface IOutcome {
  index: number;
  name: string;
  logo: string;
}

interface IPosition {
  market: IMarket;
  outcome: IOutcome;
  shares: string;
  value: string;
}

interface IUserPositionsResponse {
  positions: IPosition[];
}

export function useUserPositions() {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  return createQueryHook<IUserPositionsResponse>(
    ApiPath.oddsUserPositions,
    () => ['user', 'positions', userId || ''],
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
