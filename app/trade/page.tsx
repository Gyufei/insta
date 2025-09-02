import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenContent } from './trade-content';

export const metadata: Metadata = {
  title: 'Trade',
  openGraph: {
    title: 'Trade',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade',
    site: '@tadle_com',
  },
};

export default function TradePage() {
  return (
    <CommonPageLayout title="Trade" iconSrc={null}>
      <TokenContent />
    </CommonPageLayout>
  );
}
