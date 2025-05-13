import { useBalance } from 'wagmi';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface WithdrawParams {
  wallet: string;
  sandbox_account: string;
  amount: string;
  token_address: string;
  [key: string]: string;
}

export function useWithdraw() {
  const { queryKey } = useBalance();
  return createMutationHook<WithdrawParams>(
    ApiPath.withdraw,
    (args: unknown, address: string, account: string) => {
      const { amount, tokenAddress } = args as WithdrawParams;
      return {
        wallet: address,
        sandbox_account: account,
        token_address: tokenAddress,
        amount,
      };
    },
    SUCCESS_MESSAGES.WITHDRAW_SUCCESS,
    ERROR_MESSAGES.WITHDRAW_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: queryKey }
  )();
}
