import { MONAD, MonUSD } from '@/config/tokens';

import { isProduction } from '@/lib/data/api-path';

export const STATION_FROM_TOKENS_ETH = [
  {
    name: 'Eth',
    symbol: 'ETH',
    logo: '/icons/eth.svg',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    description: isProduction ? 'Ethereum Mainnet Gas' : 'Ethereum Testnet Gas',
  },
  {
    address: isProduction
      ? '0xdac17f958d2ee523a2206206994597c13d831ec7'
      : '0xD9A6037894a5B8Ad91e6d4815431FC63445bAeBb',
    name: 'Tether USD',
    symbol: 'USDT',
    logo: '/icons/usdt.svg',
    decimals: 6,
    description: isProduction ? 'Stablecoin on Ethereum Mainnet' : 'Stablecoin on Ethereum Testnet',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    logo: '/icons/usdc.svg',
    decimals: 18,
    address: isProduction
      ? '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      : '0xD9A6037894a5B8Ad91e6d4815431FC63445bAeBb',
    description: isProduction ? 'Stablecoin on Ethereum Mainnet' : 'Stablecoin on Ethereum Testnet',
  },
];

export const STATION_FROM_TOKENS_BASE = [
  {
    name: 'Eth',
    symbol: 'ETH',
    logo: '/icons/eth.svg',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    description: isProduction ? 'Base Mainnet Gas' : 'Base Testnet Gas',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    logo: '/icons/usdt.svg',
    decimals: 6,
    address: isProduction
      ? '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2'
      : '0xC179da1fcDE35d63a8eB46eA50Bf363719f3aB05',
    description: isProduction ? 'Stablecoin on Base Mainnet' : 'Stablecoin on Base Testnet',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    logo: '/icons/usdc.svg',
    decimals: 18,
    address: isProduction
      ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      : '0xC179da1fcDE35d63a8eB46eA50Bf363719f3aB05',
    description: isProduction ? 'Stablecoin on Base Mainnet' : 'Stablecoin on Base Testnet',
  },
];

export const STATION_TO_TOKENS = [MONAD, MonUSD];
