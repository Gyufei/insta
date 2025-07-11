import { NetworkConfigs } from '@/config/network-config';

import { ApiPath, WithPointImgCDN, WithProjectImgCDN } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface IMarketplace {
  id: number;
  last_price: string;
  last_price_24h_ago: string;
  minimum_price: string;
  market_name: string;
  floor_price: string;
  total_vol: string;
  filled_orders: string;
  change_rate_24h: string;
  vol_24h: string;
  listed_supply: string;
  avg_bid: string;
  tge: string;
  settlement_period: string;
  trading_ends_at: string;
  all_time_high_price: string;
  initial_listing_price: string;
  active_wallets: string;
  status: string;
  market_symbol: string;
  market_catagory:
    | 'offchain_fungible_point'
    | 'onchain_fungible_point'
    | 'onchain_nonfungible_point'
    | 'point_token'
    | 'future_token'
    | 'token'
    | 'whitelist';
  item_name: string;
  project_token_addr: string;
  token_per_item: string;
  is_fungible: boolean;
  require_collateral: boolean;
  market_place_account: string;

  projectLogo: string;
  pointLogo: string;
}

function useMarketPlaceData() {
  return createQueryHook<IMarketplace[]>(
    ApiPath.c2cMarketplaces,
    () => ['markets'],
    (url) => {
      return url;
    },
    {
      withAccount: false,
    }
  )();
}

export function useMarketplaces() {
  const res = useMarketPlaceData();

  const allMarket = res.data
    ? res.data
    : (res.data || []).map((m: IMarketplace) => {
        return {
          ...m,
          projectLogo: WithProjectImgCDN(m.market_symbol, NetworkConfigs.monadTestnet.name),
          pointLogo: WithPointImgCDN(m.market_symbol, NetworkConfigs.monadTestnet.name),
        };
      });

  return {
    ...res,
    data: allMarket,
  };
}
