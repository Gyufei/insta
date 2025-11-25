import { base, baseSepolia, mainnet, monadTestnet, sepolia } from '@reown/appkit/networks';
import { Chain } from '@reown/appkit/networks';

import { isProduction } from '@/lib/data/api-path';

export interface INetworkConfig extends Chain {
  icon: string;
}

// ==== Monad Mainnet (temporary: copy missing info from testnet) ====
const monadMainnet: Chain = {
  ...monadTestnet,
  id: 143,
  name: 'Monad',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://gateway.tadle.com/rpc/monad'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision',
      url: 'https://monadvision.com/',
    },
  },
  contracts: {
    ...monadTestnet.contracts,
  },
};

export const NetworkConfigs = {
  monadTestnet: {
    ...(isProduction ? monadMainnet : monadTestnet),
    icon: '/icons/monad.svg',
    contracts: {
      ...(isProduction ? monadMainnet.contracts : monadTestnet.contracts),
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

export const DEFAULT_NATIVE_ADDRESS = isProduction
  ? '0x0000000000000000000000000000000000000000'
  : '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const BACKEND_NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const DEFAULT_TOKEN_DECIMALS = 18;

export const UniversalRouterAddress = '0x3aE6D8A282D67893e17AA70ebFFb33EE5aa65893';
export const UniversalRouterAddressPermit = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

export const TOKEN_DECIMALS: Record<string, Record<string, number>> = {
  [NetworkConfigs.monadTestnet.id]: {
    '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea': 6,
    '0x754704Bc059F8C67012fEd69BC8A327a5aafb603': 6,
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
