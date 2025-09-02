import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import RanksMain from './ranks-main';

export const metadata: Metadata = {
  title: 'Odds Ranks',
  openGraph: {
    title: 'Odds Ranks',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Ranks',
    site: '@tadle_com',
  },
};

export default function RanksPage() {
  return <RanksMain />;
}
