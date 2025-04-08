import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadFunMyToken {
  token_address: string;
  name: string;
  symbol: string;
  logo_url: string;
  balance: string;
}

export function useNadFunMyTokens() {
  return createQueryHook<INadFunMyToken[]>(
    ApiPath.nadfunMyTokens,
    (account) => ['nadfun', 'my-tokens', account ?? ''],
    (url, account) => {
      if (!account) {
        return url;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
} 