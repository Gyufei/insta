import { base, baseSepolia, mainnet, monadTestnet, sepolia } from '@reown/appkit/networks';
import { Chain } from '@reown/appkit/networks';

import { isProduction } from '@/lib/data/api-path';

export interface INetworkConfig extends Chain {
  icon: string;
}

export const NetworkConfigs = {
  monadTestnet: {
    ...monadTestnet,
    icon: '/icons/monad.svg',
    contracts: {
      ...monadTestnet.contracts,
    },
  },
  eth: {
    ...(isProduction ? mainnet : sepolia),
    icon: '/icons/eth.svg',
  },
  base: {
    ...(isProduction ? base : baseSepolia),
    icon: '/icons/base.svg',
  },
};

export const MONAD_TESTNET_NAME = 'Monad';

export const DEFAULT_NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const DEFAULT_TOKEN_DECIMALS = 18;

export const BaseNetIds = [
  String(NetworkConfigs.base.id),
  String(NetworkConfigs.eth.id),
] as string[];
