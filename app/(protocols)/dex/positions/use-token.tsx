import { APR_MONAD, G_MONAD, IToken, MONAD, MonUSD } from '@/config/tokens';

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

export const TOKENS: Array<IToken> = [MONAD, WMONAD_TOKEN, USDT_TOKEN, MonUSD, APR_MONAD, G_MONAD];
