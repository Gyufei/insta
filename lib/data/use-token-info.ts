import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ITokenInfo {
  name: string;
  symbol: string;
  decimals: string;
  address: string;
}

export function useTokenInfo(tokenAddress: string) {
  return createQueryHook<ITokenInfo>(
    ApiPath.uniswapTokenInfo,
    () => ['token', 'info', tokenAddress],
    (url) => {
      if (!tokenAddress) return null;

      return new URL(`${url}?token_address=${tokenAddress}`);
    },
    { withAccount: false }
  )();
}
