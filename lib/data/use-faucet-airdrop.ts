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
      const { wallet, token_address, wallet_type, sandbox_account } = args as {
        token_address: string;
        sandbox_account: string;
        wallet_type: string;
        wallet: string;
      };
      return {
        wallet: wallet || address,
        wallet_type,
        token_address,
        sandbox_account,
      };
    },
    SUCCESS_MESSAGES.FAUCET_AIRDROP_SUCCESS,
    ERROR_MESSAGES.FAUCET_AIRDROP_FAILED,
    {
      checkAddress: false,
      checkAccount: false,
      refreshQueryKey: ['account', 'balance'],
    }
  )();
}
