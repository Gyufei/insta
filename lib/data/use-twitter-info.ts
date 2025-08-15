import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ITwitterInfo {
  id: string;
  name: string;
  username: string;
}

export function useTwitterInfo() {
  const { address: wallet } = useAccount();

  return createQueryHook<ITwitterInfo>(
    ApiPath.twitterInfo,
    (_account) => ['twitter', 'info', wallet || ''],
    (url, _account) => {
      if (!wallet) {
        return null;
      }

      url.searchParams.set('wallet', wallet);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
