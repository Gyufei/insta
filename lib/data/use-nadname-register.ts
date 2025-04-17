import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface NadNameRegisterParams {
  wallet: string;
  sandbox_account: string;
  name: string;
  set_as_primary_name: boolean;
  [key: string]: string | boolean;
}

export function useNadNameRegister() {
  return createMutationHook<NadNameRegisterParams>(
    ApiPath.nadNameRegister,
    (args: unknown, address: string, account: string) => {
      const params = args as { name: string; set_as_primary_name: boolean };
      return {
        wallet: address,
        sandbox_account: account,
        name: params.name,
        set_as_primary_name: params.set_as_primary_name,
      };
    },
    SUCCESS_MESSAGES.REGISTER_SUCCESS,
    ERROR_MESSAGES.REGISTER_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['nadname', 'my-names'] }
  )();
}
