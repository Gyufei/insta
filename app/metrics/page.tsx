import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { MetricsContent } from './metrics-content';

export const metadata: Metadata = {
  title: 'Metrics',
  openGraph: {
    title: 'Metrics',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metrics',
    site: '@tadle_com',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Metrics" iconSrc={null}>
      <MetricsContent />
    </CommonPageLayout>
  );
}
