import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia, mainnet, monadTestnet, sepolia } from '@reown/appkit/networks';
import { cookieStorage, createStorage, http } from 'wagmi';

// Get projectId from https://cloud.reown.com
export const projectId = 'a28b02bc896fe06c2d396657ac391d16';

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const wagmiNetworks = [monadTestnet, mainnet, sepolia, base, baseSepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  transports: {
    [monadTestnet.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
  networks: wagmiNetworks,
});

export const config = wagmiAdapter.wagmiConfig;
