import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds Market - Trade',
  openGraph: {
    title: 'Odds Market - Trade',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Market - Trade',
    site: '@tadle_com',
  },
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
