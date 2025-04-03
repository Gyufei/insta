import { monadTestnet } from '@reown/appkit/networks';
import { Chain } from '@reown/appkit/networks';

export interface INetworkConfig extends Chain {
  icon: string;
}

export const NetworkConfigs = {
  monadTestnet: {
    ...monadTestnet,
    icon: '/icons/monad.svg',
    contracts: {
      ...monadTestnet.contracts,
      dsa: {
        address: '0x0000000000000000000000000000000000000000',
        abi: [],
      },
    },
  },
};

export const MonadTestnetName = 'Monad';

export const ZeroAddress = '0x0000000000000000000000000000000000000000';