import { NetworkConfigs } from '@/config/network-config';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { toNonExponential } from '@/lib/utils/number';

export interface IUniswapQuote {
  input: string;
  output: string;
  priceImpact: number;
  permitData: {
    domain: {
      name: string;
      chainId: number;
      verifyingContract: string;
    };
    types: {
      PermitSingle: [
        {
          name: string;
          type: string;
        },
        {
          name: string;
          type: string;
        },
        {
          name: string;
          type: string;
        },
      ];
      PermitDetails: [
        {
          name: string;
          type: string;
        },
        {
          name: string;
          type: string;
        },
        {
          name: string;
          type: string;
        },
        {
          name: string;
          type: string;
        },
      ];
    };
    values: {
      details: {
        token: string;
        amount: string;
        expiration: string;
        nonce: string;
      };
      spender: string;
      sigDeadline: string;
    };
  };
  route: Array<
    Array<{
      type: string;
      address: string;
      tokenIn: {
        chainId: number;
        decimals: string;
        address: string;
        symbol: string;
      };
      tokenOut: {
        chainId: number;
        decimals: string;
        address: string;
        symbol: string;
      };
      fee: string;
      liquidity: string;
      sqrtRatioX96: string;
      tickCurrent: string;
      amountIn: string;
      amountOut: string;
    }>
  >;
}

export interface IUniswapQuoteParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountInDecimals: string;
  wallet?: string;
}

export function useUniswapQuote(params?: IUniswapQuoteParams) {
  const chainId = NetworkConfigs.monadTestnet.id.toString();

  return createQueryHook<IUniswapQuote>(
    ApiPath.uniswapQuote,
    () => [
      'uniswap',
      'quote',
      chainId,
      params?.tokenIn || '',
      params?.tokenOut || '',
      params?.amountIn || '',
    ],
    (url) => {
      if (!params) {
        return null;
      }
      if (Number(params.amountIn) === 0) {
        return null;
      }
      url.searchParams.set('chain_id', chainId);
      url.searchParams.set('token_in', params.tokenIn);
      url.searchParams.set('token_out', params.tokenOut);
      url.searchParams.set('amount_in', toNonExponential(params.amountIn));
      url.searchParams.set('amount_in_decimals', params.amountInDecimals);
      if (params.wallet) {
        url.searchParams.set('wallet', params.wallet);
      }
      return url;
    },
    {
      withAccount: false,
      retry: false,
    }
  )();
}
