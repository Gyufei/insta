import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

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
  return createQueryHook<IUserPositionsResponse>(
    ApiPath.oddsUserPositions,
    () => ['user', 'positions'],
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
