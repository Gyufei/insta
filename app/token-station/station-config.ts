import { MONAD, MonUSD } from '@/config/tokens';

import { USDT_TOKEN } from '../(protocols)/uniswap/use-uniswap-token';

export const STATION_FROM_TOKENS = [
  {
    name: 'Eth',
    symbol: 'ETH',
    logo: '/icons/eth.svg',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  USDT_TOKEN,
  {
    name: 'USDC',
    symbol: 'USDC',
    logo: '/icons/usdc.svg',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  // {
  //   name: 'LINK',
  //   symbol: 'LINK',
  //   logo: '/icons/link-token.svg',
  //   decimals: 18,
  //   address: '0x0000000000000000000000000000000000000000',
  // },
];

export const STATION_TO_TOKENS = [MONAD, MonUSD];
