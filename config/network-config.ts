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

export const BACKEND_NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const DEFAULT_TOKEN_DECIMALS = 18;

export const UniversalRouterAddress = '0x3aE6D8A282D67893e17AA70ebFFb33EE5aa65893';

export const TOKEN_DECIMALS: Record<string, Record<string, number>> = {
  [NetworkConfigs.monadTestnet.id]: {
    '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea': 6,
  },
};

export const BaseNetIds = [
  String(NetworkConfigs.base.id),
  String(NetworkConfigs.eth.id),
] as string[];

export function replaceNativeAddressUseBackend(tokenAddress: string) {
  if (tokenAddress === DEFAULT_NATIVE_ADDRESS) {
    return BACKEND_NATIVE_ADDRESS;
  }
  return tokenAddress;
}
