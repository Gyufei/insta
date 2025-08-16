import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IUniswapToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tokenDescription: string;
  xLink: string;
  telegramLink: string;
  website: string;
  initialSupply: string;
}

export function useUniswapTokens() {
  return createQueryHook<IUniswapToken[]>(
    ApiPath.uniswapTokens,
    () => ['uniswap', 'tokens'],
    (url) => {
      return url;
    },
    { withAccount: false }
  )();
}
