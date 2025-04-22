import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface NadNameTransferParams {
  wallet: string;
  sandbox_account: string;
  name: string;
  receiver: string;
  [key: string]: string;
}

export function useNadNameTransfer() {
  return createMutationHook<NadNameTransferParams>(
    ApiPath.nadNameTransfer,
    (args: unknown, address: string, account: string) => {
      const params = args as { name: string; receiver: string };
      return {
        wallet: address,
        sandbox_account: account,
        name: params.name,
        receiver: params.receiver,
      };
    },
    SUCCESS_MESSAGES.TRANSFER_NAME_SUCCESS,
    ERROR_MESSAGES.TRANSFER_NAME_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['nadname', 'my-names'] }
  )();
} 