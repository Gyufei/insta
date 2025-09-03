import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds',
  openGraph: {
    title: 'Odds',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
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
  redirect('/odds/markets?chain=monad');
}
