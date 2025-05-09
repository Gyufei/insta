import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { IToken } from '../../config/tokens';

export interface IV3Position {
  tokenId: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  token0: Omit<IToken, 'logo'>;
  token1: Omit<IToken, 'logo'>;
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

export enum PositionStatus {
  POSITION_STATUS_IN_RANGE = 'POSITION_STATUS_IN_RANGE',
  POSITION_STATUS_OUT_OF_RANGE = 'POSITION_STATUS_OUT_OF_RANGE',
  POSITION_STATUS_CLOSED = 'POSITION_STATUS_CLOSED',
}

export interface IUniswapPosition {
  chainId: number;
  protocolVersion: string;
  v3Position: IV3Position;
  status: PositionStatus;
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
