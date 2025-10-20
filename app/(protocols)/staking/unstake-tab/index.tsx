'use client';

import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { type StakingProjectId, getStakingProject } from '../staking-config';
import { BalanceDisplay } from './balance-display';
import { ClaimUnstakeSections } from './claim-unstake-sections';

interface UnstakeTabProps {
  selectedProject: StakingProjectId;
}

/**
 * UnstakeTab Component - Main component for unstaking operations
 * Manages the unstaking interface including balance display and claim/unstake sections
 */
export function UnstakeTab({ selectedProject }: UnstakeTabProps) {
  const { setCurrentComponent: _setCurrentComponent } = useSideDrawerStore();

  const aprioriBalanceResult = useAprioriBalance();
  const magmaBalanceResult = useMagmaBalance();

  const _project = getStakingProject(selectedProject);

  // 根据选择的项目使用对应的数据
  const balanceResults = {
    apriori: aprioriBalanceResult,
    magma: magmaBalanceResult,
  };

  const currentBalanceResult = balanceResults[selectedProject];
  const balance = currentBalanceResult.data?.balance || '0';
  const _isLoading = currentBalanceResult.isLoading;

  return (
    <div className="w-full space-y-6">
      {/* Balance Display Card */}
      <BalanceDisplay selectedProject={selectedProject} balance={balance} />

      {/* Claim and Unstake Sections */}
      {selectedProject === 'apriori' && <ClaimUnstakeSections />}
    </div>
  );
}
