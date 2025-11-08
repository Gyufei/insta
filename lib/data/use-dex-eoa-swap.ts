import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface DexEOASwapArgs {
  swap_router_name: string;
  path: string[];
  token_in_is_mon: boolean;
  token_out_is_mon: boolean;
  amount_in_wei: string;
  amount_out_wei?: string;
  min_amount_out_wei?: string; // 最小可接受的输出（滑点保护），默认 "0"
  recipient_address?: string; // 仅 Uniswap EOA 支持用户自定义，其它与 wallet_address 一致
}

interface DexEOASwapParams {
  chain_id: string;
  swap_router_name: string;
  path: string[];
  token_in_is_mon: boolean;
  token_out_is_mon: boolean;
  amount_in_wei: string;
  amount_out_wei: string;
  min_amount_out_wei: string;
  wallet_address: string;
  recipient_address: string;
  [key: string]: unknown;
}

export function useDexEOASwap() {
  return createMutationHook<DexEOASwapParams>(
    ApiPath.dexEOAExecute,
    (args: unknown, address: string) => {
      const p = args as DexEOASwapArgs;
      return {
        chain_id: NetworkConfigs.monadTestnet.id.toString(),
        swap_router_name: p.swap_router_name,
        path: p.path,
        token_in_is_mon: p.token_in_is_mon,
        token_out_is_mon: p.token_out_is_mon,
        amount_in_wei: p.amount_in_wei,
         amount_out_wei: p.amount_out_wei ?? '0',
        min_amount_out_wei: p.min_amount_out_wei ?? '0',
        wallet_address: address,
        recipient_address: p.recipient_address || address,
      };
    },
    SUCCESS_MESSAGES.SWAP_SUCCESS,
    ERROR_MESSAGES.SWAP_FAILED,
    {
      checkAddress: true,
      checkAccount: false,
      refreshQueryKey: [['monad', 'token', 'balance']],
    }
  )();
}