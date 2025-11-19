import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { toNonExponential } from '@/lib/utils/number';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface CurvanceDepositArgs {
  base_token: string;
  base_c_token: string;
  deposit_amount: string; // wei
}

interface CurvanceDepositParams {
  wallet: string;
  sandbox_account: string;
  base_token: string;
  base_c_token: string;
  deposit_amount: string; // wei
  [key: string]: unknown;
}

export function useCurvanceDeposit() {
  return createMutationHook<CurvanceDepositParams>(
    ApiPath.curvanceDeposit,
    (args: unknown, address: string, account: string) => {
      const p = args as CurvanceDepositArgs;
      return {
        wallet: address,
        sandbox_account: account,
        base_token: p.base_token,
        base_c_token: p.base_c_token,
        deposit_amount: toNonExponential(p.deposit_amount),
      };
    },
    SUCCESS_MESSAGES.DEPOSIT_SUCCESS,
    ERROR_MESSAGES.DEPOSIT_FAILED,
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