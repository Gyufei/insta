import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';
import { UniswapMintPositionArgs, UniswapMintPositionParams } from './use-uniswap-mint-position';

type UniswapNewPoolMintPositionParams = UniswapMintPositionParams & {
  price_current: string;
};

type UniswapNewPoolMintPositionArgs = UniswapMintPositionArgs & {
  price_current: string;
};

export function useUniswapNewPoolMintPosition() {
  return createMutationHook<UniswapNewPoolMintPositionParams>(
    ApiPath.uniswapCreatePoolAndMintPosition,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapNewPoolMintPositionArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_a_address: params.token_a_address,
        token_b_address: params.token_b_address,
        fee: params.fee,
        price_current: params.price_current,
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
