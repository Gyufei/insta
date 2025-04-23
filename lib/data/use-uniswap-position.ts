import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IToken {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
}

export interface IV3Position {
  tokenId: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  token0: IToken;
  token1: IToken;
  feeTier: string;
  currentTick: string;
  currentPrice: string;
  tickSpacing: string;
  token0UncollectedFees: string;
  token1UncollectedFees: string;
  amount0: string;
  amount1: string;
  poolId: string;
  totalLiquidityUsd: string;
  currentLiquidity: string;
}

export interface IUniswapPosition {
  chainId: number;
  protocolVersion: string;
  v3Position: IV3Position;
  status: string;
}

export function useUniswapPosition() {
  return createQueryHook<IUniswapPosition[]>(
    ApiPath.uniswapV3Position,
    (account) => ['uniswap', 'position', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
