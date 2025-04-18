import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';
import { useBalance } from 'wagmi';

interface WithdrawParams {
  wallet: string;
  sandbox_account: string;
  amount: string;
  [key: string]: string;
}

export function useWithdraw() {
  const { queryKey } = useBalance();
  return createMutationHook<WithdrawParams>(
    ApiPath.withdraw,
    (args: unknown, address: string, account: string) => {
      const amount = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        amount,
      };
    },
    SUCCESS_MESSAGES.WITHDRAW_SUCCESS,
    ERROR_MESSAGES.WITHDRAW_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: queryKey }
  )();
}
