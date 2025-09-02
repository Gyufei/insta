import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { BadgeContent } from './badge-content';

export const metadata: Metadata = {
  title: 'Badge Gallery',
  openGraph: {
    title: 'Badge Gallery',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badge Gallery',
    site: '@tadle_com',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Badge Gallery" iconSrc={null}>
      <BadgeContent />
    </CommonPageLayout>
  );
}
