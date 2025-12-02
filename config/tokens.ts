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
  description: 'Monad Gas',
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

export const USDC_TOKEN: IToken = {
  address: isProduction
    ? '0x754704Bc059F8C67012fEd69BC8A327a5aafb603'
    : '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
  name: 'USDC',
  symbol: 'USDC',
  logo: '/icons/usdc.svg',
  decimals: 6,
};

export const WMONAD_TOKEN: IToken = {
  address: isProduction
    ? '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A'
    : '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  name: 'Wrapped MON',
  symbol: 'WMON',
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

export const mu_BOND: IToken = {
  address: '0x336D414754967C6682B5A665C7DAF6F1409E63e8',
  name: 'mu Bond',
  symbol: 'muBOND',
  logo: '/icons/mubond.svg',
  decimals: 18,
  description: 'mu Bond',
};

export const AUSD: IToken = {
  address: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a',
  name: 'AUSD',
  symbol: 'AUSD',
  logo: '/icons/ausd.svg',
  decimals: 6,
  description: 'AUSD',
};

export const WETH: IToken = {
  address: '0xEE8c0E9f1BFFb4Eb878d8f15f368A02a35481242',
  name: 'Wrapped Ether',
  symbol: 'WETH',
  logo: '/icons/weth.svg',
  decimals: 18,
  description: 'WETH',
};

export const ezETH: IToken = {
  address: '0x2416092f143378750bb29b79eD961ab195CcEea5',
  name: 'ezETH',
  symbol: 'ezETH',
  logo: '/icons/ezeth.svg',
  decimals: 18,
  description: 'ezETH',
};

export const sAUSD: IToken = {
  address: '0xD793c04B87386A6bb84ee61D98e0065FdE7fdA5E',
  name: 'sAUSD',
  symbol: 'sAUSD',
  logo: '/icons/sausd.svg',
  decimals: 6,
  description: 'AUSD',
};

export const earnAUSD: IToken = {
  address: '0x103222f020e98Bba0AD9809A011FDF8e6F067496',
  name: 'earnAUSD',
  symbol: 'earnAUSD',
  logo: '/icons/earnausd.svg',
  decimals: 6,
  description: 'AUSD',
};

export const WBTC: IToken = {
  address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
  name: 'Wrapped BTC',
  symbol: 'WBTC',
  logo: '/icons/wbtc.svg',
  decimals: 8,
  description: 'WBTC',
};

export const loAZND: IToken = {
  address: '0x9c82eB49B51F7Dc61e22Ff347931CA32aDc6cd90',
  name: 'Locked AZND',
  symbol: 'loAZND',
  logo: '/icons/loaznd.svg',
  decimals: 18,
  description: 'loAZND',
};