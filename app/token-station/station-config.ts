import { MONAD, MonUSD } from '@/config/tokens';

export const STATION_FROM_TOKENS_ETH = [
  {
    name: 'Eth',
    symbol: 'ETH',
    logo: '/icons/eth.svg',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    logo: '/icons/usdt.svg',
    decimals: 6,
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    logo: '/icons/usdc.svg',
    decimals: 18,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
