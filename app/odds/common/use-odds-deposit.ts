import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

import { useOddsUserInfo } from './use-user-info';

export interface IOddsDepositParams {
  wallet: string;
  sandbox_account: string;
  odds_user_id: string;
  amount: string;
  [key: string]: string | undefined;
}

export interface IOddsDepositArgs {
  amount: string;
}

export function useOddsDeposit() {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  return createMutationHook<IOddsDepositParams>(
    ApiPath.oddsDeposit,
    (args: unknown, address: string, account: string) => {
      const params = args as IOddsDepositParams;
      return {
        wallet: address,
        sandbox_account: account,
        odds_user_id: userId || '',
        amount: params.amount,
      };
    },
    SUCCESS_MESSAGES.TRANSFER_TO_TRADING_SUCCESS,
    ERROR_MESSAGES.TRANSFER_TO_TRADING_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
