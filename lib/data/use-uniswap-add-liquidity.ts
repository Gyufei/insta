import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface UniswapAddLiquidityParams {
  wallet: string;
  sandbox_account: string;
  token_id: string;
  token_0_amount: string;
  token_1_amount: string;
  slippage: string;
  token0_decimals: number;
  token1_decimals: number;
  [key: string]: string | number;
}

export interface UniswapAddLiquidityArgs {
  token_id: string;
  token_0_amount: string;
  token_1_amount: string;
  slippage: string;
  token0_decimals: number;
  token1_decimals: number;
}

export function useUniswapAddLiquidity() {
  return createMutationHook<UniswapAddLiquidityParams>(
    ApiPath.uniswapAddLiquidity,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapAddLiquidityArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_id: params.token_id,
        token_0_amount: params.token_0_amount,
        token_1_amount: params.token_1_amount,
        slippage: params.slippage,
        token0_decimals: params.token0_decimals,
        token1_decimals: params.token1_decimals,
      };
    },
    SUCCESS_MESSAGES.CREATE_POSITION_SUCCESS,
    ERROR_MESSAGES.CREATE_POSITION_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
} 