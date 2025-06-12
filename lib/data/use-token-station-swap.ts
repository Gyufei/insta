import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface TokenStationSwapParams {
  wallet: string;
  token_name: string;
  amount_in: string;
  min_amount_out: string;
  [key: string]: unknown;
}

interface TokenStationSwapArgs {
  token_name: string;
  amount_in: string;
  min_amount_out: string;
}

export function useTokenStationSwap() {
  return createMutationHook<TokenStationSwapParams>(
    ApiPath.tokenStationSwap,
    (args: unknown, address: string) => {
      const params = args as TokenStationSwapArgs;
      return {
        wallet: address,
        token_name: params.token_name,
        amount_in: params.amount_in,
        min_amount_out: params.min_amount_out,
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: [] }
  )();
}
