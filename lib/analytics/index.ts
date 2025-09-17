// Analytics tracking utilities using @next/third-parties/google

// Analytics events configuration
export const ANALYTICS_EVENTS = {
  // Wallet Connection Events
  WALLET_CONNECT: 'wallet_connect',
  WALLET_DISCONNECT: 'wallet_disconnect',
  ACCOUNT_SWITCH: 'account_switch',

  // Trading Events
  TRADE_INITIATED: 'trade_initiated',
  TRADE_COMPLETED: 'trade_completed',
  TRADE_FAILED: 'trade_failed',
  TOKEN_APPROVE: 'token_approve',
  SWAP_TOKENS: 'swap_tokens',
  SLIPPAGE_CHANGE: 'slippage_change',

  // Portfolio Events
  DEPOSIT_INITIATED: 'deposit_initiated',
  DEPOSIT_COMPLETED: 'deposit_completed',
  WITHDRAW_INITIATED: 'withdraw_initiated',
  WITHDRAW_COMPLETED: 'withdraw_completed',
  PORTFOLIO_VIEW: 'portfolio_view',
  BALANCE_REFRESH: 'balance_refresh',

  // Token Station Events
  TOKEN_STATION_VIEW: 'token_station_view',
  TOKEN_BRIDGE_INITIATED: 'token_bridge_initiated',
  TOKEN_BRIDGE_COMPLETED: 'token_bridge_completed',

  // Protocol Events
  UNISWAP_POSITION_CREATE: 'uniswap_position_create',
  UNISWAP_LIQUIDITY_ADD: 'uniswap_liquidity_add',
  UNISWAP_LIQUIDITY_REMOVE: 'uniswap_liquidity_remove',
  AMBIENT_POSITION_CREATE: 'ambient_position_create',
  APRIORI_STAKE: 'apriori_stake',
  MAGMA_STAKE: 'magma_stake',

  // NAD Fun Events
  NAD_TOKEN_CREATE: 'nad_token_create',
  NAD_TOKEN_BUY: 'nad_token_buy',
  NAD_TOKEN_SELL: 'nad_token_sell',

  // NAD Name Service Events
  NAD_NAME_REGISTER: 'nad_name_register',
  NAD_NAME_TRANSFER: 'nad_name_transfer',
  NAD_NAME_SET_PRIMARY: 'nad_name_set_primary',

  // Badge Gallery Events
  BADGE_PURCHASE: 'badge_purchase',
  BADGE_CLAIM: 'badge_claim',

  // Odds/Prediction Market Events
  MARKET_CREATE: 'market_create',
  MARKET_VIEW: 'market_view',
  POSITION_OPEN: 'position_open',
  POSITION_CLOSE: 'position_close',
  ODDS_CLAIM: 'odds_claim',

  // Faucet Events
  FAUCET_CLAIM: 'faucet_claim',

  // General UI Events
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  SEARCH: 'search',
  FILTER_CHANGE: 'filter_change',
  TAB_CHANGE: 'tab_change',

  // Error Events
  ERROR_OCCURRED: 'error_occurred',
  TRANSACTION_FAILED: 'transaction_failed',
} as const;

// Analytics parameters interface
export interface AnalyticsParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  currency?: string;
  token_address?: string;
  token_symbol?: string;
  amount?: string;
  account_type?: 'EOA' | 'DSA';
  network?: string;
  error_message?: string;
  page_path?: string;
  custom_parameters?: Record<string, unknown>;
}

// Track events using gtag (provided by @next/third-parties/google)
export const trackEvent = (
  eventName: keyof typeof ANALYTICS_EVENTS,
  parameters: AnalyticsParams = {}
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventAction = ANALYTICS_EVENTS[eventName];

    window.gtag('event', eventAction, {
      event_category: parameters.event_category || 'engagement',
      event_label: parameters.event_label,
      value: parameters.value,
      currency: parameters.currency,
      custom_parameters: {
        token_address: parameters.token_address,
        token_symbol: parameters.token_symbol,
        amount: parameters.amount,
        account_type: parameters.account_type,
        network: parameters.network,
        error_message: parameters.error_message,
        page_path: parameters.page_path,
        ...parameters.custom_parameters,
      },
    });
  }
};

// Track page views
export const trackPageView = (page_path: string, page_title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path,
      page_title,
    });
  }
};

// Track user properties
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      custom_map: properties,
    });
  }
};

// Track conversions for important actions
export const trackConversion = (conversionId: string, value?: number, currency = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value,
      currency,
    });
  }
};

// Helper function to track wallet connection
export const trackWalletConnection = (address: string, accountType: 'EOA' | 'DSA') => {
  trackEvent('WALLET_CONNECT', {
    event_category: 'wallet',
    event_label: accountType,
    account_type: accountType,
    custom_parameters: {
      wallet_address: address.slice(0, 6) + '...' + address.slice(-4), // Anonymize address
    },
  });
};

// Helper function to track trading activities
export const trackTrade = (
  action: 'initiated' | 'completed' | 'failed',
  sellToken: string,
  buyToken: string,
  amount: string,
  errorMessage?: string
) => {
  const eventMap = {
    initiated: 'TRADE_INITIATED' as const,
    completed: 'TRADE_COMPLETED' as const,
    failed: 'TRADE_FAILED' as const,
  };

  trackEvent(eventMap[action], {
    event_category: 'trading',
    event_label: `${sellToken}_to_${buyToken}`,
    value: parseFloat(amount) || undefined,
    custom_parameters: {
      sell_token: sellToken,
      buy_token: buyToken,
      trade_amount: amount,
      error_message: errorMessage,
    },
  });
};

// Helper function to track protocol interactions
export const trackProtocolInteraction = (
  protocol: 'uniswap' | 'ambient' | 'apriori' | 'magma' | 'nad_fun' | 'nad_name_service',
  action: string,
  details?: Record<string, unknown>
) => {
  trackEvent('BUTTON_CLICK', {
    event_category: 'protocol_interaction',
    event_label: `${protocol}_${action}`,
    custom_parameters: {
      protocol,
      action,
      ...details,
    },
  });
};

// Declare global gtag type for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
