import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';

export interface CreateAuthorityParams {
  wallet: string;
  sandbox_account: string;
  manager: string;
  [key: string]: string;
}

export function useCreateAuthority() {
  return createMutationHook<CreateAuthorityParams>(
    ApiPath.addAuthority,
    (args: unknown, address: string, account: string) => {
      const manager = args as string;
      return {
        wallet: address,
        sandbox_account: account,
        manager,
      };
    },
    SUCCESS_MESSAGES.CREATE_AUTHORITY_SUCCESS,
    ERROR_MESSAGES.CREATE_AUTHORITY_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['account'] }
  )();
}
