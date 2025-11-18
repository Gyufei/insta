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
  address: '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
  description: 'Staking Token on Monad Apriori',
};

export const G_MONAD = {
  address: '0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3',
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
export const USDT_TOKEN: IToken = {
  address: '0xfBC2D240A5eD44231AcA3A9e9066bc4b33f01149',
  name: 'Tether USD',
  symbol: 'USDT',
  logo: '/icons/usdt.svg',
  decimals: 6,
};

export const WMONAD_TOKEN: IToken = {
  address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  name: 'Wrapped Monad',
  symbol: 'wMON',
  logo: '/icons/wmon.svg',
  decimals: 18,
};

// Additional LST tokens
export const SH_MONAD: IToken = {
  address: '0x3a98250F98Dd388C211206983453837C8365BDc1',
  name: 'ShMonad',
  symbol: 'shMON',
  logo: '/icons/shmon.png',
  decimals: 18,
  description: 'Shard Monad Liquid Staked Token',
};

export const S_MONAD: IToken = {
  address: '0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5',
  name: 'Kintsu Staked Monad',
  symbol: 'sMON',
  logo: '/icons/smon.png',
  decimals: 18,
  description: 'Kintsu Staked Monad Liquid Staked Token',
};
