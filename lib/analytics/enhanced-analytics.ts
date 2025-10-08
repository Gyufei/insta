// Enhanced Analytics with User Identification Integration
import { UserIdentificationCollector } from '@/lib/utils/user-identification';
import { trackEvent, trackPageView, ANALYTICS_EVENTS, type AnalyticsParams } from './index';

/**
 * Enhanced analytics interface that includes user identification data
 */
export interface EnhancedAnalyticsParams extends AnalyticsParams {
  include_user_id?: boolean;
  wallet_address?: string;
  session_id?: string;
  user_fingerprint?: string;
  real_ip?: string;
  vpn_ip?: string;
  cloudflare_visitor_id?: string;
  device_info?: Record<string, unknown>;
  geo_location?: Record<string, unknown>;
}

/**
 * Enhanced Analytics Manager
 * Integrates user identification data with Google Analytics tracking
 */
export class EnhancedAnalyticsManager {
  private userCollector: UserIdentificationCollector;
  private sessionId: string;
  private isInitialized = false;

  constructor() {
    this.userCollector = UserIdentificationCollector.getInstance();
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize the enhanced analytics system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Pre-collect user identification data for faster subsequent calls
      await this.userCollector.collectUserIdentification({
        includeWallet: true,
        includeFingerprint: true,
        includeIP: true,
        includeCloudflare: true,
      });
      this.isInitialized = true;
      
      // Track initialization event
      this.trackEvent('PAGE_VIEW', {
        event_category: 'system',
        event_label: 'analytics_initialized',
        include_user_id: true,
      });
    } catch (error) {
      console.warn('Failed to initialize enhanced analytics:', error);
    }
  }

  /**
   * Generate a unique session ID for this browsing session
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `sess_${timestamp}_${randomStr}`;
  }

  /**
   * Enhanced event tracking with user identification data
   */
  async trackEvent(
    eventName: keyof typeof ANALYTICS_EVENTS,
    parameters: EnhancedAnalyticsParams = {}
  ): Promise<void> {
    try {
      let enhancedParams = { ...parameters };

      // Include user identification data if requested
      if (parameters.include_user_id) {
        // Debug: Log before data collection
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Enhanced Analytics - 开始收集用户数据...');
        }
        
        const userData = await this.userCollector.collectUserIdentification({
          includeWallet: true,
          includeFingerprint: true,
          includeIP: true,
          includeCloudflare: true,
        });
        
        // Debug: Log collected user data
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Enhanced Analytics - userData:', userData);
        }
        
        enhancedParams = {
          ...enhancedParams,
          custom_parameters: {
            ...enhancedParams.custom_parameters,
            // Also include in custom_parameters for backup
            session_id: this.sessionId,
            user_fingerprint: userData.browserFingerprint,
            real_ip: userData.realIP,
            vpn_ip: userData.vpnIP,
            cloudflare_visitor_id: userData.cloudflareVisitorId,
            cf_connecting_ip: userData.cfConnectingIP,
            cf_country: userData.cfCountry,
            cf_ray: userData.cfRay,
            // Network and connection info (GA4 doesn't collect this)
            network_info: {
              connection_type: userData.connectionType,
            },
            // Custom device classification (more detailed than GA4's basic device category)
            device_classification: {
              is_mobile: userData.isMobile,
              is_tablet: userData.isTablet,
              is_desktop: userData.isDesktop,
            },
            // Security and fraud detection info (GA4 doesn't collect this)
            security_info: {
              is_vpn: userData.isVPN,
              is_tor: userData.isTor,
              is_proxy: userData.isProxy,
            },
            // Additional identification data
            wallet_address: parameters.wallet_address,
          },
        };
      }

      // Track the event using the base analytics system
      trackEvent(eventName, enhancedParams);

      // Store user identification data locally if wallet is connected
      if (parameters.wallet_address && parameters.include_user_id) {
        await this.storeUserIdentificationData(parameters.wallet_address);
      }
    } catch (error) {
      console.warn('Enhanced analytics tracking failed:', error);
      // Fallback to basic tracking
      trackEvent(eventName, parameters);
    }
  }

  /**
   * Enhanced page view tracking with user identification
   */
  async trackPageView(
    pagePath: string,
    pageTitle?: string,
    includeUserData = false
  ): Promise<void> {
    try {
      // Track basic page view
      trackPageView(pagePath, pageTitle);

      // Track enhanced page view event with user data
      if (includeUserData) {
        await this.trackEvent('PAGE_VIEW', {
          event_category: 'navigation',
          event_label: pageTitle || pagePath,
          page_path: pagePath,
          include_user_id: true,
        });
      }
    } catch (error) {
      console.warn('Enhanced page view tracking failed:', error);
      // Fallback to basic tracking
      trackPageView(pagePath, pageTitle);
    }
  }

  /**
   * Track wallet connection with comprehensive user identification
   */
  async trackWalletConnection(
    walletAddress: string,
    accountType: 'EOA' | 'DSA',
    walletType?: string
  ): Promise<void> {
    await this.trackEvent('WALLET_CONNECT', {
      event_category: 'wallet',
      event_label: accountType,
      account_type: accountType,
      wallet_address: walletAddress,
      include_user_id: true,
      custom_parameters: {
        wallet_type: walletType,
        wallet_address_short: walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4),
      },
    });
  }

  /**
   * Track trading activities with user identification
   */
  async trackTrade(
    action: 'initiated' | 'completed' | 'failed',
    sellToken: string,
    buyToken: string,
    amount: string,
    walletAddress?: string,
    errorMessage?: string
  ): Promise<void> {
    const eventMap = {
      initiated: 'TRADE_INITIATED' as const,
      completed: 'TRADE_COMPLETED' as const,
      failed: 'TRADE_FAILED' as const,
    };

    await this.trackEvent(eventMap[action], {
      event_category: 'trading',
      event_label: `${sellToken}_to_${buyToken}`,
      value: parseFloat(amount) || undefined,
      wallet_address: walletAddress,
      include_user_id: !!walletAddress,
      custom_parameters: {
        sell_token: sellToken,
        buy_token: buyToken,
        trade_amount: amount,
        error_message: errorMessage,
      },
    });
  }

  /**
   * Track protocol interactions with user identification
   */
  async trackProtocolInteraction(
    protocol: string,
    action: string,
    walletAddress?: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.trackEvent('BUTTON_CLICK', {
      event_category: 'protocol_interaction',
      event_label: `${protocol}_${action}`,
      wallet_address: walletAddress,
      include_user_id: !!walletAddress,
      custom_parameters: {
        protocol,
        action,
        ...details,
      },
    });
  }

  /**
   * Store user identification data locally for analysis
   * Replaces the previous API-based storage with local storage
   */
  private async storeUserIdentificationData(walletAddress: string): Promise<void> {
    try {
      const userData = await this.userCollector.collectUserIdentification({
        includeWallet: true,
        includeFingerprint: true,
        includeIP: true,
        includeCloudflare: true,
      });
      
      const payload = {
        walletAddress,
        ...userData,
        // Override with our session data
        sessionId: this.sessionId,
        timestamp: Date.now(),
      };

      // Store data locally instead of sending to API
      await this.userCollector.storeIdentificationData(payload);
    } catch (error) {
      console.warn('Failed to store user identification data:', error);
    }
  }

  /**
   * Track user behavior patterns for fraud detection
   */
  async trackUserBehavior(
    behaviorType: 'suspicious' | 'normal' | 'bot_like',
    details: Record<string, unknown>,
    walletAddress?: string
  ): Promise<void> {
    await this.trackEvent('ERROR_OCCURRED', {
      event_category: 'security',
      event_label: `behavior_${behaviorType}`,
      wallet_address: walletAddress,
      include_user_id: true,
      custom_parameters: {
        behavior_type: behaviorType,
        behavior_details: details,
        detection_timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get current session information
   */
  getSessionInfo(): { sessionId: string; isInitialized: boolean } {
    return {
      sessionId: this.sessionId,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Force refresh user identification data
   */
  async refreshUserData(): Promise<void> {
    try {
      await this.userCollector.collectUserIdentification({
        includeWallet: true,
        includeFingerprint: true,
        includeIP: true,
        includeCloudflare: true,
      }); // Force refresh
    } catch (error) {
      console.warn('Failed to refresh user data:', error);
    }
  }
}

// Create a singleton instance
export const enhancedAnalytics = new EnhancedAnalyticsManager();

// Convenience functions for common use cases
export const trackEnhancedEvent = enhancedAnalytics.trackEvent.bind(enhancedAnalytics);
export const trackEnhancedPageView = enhancedAnalytics.trackPageView.bind(enhancedAnalytics);
export const trackEnhancedWalletConnection = enhancedAnalytics.trackWalletConnection.bind(enhancedAnalytics);
export const trackEnhancedTrade = enhancedAnalytics.trackTrade.bind(enhancedAnalytics);
export const trackEnhancedProtocolInteraction = enhancedAnalytics.trackProtocolInteraction.bind(enhancedAnalytics);

// Auto-initialize on import in browser environment
if (typeof window !== 'undefined') {
  enhancedAnalytics.initialize().catch(console.warn);
}