import { DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';

import { isProduction } from '@/lib/data/api-path';

export interface IToken {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: string;
  description?: string;
}

export const MONAD = {
  name: 'Monad',
  symbol: 'MON',
  logo: '/icons/mon.svg',
  decimals: 18,
  address: DEFAULT_NATIVE_ADDRESS,
  description: 'Monad Testnet Gas',
};

export const APR_MONAD = {
  name: 'aPriori Monad LST',
  symbol: 'aprMON',
  logo: '/icons/aprmon.svg',
  decimals: 18,
  address: isProduction
    ? '0x0c65A0BC65a5D819235B71F554D210D3F80E0852'
    : '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
  description: 'Staking Token on Monad Apriori',
};

export const G_MONAD = {
  address: isProduction
    ? '0x8498312A6B3CbD158bf0c93AbdCF29E6e4F55081'
    : '0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3',
  name: 'gMON',
  symbol: 'gMON',
  logo: '/icons/gmon.svg',
  decimals: 18,
  description: 'Staking Token on Monad Magma',
};

export const MonUSD = {
  address: '0x57c914e3240C837EBE87F096e0B4d9A06E3F489B',
  name: 'monUSD',
  symbol: 'monUSD',
  logo: '/icons/monUSD.svg',
  decimals: 18,
  description: 'Tadle Monad USD',
};

export const TokenPriceMap: Record<string, number> = {
  aprMON: isProduction ? 2 : 1,
  gMON: isProduction ? 2 : 1,
};

// Common tokens used across DEX modules
// export const USDT_TOKEN: IToken = {
//   address: '0xfBC2D240A5eD44231AcA3A9e9066bc4b33f01149',
//   name: 'Tether USD',
//   symbol: 'USDT',
//   logo: '/icons/usdt.svg',
//   decimals: 6,
// };

export const WMONAD_TOKEN: IToken = {
  address: isProduction
    ? '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A'
    : '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  name: 'Wrapped Monad',
  symbol: 'wMON',
  logo: '/icons/wmon.svg',
  decimals: 18,
};

// Additional LST tokens
export const SH_MONAD: IToken = {
  address: isProduction
    ? '0x1B68626dCa36c7fE922fD2d55E4f631d962dE19c'
    : '0x3a98250F98Dd388C211206983453837C8365BDc1',
  name: 'ShMonad',
  symbol: 'shMON',
  logo: '/icons/shmon.png',
  decimals: 18,
  description: 'Shard Monad Liquid Staked Token',
};

export const S_MONAD: IToken = {
  address: isProduction
    ? '0xA3227C5969757783154C60bF0bC1944180ed81B9'
    : '0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5',
  name: 'Kintsu Staked Monad',
  symbol: 'sMON',
  logo: '/icons/smon.png',
  decimals: 18,
  description: 'Kintsu Staked Monad Liquid Staked Token',
};
