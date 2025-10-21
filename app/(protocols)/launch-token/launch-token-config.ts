export type LaunchTokenProjectId = 'uniswap';

export interface LaunchTokenProject {
  id: LaunchTokenProjectId;
  name: string;
  icon: string;
}

export const LAUNCH_TOKEN_PROJECT_IDS: LaunchTokenProjectId[] = ['uniswap'];

export const LAUNCH_TOKEN_PROJECTS: Record<LaunchTokenProjectId, LaunchTokenProject> = {
  uniswap: {
    id: 'uniswap',
    name: 'Uniswap V3',
    icon: '/icons/uniswap.svg',
  },
};

/**
 * Get launch token module configuration by ID
 * @param moduleId - The module ID to get configuration for
 * @returns The module configuration object
 */
export function getLaunchTokenProject(moduleId: LaunchTokenProjectId): LaunchTokenProject {
  return LAUNCH_TOKEN_PROJECTS[moduleId];
}
