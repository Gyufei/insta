import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { LaunchTokenContent } from './launch-token-content';

export const metadata: Metadata = {
  title: 'Launch Token',
  openGraph: {
    title: 'Launch Token',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launch Token',
    site: '@tadle_com',
  },
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Launch Token" iconSrc={null} titleClassName="md:pb-6">
      <LaunchTokenContent />
    </CommonPageLayout>
  );
}
