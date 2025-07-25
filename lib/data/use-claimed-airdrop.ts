import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IClaimedAirdrop {
  mon_amount: string;
}

export function useClaimedAirdrop() {
  return createQueryHook<IClaimedAirdrop>(
    ApiPath.claimedAirdrop,
    (account) => ['claimed', 'airdrop', 'amount', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
