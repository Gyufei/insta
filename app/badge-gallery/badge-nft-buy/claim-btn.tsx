import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { useBadgeClaim } from '@/lib/data/use-badge-claim';

export function ClaimBtn() {
  const { data: userBadgeData } = useBadgeWalletNfts();

  const { mutate: claim, isPending: isClaimPending } = useBadgeClaim();

  const isAvailable = useMemo(() => {
    return userBadgeData?.claimInfo.is_available;
  }, [userBadgeData]);

  function handleClaim() {
    claim(undefined);
  }

  return (
    <div className="mt-6">
      <Button
        disabled={isClaimPending || !isAvailable}
        onClick={handleClaim}
        className="w-full bg-[#6E75F9] text-white rounded text-xs font-medium hover:bg-[#6E75F990] disabled:bg-[#6E75F990] disabled:text-white"
      >
        {isAvailable ? (
          isClaimPending ? (
            <span>Claiming...</span>
          ) : (
            <span>Claim</span>
          )
        ) : (
          <span>Not available</span>
        )}
      </Button>
    </div>
  );
}
