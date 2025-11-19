import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';
import { IUniswapQuote } from './use-uniswap-quote';
import { toNonExponential } from '@/lib/utils/number';

interface UniswapSwapParams {
  wallet: string;
  chain_id: string;
  token_in: string;
  token_out: string;
  amount_in: string;
  amount_in_decimals: string;
  [key: string]: unknown;
}

interface UniswapSwapArgs {
  token_in: string;
  token_out: string;
  amount_in: string;
  amount_in_decimals: string;
  permitData: IUniswapQuote['permitData'];
  signature: string;
}

export function useUniswapEOASwap() {
  return createMutationHook<UniswapSwapParams>(
    ApiPath.uniswapEOASwap,
    (args: unknown, address: string) => {
      const params = args as UniswapSwapArgs;
      return {
        chain_id: NetworkConfigs.monadTestnet.id.toString(),
        token_in: params.token_in,
        token_out: params.token_out,
        amount_in: toNonExponential(params.amount_in),
        amount_in_decimals: params.amount_in_decimals,
        wallet: address,
        ...(params.permitData ? { permitData: params.permitData } : {}),
        ...(params.signature ? { signature: params.signature } : {}),
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    //TODO: need update swap token balance
    {
      checkAddress: true,
      checkAccount: false,
      refreshQueryKey: [['monad', 'token', 'balance']],
    }
  )();
}
