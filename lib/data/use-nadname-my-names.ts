import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadNameMyNames {
  names: string[];
}

export function useNadNameMyNames() {
  return createQueryHook<INadNameMyNames>(
    ApiPath.nadNameMyNames,
    (account) => ['nadname', 'my-names', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('wallet', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
