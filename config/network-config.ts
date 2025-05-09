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
      ...monadTestnet.contracts
    },
  },
};

export const MONAD_TESTNET_NAME = 'Monad';

export const DEFAULT_NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const DEFAULT_TOKEN_DECIMALS = 18;
