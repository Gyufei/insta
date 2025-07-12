import { isProduction } from '@/lib/data/api-path';

export const BUY_TOKEN_CONFIG_BASE = [
  {
    symbol: 'ETH',
    logo: '/icons/eth.svg',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    logo: '/icons/usdt.svg',
    decimals: 6,
    address: isProduction
      ? '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2'
      : '0xC179da1fcDE35d63a8eB46eA50Bf363719f3aB05',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    logo: '/icons/usdc.svg',
    decimals: 18,
    address: isProduction
      ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      : '0xC179da1fcDE35d63a8eB46eA50Bf363719f3aB05',
  },
];
