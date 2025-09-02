import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'C2C',
  openGraph: {
    title: 'C2C',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C2C',
    site: '@tadle_com',
  },
};

export default function Odds() {
  redirect('/c2c/markets');
}
