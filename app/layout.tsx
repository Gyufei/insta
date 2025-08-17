import { Toaster } from 'sonner';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Web3AppKitContextProvider from '@/components/context/appkit';
import BaseLayout from '@/components/layout/base-layout';

import { isProduction } from '@/lib/data/api-path';

import { aeonik } from './font';
import './globals.css';

const BaseHost = isProduction ? 'https://v3.tadle.com' : 'https://preview-v3.tadle.com';
const ImageBase = `${BaseHost}/images`;

export const metadata: Metadata = {
  title: {
    template: '%s | Tadle',
    default: 'Tadle',
  },
  description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
  metadataBase: new URL(BaseHost),
  openGraph: {
    title: 'Tadle',
    description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
    url: BaseHost,
    siteName: 'Tadle Market',
    images: `${ImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: `${ImageBase}/favs/favicon-32x32.png` },
      {
        url: `${ImageBase}/favs/favicon-16x16.png`,
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      { url: `${ImageBase}/favs/apple-touch-icon.png` },
      {
        url: `${ImageBase}/favs/apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: `${ImageBase}/favs/apple-touch-icon-precomposed.png`,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tadle',
    description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
    creator: '@tadle_com',
    images: [`${ImageBase}/UjXLk9pSW552Wq3jVMIQU.png`],
  },
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
