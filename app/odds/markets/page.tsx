import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import MarketList from './market-list';

export const metadata: Metadata = {
  title: 'Odds Markets',
  openGraph: {
    title: 'Odds Markets',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
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
