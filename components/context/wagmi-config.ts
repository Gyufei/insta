import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = "a28b02bc896fe06c2d396657ac391d16"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [monadTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig