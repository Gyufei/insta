import { APR_MONAD, G_MONAD } from '@/config/tokens';

import { SideDrawerComponent } from '@/lib/state/side-drawer';

export type StakingProjectId = 'apriori' | 'magma';

export interface StakingProject {
  id: StakingProjectId;
  name: string;
  icon: string;
  disabled?: boolean;
  token: {
    name: string;
    symbol: string;
    logo: string;
    decimals: number;
    address: string;
    description?: string;
  };
  exchangeRate: string;
  depositComponent: SideDrawerComponent;
  withdrawComponent: SideDrawerComponent;
  useBalance: () => {
    data: { balance: string } | undefined;
    isLoading: boolean;
  };
}

// Staking projects configuration
export const STAKING_PROJECTS: Record<StakingProjectId, Omit<StakingProject, 'useBalance'>> = {
  apriori: {
    id: 'apriori',
    name: 'aPriori',
    icon: '/icons/apriori.svg',
    token: APR_MONAD,
    exchangeRate: '1 MON = 1 aprMON',
    depositComponent: 'AprioriDeposit',
    withdrawComponent: 'AprioriWithdraw',
  },
  magma: {
    id: 'magma',
    name: 'Magma',
    icon: '/icons/magma.svg',
    disabled: true,
    token: G_MONAD,
    exchangeRate: '1 MON = 1 gMON',
    depositComponent: 'MagmaDeposit',
    withdrawComponent: 'MagmaWithdraw',
  },
};

// Get all project IDs for iteration
export const STAKING_PROJECT_IDS: StakingProjectId[] = Object.keys(
  STAKING_PROJECTS
) as StakingProjectId[];

// Helper to get project config
export function getStakingProject(id: StakingProjectId): Omit<StakingProject, 'useBalance'> {
  return STAKING_PROJECTS[id];
}
