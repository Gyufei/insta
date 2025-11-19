import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { toNonExponential } from '@/lib/utils/number';

export interface IDexQuoteParams {
  token_in: string;
  token_out: string;
  amount_in: string;
  amount_in_decimals: string;
  amount_out_decimals: string;
  swap_router_name: string; // e.g. 'Uniswap v3' | 'Ambient'
}

export interface IDexQuoteResponse {
  swapRouterName?: string;
  dexRouter?: string;
  path?: string[];
  amountIn?: string;
  amountOut?: string;
  tokenInIsMON?: boolean;
  tokenOutIsMON?: boolean;
  amountInWei?: string;
  amountOutWei?: string;
}

export function useDexQuote(params?: IDexQuoteParams) {
  const chainId = NetworkConfigs.monadTestnet.id.toString();

  return createQueryHook<IDexQuoteResponse>(
    ApiPath.dexQuote,
    () => [
      'dex',
      'quote',
      chainId,
      params?.swap_router_name || '',
      params?.token_in || '',
      params?.token_out || '',
      params?.amount_in || '',
    ],
    (url) => {
      if (!params) return null;
      if (Number(params.amount_in) === 0) return null;
      url.searchParams.set('chain_id', chainId);
      url.searchParams.set('token_in', params.token_in);
      url.searchParams.set('token_out', params.token_out);
      url.searchParams.set('amount_in', toNonExponential(params.amount_in));
      url.searchParams.set('amount_in_decimals', params.amount_in_decimals);
      url.searchParams.set('amount_out_decimals', params.amount_out_decimals);
      url.searchParams.set('swap_router_name', params.swap_router_name);
      return url;
    },
    {
      withAccount: false,
      retry: false,
    }
  )();
}
