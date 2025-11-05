'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

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
  // Notification state management
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
}

const VersionContext = createContext<VersionContextType | null>(null);

interface VersionUpdateProviderProps {
  children: ReactNode;
}

export function VersionUpdateProvider({ children }: VersionUpdateProviderProps) {
  const [showNotification, setShowNotification] = useState(false);

  const versionCheck = useVersionCheck({
    checkInterval: 30 * 60 * 1000, // Check every 30 minutes
    onNewVersionDetected: (newVersion, oldVersion) => {
      console.log('🔄 New version detected in provider:', {
        from: oldVersion.buildId,
        to: newVersion.buildId,
      });
      // Show notification when new version is detected
      setShowNotification(true);
    },
    onError: (error) => {
      console.error('❌ Version check error in provider:', error);
    },
  });

  // Enhanced dismiss function that also hides notification
  const enhancedDismissUpdate = useCallback(() => {
    versionCheck.dismissUpdate();
    setShowNotification(false);
  }, [versionCheck]);

  const contextValue: VersionContextType = {
    ...versionCheck,
    dismissUpdate: enhancedDismissUpdate,
    showNotification,
    setShowNotification,
  };

  return <VersionContext.Provider value={contextValue}>{children}</VersionContext.Provider>;
}

export function useVersionContext() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersionContext must be used within a VersionUpdateProvider');
  }
  return context;
}