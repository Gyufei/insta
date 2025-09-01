import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds Market - Watchlist',
  openGraph: {
    title: 'Odds Market - Watchlist',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/social-card.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Market - Watchlist',
    site: '@tadle_com',
  },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
