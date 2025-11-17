import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface DexDSASwapArgs {
  swap_router_name: string;
  path: string[];
  token_in_is_mon: boolean;
  token_out_is_mon: boolean;
  amount_in_wei: string;
  amount_out_wei: string;
  wallet_address: string;
}

interface DexDSASwapParams {
  chain_id: string;
  swap_router_name: string;
  path: string[];
  token_in_is_mon: boolean;
  token_out_is_mon: boolean;
  amount_in_wei: string;
  min_amount_out_wei: string;
  sandbox_account: string;
  wallet_address: string;
  [key: string]: unknown;
}

export function useDexDSASwap() {
  return createMutationHook<DexDSASwapParams>(
    ApiPath.dexDSAExecute,
    (args: unknown, address: string, account: string) => {
      const p = args as DexDSASwapArgs;
      return {
        chain_id: NetworkConfigs.monadTestnet.id.toString(),
        swap_router_name: p.swap_router_name,
        path: p.path,
        token_in_is_mon: p.token_in_is_mon,
        token_out_is_mon: p.token_out_is_mon,
        amount_in_wei: p.amount_in_wei,
        min_amount_out_wei: p.amount_out_wei ?? '0',
        sandbox_account: account,
        wallet_address: address,
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    {
      checkAddress: true,
      checkAccount: true,
      refreshQueryKey: [['account', 'balance']],
    }
  )();
}
