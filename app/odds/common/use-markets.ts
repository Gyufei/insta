import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

interface IOutcome {
  name: string;
  probability: number;
  players: number;
}

export interface IMarket {
  market_id: string;
  market_static_link: string;
  title: string;
  market_type: string;
  state: string;
  volume: string;
  outcomes: IOutcome[];
  image_url: string;
}

export interface IMarketsResponse {
  market_list: IMarket[];
}

export function useMarkets(type: string) {
  return createQueryHook<IMarketsResponse>(
    ApiPath.oddsMarkets,
    () => ['markets', type],
    (url) => {
      url.searchParams.set('category', type);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
