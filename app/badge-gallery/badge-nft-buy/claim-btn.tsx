import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { useBadgeClaim } from '@/lib/data/use-badge-claim';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';

export function ClaimBtn() {
  const { data: userBadgeData } = useBadgeWalletNfts();

  const { mutate: claim, isPending: isClaimPending } = useBadgeClaim();

  const isAllClaimed =
    Number(userBadgeData?.claimInfo.total_claim_count) ===
    Number(userBadgeData?.nftInfo.total_release_times);

  const isAvailable = useMemo(() => {
    return userBadgeData?.claimInfo.is_available && !isAllClaimed;
  }, [userBadgeData, isAllClaimed]);

  function handleClaim() {
    claim(undefined);
  }

  return (
    <div className="mt-6">
      <Button
        disabled={isClaimPending || !isAvailable || isAllClaimed}
        onClick={handleClaim}
        className="w-full bg-[#6E75F9] text-white rounded text-xs font-medium hover:bg-[#6E75F990] disabled:bg-[#6E75F990] disabled:text-white"
      >
        {isAvailable ? (
          isClaimPending ? (
            <span>Claiming...</span>
          ) : (
            <span>Claim</span>
          )
        ) : isAllClaimed ? (
          <span>Claim Finished</span>
        ) : (
          <span>Not available</span>
        )}
      </Button>
    </div>
  );
}
