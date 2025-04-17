import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface NadNameSetPrimaryParams {
  wallet: string;
  sandbox_account: string;
  name: string;
  [key: string]: string;
}

export function useNadNameSetPrimary() {
  return createMutationHook<NadNameSetPrimaryParams>(
    ApiPath.nadNameSetPrimary,
    (args: unknown, address: string, account: string) => {
      const params = args as { name: string };
      return {
        wallet: address,
        sandbox_account: account,
        name: params.name,
      };
    },
    SUCCESS_MESSAGES.SET_PRIMARY_NAME_SUCCESS,
    ERROR_MESSAGES.SET_PRIMARY_NAME_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['nadname', 'my-names'] }
  )();
}
