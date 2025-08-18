import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds',
  openGraph: {
    title: 'Odds',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds',
    site: '@tadle_com',
  },
};

export default function Odds() {
  redirect('/odds/markets');
}
