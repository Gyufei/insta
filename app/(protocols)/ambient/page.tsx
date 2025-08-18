import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AmbientPositionsSection } from './ambient-position-section';

export const metadata: Metadata = {
  title: 'Ambient',
  openGraph: {
    title: 'Ambient',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Ambient',
    creator: '@tadle_com',
  },
};

export default function AmbientPage() {
  return (
    <CommonPageLayout title="Ambient" iconSrc="/icons/ambient.svg">
      <AmbientPositionsSection />
    </CommonPageLayout>
  );
}
