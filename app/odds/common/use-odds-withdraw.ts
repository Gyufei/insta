import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface IOddsWithdrawParams {
  user_id: string;
  from: string;
  amount: string;
  [key: string]: string | undefined;
}

export interface IOddsWithdrawArgs {
  amount: string;
}

export function useOddsWithdraw() {
  return createMutationHook<IOddsWithdrawParams>(
    ApiPath.oddsWithdraw,
    (args: unknown, address: string, account: string) => {
      const params = args as IOddsWithdrawArgs;
      return {
        user_id: account,
        from: address,
        amount: params.amount,
      };
    },
    SUCCESS_MESSAGES.TRANSFER_TO_FUNDING_SUCCESS,
    ERROR_MESSAGES.TRANSFER_TO_FUNDING_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
