import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IUniswapPositionInfo {
  pool_addr: string;
  price: string;
}

export interface IUniswapPositionInfoParams {
  token_a_address: string;
  token_b_address: string;
  decimals_a: string;
  decimals_b: string;
  fee: string;
}

export function useUniswapPositionInfo(params?: IUniswapPositionInfoParams) {
  const chainId = NetworkConfigs.monadTestnet.id.toString();

  return createQueryHook<IUniswapPositionInfo>(
    ApiPath.uniswapPosition,
    () => [
      'uniswap',
      'position',
      'info',
      chainId,
      params?.token_a_address || '',
      params?.token_b_address || '',
      params?.fee || '',
    ],
    (url) => {
      if (!params || !params.token_a_address || !params.token_b_address || !params.fee) {
        return null;
      }

      url.searchParams.set('token_a_address', params.token_a_address);
      url.searchParams.set('token_b_address', params.token_b_address);
      url.searchParams.set('decimals_a', params.decimals_a);
      url.searchParams.set('decimals_b', params.decimals_b);
      url.searchParams.set('fee', params.fee);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
