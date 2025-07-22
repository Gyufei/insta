import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { IBadgeNft } from './use-badge-nfts';

export interface IClaimInfo {
  is_available: boolean;
  category: string;
  total_claim_count: string;
  total_claim_amount: string;
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
  // const address = '0x3a69f8E93aFC0F803dc6c25dBBf6B0af9b11de94';

  return createQueryHook<IAccountNft>(
    ApiPath.badgeWalletNft.replace('{wallet}', address ?? ''),
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
