import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import RanksMain from './ranks-main';

export const metadata: Metadata = {
  title: 'Odds Ranks',
  openGraph: {
    title: 'Odds Ranks',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Ranks',
    creator: '@tadle_com',
  },
};

export default function RanksPage() {
  return <RanksMain />;
}
