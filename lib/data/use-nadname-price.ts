import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadNamePrice {
  base: string;
  premium: string;
}

export function useNadNamePrice(name: string) {
  return createQueryHook<INadNamePrice>(
    ApiPath.nadNamePrice,
    (_account) => ['nadname', 'price', name],
    (url, _account) => {
      url.searchParams.set('name', name);
      return url;
    },
    {
      withAccount: false,
    }
  )();
} 