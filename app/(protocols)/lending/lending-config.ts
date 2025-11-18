export type LendingProjectId = 'curvance';

export interface LendingProject {
  id: LendingProjectId;
  name: string;
  icon?: string;
}

export const LENDING_PROJECTS: Record<LendingProjectId, Omit<LendingProject, 'useBalance'>> = {
  curvance: {
    id: 'curvance',
    name: 'Curvance',
    icon: '/icons/curvance.svg',
  },
};

export const LENDING_PROJECT_IDS: LendingProjectId[] = Object.keys(
  LENDING_PROJECTS
) as LendingProjectId[];

export function getLendingProject(id: LendingProjectId): Omit<LendingProject, 'useBalance'> {
  return LENDING_PROJECTS[id];
}