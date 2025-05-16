import { Toaster } from 'sonner';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Web3AppKitContextProvider from '@/components/context/appkit';
import BaseLayout from '@/components/layout/base-layout';

import { aeonik } from './font';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tadle',
  description: 'The Most Powerful DeFi Management Platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <html lang="en">
      <body className={`${aeonik.variable} antialiased`}>
        <Web3AppKitContextProvider cookies={cookies}>
          <BaseLayout>{children}</BaseLayout>
          <Toaster richColors />
        </Web3AppKitContextProvider>
      </body>
    </html>
  );
}
