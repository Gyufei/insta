import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

import { useOddsUserInfo } from './use-user-info';

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
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  return createQueryHook<IUserOrdersResponse>(
    ApiPath.oddsOrders,
    () => ['user', 'orders', userId || ''],
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
