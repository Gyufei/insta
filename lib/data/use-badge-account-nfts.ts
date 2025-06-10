import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INftInfo {
  name: string;
  category: string;
  price: number;
  total_release_amount: number;
  total_release_times: number;
}

export interface IClaimInfo {
  is_available: boolean;
  category: string;
  total_claim_count: string;
  last_claim_count: string;
  last_claim_day: string;
}

export interface IAccountNft {
  nextClaimAmount: string;
  remainingClaims: string;
  nftInfo: INftInfo;
  claimInfo: IClaimInfo;
}

export function useBadgeWalletNfts() {
  const { address } = useAccount();

  return createQueryHook<IAccountNft>(
    ApiPath.badgeWalletNfts,
    () => ['badge', 'wallet', 'nfts', address ?? ''],
    (url) => {
      if (!address) {
        return null;
      }

      url.pathname = url.pathname.replace('{wallet}', address);

      return url;
    },
    {
      withAccount: false,
    }
  )();
}
