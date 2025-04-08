import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadFunTokenMarketInfo {
  virtual_native: string;
  virtual_token: string;
  reserve_token: string;
  reserve_native: string;
}

export function useNadFunTokenMarketInfo(tokenAddress: string | undefined) {
  return createQueryHook<INadFunTokenMarketInfo>(
    ApiPath.nadfunTokenInfo,
    () => ['nadfun', 'token-market-info', tokenAddress ?? ''],
    (url) => {
      if (!tokenAddress) {
        return null;
      }

      url.searchParams.set('token_address', tokenAddress);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
