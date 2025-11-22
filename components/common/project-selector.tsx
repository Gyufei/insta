'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Generic project configuration interface
 * Defines the minimum required properties for a project
 */
export interface ProjectConfig {
  id: string;
  name: string;
  icon?: string;
}

/**
 * Props for the ProjectSelector component
 */
export interface ProjectSelectorProps<T extends ProjectConfig> {
  /** Array of project IDs to display */
  projectIds: readonly string[];
  /** Function to get project configuration by ID */
  getProject: (id: string) => T;
  /** Currently selected project ID */
  selectedProject: string;
  /** Callback when a project is selected */
  onProjectSelect: (projectId: string) => void;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Generic Project Selector Component
 * Renders a horizontal list of project selection buttons with icons and names
 * Uses consistent styling across all use cases
 */
export function ProjectSelector<T extends ProjectConfig>({
  projectIds,
  getProject,
  selectedProject,
  onProjectSelect,
  className,
}: ProjectSelectorProps<T>) {
  return (
    <div
      className={cn(
        'flex flex-nowrap gap-2 p-[4px] mb-5 md:mb-12 w-full md:w-fit bg-[#F5F6F9] rounded-[8px] overflow-x-auto',
        'whitespace-nowrap',
        className
      )}
    >
      {projectIds.map((projectId) => {
        const projectConfig = getProject(projectId);
        return (
          <button
            key={projectId}
            onClick={() => onProjectSelect(projectId)}
            className={cn(
              'flex items-center gap-2 rounded-[6px] px-4 py-2 md:py-[10px] transition-all duration-200 shrink-0',
              selectedProject === projectId
                ? 'bg-[#FFFFFF] shadow-sm'
                : 'bg-[#F5F5F5] text-[#A5ADC6] hover:bg-[#EBEBEB]'
            )}
          >
            {projectConfig.icon && (
              <Image
                src={projectConfig.icon}
                alt={projectConfig.name}
                width={20}
                height={20}
                className="shrink-0 min-w-[20px] min-h-[20px]"
              />
            )}
            <span className="text-[20px] leading-[20px] font-medium whitespace-nowrap">{projectConfig.name}</span>
          </button>
        );
      })}
    </div>
  );
}
