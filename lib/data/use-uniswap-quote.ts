import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { NetworkConfigs } from '@/config/network-config';

export interface IUniswapQuote {
  input: string;
  output: string;
  route: Array<Array<{
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
  }>>;
}

export interface IUniswapQuoteParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountInDecimals: string;
}

export function useUniswapQuote(params?: IUniswapQuoteParams) {
  const chainId = NetworkConfigs.monadTestnet.id.toString();
  
  return createQueryHook<IUniswapQuote>(
    ApiPath.uniswapQuote,
    () => ['uniswap', 'quote', chainId, params?.tokenIn || '', params?.tokenOut || '', params?.amountIn || ''],
    (url) => {
      if (!params) {
        return null;
      }
      url.searchParams.set('chain_id', chainId);
      url.searchParams.set('token_in', params.tokenIn);
      url.searchParams.set('token_out', params.tokenOut);
      url.searchParams.set('amount_in', params.amountIn);
      url.searchParams.set('amount_in_decimals', params.amountInDecimals);
      return url;
    },
    {
      withAccount: false,
    }
  )();
} 