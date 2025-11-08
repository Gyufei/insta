import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface CurvanceRepayArgs {
  borrowable_token: string;
  borrowable_c_token: string;
  repay_amount: string; // wei
}

interface CurvanceRepayParams {
  wallet: string;
  sandbox_account: string;
  borrowable_token: string;
  borrowable_c_token: string;
  repay_amount: string; // wei
  [key: string]: unknown;
}

export function useCurvanceRepay() {
  return createMutationHook<CurvanceRepayParams>(
    ApiPath.curvanceRepay,
    (args: unknown, address: string, account: string) => {
      const p = args as CurvanceRepayArgs;
      return {
        wallet: address,
        sandbox_account: account,
        borrowable_token: p.borrowable_token,
        borrowable_c_token: p.borrowable_c_token,
        repay_amount: p.repay_amount,
      };
    },
    SUCCESS_MESSAGES.REPAY_SUCCESS,
    ERROR_MESSAGES.REPAY_FAILED,
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