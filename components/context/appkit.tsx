'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Config, WagmiProvider, cookieToInitialState } from 'wagmi';

import React, { type ReactNode } from 'react';

import { projectId, wagmiAdapter } from '../../config/wagmi-config';
import { NetworkConfigs } from '@/config/network-config';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'sandbox',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  // 统一使用我们自定义的网络配置，生产环境下 Monad 使用主网（id: 143）
  networks: [NetworkConfigs.monadTestnet, NetworkConfigs.base, NetworkConfigs.eth],
  defaultNetwork: NetworkConfigs.monadTestnet,
  metadata: metadata,
  features: {
    analytics: true,
    socials: ['x', 'google'],
    swaps: false,
    onramp: false,
    email: false,
  },
});

function Web3AppKitContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3AppKitContextProvider;
