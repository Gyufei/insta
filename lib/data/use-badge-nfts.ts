import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IBadgeNft {
  name: string;
  price: number;
  total_release_amount: number;
  total_release_times: number;
}

export function useBadgeNfts() {
  return createQueryHook<IBadgeNft[]>(
    ApiPath.badgeNfts,
    () => ['badge', 'nfts'],
    (url) => url,
    {
      withAccount: false,
    }
  )();
}
