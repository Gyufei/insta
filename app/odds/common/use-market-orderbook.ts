import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface OrderbookEntry {
  price: number;
  shares: number;
  total?: number;
}

export interface OrderbookResponse {
  buy: OrderbookEntry[];
  sell: OrderbookEntry[];
  lastPrice: number;
  spread: number;
}

export function useMarketOrderbook(marketId: string, outcomeIndex: number, isVisible: boolean) {
  return createQueryHook<OrderbookResponse>(
    ApiPath.oddsMarketOrderbook.replace('{marketId}', marketId),
    () => ['market-orderbook', `${marketId}-${outcomeIndex}`],
    (url) => {
      if (!isVisible) {
        return null;
      }

      url.searchParams.set('outcome_index', outcomeIndex.toString());
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
