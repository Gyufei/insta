import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
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
    SUCCESS_MESSAGES.CREATE_AUTHORITY_SUCCESS,
    ERROR_MESSAGES.CREATE_AUTHORITY_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: ['account'] }
  )();
}
