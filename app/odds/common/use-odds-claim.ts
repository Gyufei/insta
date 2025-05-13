import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { MonUSD } from '@/config/tokens';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface IOddsClaimParams {
  wallet: string;
  sandbox_account: string;
  [key: string]: string;
}

export function useOddsClaim() {
  return createMutationHook<IOddsClaimParams>(
    ApiPath.faucetAirdrop,
    (_args: unknown, address: string, account: string) => {
      return {
        wallet: address,
        sandbox_account: account,
        token_address: MonUSD.address,
      };
    },
    SUCCESS_MESSAGES.CLAIM_SUCCESS,
    ERROR_MESSAGES.CLAIM_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'balance'] }
  )();
}
