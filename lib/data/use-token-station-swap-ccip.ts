import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface TokenStationSwapParams {
  wallet: string;
  token_name: string;
  amount_in: string;
  min_amount_out: string;
  recipient: string;
  token_out_name: string;
  [key: string]: unknown;
}

interface TokenStationSwapArgs {
  token_name: string;
  amount_in: string;
  min_amount_out: string;
  recipient: string;
  token_out_name: string;
}

export function useTokenStationSwapCCIP() {
  return createMutationHook<TokenStationSwapParams>(
    ApiPath.tokenStationSwapCCIP,
    (args: unknown, address: string) => {
      const params = args as TokenStationSwapArgs;
      return {
        wallet: address,
        token_name: params.token_name,
        recipient: params.recipient,
        amount_in: params.amount_in,
        min_amount_out: params.min_amount_out,
        token_out_name: params.token_out_name,
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: [] }
  )();
}
