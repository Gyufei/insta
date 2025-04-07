export interface IToken {
  name: string;
  symbol: string;
  iconUrl: string;
  decimals: number;
  address: string;
}

export const TokenData: IToken[] = [
  {
    name: 'Monad',
    symbol: 'MON',
    iconUrl: '/icons/mon.svg',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    name: 'aprMON',
    symbol: 'aprMON',
    iconUrl: '/icons/aprmon.svg',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
];

export const TokenPriceMap: Record<string, number> = {
  MON: 9.82,
  aprMON: 9.82,
};
