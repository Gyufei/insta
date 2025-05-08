import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface IMarketData {
  market_id: string;
  market_type: string;
  title: string;
  volume: string;
  endDate: string;
  description: string;
  tags: string[];
  state: string;
  outcomes: Array<{
    name: string;
    logo: string;
    probability: number;
    volume: string;
    price: number;
    players: number;
  }>;
  image_url: string;
  visitors: string;
  resolution_type: string;
  resolution_details: {
    date: number;
    event_name?: string;
  };
  description_type: string;
  resolution_source: string;
}

export function useMarketDetail(mId: string) {
  return createQueryHook<IMarketData>(
    ApiPath.oddsMarketDetail.replace('{marketId}', mId),
    () => ['market', 'detail', mId],
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
