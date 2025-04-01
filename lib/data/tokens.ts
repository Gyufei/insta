export interface IToken {
  name: string;
  symbol: string;
  iconUrl: string;
  coingeckoUrl: string;
}

export const tokenData: IToken[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/eth.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/ethereum',
  },
  {
    name: 'Fluid',
    symbol: 'FLUID',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/fluid.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/instadapp',
  },
  {
    name: 'Instadapp ETH',
    symbol: 'iETH',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/ieth.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/instadapp-eth',
  },
  {
    name: 'Instadapp WBTC',
    symbol: 'iWBTC',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/iwbtc.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/instadapp-wbtc',
  },
  {
    name: 'Instadapp USDC',
    symbol: 'iUSDC',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/iusdc.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/instadapp-usdc',
  },
  {
    name: 'Instadapp DAI',
    symbol: 'iDAI',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/idai.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/instadapp-dai',
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/dai.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/dai',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/usdc.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/usd-coin',
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/usdt.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/tether',
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    iconUrl: 'https://cdn.instadapp.io/icons/tokens/weth.svg',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/weth',
  },
];
