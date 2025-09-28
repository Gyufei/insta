'use client';

import { createContext, useContext, ReactNode } from 'react';

import { useVersionCheck } from '@/lib/hooks/use-version-check';

interface VersionInfo {
  version: string;
  gitHash: string;
  fullGitHash: string;
  buildTimestamp: number;
  buildDate: string;
  buildId: string;
}

interface VersionContextType {
  currentVersion: VersionInfo | null;
  latestVersion: VersionInfo | null;
  hasUpdate: boolean;
  isChecking: boolean;
  error: string | null;
  checkForUpdates: () => Promise<void>;
  forceRefresh: () => void;
  dismissUpdate: () => void;
}

const VersionContext = createContext<VersionContextType | null>(null);

interface VersionUpdateProviderProps {
  children: ReactNode;
}

export function VersionUpdateProvider({ children }: VersionUpdateProviderProps) {
  const versionCheck = useVersionCheck({
    checkInterval: 30 * 60 * 1000, // Check every 30 minutes
    onNewVersionDetected: (newVersion, oldVersion) => {
      console.log('🔄 New version detected in provider:', {
        from: oldVersion.buildId,
        to: newVersion.buildId,
      });
    },
    onError: (error) => {
      console.error('❌ Version check error in provider:', error);
    },
  });

  return <VersionContext.Provider value={versionCheck}>{children}</VersionContext.Provider>;
}

export function useVersionContext() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersionContext must be used within a VersionUpdateProvider');
  }
  return context;
}