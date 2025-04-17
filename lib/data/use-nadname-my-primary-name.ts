import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadNameMyPrimaryName {
  name: string;
}

export function useNadNameMyPrimaryName() {
  return createQueryHook<INadNameMyPrimaryName>(
    ApiPath.nadNameMyPrimaryName,
    (account) => ['nadname', 'my-names', 'primary', account ?? ''],
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
