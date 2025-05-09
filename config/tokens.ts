import { DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';

export interface IToken {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: string;
}

export const MONAD = {
  name: 'Monad',
  symbol: 'MON',
  logo: '/icons/mon.svg',
  decimals: 18,
  address: DEFAULT_NATIVE_ADDRESS,
};

export const APR_MONAD = {
  name: 'aPriori Monad LST',
  symbol: 'aprMON',
  logo: '/icons/aprmon.svg',
  decimals: 18,
  address: '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
};

export const G_MONAD = {
  address: '0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3',
  name: 'gMON',
  symbol: 'gMON',
  logo: '/icons/gmon.svg',
  decimals: 18,
};

export const MonUSD = {
  address: '0x57c914e3240C837EBE87F096e0B4d9A06E3F489B',
  name: 'monUSD',
  symbol: 'monUSD',
  logo: '/icons/usdt.svg',
  decimals: 18,
};

export const TokenPriceMap: Record<string, number> = {
  MON: 0.00038,
  aprMON: 0.00038,
  gMON: 0.00038,
};
