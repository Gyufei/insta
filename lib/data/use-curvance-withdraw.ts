import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { toNonExponential } from '@/lib/utils/number';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface CurvanceWithdrawArgs {
  base_token: string;
  base_c_token: string;
  withdraw_shares: string; // wei shares
}

interface CurvanceWithdrawParams {
  wallet: string;
  sandbox_account: string;
  base_token: string;
  base_c_token: string;
  withdraw_shares: string; // wei shares
  [key: string]: unknown;
}

export function useCurvanceWithdraw() {
  return createMutationHook<CurvanceWithdrawParams>(
    ApiPath.curvanceWithdraw,
    (args: unknown, address: string, account: string) => {
      const p = args as CurvanceWithdrawArgs;
      return {
        wallet: address,
        sandbox_account: account,
        base_token: p.base_token,
        base_c_token: p.base_c_token,
        withdraw_shares: toNonExponential(p.withdraw_shares),
      };
    },
    SUCCESS_MESSAGES.WITHDRAW_SUCCESS,
    ERROR_MESSAGES.WITHDRAW_FAILED,
    {
      checkAddress: true,
      checkAccount: true,
      refreshQueryKey: [
        ['account', 'balance'],
        ['curvance', 'market_user_info'],
      ],
    }
  )();
}