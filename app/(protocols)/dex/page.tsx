import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { DexContent } from './dex-content';
import { PositionsSection } from './positions/position-section';

export const metadata: Metadata = {
  title: 'Dex',
  openGraph: {
    title: 'Dex',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dex',
    site: '@tadle_com',
  },
};

export default function DexPage() {
  return (
    <CommonPageLayout title="DEX" iconSrc={null} titleClassName="pb-5 md:pb-6">
      <DexContent />
      <PositionsSection />
    </CommonPageLayout>
  );
}
