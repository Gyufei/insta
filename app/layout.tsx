import { Toaster } from 'sonner';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Web3AppKitContextProvider from '@/components/context/appkit';
import BaseLayout from '@/components/layout/base-layout';

import { isProduction } from '@/lib/data/api-path';

import { aeonik } from './font';
import './globals.css';

const ImageBase = isProduction ? 'https://v3.tadle.com/images' : 'https://sb.tadle.com/images';

export const metadata: Metadata = {
  title: {
    template: '%s | Tadle',
    default: 'Tadle',
  },
  description: 'Tadle - Ship the only Parallel Sandbox for accessing dApps on the globe.',
  metadataBase: new URL(`https://${process.env.VERCEL_DOMAIN}`),
  openGraph: {
    title: 'Tadle',
    description: 'Tadle - Ship the only Parallel Sandbox for accessing dApps on the globe.',
    url: `https://${process.env.VERCEL_DOMAIN}`,
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
    description: 'Tadle - Ship the only Parallel Sandbox for accessing dApps on the globe.',
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
