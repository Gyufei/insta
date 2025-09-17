import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import Web3AppKitContextProvider from '@/components/context/appkit';
import BaseLayout from '@/components/layout/base-layout';

import { aeonik } from './font';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Tadle',
    default: 'Tadle',
  },
  description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
  metadataBase: new URL(MetaBaseHost),
  openGraph: {
    title: {
      template: '%s | Tadle',
      default: 'Tadle',
    },
    description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: `${MateImageBase}/favs/favicon-32x32.png` },
      {
        url: `${MateImageBase}/favs/favicon-16x16.png`,
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      { url: `${MateImageBase}/favs/apple-touch-icon.png` },
      {
        url: `${MateImageBase}/favs/apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: `${MateImageBase}/favs/apple-touch-icon-precomposed.png`,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Tadle',
      default: 'Tadle',
    },
    description: 'Tadle - The Parallel Sandbox opening a new dimension of accessing dApps.',
    site: '@tadle_com',
    images: [`https://cdn.tadle.com/images/thumbnail-1800_945.jpg`],
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
      <link rel="icon" href="https://cdn.tadle.com/icons/favicon-purple.ico" />
      <body className={`${aeonik.variable} antialiased`}>
        <Web3AppKitContextProvider cookies={cookies}>
          <BaseLayout>{children}</BaseLayout>
          <Toaster richColors />
        </Web3AppKitContextProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
