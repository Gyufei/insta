import { ApiPath } from './api-path';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';
import { createMutationHook } from './helpers';

interface NadFunCreateTokenParams {
  wallet: string;
  sandbox_account: string;
  token_name: string;
  token_symbol: string;
  token_logo: string;
  amount_in: string;
  [key: string]: string;
}

export function useNadFunCreateToken() {
  return createMutationHook<NadFunCreateTokenParams>(
    ApiPath.nadfunCreateToken,
    (args: unknown, address: string, account: string) => {
      const params = args as {
        token_name: string;
        token_symbol: string;
        token_logo: string;
        amount_in: string;
      };
      return {
        wallet: address,
        sandbox_account: account,
        token_name: params.token_name,
        token_symbol: params.token_symbol,
        token_logo: params.token_logo,
        amount_in: params.amount_in,
      };
    },
    SUCCESS_MESSAGES.CREATE_TOKEN_SUCCESS,
    ERROR_MESSAGES.CREATE_TOKEN_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['nadfun', 'my-tokens'] }
  )();
} 