import { useMemo, useState } from 'react';



import { APR_MONAD } from '@/config/tokens';



import { ActionButton } from '@/components/side-drawer/common/action-button';
import { Separator } from '@/components/ui/separator';



import { useAprioriClaim } from '@/lib/data/use-apriori-claim';
import { useGetAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { formatBig, formatNumber } from '@/lib/utils/number';

import { ClaimCard } from './claim-card';

export function Claim({ handleBack }: { handleBack: () => void }) {
  const aprMonToken = APR_MONAD;
  const { data: claimRecords, isLoading: isClaimRecordsPending } = useGetAprioriClaim();
  const { mutate: claim, isPending: isClaiming, error: claimError } = useAprioriClaim();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { trackEvent } = useEnhancedAnalytics();

  // 找到选中的 claim 记录
  const selectedClaim = useMemo(() => {
    if (!selectedRequestId || !claimRecords) return null;
    return claimRecords.find((claim) => claim.request_id === selectedRequestId);
  }, [selectedRequestId, claimRecords]);

  // 计算选中 claim 的金额
  const canClaimAmount = useMemo(() => {
    if (!selectedClaim) return '0';
    return formatBig(String(selectedClaim.token_amount), aprMonToken?.decimals);
  }, [selectedClaim, aprMonToken]);

  const waitingForClaim = useMemo(() => {
    if (!selectedClaim) return false;
    if (selectedClaim.status !== 'pending') return false;

    const requestTime = new Date(selectedClaim.request_at * 1000);
    const timeDiff = Date.now() - requestTime.getTime();
    const tenMinutes = 10 * 60 * 1000;
    if (timeDiff < tenMinutes) return true;

    return false;
  }, [selectedClaim]);

  const canClaim = useMemo(() => {
    if (!selectedClaim) return false;
    if (canClaimAmount === '0') return false;
    if (selectedClaim.status !== 'pending') return false;
    if (waitingForClaim) return false;

    return true;
  }, [canClaimAmount, waitingForClaim, selectedClaim]);

  const handleClaim = () => {
    if (selectedRequestId) {
      // Track claim attempt
      trackEvent('APRIORI_CLAIM', {
        event_category: 'protocol_interaction',
        event_label: 'apriori_claim_attempt',
        include_user_id: true,
        custom_parameters: {
          protocol: 'apriori',
          action: 'claim',
          request_id: selectedRequestId,
          amount: canClaimAmount,
          token: 'MON',
        },
      });

      claim(selectedRequestId, {
        onSuccess: () => {
          // Track successful claim
          trackEvent('APRIORI_CLAIM', {
            event_category: 'protocol_interaction',
            event_label: 'apriori_claim_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'apriori',
              action: 'claim_success',
              request_id: selectedRequestId,
              amount: canClaimAmount,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed claim
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'apriori_claim_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'apriori',
              action: 'claim_failed',
              request_id: selectedRequestId,
            },
          });
        },
      });
    }
  };

  const errorData = useMemo(() => {
    if (claimError) {
      return {
        showError: true,
        errorMessage: claimError.message,
      };
    }
    return {
      showError: false,
      errorMessage: '',
    };
  }, [claimError]);

  return (
    <>
      <div className="mt-3">
        <h3 className="mb-3 text-center text-lg font-medium">Unstake MON</h3>
        {isClaimRecordsPending ? (
          <div className="text-gray-300-400 py-4 text-center">Loading request...</div>
        ) : claimRecords && claimRecords.length > 0 ? (
          <div className="space-y-3">
            {claimRecords.map((claim) => (
              <ClaimCard
                key={claim.request_id}
                claim={claim}
                isSelected={selectedRequestId === claim.request_id}
                onSelect={() => setSelectedRequestId(claim.request_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-300-400 py-4 text-center">No request found</div>
        )}
      </div>
      <Separator className="mt-4" />
      <ActionButton
        disabled={isClaimRecordsPending || !canClaim}
        onClick={handleClaim}
        isPending={isClaiming}
        error={errorData}
      >
        {selectedClaim?.status === 'completed'
          ? 'Claimed'
          : waitingForClaim
            ? 'Waiting for claim'
            : `Claim ${formatNumber(canClaimAmount)} MON`}
      </ActionButton>
    </>
  );
}