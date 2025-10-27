'use client';

import { useAccount } from 'wagmi';

import { useCallback, useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { ANALYTICS_EVENTS } from '@/lib/analytics';
import {
  type EnhancedAnalyticsParams,
  enhancedAnalytics,
} from '@/lib/analytics/enhanced-analytics';

// Global state to prevent duplicate PAGE_VIEW tracking across multiple hook instances
const globalPageViewTracker = {
  lastTrackedPath: '',
  trackingTimeout: null as NodeJS.Timeout | null,
  isTracking: false,
};

/**
 * Enhanced Analytics Hook
 * Provides easy access to enhanced analytics functionality in React components
 */
export function useEnhancedAnalytics() {
  const { address, isConnected } = useAccount();
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');
  const trackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-track page views with wallet address and user identification data
  // Added debouncing and global deduplication to prevent excessive tracking
  useEffect(() => {
    if (
      pathname &&
      pathname !== lastPathRef.current &&
      pathname !== globalPageViewTracker.lastTrackedPath
    ) {
      lastPathRef.current = pathname;

      // Clear any pending tracking (both local and global)
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
      if (globalPageViewTracker.trackingTimeout) {
        clearTimeout(globalPageViewTracker.trackingTimeout);
      }

      // Skip if already tracking this path
      if (globalPageViewTracker.isTracking) {
        return;
      }

      globalPageViewTracker.isTracking = true;

      // Debounce page view tracking to avoid rapid-fire events
      const timeout = setTimeout(() => {
        // Double-check we haven't tracked this path yet
        if (pathname !== globalPageViewTracker.lastTrackedPath) {
          globalPageViewTracker.lastTrackedPath = pathname;

          // Track page view with enhanced user identification data
          enhancedAnalytics
            .trackEvent('PAGE_VIEW', {
              event_category: 'navigation',
              event_label: pathname,
              page_path: pathname,
              wallet_address: address,
              include_user_id: true, // This ensures IP, fingerprint, and Cloudflare ID are included
              custom_parameters: {
                page_type: pathname.split('/')[1] || 'home',
                is_wallet_connected: isConnected,
              },
            })
            .catch(console.warn)
            .finally(() => {
              globalPageViewTracker.isTracking = false;
            });
        } else {
          globalPageViewTracker.isTracking = false;
        }
      }, 300); // 300ms debounce

      trackingTimeoutRef.current = timeout;
      globalPageViewTracker.trackingTimeout = timeout;
    }

    // Cleanup timeout on unmount
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, [pathname, address, isConnected]);

  /**
   * Track events with automatic wallet address inclusion
   */
  const trackEvent = useCallback(
    async (
      eventName: keyof typeof ANALYTICS_EVENTS,
      parameters: Omit<EnhancedAnalyticsParams, 'wallet_address'> = {}
    ) => {
      const enhancedParams: EnhancedAnalyticsParams = {
        ...parameters,
        wallet_address: address,
        include_user_id: isConnected && parameters.include_user_id !== false,
      };

      await enhancedAnalytics.trackEvent(eventName, enhancedParams);
    },
    [address, isConnected]
  );

  /**
   * Track wallet connection events
   */
  const trackWalletConnection = useCallback(
    async (accountType: 'EOA' | 'DSA', walletType?: string) => {
      if (!address) return;

      // Track wallet connection with full user identification data
      await enhancedAnalytics.trackEvent('WALLET_CONNECT', {
        event_category: 'wallet',
        event_label: walletType || 'unknown',
        wallet_address: address,
        account_type: accountType,
        include_user_id: true, // This ensures IP, fingerprint, and Cloudflare ID are included
      });
    },
    [address]
  );

  /**
   * Track trading activities
   */
  const trackTrade = useCallback(
    async (
      action: 'initiated' | 'completed' | 'failed',
      sellToken: string,
      buyToken: string,
      amount: string,
      errorMessage?: string
    ) => {
      const eventName =
        action === 'initiated'
          ? 'TRADE_INITIATED'
          : action === 'completed'
            ? 'TRADE_COMPLETED'
            : 'TRADE_FAILED';

      await enhancedAnalytics.trackEvent(eventName, {
        event_category: 'trading',
        event_label: `${sellToken}-${buyToken}`,
        wallet_address: address,
        token_address: sellToken,
        token_symbol: sellToken,
        amount,
        error_message: errorMessage,
        include_user_id: true, // This ensures IP, fingerprint, and Cloudflare ID are included
        custom_parameters: {
          sell_token: sellToken,
          buy_token: buyToken,
          trade_action: action,
        },
      });
    },
    [address]
  );

  /**
   * Track protocol interactions
   */
  const trackProtocolInteraction = useCallback(
    async (protocol: string, action: string, details?: Record<string, unknown>) => {
      await enhancedAnalytics.trackEvent('BUTTON_CLICK', {
        event_category: 'protocol_interaction',
        event_label: `${protocol}-${action}`,
        wallet_address: address,
        include_user_id: true, // This ensures IP, fingerprint, and Cloudflare ID are included
        custom_parameters: {
          protocol,
          action,
          ...details,
        },
      });
    },
    [address]
  );

  /**
   * Track button clicks with context
   */
  const trackButtonClick = useCallback(
    async (buttonType: string, context?: string, additionalData?: Record<string, unknown>) => {
      await trackEvent('BUTTON_CLICK', {
        event_category: 'ui_interaction',
        event_label: buttonType,
        custom_parameters: {
          button_type: buttonType,
          context,
          page_path: pathname,
          ...additionalData,
        },
      });
    },
    [trackEvent, pathname]
  );

  /**
   * Track modal interactions
   */
  const trackModal = useCallback(
    async (
      action: 'open' | 'close',
      modalType: string,
      additionalData?: Record<string, unknown>
    ) => {
      const eventName = action === 'open' ? 'MODAL_OPEN' : 'MODAL_CLOSE';

      await trackEvent(eventName, {
        event_category: 'ui_interaction',
        event_label: modalType,
        custom_parameters: {
          modal_type: modalType,
          page_path: pathname,
          ...additionalData,
        },
      });
    },
    [trackEvent, pathname]
  );

  /**
   * Track search activities
   */
  const trackSearch = useCallback(
    async (searchTerm: string, searchContext: string, resultsCount?: number) => {
      await trackEvent('SEARCH', {
        event_category: 'search',
        event_label: searchContext,
        custom_parameters: {
          search_term: searchTerm,
          search_context: searchContext,
          results_count: resultsCount,
          page_path: pathname,
        },
      });
    },
    [trackEvent, pathname]
  );

  /**
   * Track errors with context
   */
  const trackError = useCallback(
    async (errorMessage: string, errorContext: string, errorType?: string) => {
      await trackEvent('ERROR_OCCURRED', {
        event_category: 'error',
        event_label: errorType || 'general_error',
        error_message: errorMessage,
        custom_parameters: {
          error_context: errorContext,
          error_type: errorType,
          page_path: pathname,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [trackEvent, pathname]
  );

  /**
   * Track user behavior for security monitoring
   */
  const trackUserBehavior = useCallback(
    async (
      behaviorType: 'suspicious' | 'normal' | 'bot_like',
      details: Record<string, unknown>
    ) => {
      await enhancedAnalytics.trackUserBehavior(
        behaviorType,
        {
          ...details,
          page_path: pathname,
          timestamp: new Date().toISOString(),
        },
        address
      );
    },
    [address, pathname]
  );

  /**
   * Track conversion events
   */
  const trackConversion = useCallback(
    async (conversionType: string, value?: number, currency = 'USD') => {
      await trackEvent('TRADE_COMPLETED', {
        event_category: 'conversion',
        event_label: conversionType,
        value,
        currency,
        custom_parameters: {
          conversion_type: conversionType,
          page_path: pathname,
        },
      });
    },
    [trackEvent, pathname]
  );

  /**
   * Get current session information
   */
  const getSessionInfo = useCallback(() => {
    return enhancedAnalytics.getSessionInfo();
  }, []);

  /**
   * Force refresh user identification data
   */
  const refreshUserData = useCallback(async () => {
    await enhancedAnalytics.refreshUserData();
  }, []);

  return {
    // Core tracking functions
    trackEvent,
    trackWalletConnection,
    trackTrade,
    trackProtocolInteraction,

    // UI interaction tracking
    trackButtonClick,
    trackModal,
    trackSearch,

    // Error and behavior tracking
    trackError,
    trackUserBehavior,

    // Conversion tracking
    trackConversion,

    // Utility functions
    getSessionInfo,
    refreshUserData,

    // Current state
    isWalletConnected: isConnected,
    walletAddress: address,
    currentPath: pathname,
  };
}

/**
 * Hook for tracking component mount/unmount events
 */
export function useComponentTracking(
  componentName: string,
  trackMount = true,
  trackUnmount = false
) {
  const { trackEvent } = useEnhancedAnalytics();

  useEffect(() => {
    if (trackMount) {
      trackEvent('PAGE_VIEW', {
        event_category: 'component',
        event_label: `${componentName}_mount`,
        custom_parameters: {
          component_name: componentName,
          action: 'mount',
        },
      }).catch(console.warn);
    }

    return () => {
      if (trackUnmount) {
        trackEvent('PAGE_VIEW', {
          event_category: 'component',
          event_label: `${componentName}_unmount`,
          custom_parameters: {
            component_name: componentName,
            action: 'unmount',
          },
        }).catch(console.warn);
      }
    };
  }, [componentName, trackMount, trackUnmount, trackEvent]);
}

/**
 * Hook for tracking form interactions
 */
export function useFormTracking(formName: string) {
  const { trackEvent } = useEnhancedAnalytics();

  const trackFormStart = useCallback(async () => {
    await trackEvent('BUTTON_CLICK', {
      event_category: 'form',
      event_label: `${formName}_start`,
      custom_parameters: {
        form_name: formName,
        action: 'start',
      },
    });
  }, [formName, trackEvent]);

  const trackFormSubmit = useCallback(
    async (success: boolean, errorMessage?: string) => {
      await trackEvent('BUTTON_CLICK', {
        event_category: 'form',
        event_label: `${formName}_${success ? 'success' : 'error'}`,
        custom_parameters: {
          form_name: formName,
          action: 'submit',
          success,
          error_message: errorMessage,
        },
      });
    },
    [formName, trackEvent]
  );

  const trackFieldInteraction = useCallback(
    async (fieldName: string, action: string) => {
      await trackEvent('BUTTON_CLICK', {
        event_category: 'form_field',
        event_label: `${formName}_${fieldName}_${action}`,
        custom_parameters: {
          form_name: formName,
          field_name: fieldName,
          action,
        },
      });
    },
    [formName, trackEvent]
  );

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction,
  };
}
