import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenStation } from './token-station';

export const metadata: Metadata = {
  title: 'Token Station',
  openGraph: {
    title: 'Token Station',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Token Station',
    creator: '@tadle_com',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Token Station" iconSrc={null}>
      <TokenStation />
    </CommonPageLayout>
  );
}
