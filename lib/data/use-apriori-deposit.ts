import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';

interface AprioriDepositParams {
  wallet: string;
  sandbox_account: string;
  deposit_amount: string;
  [key: string]: string;
}

export function useAprioriDeposit() {
  return createMutationHook<AprioriDepositParams>(
    ApiPath.aprioriDeposit,
    (args: unknown, address: string, account: string) => {
      const amount = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        deposit_amount: amount,
      };
    },
    SUCCESS_MESSAGES.DEPOSIT_SUCCESS,
    ERROR_MESSAGES.DEPOSIT_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['aprior', 'balance'] }
  )();
}
