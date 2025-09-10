import { useAccount } from 'wagmi';

import { ApiPath } from '../api-path';
import { createQueryHook } from '../helpers';

export interface IIsCheckIn {
  has_checked_in_today: boolean;
}

export function useIsCheckIn() {
  const { address } = useAccount();

  return createQueryHook<IIsCheckIn>(
    ApiPath.checkInToday,
    () => ['isCheckIn', address || ''],
    (url) => {
      if (!address) {
        return null;
      }

      url.searchParams.set('wallet', address);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
