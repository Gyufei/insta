import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenStation } from './token-station';

export const metadata: Metadata = {
  title: 'Token Station',
  openGraph: {
    title: 'Token Station',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/social-card.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Station',
    site: '@tadle_com',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Token Station" iconSrc={null}>
      <TokenStation />
    </CommonPageLayout>
  );
}
