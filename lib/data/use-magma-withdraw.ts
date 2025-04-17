import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';

interface MagmaWithdrawParams {
  wallet: string;
  sandbox_account: string;
  withdraw_amount: string;
  [key: string]: string;
}

export function useMagmaWithdraw() {
  return createMutationHook<MagmaWithdrawParams>(
    ApiPath.magmaWithdraw,
    (args: unknown, address: string, account: string) => {
      const amount = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        withdraw_amount: amount,
      };
    },
    SUCCESS_MESSAGES.WITHDRAW_SUCCESS,
    ERROR_MESSAGES.WITHDRAW_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['magma', 'balance'] }
  )();
}