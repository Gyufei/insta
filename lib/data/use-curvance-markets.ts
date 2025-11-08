import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface ICurvanceTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  wrapper_address?: string;
  wrapper_name?: string;
  wrapper_symbol?: string;
  wrapper_decimals?: number;
  price?: string;
  total_supply?: string;
  total_supply_in_usd?: string;
  total_debt?: string;
  total_debt_in_usd?: string;
  supply_rate?: string;
  borrow_rate?: string;
}

export interface ICurvanceMarketInfo {
  market_name: string;
  market_address: string;
  chain_name: string;
  total_supply_in_usd?: string;
  available_supply_in_usd?: string;
  utilization_rate?: string;
  supply_rate?: string;
  borrow_rate?: string;
  token0: ICurvanceTokenInfo;
  token1: ICurvanceTokenInfo;
}

export function useCurvanceMarkets(enabled?: boolean) {
  return createQueryHook<ICurvanceMarketInfo[]>(
    ApiPath.curvanceMarkets,
    () => ['curvance', 'markets'],
    (url) => url,
    {
      withAccount: false,
      enabled,
      staleTime: 60_000,
    }
  )();
}