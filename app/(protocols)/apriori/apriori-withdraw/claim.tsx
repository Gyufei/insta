import { useMemo, useState } from 'react';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { Separator } from '@/components/ui/separator';

import { APR_MONAD } from '@/config/tokens';
import { useAprioriClaim } from '@/lib/data/use-apriori-claim';
import { useGetAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { formatBig, formatNumber } from '@/lib/utils/number';

import { ClaimCard } from './claim-card';

export function Claim() {
  const aprMonToken = APR_MONAD;
  const { data: claimRecords, isLoading: isClaimRecordsPending } = useGetAprioriClaim();
  const { mutate: claim, isPending: isClaiming, error: claimError } = useAprioriClaim();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

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

  const handleClaim = () => {
    if (selectedRequestId) {
      claim(selectedRequestId);
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
      <Separator className='mt-4' />
      <ActionButton
        disabled={isClaimRecordsPending || canClaimAmount === '0' || !selectedRequestId}
        onClick={handleClaim}
        isPending={isClaiming}
        error={errorData}
      >
        Claim {formatNumber(canClaimAmount)} MON
      </ActionButton>
    </>
  );
}
