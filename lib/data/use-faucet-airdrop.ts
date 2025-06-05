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

    (args: unknown, address: string) => {
      const { token_address, sandbox_account } = args as {
        token_address: string;
        sandbox_account: string;
      };
      return {
        wallet: address,
        token_address,
        sandbox_account,
      };
    },
    SUCCESS_MESSAGES.DEPOSIT_SUCCESS,
    ERROR_MESSAGES.DEPOSIT_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['balance'] }
  )();
}
