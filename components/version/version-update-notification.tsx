'use client';

import { AlertCircle, RefreshCw, X } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { useVersionContext } from './version-update-provider';

interface VersionUpdateNotificationProps {
  className?: string;
}

export function VersionUpdateNotification({ className }: VersionUpdateNotificationProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use the shared version context instead of creating a new version check
  const { 
    hasUpdate, 
    latestVersion, 
    currentVersion, 
    forceRefresh, 
    dismissUpdate,
    showNotification,
    setShowNotification 
  } = useVersionContext();

  const handleRefresh = () => {
    setIsRefreshing(true);
    forceRefresh();
  };

  const handleDismiss = () => {
    dismissUpdate();
    setShowNotification(false);
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  if (!showNotification || !hasUpdate || !latestVersion || !currentVersion) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md bg-white border border-orange-200 rounded-lg shadow-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">New Version Available</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            <p>A new version has been detected. Please refresh the page to get the latest features and fixes.</p>
            {/* <div className="mt-2 text-xs text-gray-400">
              <p>Current: {currentVersion.buildId.split('-')[0]}</p>
              <p>Latest: {latestVersion.buildId.split('-')[0]}</p>
            </div> */}
          </div>
          <div className="mt-3 flex space-x-2">
            <Button
              size="sm"
              className="h-7 px-3 text-xs bg-primary text-white hover:bg-primary/90"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Refresh Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={handleDismiss}
            >
              Remind Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
