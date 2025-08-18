import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds Market - Watchlist',
  openGraph: {
    title: 'Odds Market - Watchlist',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Market - Watchlist',
    creator: '@tadle_com',
  },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
