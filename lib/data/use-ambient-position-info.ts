import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAmbientPositionInfo {
  pool_addr: string;
  price: string;
}

export interface IAmbientPositionInfoParams {
  token_a_address: string;
  token_b_address: string;
  decimals_a: string;
  decimals_b: string;
}

export function useAmbientPositionInfo(params?: IAmbientPositionInfoParams) {
  const chainId = NetworkConfigs.monadTestnet.id.toString();

  return createQueryHook<IAmbientPositionInfo>(
    ApiPath.ambientPositionInfo,
    () => [
      'ambient',
      'position',
      'info',
      chainId,
      params?.token_a_address || '',
      params?.token_b_address || '',
    ],
    (url) => {
      if (!params || !params.token_a_address || !params.token_b_address) {
        return null;
      }

      url.searchParams.set('token_a_address', params.token_a_address);
      url.searchParams.set('token_b_address', params.token_b_address);
      url.searchParams.set('decimals_a', params.decimals_a);
      url.searchParams.set('decimals_b', params.decimals_b);
      return url;
    },
    {
      withAccount: false,
    }
  )();
} 