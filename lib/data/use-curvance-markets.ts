import { useMemo } from 'react';

import {
  APR_MONAD,
  AUSD,
  G_MONAD,
  MONAD,
  MonUSD,
  SH_MONAD,
  S_MONAD,
  USDC_TOKEN,
  WBTC,
  WETH,
  WMONAD_TOKEN,
  earnAUSD,
  ezETH,
  loAZND,
  mu_BOND,
  sAUSD,
} from '@/config/tokens';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { useUniswapTokens } from './use-uniswap-tokens';

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
  // 从 tokens 接口中合并的图标地址（可选）
  logoURI: string;
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
  // 原始 markets 查询
  const marketsQuery = createQueryHook<ICurvanceMarketInfo[]>(
    ApiPath.curvanceMarkets,
    () => ['curvance', 'markets'],
    (url) => url,
    {
      withAccount: false,
      enabled,
      staleTime: 60_000,
    }
  )();

  // 取 tokens 列表以合并 logo
  const { data: uniswapTokens } = useUniswapTokens();

  const enrichedData = useMemo(() => {
    const list = marketsQuery.data;
    if (!list || !Array.isArray(list)) return list;

    const logoMap = new Map<string, string>();
    (uniswapTokens || []).forEach((t) => {
      if (t?.address) {
        logoMap.set(t.address.toLowerCase(), t.logoURI || '');
      }
    });

    // 本地回退：按 symbol 提供内置图标映射
    const symbolLogoMap = new Map<string, string>([
      [MONAD.symbol.toUpperCase(), MONAD.logo],
      [APR_MONAD.symbol.toUpperCase(), APR_MONAD.logo],
      [G_MONAD.symbol.toUpperCase(), G_MONAD.logo],
      [WMONAD_TOKEN.symbol.toUpperCase(), WMONAD_TOKEN.logo],
      [MonUSD.symbol.toUpperCase(), MonUSD.logo],
      [SH_MONAD.symbol.toUpperCase(), SH_MONAD.logo],
      [S_MONAD.symbol.toUpperCase(), S_MONAD.logo],
      [earnAUSD.symbol.toUpperCase(), earnAUSD.logo],
      [WBTC.symbol.toUpperCase(), WBTC.logo],
      [WETH.symbol.toUpperCase(), WETH.logo],
      [mu_BOND.symbol.toUpperCase(), mu_BOND.logo],
      [AUSD.symbol.toUpperCase(), AUSD.logo],
      [ezETH.symbol.toUpperCase(), ezETH.logo],
      [sAUSD.symbol.toUpperCase(), sAUSD.logo],
      [earnAUSD.symbol.toUpperCase(), earnAUSD.logo],
      [USDC_TOKEN.symbol.toUpperCase(), USDC_TOKEN.logo],
      [loAZND.symbol.toUpperCase(), loAZND.logo],
    ]);

    const attachLogo = (token: ICurvanceTokenInfo): ICurvanceTokenInfo => {
      const addr = (token?.wrapper_address || token?.address || '').toLowerCase();
      const logoByAddr = logoMap.get(addr);
      if (logoByAddr) return { ...token, logoURI: logoByAddr };

      const sym = (token?.symbol || '').toUpperCase();
      const logoBySym = symbolLogoMap.get(sym);
      return logoBySym ? { ...token, logoURI: logoBySym || '/icons/token.svg' } : token;
    };

    return list.map((m) => ({
      ...m,
      token0: attachLogo(m.token0),
      token1: attachLogo(m.token1),
    }));
  }, [marketsQuery.data, uniswapTokens]);

  return {
    ...marketsQuery,
    data: enrichedData,
  };
}
