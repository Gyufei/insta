import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import MarketList from './market-list';

export const metadata: Metadata = {
  title: 'Odds Markets',
  openGraph: {
    title: 'Odds Markets',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Markets',
    site: '@tadle_com',
  },
};

export default function MarketsPage() {
  return <MarketList />;
}
