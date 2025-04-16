import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';
import { useBalance } from 'wagmi';

interface DepositParams {
  wallet: string;
  sandbox_account: string;
  amount: string;
  [key: string]: string; // 添加索引签名以满足 Record<string, unknown> 约束
}

export function useDeposit() {
  const { queryKey } = useBalance();
  return createMutationHook<DepositParams>(
    ApiPath.deposit,
    (args: unknown, address: string, account: string) => {
      const amount = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        amount,
      };
    },
    SUCCESS_MESSAGES.DEPOSIT_SUCCESS,
    ERROR_MESSAGES.DEPOSIT_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: queryKey }
  )();
}
