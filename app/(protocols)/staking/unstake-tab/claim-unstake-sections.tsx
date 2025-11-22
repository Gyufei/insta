import { useMemo, useState } from 'react';

import { ButtonWithCheck } from '@/components/common/button-with-check';
import { ActionButton } from '@/components/new/action-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAprioriClaim } from '@/lib/data/use-apriori-claim';
import { useGetAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { formatNumber } from '@/lib/utils/number';
import { truncateIfExceeds } from '@/lib/utils/number';
import { formatBig } from '@/lib/utils/number';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useAccountStore } from '@/lib/state/account';

type ClaimAction = 'all' | 'ready-to-claim' | 'pending';

/**
 * Claim and Unstake Sections Component - Handles claim and unstake operations
 * Provides tabbed interface for managing different states of tokens (all, ready-to-claim, pending)
 * Fetches real claim data from API instead of using static props
 */
export function ClaimUnstakeSections() {
  const [subAction, setSubAction] = useState<ClaimAction>('all');
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set());
  const { currentAccountType } = useAccountStore();
  const isEoa = currentAccountType === 'EOA';

  // 获取claim记录数据
  const { data: claimRecords = [], isLoading: _isClaimRecordsPending } = useGetAprioriClaim();

  // 获取claim操作的状态管理
  const { mutate: claimMutate, isPending: isClaimPending, error: claimError } = useAprioriClaim();
  const { trackEvent } = useEnhancedAnalytics();

  // 处理checkbox选择
  const handleClaimSelection = (claimId: string, checked: boolean) => {
    setSelectedClaimIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(claimId);
      } else {
        newSet.delete(claimId);
      }
      return newSet;
    });
  };

  // 处理claim操作 - Enhanced with better state validation
  const handleClaim = () => {
    // ===== SECURITY: Pre-claim validation =====

    // SECURITY: Basic state checks
    if (!canClaim || isClaimPending || selectedClaimIds.size === 0) {
      console.warn('[CLAIM] Claim blocked', {
        canClaim,
        isClaimPending,
        selectedCount: selectedClaimIds.size,
      });
      return;
    }

    // SECURITY: Validate claim records exist
    if (!readyToClaimRecords || readyToClaimRecords.length === 0) {
      console.error('[CLAIM] No ready-to-claim records available');
      return;
    }

    // 只处理ready-to-claim的记录，过滤掉等待中的记录
    const validClaimIds = Array.from(selectedClaimIds).filter((requestId) => {
      const claim = readyToClaimRecords.find((record) => String(record.request_id) === requestId);
      return claim && claim.status === 'pending';
    });

    // SECURITY: Validate we have valid claims to process
    if (validClaimIds.length === 0) {
      console.warn('[CLAIM] No valid claim IDs to process');
      return;
    }

    console.log('[CLAIM] Processing claims:', {
      totalSelected: selectedClaimIds.size,
      validCount: validClaimIds.length,
    });

    // 批量处理所有有效的claim请求
    validClaimIds.forEach((requestId) => {
      // ===== SECURITY: Individual claim validation =====

      // SECURITY: Find and validate the claim record
      const claimRecord = readyToClaimRecords.find(
        (record) => String(record.request_id) === requestId
      );

      if (!claimRecord) {
        console.error('[CLAIM] Claim record not found for request ID:', requestId);
        return;
      }

      // SECURITY: Validate claim amount
      const claimAmount = formatBig(String(claimRecord.token_amount));
      const amountNum = parseFloat(claimAmount);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        console.error('[CLAIM] Invalid claim amount', {
          requestId,
          claimAmount,
        });
        return;
      }

      // Track claim attempt
      trackEvent('APRIORI_CLAIM', {
        event_category: 'protocol_interaction',
        event_label: 'apriori_claim_attempt',
        include_user_id: true,
        custom_parameters: {
          protocol: 'apriori',
          action: 'claim',
          request_id: requestId,
          amount: claimAmount,
          token: 'MON',
        },
      });

      claimMutate(requestId, {
        onSuccess: () => {
          // Track successful claim
          trackEvent('APRIORI_CLAIM', {
            event_category: 'protocol_interaction',
            event_label: 'apriori_claim_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'apriori',
              action: 'claim_success',
              request_id: requestId,
              amount: claimAmount,
            },
          });
          // 成功后从选中列表中移除该项
          setSelectedClaimIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(requestId);
            return newSet;
          });
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
              request_id: requestId,
            },
          });
        },
      });
    });
  };

  // 处理和分类claim记录，添加更精确的状态判断逻辑
  const {
    availableToClaim,
    readyToClaimRecords,
    pendingClaimRecords,
    selectedClaimAmount,
    waitingForClaim,
    canClaim,
    hasCompletedSelected,
  } = useMemo(() => {
    if (!claimRecords) {
      return {
        availableToClaim: 0,
        readyToClaimRecords: [],
        pendingClaimRecords: [],
        selectedClaimAmount: 0,
        waitingForClaim: false,
        canClaim: false,
        hasCompletedSelected: false,
      };
    }

    const readyRecords: typeof claimRecords = [];
    const pendingRecords: typeof claimRecords = [];
    let totalAvailable = 0;
    let hasWaitingClaims = false;
    let hasCompletedInSelected = false;

    claimRecords.forEach((claim) => {
      const requestId = String(claim.request_id);

      if (claim.status === 'pending') {
        // 检查是否已经过了等待时间（10分钟）
        const requestTime = new Date(claim.request_at * 1000);
        const timeDiff = Date.now() - requestTime.getTime();
const tenMinutes = 18 * 60 * 60 * 1000;

        if (timeDiff >= tenMinutes) {
          readyRecords.push(claim);
          totalAvailable += parseFloat(formatBig(claim.token_amount));
        } else {
          pendingRecords.push(claim);
          // 检查选中的记录中是否有等待中的
          if (selectedClaimIds.has(requestId)) {
            hasWaitingClaims = true;
          }
        }
      } else if (claim.status === 'completed') {
        // 检查选中的记录中是否有已完成的
        if (selectedClaimIds.has(requestId)) {
          hasCompletedInSelected = true;
        }
      }
    });

    // 计算选中的金额（只计算ready-to-claim的记录）
    let selectedAmount = 0;
    readyRecords.forEach((claim) => {
      const requestId = String(claim.request_id); // 确保是字符串
      if (selectedClaimIds.has(requestId)) {
        selectedAmount += parseFloat(formatBig(claim.token_amount));
      }
    });

    // 判断是否可以执行 claim 操作
    const canPerformClaim = selectedAmount > 0 && !hasWaitingClaims;

    return {
      availableToClaim: totalAvailable,
      readyToClaimRecords: readyRecords,
      pendingClaimRecords: pendingRecords,
      selectedClaimAmount: selectedAmount,
      waitingForClaim: hasWaitingClaims,
      canClaim: canPerformClaim,
      hasCompletedSelected: hasCompletedInSelected,
    };
  }, [claimRecords, selectedClaimIds]);

  // 当账户类型为 EOA 时，前端展示需要为空
  const uiAvailableToClaim = isEoa ? 0 : availableToClaim;
  const uiReadyToClaimRecords = isEoa ? [] : readyToClaimRecords;
  const uiPendingClaimRecords = isEoa ? [] : pendingClaimRecords;

  // 计算各种状态的总金额用于显示（保留用于未来可能的用途）
  const _readyToClaimAmount = readyToClaimRecords.reduce(
    (sum, claim) => sum + parseFloat(formatBig(claim.token_amount)),
    0
  );
  const _pendingAmount = pendingClaimRecords.reduce(
    (sum, claim) => sum + parseFloat(formatBig(claim.token_amount)),
    0
  );

  return (
    <div className="rounded-[8px] border border-[#EBEBEB] bg-white p-6 pb-2 shadow-sm">
      {/* Available to claim info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Unstake MON</span>
        </div>
        <div className="text-sm text-[#999999] flex items-center justify-center">
          <span className="text-[#A5ADC6]">Available to claim</span>
          <span className="text-[#6E75F9] ml-2">{uiAvailableToClaim ? truncateIfExceeds(String(uiAvailableToClaim), 4) : '0'} MON</span>
        </div>
      </div>
      <Separator className="mt-3 mb-5" />
      {/* Sub Action Tabs */}
      <Tabs
        value={subAction}
        onValueChange={(value) => setSubAction(value as ClaimAction)}
        className="w-full gap-4"
      >
        <div className="flex flex-wrap gap-2">
          <ButtonWithCheck
            label="All"
            value="all"
            activeTab={subAction}
            onClick={() => setSubAction('all')}
            showIcon={false}
          />
          <ButtonWithCheck
            label="Ready To Claim"
            value="ready-to-claim"
            activeTab={subAction}
            onClick={() => setSubAction('ready-to-claim')}
            showIcon={false}
          />
          <ButtonWithCheck
            label="Pending"
            value="pending"
            activeTab={subAction}
            onClick={() => setSubAction('pending')}
            showIcon={false}
          />
        </div>

        {/* Content based on main action and sub action */}
        <TabsContent value="all" className="mt-0">
          {uiReadyToClaimRecords.length > 0 || uiPendingClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {/* Ready to claim records */}
              {uiReadyToClaimRecords.map((claim) => (
                <div
                  key={claim.request_id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={selectedClaimIds.has(String(claim.request_id))}
                    onChange={(e) =>
                      handleClaimSelection(String(claim.request_id), e.target.checked)
                    }
                  />
                  <div className="flex-1 mx-3">
                    <div className="text-sm font-medium">
                      {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-[8px] bg-[#6E75F9] text-white">
                    Ready To Claim
                  </span>
                </div>
              ))}

              {/* Pending records */}
              {uiPendingClaimRecords.map((claim) => {
                const requestTime = new Date(claim.request_at * 1000);
                const timeDiff = Date.now() - requestTime.getTime();
const tenMinutes = 18 * 60 * 60 * 1000;
                const remainingTime = Math.max(0, tenMinutes - timeDiff);
                const remainingMinutes = Math.max(1, Math.ceil(remainingTime / (60 * 1000)));
                const remainingText =
                  remainingMinutes >= 60
                    ? `${Math.ceil(remainingMinutes / 60)} hours`
                    : `${remainingMinutes} minutes`;

                return (
                  <div key={claim.request_id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]">
                      <input type="checkbox" disabled className="h-4 w-4 rounded" />
                      <div className="flex-1 mx-3">
                        <div className="text-sm font-medium">
                          {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                        </div>
                      </div>
                      <p className="text-xs text-[#A5ADC6] mx-3">
                        Available in ~{remainingText}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-[8px] bg-[#6E75F9] text-white opacity-50">
                        Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No requests found.</div>
          )}
        </TabsContent>

        <TabsContent value="ready-to-claim" className="mt-0">
          {uiReadyToClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {uiReadyToClaimRecords.map((claim) => (
                <div
                  key={claim.request_id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={selectedClaimIds.has(String(claim.request_id))}
                    onChange={(e) =>
                      handleClaimSelection(String(claim.request_id), e.target.checked)
                    }
                  />
                  <div className="flex-1 mx-3">
                    <div className="text-sm font-medium">
                      {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-[8px] bg-[#6E75F9] text-white">
                    Ready To Claim
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No claimable requests found.</div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          {uiPendingClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {uiPendingClaimRecords.map((claim) => {
                const requestTime = new Date(claim.request_at * 1000);
                const timeDiff = Date.now() - requestTime.getTime();
const tenMinutes = 18 * 60 * 60 * 1000;
                const remainingTime = Math.max(0, tenMinutes - timeDiff);
                const remainingMinutes = Math.max(1, Math.ceil(remainingTime / (60 * 1000)));
                const remainingText =
                  remainingMinutes >= 60
                    ? `${Math.ceil(remainingMinutes / 60)} hours`
                    : `${remainingMinutes} minutes`;

                return (
                  <div key={claim.request_id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]">
                      <input type="checkbox" disabled className="h-4 w-4 rounded" />
                      <div className="flex-1 mx-3">
                        <div className="text-sm font-medium">
                          {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                        </div>
                      </div>
                      <p className="text-xs text-[#A5ADC6] mx-3">
                        Available in ~{remainingText}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-[8px] bg-[#6E75F9] text-white opacity-50">
                        Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No pending requests found.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Button */}
      <ActionButton
        disabled={!canClaim || isClaimPending}
        onClick={handleClaim}
        isPending={isClaimPending}
        error={claimError ? { showError: true, errorMessage: claimError.message } : undefined}
        className="w-full mt-4"
      >
        {hasCompletedSelected
          ? 'Claimed'
          : waitingForClaim
            ? 'Waiting for claim'
            : `Claim ${formatNumber(selectedClaimAmount)} MON`}
      </ActionButton>
    </div>
  );
}
