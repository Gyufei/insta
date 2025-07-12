import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { IBadgeNft } from './use-badge-nfts';

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
  nftInfo: IBadgeNft & {
    category: string;
  };
  claimInfo: IClaimInfo;
}

export function useBadgeWalletNfts() {
  const { address } = useAccount();

  return createQueryHook<IAccountNft>(
    ApiPath.badgeWalletNft.replace(
      '{wallet}',
      address ?? ''
    ),
    () => ['badge', 'wallet', 'nfts', address ?? ''],
    (url) => {
      if (!address) {
        return null;
      }

      return url;
    },
    {
      withAccount: false,
    }
  )();
}
