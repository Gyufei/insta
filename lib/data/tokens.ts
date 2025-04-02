export interface IToken {
  name: string;
  symbol: string;
  iconUrl: string;
  decimals: number;
}

export const tokenData: IToken[] = [
  {
    name: 'Monad',
    symbol: 'MON',
    iconUrl: '/icons/mon.png',
    decimals: 18,
  },
];
