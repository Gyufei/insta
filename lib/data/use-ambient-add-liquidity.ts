import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface AmbientAddLiquidityParams {
  wallet: string;
  sandbox_account: string;
  token_a: string;
  token_b: string;
  price_current: string;
  price_lower: string;
  price_upper: string;
  token_a_amount: string;
  token_a_decimals: number;
  token_b_decimals: number;
  [key: string]: string | number;
}

export interface AmbientAddLiquidityArgs {
  token_a: string;
  token_b: string;
  price_current: string;
  price_lower: string;
  price_upper: string;
  token_a_amount: string;
  token_a_decimals: number;
  token_b_decimals: number;
}

export function useAmbientAddLiquidity() {
  return createMutationHook<AmbientAddLiquidityParams>(
    ApiPath.ambientAddLiquidity,
    (args: unknown, address: string, account: string) => {
      const params = args as AmbientAddLiquidityArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_a: params.token_a,
        token_b: params.token_b,
        price_current: params.price_current,
        price_lower: params.price_lower,
        price_upper: params.price_upper,
        token_a_amount: params.token_a_amount,
        token_a_decimals: params.token_a_decimals,
        token_b_decimals: params.token_b_decimals,
      };
    },
    SUCCESS_MESSAGES.CREATE_POSITION_SUCCESS,
    ERROR_MESSAGES.CREATE_POSITION_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
} 