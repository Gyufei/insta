import { useMemo, useState } from 'react';

import { ButtonWithCheck } from '@/components/common/button-with-check';
import { ActionButton } from '@/components/new/action-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAprioriClaim } from '@/lib/data/use-apriori-claim';
import { useGetAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { formatNumber } from '@/lib/utils/number';
import { formatBig } from '@/lib/utils/number';

type ClaimAction = 'all' | 'ready-to-claim' | 'pending';

/**
 * Claim and Unstake Sections Component - Handles claim and unstake operations
 * Provides tabbed interface for managing different states of tokens (all, ready-to-claim, pending)
 * Fetches real claim data from API instead of using static props
 */
export function ClaimUnstakeSections() {
  const [subAction, setSubAction] = useState<ClaimAction>('all');
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set());

  // 获取claim记录数据
  const { data: claimRecords = [], isLoading: _isClaimRecordsPending } = useGetAprioriClaim();

  // 获取claim操作的状态管理
  const { mutate: claimMutate, isPending: isClaimPending, error: claimError } = useAprioriClaim();

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
    if (!canClaim || isClaimPending || selectedClaimIds.size === 0) return;

    // 只处理ready-to-claim的记录，过滤掉等待中的记录
    const validClaimIds = Array.from(selectedClaimIds).filter((requestId) => {
      const claim = readyToClaimRecords.find((record) => String(record.request_id) === requestId);
      return claim && claim.status === 'pending';
    });

    if (validClaimIds.length === 0) return;

    // 批量处理所有有效的claim请求
    validClaimIds.forEach((requestId) => {
      claimMutate(requestId, {
        onSuccess: () => {
          // 成功后从选中列表中移除该项
          setSelectedClaimIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(requestId);
            return newSet;
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
        const tenMinutes = 10 * 60 * 1000;

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
    <div className="rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      {/* Available to claim info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Unstake MON</span>
        </div>
        <div className="text-sm text-[#999999] flex items-center justify-center">
          <span className="text-gray-500">Available to claim</span>
          <span className="text-[#6E75F9] ml-3">{availableToClaim} MON</span>
        </div>
      </div>
      <Separator className="mt-3 mb-5" />
      {/* Sub Action Tabs */}
      <Tabs
        value={subAction}
        onValueChange={(value) => setSubAction(value as ClaimAction)}
        className="w-full"
      >
        <div className="flex flex-wrap gap-2 mb-4">
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
          {readyToClaimRecords.length > 0 || pendingClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {/* Ready to claim records */}
              {readyToClaimRecords.map((claim) => (
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
                    <div className="text-xs text-gray-500">
                      Request ID: {claim.request_id.slice(0, 8)}...
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-600">
                    Ready To Claim
                  </span>
                </div>
              ))}

              {/* Pending records */}
              {pendingClaimRecords.map((claim) => {
                const requestTime = new Date(claim.request_at * 1000);
                const timeDiff = Date.now() - requestTime.getTime();
                const tenMinutes = 10 * 60 * 1000;
                const remainingTime = Math.max(0, tenMinutes - timeDiff);
                const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

                return (
                  <div key={claim.request_id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]">
                      <input type="checkbox" disabled className="h-4 w-4 rounded" />
                      <div className="flex-1 mx-3">
                        <div className="text-sm font-medium">
                          {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-7">
                        Available in ~{remainingMinutes} minutes
                      </p>
                      <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600">
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
          {readyToClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {readyToClaimRecords.map((claim) => (
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
                    <div className="text-xs text-gray-500">
                      Request ID: {claim.request_id.slice(0, 8)}...
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-600">
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
          {pendingClaimRecords.length > 0 ? (
            <div className="space-y-3">
              {pendingClaimRecords.map((claim) => {
                const requestTime = new Date(claim.request_at * 1000);
                const timeDiff = Date.now() - requestTime.getTime();
                const tenMinutes = 10 * 60 * 1000;
                const remainingTime = Math.max(0, tenMinutes - timeDiff);
                const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

                return (
                  <div key={claim.request_id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBEBEB]">
                      <input type="checkbox" disabled className="h-4 w-4 rounded" />
                      <div className="flex-1 mx-3">
                        <div className="text-sm font-medium">
                          {formatNumber(parseFloat(formatBig(claim.token_amount)))} MON
                        </div>
                        <div className="text-xs text-gray-500">
                          Request ID: {claim.request_id.slice(0, 8)}...
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-7">
                      Available in ~{remainingMinutes} minutes
                    </p>
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
