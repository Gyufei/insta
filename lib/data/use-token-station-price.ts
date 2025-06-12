import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ITokenStationPrice {
  eth_price: string;
  mon_price: string;
}

export function useTokenStationPrice() {
  return createQueryHook<ITokenStationPrice>(
    ApiPath.tokenStationPrice,
    (_account) => ['token-station', 'price'],
    (url, _account) => {
      return url;
    },
    {
      withAccount: false,
    }
  )();
} 