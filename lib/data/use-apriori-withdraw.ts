import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';

interface AprioriWithdrawParams {
  wallet: string;
  sandbox_account: string;
  shares: string;
  [key: string]: string;
}

export function useAprioriWithdraw() {
  return createMutationHook<AprioriWithdrawParams>(
    ApiPath.aprioriRequestClaim,
    (args: unknown, address: string, account: string) => {
      const amount = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        shares: amount,
      };
    },
    SUCCESS_MESSAGES.REQUEST_WITHDRAW_SUCCESS,
    ERROR_MESSAGES.WITHDRAW_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['aprior', 'balance'] }
  )();
}
