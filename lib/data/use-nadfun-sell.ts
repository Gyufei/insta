import { ApiPath } from './api-path';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { createMutationHook } from './helpers';

interface NadFunSellParams {
  wallet: string;
  sandbox_account: string;
  amount_in: string;
  amount_out_min: string;
  token: string;
  [key: string]: string;
}

export function useNadFunSell() {
  return createMutationHook<NadFunSellParams>(
    ApiPath.nadfunSellToken,
    (args: unknown, address: string, account: string) => {
      const params = args as {
        amount_in: string;
        amount_out_min: string;
        token: string;
      };
      return {
        wallet: address,
        sandbox_account: account,
        amount_in: params.amount_in,
        amount_out_min: params.amount_out_min,
        token: params.token,
      };
    },
    ERROR_MESSAGES.SELL_TOKEN_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['nadfun', 'my-tokens'] }
  )();
} 