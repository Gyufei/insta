import { useMemo } from 'react';
import { useAppKitNetwork } from '@reown/appkit/react';



import { Button } from '@/components/ui/button';



import { useBadgeClaim } from '@/lib/data/use-badge-claim';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ensureBaseNetwork } from '@/lib/utils/network-guard';
import { eventBus } from '@/lib/state/eventBus';

export function ClaimBtn() {
  const { chainId } = useAppKitNetwork();
  const { data: userBadgeData } = useBadgeWalletNfts();
  const { trackEvent } = useEnhancedAnalytics();

  const { mutate: claim, isPending: isClaimPending } = useBadgeClaim();

  const isAllClaimed =
    Number(userBadgeData?.claimInfo.total_claim_count) ===
    Number(userBadgeData?.nftInfo.total_release_times);

  const isAvailable = useMemo(() => {
    return userBadgeData?.claimInfo.is_available && !isAllClaimed;
  }, [userBadgeData, isAllClaimed]);

  async function handleClaim() {
    // Track badge claim attempt
    trackEvent('BADGE_CLAIM', {
      event_category: 'badge',
      event_label: 'badge_claim_attempt',
      include_user_id: true,
      custom_parameters: {
        badge_name: userBadgeData?.nftInfo.name || 'unknown',
        claim_count: userBadgeData?.claimInfo.total_claim_count || 0,
      },
    });

    const ok = await ensureBaseNetwork({
      chainId,
      switchNetwork: async (target) => Promise.resolve(eventBus.publish('toggle-network', target)),
      sentryTags: { area: 'badge_gallery', action: 'claim' },
    });
    if (!ok) return;

    claim(undefined, {
      onSuccess: () => {
        // Track successful claim
        trackEvent('BADGE_CLAIM', {
          event_category: 'badge',
          event_label: 'badge_claim_success',
          include_user_id: true,
          custom_parameters: {
            badge_name: userBadgeData?.nftInfo.name || 'unknown',
          },
        });
      },
      onError: (error: Error) => {
        // Track failed claim
        trackEvent('ERROR_OCCURRED', {
          event_category: 'badge',
          event_label: 'badge_claim_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            badge_name: userBadgeData?.nftInfo.name || 'unknown',
          },
        });
      },
    });
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