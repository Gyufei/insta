'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Tabs, TabsContent } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import {
  LAUNCH_TOKEN_PROJECT_IDS,
  type LaunchTokenProjectId,
  getLaunchTokenProject,
} from './launch-token-config';
import { UniswapCreateCoin } from './uniswap/uniswap-create-coin';

/**
 * Launch Token Content Component - Manages different token launch functionalities
 * Provides tabbed interface for token creation, liquidity management, and position management
 * Similar structure to staking-content.tsx but for token launch operations
 */
export function LaunchTokenContent() {
  const [selectedProject, setSelectedProject] = useState<LaunchTokenProjectId>('uniswap');

  /**
   * Render the content for the selected module
   * @param moduleId - The module ID to render content for
   * @returns The corresponding component for the module
   */
  const renderModuleContent = (moduleId: LaunchTokenProjectId) => {
    switch (moduleId) {
      case 'uniswap':
        return <UniswapCreateCoin />;
      default:
        return <UniswapCreateCoin />;
    }
  };

  return (
    <div className="w-full pl-4 md:pl-12">
      <div className="w-full max-w-4xl">
        {/* Module Selection Tabs */}
        <div className="flex gap-2 p-[4px] mb-12 w-fit bg-[#F5F6F9] rounded-xl">
          {LAUNCH_TOKEN_PROJECT_IDS.map((projectId) => {
            const projectConfig = getLaunchTokenProject(projectId);
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

        {/* Module Content */}
        <Tabs
          value={selectedProject}
          onValueChange={(value) => setSelectedProject(value as LaunchTokenProjectId)}
          className="w-full"
        >
          <TabsContent value="uniswap" className="mt-0">
            {renderModuleContent('uniswap')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
