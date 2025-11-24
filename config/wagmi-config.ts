import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia, mainnet, sepolia } from '@reown/appkit/networks';
import { cookieStorage, createStorage, http } from 'wagmi';
import { NetworkConfigs } from '@/config/network-config';

// Get projectId from https://cloud.reown.com
export const projectId = 'a28b02bc896fe06c2d396657ac391d16';

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// 保留原有网络，并加入我们的 Monad 主网（生产环境下 NetworkConfigs.monadTestnet.id=143）
export const wagmiNetworks = [
  NetworkConfigs.monadTestnet,
  mainnet,
  sepolia,
  base,
  baseSepolia,
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  transports: {
    [NetworkConfigs.monadTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  networks: wagmiNetworks,
});

export const config = wagmiAdapter.wagmiConfig;
