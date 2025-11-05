'use client';

import { useState } from 'react';

import { ProjectSelector } from '@/components/common/project-selector';

import { DEX_PROJECT_IDS, type DexProjectId, getDexProject } from './dex-config';
import { TradeContent } from './trade-content';

export function DexContent() {
  const [selectedProject, setSelectedProject] = useState<DexProjectId>('auto-routing');

  return (
    <div className="w-full px-4 md:pl-12 md:pr-0 flex justify-center md:justify-start">
      <div className="w-full max-w-md">
        <ProjectSelector
          projectIds={DEX_PROJECT_IDS}
          getProject={(id: string) => getDexProject(id as DexProjectId)}
          selectedProject={selectedProject}
          onProjectSelect={(projectId: string) => setSelectedProject(projectId as DexProjectId)}
        />
        <TradeContent />
      </div>
    </div>
  );
}
