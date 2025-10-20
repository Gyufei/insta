'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Tabs, TabsContent } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import { StakeTab } from './stake-tab';
import { STAKING_PROJECT_IDS, type StakingProjectId, getStakingProject } from './staking-config';
import { UnstakeTab } from './unstake-tab';

export function StakingContent() {
  const [activeTab, setActiveTab] = useState('stake');
  const [selectedProject, setSelectedProject] = useState<StakingProjectId>('apriori');

  return (
    <div className="w-full pl-4 md:pl-12">
      <div className="w-full max-w-md">
        <div className="flex gap-2 p-[4px] mb-12 w-fit bg-[#F5F6F9] rounded-xl">
          {STAKING_PROJECT_IDS.map((projectId) => {
            const projectConfig = getStakingProject(projectId);
            return (
              <button
                key={projectId}
                onClick={() => setSelectedProject(projectId)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200',
                  selectedProject === projectId
                    ? 'bg-[#FFFFFF] shadow-sm'
                    : 'bg-[#F5F5F5] text-[#A5ADC6] hover:bg-[#EBEBEB]'
                )}
              >
                <Image src={projectConfig.icon} alt={projectConfig.name} width={20} height={20} />
                <span className="text-sm font-medium">{projectConfig.name}</span>
              </button>
            );
          })}
        </div>

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
