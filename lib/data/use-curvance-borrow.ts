import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { toNonExponential } from '@/lib/utils/number';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface CurvanceBorrowArgs {
  borrowable_token: string;
  borrowable_c_token: string;
  borrow_amount: string; // wei
}

interface CurvanceBorrowParams {
  wallet: string;
  sandbox_account: string;
  borrowable_token: string;
  borrowable_c_token: string;
  borrow_amount: string; // wei
  [key: string]: unknown;
}

export function useCurvanceBorrow() {
  return createMutationHook<CurvanceBorrowParams>(
    ApiPath.curvanceBorrow,
    (args: unknown, address: string, account: string) => {
      const p = args as CurvanceBorrowArgs;
      return {
        wallet: address,
        sandbox_account: account,
        borrowable_token: p.borrowable_token,
        borrowable_c_token: p.borrowable_c_token,
        borrow_amount: toNonExponential(p.borrow_amount),
      };
    },
    SUCCESS_MESSAGES.BORROW_SUCCESS,
    ERROR_MESSAGES.BORROW_FAILED,
    {
      checkAddress: true,
      checkAccount: true,
      refreshQueryKey: [
        ['curvance', 'market_user_info'],
      ],
    }
  )();
}