import { monadTestnet } from '@reown/appkit/networks';
import { Chain } from '@reown/appkit/networks';

export interface INetworkConfig extends Chain {
  icon: string;
}

export const NetworkConfigs = {
  monadTestnet: {
    ...monadTestnet,
    icon: '/icons/monad.svg',
  },
};
