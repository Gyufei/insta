import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ILiquidityRatio {
  ratio: string;
}

interface ILiquidityRatioParams {
  tokenA: string;
  tokenB: string;
  fee: number;
  price_current: number;
  price_lower: number;
  price_upper: number;
  decimals_a: number;
  decimals_b: number;
}

export function useAmbientLiquidityRatio(params: ILiquidityRatioParams) {
  return createQueryHook<ILiquidityRatio>(
    ApiPath.ambientLiquidityRatio,
    () => ['ambient', 'liquidity-ratio', JSON.stringify(params)],
    (url) => {
      url.searchParams.set('tokenA', params.tokenA);
      url.searchParams.set('tokenB', params.tokenB);
      url.searchParams.set('fee', params.fee.toString());
      url.searchParams.set('price_current', params.price_current.toString());
      url.searchParams.set('price_lower', params.price_lower.toString());
      url.searchParams.set('price_upper', params.price_upper.toString());
      url.searchParams.set('decimals_a', params.decimals_a.toString());
      url.searchParams.set('decimals_b', params.decimals_b.toString());
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
