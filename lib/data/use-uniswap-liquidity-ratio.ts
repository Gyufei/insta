import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { toNonExponential } from '@/lib/utils/number';

export interface ILiquidityRatio {
  ratio: string;
}

interface ILiquidityRatioParams {
  tokenA: string;
  tokenB: string;
  fee: number;
  price_current: string;
  price_lower: string;
  price_upper: string;
  decimals_a: number;
  decimals_b: number;
}

export function useUniswapLiquidityRatio(params: ILiquidityRatioParams) {
  return createQueryHook<ILiquidityRatio>(
    ApiPath.uniswapLiquidityRatio,
    () => ['uniswap', 'liquidity-ratio', JSON.stringify(params)],
    (url) => {
      if (!params.tokenA || !params.tokenB) {
        return null;
      }

      url.searchParams.set('tokenA', params.tokenA);
      url.searchParams.set('tokenB', params.tokenB);
      url.searchParams.set('fee', params.fee.toString());
      url.searchParams.set('price_current', toNonExponential(params.price_current));
      url.searchParams.set('price_lower', toNonExponential(params.price_lower));
      url.searchParams.set('price_upper', toNonExponential(params.price_upper));
      url.searchParams.set('decimals_a', params.decimals_a.toString());
      url.searchParams.set('decimals_b', params.decimals_b.toString());
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
