'use client';

import { createContext, useContext, ReactNode } from 'react';

import { useVersionCheck } from '@/lib/hooks/use-version-check';

interface VersionContextType {
  currentVersion: any;
  latestVersion: any;
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
    checkInterval: 30 * 60 * 1000, // 30分钟检查一次
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