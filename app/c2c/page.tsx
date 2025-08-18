import { MateImageBase, MetaBaseHost } from '@/config/env-url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'C2C',
  openGraph: {
    title: 'C2C',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'C2C',
    creator: '@tadle_com',
  },
};

export default function Odds() {
  redirect('/c2c/markets');
}
