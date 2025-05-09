import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface IOddsDepositParams {
  user_id: string;
  from: string;
  amount: string;
  [key: string]: string | undefined;
}

export interface IOddsDepositArgs {
  amount: string;
}

export function useOddsDeposit() {
  return createMutationHook<IOddsDepositParams>(
    ApiPath.deposit,
    (args: unknown, address: string, account: string) => {
      const params = args as IOddsDepositParams;
      return {
        user_id: account,
        from: address,
        amount: params.amount,
      };
    },
    SUCCESS_MESSAGES.TRANSFER_TO_TRADING_SUCCESS,
    ERROR_MESSAGES.TRANSFER_TO_TRADING_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
