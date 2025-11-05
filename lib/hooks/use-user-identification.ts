'use client';

import { useAccount } from 'wagmi';

import { useCallback, useEffect, useRef, useState } from 'react';

import { enhancedAnalytics } from '@/lib/analytics/enhanced-analytics';
import {
  UserIdentificationCollector,
  type UserIdentificationData,
} from '@/lib/utils/user-identification';

/**
 * User Identification Hook Options
 */
interface UseUserIdentificationOptions {
  autoCollect?: boolean;
  collectOnWalletConnect?: boolean;
  enableAnalytics?: boolean;
  cacheTimeout?: number; // in milliseconds
}

/**
 * User Identification Hook Return Type
 */
interface UseUserIdentificationReturn {
  // Data state
  userData: UserIdentificationData | null;
  isLoading: boolean;
  error: string | null;
  isCollecting: boolean;

  // Collection info
  lastCollectedAt: Date | null;
  collectionCount: number;

  // Methods
  collectUserData: (force?: boolean) => Promise<UserIdentificationData | null>;
  refreshUserData: () => Promise<void>;
  clearUserData: () => void;

  // Analytics methods
  trackUserAction: (action: string, details?: Record<string, unknown>) => Promise<void>;

  // Utility methods
  getUserFingerprint: () => string | null;
  getSessionId: () => string;
  isDataFresh: () => boolean;

  // Security checks
  checkForVPN: () => boolean;
  checkDeviceSecurity: () => { isSecure: boolean; issues: string[] };
}

/**
 * User Identification Hook
 * Provides comprehensive user identification functionality with analytics integration
 */
export function useUserIdentification(
  options: UseUserIdentificationOptions = {}
): UseUserIdentificationReturn {
  const {
    autoCollect = true,
    collectOnWalletConnect = true,
    enableAnalytics = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
  } = options;

  const { address, isConnected } = useAccount();

  // State management
  const [userData, setUserData] = useState<UserIdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastCollectedAt, setLastCollectedAt] = useState<Date | null>(null);
  const [collectionCount, setCollectionCount] = useState(0);

  // Refs for stable instances
  const userCollectorRef = useRef<UserIdentificationCollector>(null);
  const sessionIdRef = useRef<string>(null);

  // Initialize collector and session ID (client-side only)
  useEffect(() => {
    if (!userCollectorRef.current) {
      userCollectorRef.current = UserIdentificationCollector.getInstance();
    }

    if (!sessionIdRef.current) {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 15);
      sessionIdRef.current = `sess_${timestamp}_${randomStr}`;
    }
  }, []);

  /**
   * Collect user identification data
   */
  const collectUserData = useCallback(
    async (force = false): Promise<UserIdentificationData | null> => {
      if (isCollecting && !force) {
        return userData;
      }

      // Check cache freshness
      if (!force && userData && lastCollectedAt) {
        const timeSinceLastCollection = Date.now() - lastCollectedAt.getTime();
        if (timeSinceLastCollection < cacheTimeout) {
          return userData;
        }
      }

      setIsCollecting(true);
      setError(null);

      try {
        const data = await userCollectorRef.current!.collectUserIdentification({
          includeWallet: !!address,
          includeFingerprint: true,
          includeIP: true,
          includeCloudflare: true,
        });

        // Update wallet info if connected
        if (address) {
          userCollectorRef.current!.updateWalletInfo(address, 'EOA');
        }

        setUserData(data);
        setLastCollectedAt(new Date());
        setCollectionCount((prev) => prev + 1);

        // Store data locally if wallet is connected
        if (isConnected && address && enableAnalytics) {
          await userCollectorRef.current!.storeIdentificationData(data);
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to collect user data';
        setError(errorMessage);
        console.error('User identification collection failed:', err);
        return null;
      } finally {
        setIsCollecting(false);
      }
    },
    [isCollecting, userData, lastCollectedAt, cacheTimeout, isConnected, address, enableAnalytics]
  );

  /**
   * Refresh user data (force collection)
   */
  const refreshUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      await collectUserData(true);
    } finally {
      setIsLoading(false);
    }
  }, [collectUserData]);

  /**
   * Clear user data and reset state
   */
  const clearUserData = useCallback(() => {
    setUserData(null);
    setError(null);
    setLastCollectedAt(null);
    setCollectionCount(0);
    userCollectorRef.current?.clearCache();
  }, []);

  /**
   * Track user actions with analytics integration
   */
  const trackUserAction = useCallback(
    async (action: string, details: Record<string, unknown> = {}) => {
      if (!enableAnalytics) return;

      try {
        await enhancedAnalytics.trackEvent('BUTTON_CLICK', {
          event_category: 'user_action',
          event_label: action,
          wallet_address: address,
          include_user_id: isConnected,
          custom_parameters: {
            action,
            session_id: sessionIdRef.current,
            timestamp: new Date().toISOString(),
            has_user_data: !!userData,
            collection_count: collectionCount,
            ...details,
          },
        });
      } catch (err) {
        console.warn('Failed to track user action:', err);
      }
    },
    [enableAnalytics, address, isConnected, userData, collectionCount]
  );

  /**
   * Get user fingerprint
   */
  const getUserFingerprint = useCallback((): string | null => {
    return userData?.browserFingerprint || null;
  }, [userData]);

  /**
   * Get session ID
   */
  const getSessionId = useCallback((): string => {
    return sessionIdRef.current || 'loading...';
  }, []);

  /**
   * Check if data is fresh
   */
  const isDataFresh = useCallback((): boolean => {
    if (!userData || !lastCollectedAt) return false;
    const timeSinceLastCollection = Date.now() - lastCollectedAt.getTime();
    return timeSinceLastCollection < cacheTimeout;
  }, [userData, lastCollectedAt, cacheTimeout]);

  /**
   * Check for VPN usage
   */
  const checkForVPN = useCallback((): boolean => {
    return userData?.isVPN || false;
  }, [userData]);

  /**
   * Check device security
   */
  const checkDeviceSecurity = useCallback((): { isSecure: boolean; issues: string[] } => {
    const issues: string[] = [];

    if (!userData) {
      issues.push('No user data available');
      return { isSecure: false, issues };
    }

    // Check for VPN
    if (userData.isVPN) {
      issues.push('VPN detected');
    }

    // Check for Tor
    if (userData.isTor) {
      issues.push('Tor detected');
    }

    // Check for Proxy
    if (userData.isProxy) {
      issues.push('Proxy detected');
    }

    const isSecure = issues.length === 0;

    return { isSecure, issues };
  }, [userData]);

  // Auto-collect on wallet connection
  useEffect(() => {
    if (isConnected && address && collectOnWalletConnect) {
      collectUserData().catch(console.warn);
    }
  }, [isConnected, address, collectOnWalletConnect, collectUserData]);

  // Auto-collect on mount
  useEffect(() => {
    if (autoCollect) {
      collectUserData().catch(console.warn);
    }
  }, [autoCollect, collectUserData]);

  return {
    // Data state
    userData,
    isLoading,
    error,
    isCollecting,

    // Collection info
    lastCollectedAt,
    collectionCount,

    // Methods
    collectUserData,
    refreshUserData,
    clearUserData,

    // Analytics methods
    trackUserAction,

    // Utility methods
    getUserFingerprint,
    getSessionId,
    isDataFresh,

    // Security checks
    checkForVPN,
    checkDeviceSecurity,
  };
}

/**
 * Hook for simplified user identification (basic usage)
 */
export function useSimpleUserIdentification() {
  const { userData, isLoading, error, collectUserData, getUserFingerprint, getSessionId } =
    useUserIdentification({
      autoCollect: true,
      collectOnWalletConnect: true,
      enableAnalytics: false, // Simplified version without analytics
    });

  return {
    userData,
    isLoading,
    error,
    collectUserData,
    fingerprint: getUserFingerprint(),
    sessionId: getSessionId(),
  };
}
