import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface UniswapRemoveLiquidityParams {
  wallet: string;
  sandbox_account: string;
  token_id: string;
  liquidity: string;
  token0_amount_min: string;
  token1_amount_min: string;
  token0_decimals: number;
  token1_decimals: number;
  [key: string]: string | number;
}

export interface UniswapRemoveLiquidityArgs {
  token_id: string;
  liquidity: string;
  token0_amount_min: string;
  token1_amount_min: string;
  token0_decimals: number;
  token1_decimals: number;
}

export function useUniswapRemoveLiquidity() {
  return createMutationHook<UniswapRemoveLiquidityParams>(
    ApiPath.uniswapRemoveLiquidity,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapRemoveLiquidityArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_id: params.token_id,
        liquidity: params.liquidity,
        token0_amount_min: params.token0_amount_min,
        token1_amount_min: params.token1_amount_min,
        token0_decimals: params.token0_decimals,
        token1_decimals: params.token1_decimals,
      };
    },
    SUCCESS_MESSAGES.REMOVE_LIQUIDITY_SUCCESS,
    ERROR_MESSAGES.REMOVE_LIQUIDITY_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
} 