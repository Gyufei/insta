import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface CreateAccountParams {
  owner: string;
  [key: string]: string;
}

export function useCreateAccount() {
  return createMutationHook<CreateAccountParams>(
    ApiPath.createAccount,
    (args: unknown, address: string) => {
      return {
        owner: address,
      };
    },
    SUCCESS_MESSAGES.CREATE_ACCOUNT_SUCCESS,
    ERROR_MESSAGES.CREATE_ACCOUNT_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: ['account'] }
  )();
}
