import { ApiPath } from './api-path';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { createMutationHook } from './helpers';

interface AprioriClaimParams {
  wallet: string;
  sandbox_account: string;
  request_id: string;
  [key: string]: string;
}

export function useAprioriClaim() {
  return createMutationHook<AprioriClaimParams>(
    ApiPath.aprioriClaim,
    (args: unknown, address: string, account: string) => {
      const requestId = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        request_id: requestId,
      };
    },
    ERROR_MESSAGES.WITHDRAW_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['apriorBalance'] }
  )();
}
