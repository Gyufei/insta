export type DexProjectId = 'auto-routing' | 'uniswap' | 'ambient';

export interface DexProject {
  id: DexProjectId;
  name: string;
  icon?: string;
}

// Staking projects configuration
export const DEX_PROJECTS: Record<DexProjectId, Omit<DexProject, 'useBalance'>> = {
  'auto-routing': {
    id: 'auto-routing',
    name: 'Auto Routing',
  },
  uniswap: {
    id: 'uniswap',
    name: 'Uniswap',
    icon: '/icons/uniswap.svg',
  },
  ambient: {
    id: 'ambient',
    name: 'Ambient',
    icon: '/icons/ambient.svg',
  },
};

// Get all project IDs for iteration
export const DEX_PROJECT_IDS: DexProjectId[] = Object.keys(DEX_PROJECTS) as DexProjectId[];

// Helper to get project config
export function getDexProject(id: DexProjectId): Omit<DexProject, 'useBalance'> {
  return DEX_PROJECTS[id];
}
