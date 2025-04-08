import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadFunToken {
  address: string;
  name: string;
  symbol: string;
  logo_url: string;
}

export function useNadFunTokens() {
  return createQueryHook<INadFunToken[]>(
    ApiPath.nadfunTokens,
    () => ['nadfun', 'tokens'],
    (url) => url,
    {
      withAccount: false,
    }
  )();
}
