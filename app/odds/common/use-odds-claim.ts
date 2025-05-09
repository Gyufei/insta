import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface IOddsClaimParams {
  user_id: string;
  [key: string]: string;
}

export function useOddsClaim() {
  return createMutationHook<IOddsClaimParams>(
    ApiPath.oddsClaim,
    (args: unknown, address: string, account: string) => {
      return {
        user_id: account,
      };
    },
    SUCCESS_MESSAGES.CLAIM_SUCCESS,
    ERROR_MESSAGES.CLAIM_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
