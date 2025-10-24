'use client';

import { useState } from 'react';



import { ProjectSelector } from '@/components/common/project-selector';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import { StakeTab } from './stake-tab';
import { STAKING_PROJECT_IDS, type StakingProjectId, getStakingProject } from './staking-config';
import { UnstakeTab } from './unstake-tab';

export function StakingContent() {
  const [activeTab, setActiveTab] = useState('stake');
  const [selectedProject, setSelectedProject] = useState<StakingProjectId>('apriori');

  return (
    <div className="w-full px-4 md:pl-12 md:pr-0 flex justify-center md:justify-start">
      <div className="w-full max-w-md">
        <ProjectSelector
          projectIds={STAKING_PROJECT_IDS}
          getProject={(id: string) => getStakingProject(id as StakingProjectId)}
          selectedProject={selectedProject}
          onProjectSelect={(projectId: string) => setSelectedProject(projectId as StakingProjectId)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="w-full mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('stake')}
                className={cn(
                  'px-2 py-2 font-medium transition-colors',
                  activeTab === 'stake'
                    ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                )}
              >
                Stake
              </button>
              <button
                onClick={() => setActiveTab('unstake')}
                className={cn(
                  'ml-4 px-2 py-2 font-medium transition-colors',
                  activeTab === 'unstake'
                    ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                )}
              >
                Unstake
              </button>
            </div>
          </div>

          <TabsContent value="stake" className="mt-0">
            <StakeTab selectedProject={selectedProject} />
          </TabsContent>
          <TabsContent value="unstake" className="mt-0">
            <UnstakeTab selectedProject={selectedProject} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}