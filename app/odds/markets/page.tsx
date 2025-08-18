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
    title: 'Odds Markets',
    creator: '@tadle_com',
  },
};

export default function MarketsPage() {
  return <MarketList />;
}
