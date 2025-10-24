'use client';

import { useState } from 'react';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProjectSelector } from '@/components/common/project-selector';

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
    <div className="w-full px-4 md:pl-12 md:pr-0 flex justify-center md:justify-start">
      <div className="w-full max-w-4xl">
        {/* Module Selection Tabs */}
        <ProjectSelector
          projectIds={LAUNCH_TOKEN_PROJECT_IDS}
          getProject={(id) => getLaunchTokenProject(id as LaunchTokenProjectId)}
          selectedProject={selectedProject}
          onProjectSelect={(id) => setSelectedProject(id as LaunchTokenProjectId)}
        />

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
