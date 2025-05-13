import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

import { useUserInfo } from './use-user-info';

export interface IOddsWithdrawParams {
  wallet: string;
  sandbox_account: string;
  odds_user_id: string;
  amount: string;
  [key: string]: string | undefined;
}

export interface IOddsWithdrawArgs {
  amount: string;
}

export function useOddsWithdraw() {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  return createMutationHook<IOddsWithdrawParams>(
    ApiPath.oddsWithdraw,
    (args: unknown, address: string, account: string) => {
      const params = args as IOddsWithdrawArgs;
      return {
        wallet: address,
        sandbox_account: account,
        odds_user_id: userId || '',
        amount: params.amount,
      };
    },
    SUCCESS_MESSAGES.TRANSFER_TO_FUNDING_SUCCESS,
    ERROR_MESSAGES.TRANSFER_TO_FUNDING_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
