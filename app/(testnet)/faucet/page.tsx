import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { FaucetContainer } from './faucet-container';

export const metadata: Metadata = {
  title: 'Faucet',
  openGraph: {
    title: 'Faucet',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faucet',
    creator: '@tadle_com',
  },
};

export default function Faucet() {
  return (
    <CommonPageLayout title="Faucet" iconSrc={null}>
      <div className="flex w-full md:w-fit flex-col items-start px-4 2xl:px-12">
        <FaucetContainer />
      </div>
    </CommonPageLayout>
  );
}
