import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import FullAccountDisplay from './full-account-display';

export const metadata: Metadata = {
  title: 'Authority',
  openGraph: {
    title: 'Authority',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authority',
    site: '@tadle_com',
  },
};

export default function Authority() {
  return (
    <CommonPageLayout title="Account Setting" iconSrc={null}>
      <FullAccountDisplay />
    </CommonPageLayout>
  );
}
