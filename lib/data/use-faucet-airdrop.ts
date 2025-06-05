import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface FaucetAirdropParams {
  wallet: string;
  sandbox_account: string;
  [key: string]: string;
}

export function useFaucetAirdrop() {
  return createMutationHook<FaucetAirdropParams>(
    ApiPath.faucetAirdrop,

    (args: unknown, address: string, account: string) => {
      const { wallet, token_address } = args as { wallet: string; token_address: string };
      return {
        wallet,
        token_address,
        sandbox_account: account,
      };
    },
    SUCCESS_MESSAGES.DEPOSIT_SUCCESS,
    ERROR_MESSAGES.DEPOSIT_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['balance'] }
  )();
}
