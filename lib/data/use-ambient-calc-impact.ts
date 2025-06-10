import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ICalcImpact {
  baseFlow: string;
  quoteFlow: string;
  finalPrice: string;
}

interface ICalcImpactParams {
  base_token: string;
  quote_token: string;
  pool_idx: number;
  sell_base: boolean;
  token_amount: number;
  pool_tip: number;
}

export function useAmbientCalcImpact(params: ICalcImpactParams) {
  return createQueryHook<ICalcImpact>(
    ApiPath.ambientCalcImpact,
    () => ['ambient', 'calc-impact', JSON.stringify(params)],
    (url) => {
      url.searchParams.set('base_token', params.base_token);
      url.searchParams.set('quote_token', params.quote_token);
      url.searchParams.set('pool_idx', params.pool_idx.toString());
      url.searchParams.set('sell_base', params.sell_base.toString());
      url.searchParams.set('token_amount', params.token_amount.toString());
      url.searchParams.set('pool_tip', params.pool_tip.toString());
      return url;
    },
    {
      withAccount: false,
    }
  )();
} 