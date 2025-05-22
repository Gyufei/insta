import { APR_MONAD, G_MONAD, IToken, MONAD } from '@/config/tokens';

export const USDT_TOKEN: IToken = {
  address: '0xfBC2D240A5eD44231AcA3A9e9066bc4b33f01149',
  name: 'Tether USD',
  symbol: 'USDT',
  logo: '/icons/usdt.svg',
  decimals: 6,
};

const UNISWAP_TOKENS: Array<IToken> = [
  MONAD,
  {
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    name: 'Wrapped Monad',
    symbol: 'wMON',
    logo: '/icons/wmon.svg',
    decimals: 18,
  },
  USDT_TOKEN,
  APR_MONAD,
  G_MONAD,
  {
    address: '0x40EFECc1097fbfb1B5fbF529aE62B20504aDAccD',
    name: 'BTC 8',
    symbol: 'BTC8',
    logo: '',
    decimals: 8,
  },
  {
    address: '0x4f9569b3B7c38fa6BAE983698bF7d7B13c9fECA6',
    name: 'USDT 6',
    symbol: 'USDT6',
    logo: '',
    decimals: 6,
  },
];

export function useUniswapToken() {
  return {
    tokens: UNISWAP_TOKENS,
  };
}
