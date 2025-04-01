import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import BaseLayout from '@/components/layout/base-layout';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Aave v3 Lido | Instadapp',
  description: 'The Most Powerful DeFi Management Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
