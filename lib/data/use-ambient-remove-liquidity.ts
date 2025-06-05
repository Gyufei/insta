import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface AmbientRemoveLiquidityParams {
  wallet: string;
  sandbox_account: string;
  base_token: string;
  quote_token: string;
  bid_tick: string;
  ask_tick: string;
  liquidity: string;
  [key: string]: string;
}

export interface AmbientRemoveLiquidityArgs {
  base_token: string;
  quote_token: string;
  bid_tick: string;
  ask_tick: string;
  liquidity: string;
}

export function useAmbientRemoveLiquidity() {
  return createMutationHook<AmbientRemoveLiquidityParams>(
    ApiPath.ambientRemoveLiquidity,
    (args: unknown, address: string, account: string) => {
      const params = args as AmbientRemoveLiquidityArgs;
      return {
        wallet: address,
        sandbox_account: account,
        base_token: params.base_token,
        quote_token: params.quote_token,
        bid_tick: params.bid_tick,
        ask_tick: params.ask_tick,
        liquidity: params.liquidity,
      };
    },
    SUCCESS_MESSAGES.REMOVE_LIQUIDITY_SUCCESS,
    ERROR_MESSAGES.REMOVE_LIQUIDITY_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
}
