import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';
import { useAccountStore } from '@/lib/state/account';

import { useOddsUserInfo } from './use-user-info';

export interface IOddsDepositParams {
  wallet: string;
  sandbox_account?: string;
  odds_user_id: string;
  amount: string;
  wallet_type: string;
  [key: string]: string | undefined;
}

export interface IOddsDepositArgs {
  amount: string;
}

export function useOddsDeposit() {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;
  const { currentAccountType } = useAccountStore();

  return createMutationHook<IOddsDepositParams>(
    ApiPath.oddsDeposit,
    (args: unknown, address: string, account: string) => {
      const params = args as IOddsDepositParams;

      const reqArgs =
        currentAccountType === 'EOA'
          ? {
              wallet: address,
              odds_user_id: userId || '',
              amount: params.amount,
              wallet_type: currentAccountType,
            }
          : {
              wallet: address,
              sandbox_account: account,
              odds_user_id: userId || '',
              amount: params.amount,
              wallet_type: currentAccountType,
            };

      return reqArgs;
    },
    SUCCESS_MESSAGES.TRANSFER_TO_TRADING_SUCCESS,
    ERROR_MESSAGES.TRANSFER_TO_TRADING_FAILED,
    {
      checkAddress: true,
      checkAccount: true,
      refreshQueryKey: [['odds', 'trading_balance']],
    }
  )();
}
