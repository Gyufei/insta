import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AmbientPositionsSection } from './ambient-position-section';

export const metadata: Metadata = {
  title: 'Ambient',
  openGraph: {
    title: 'Ambient',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambient',
    site: '@tadle_com',
  },
};

export default function AmbientPage() {
  return (
    <CommonPageLayout title="Ambient" iconSrc="/icons/ambient.svg">
      <AmbientPositionsSection />
    </CommonPageLayout>
  );
}
