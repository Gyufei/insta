import { TokenData } from '@/lib/data/tokens';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { HrLine } from '@/components/side-drawer/common/hr-line';
import { useGetAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { useAprioriClaim } from '@/lib/data/use-apriori-claim';
import { ClaimCard } from './claim-card';
import { divide } from 'safebase';
import { formatNumber } from '@/lib/utils/number';
import { useMemo, useState } from 'react';

export function Claim() {
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const { data: claimRecords, isLoading: isClaimRecordsPending } = useGetAprioriClaim();
  const { mutate: claim, isPending: isClaiming } = useAprioriClaim();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // 找到选中的 claim 记录
  const selectedClaim = useMemo(() => {
    if (!selectedRequestId || !claimRecords) return null;
    return claimRecords.find(claim => claim.request_id === selectedRequestId);
  }, [selectedRequestId, claimRecords]);

  // 计算选中 claim 的金额
  const canClaimAmount = useMemo(() => {
    if (!selectedClaim) return '0';
    return divide(String(selectedClaim.token_amount), String(10 ** (aprMonToken?.decimals || 18)));
  }, [selectedClaim, aprMonToken]);

  const handleClaim = () => {
    if (selectedRequestId) {
      claim(selectedRequestId);
    }
  };

  return (
    <>
      <div className="mt-3">
        <h3 className="mb-3 text-center text-lg font-medium">Unstake MON</h3>
        {isClaimRecordsPending ? (
          <div className="py-4 text-center text-gray-400">Loading request...</div>
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
          <div className="py-4 text-center text-gray-400">No request found</div>
        )}
      </div>
      <HrLine />
      <ActionButton
        disabled={isClaimRecordsPending || canClaimAmount === '0' || !selectedRequestId}
        onClick={handleClaim}
        isPending={isClaiming}
      >
        Claim {formatNumber(canClaimAmount)} MON
      </ActionButton>
    </>
  );
}
