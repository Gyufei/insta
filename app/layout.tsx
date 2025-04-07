import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import BaseLayout from '@/components/layout/base-layout';
import Web3AppKitContextProvider from '@/components/context/appkit';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
      <body className={`${montserrat.variable} antialiased`}>
        <Web3AppKitContextProvider cookies={cookies}>
          <BaseLayout>{children}</BaseLayout>
          <Toaster richColors />
        </Web3AppKitContextProvider>
      </body>
    </html>
  );
}
