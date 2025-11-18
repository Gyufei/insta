import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { StakingContent } from './staking-content';

export const metadata: Metadata = {
  title: 'Staking',
  openGraph: {
    title: 'Staking',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staking',
    site: '@tadle_com',
  },
};

export default function StakingPage() {
  return (
    <CommonPageLayout title="Staking" iconSrc={null} titleClassName="pb-5 md:pb-6">
      <StakingContent />
    </CommonPageLayout>
  );
}
