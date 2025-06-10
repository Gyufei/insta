import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface BadgeClaimParams {
  wallet: string;
  [key: string]: string;
}

export function useBadgeClaim() {
  return createMutationHook<BadgeClaimParams>(
    ApiPath.badgeClaim,
    (args: unknown, address: string) => {
      return {
        wallet: address,
      };
    },
    SUCCESS_MESSAGES.CLAIM_SUCCESS,
    ERROR_MESSAGES.CLAIM_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: ['badge', 'wallet'] }
  )();
}
