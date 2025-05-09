import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

interface IOutcome {
  name: string;
  probability: number;
  players: number;
  status?: string;
  logo?: string;
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
  endDate?: string;
  players?: string;
}

export interface IMarketsResponse {
  market_list: IMarket[];
}

export function useMarkets(type?: string, status?: string) {
  return createQueryHook<IMarketsResponse>(
    ApiPath.oddsMarkets,
    () => ['markets', `${type}+${status}`],
    (url) => {
      if (type) {
        url.searchParams.set('category', type);
      }
      if (status) {
        url.searchParams.set('status', status);
      }
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
