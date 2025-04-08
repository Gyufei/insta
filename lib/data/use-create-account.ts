import { ApiPath } from './api-path';
import { ERROR_MESSAGES } from '@/config/error-msg';
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
    ERROR_MESSAGES.CREATE_AUTHORITY_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: ['account'] }
  )();
}
