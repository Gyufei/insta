import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { BadgeContent } from './badge-content';

export const metadata: Metadata = {
  title: 'Badge Gallery',
  openGraph: {
    title: 'Badge Gallery',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badge Gallery',
    creator: '@tadle_com',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Badge Gallery" iconSrc={null}>
      <BadgeContent />
    </CommonPageLayout>
  );
}
