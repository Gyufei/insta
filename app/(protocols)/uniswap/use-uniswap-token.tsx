import { APR_MONAD, G_MONAD, IToken, MONAD } from '@/lib/data/tokens';

const UNISWAP_TOKENS: Array<IToken> = [
  MONAD,
  {
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    name: 'Wrapped Monad',
    symbol: 'wMON',
    logo: '/icons/wmon.svg',
    decimals: 18,
  },
  {
    address: '0xfBC2D240A5eD44231AcA3A9e9066bc4b33f01149',
    name: 'Tether USD',
    symbol: 'USDT',
    logo: '/icons/usdt.svg',
    decimals: 6,
  },
  APR_MONAD,
  G_MONAD,
];

export function useUniswapToken() {
  return {
    tokens: UNISWAP_TOKENS,
  };
}
