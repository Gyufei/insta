'use client';

import { wagmiAdapter, projectId } from '../../config/wagmi-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { monadTestnet } from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

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
  networks: [monadTestnet],
  defaultNetwork: monadTestnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: false,
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
