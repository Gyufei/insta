import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';
import { IUniswapQuote } from './use-uniswap-quote';

interface UniswapSwapParams {
  wallet: string;
  sandbox_account: string;
  token_in_is_eth: boolean;
  token_out_is_eth: boolean;
  slippage: string;
  route: IUniswapQuote['route'];
  [key: string]: unknown;
}

interface UniswapSwapArgs {
  token_in_is_eth: boolean;
  token_out_is_eth: boolean;
  slippage: string;
  route: IUniswapQuote['route'];
}

export function useUniswapSwap() {
  return createMutationHook<UniswapSwapParams>(
    ApiPath.uniswapSwap,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapSwapArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_in_is_eth: params.token_in_is_eth,
        token_out_is_eth: params.token_out_is_eth,
        slippage: params.slippage,
        route: params.route,
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    //TODO: need update swap token balance
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
}
