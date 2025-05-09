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

interface IOrder {
  market: IMarket;
  outcome: IOutcome;

  order_id: string;
  trading_direction: 'buy' | 'sell';
  price: string;
  shares: string;
  value: string;
  available_shares: string;
  available_value: string;
}

interface IUserOrdersResponse {
  orders: IOrder[];
}

export function useUserOrders() {
  return createQueryHook<IUserOrdersResponse>(
    ApiPath.oddsOrders,
    () => ['user', 'orders'],
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
