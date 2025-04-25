import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface UniswapMintPositionParams {
  wallet: string;
  sandbox_account: string;
  token_a_address: string;
  token_b_address: string;
  fee: string;
  price_lower: string;
  price_upper: string;
  amount_a: string;
  amount_b: string;
  slippage: string;
  decimals_a: string;
  decimals_b: string;
  [key: string]: string;
}

export interface UniswapMintPositionArgs {
  token_a_address: string;
  token_b_address: string;
  fee: string;
  price_lower: string;
  price_upper: string;
  amount_a: string;
  amount_b: string;
  slippage: string;
  decimals_a: string;
  decimals_b: string;
}

export function useUniswapMintPosition() {
  return createMutationHook<UniswapMintPositionParams>(
    ApiPath.uniswapCreatePoolAndMintPosition,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapMintPositionArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_a_address: params.token_a_address,
        token_b_address: params.token_b_address,
        fee: params.fee,
        price_lower: params.price_lower,
        price_upper: params.price_upper,
        amount_a: params.amount_a,
        amount_b: params.amount_b,
        slippage: params.slippage,
        decimals_a: params.decimals_a,
        decimals_b: params.decimals_b,
      };
    },
    SUCCESS_MESSAGES.CREATE_POSITION_SUCCESS,
    ERROR_MESSAGES.CREATE_POSITION_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
}
