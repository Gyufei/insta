import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { UniswapCreateCoin } from './uniswap-create-coin';
import { UniswapPositionsSection } from './uniswap-position-section';

export const metadata: Metadata = {
  title: 'Uniswap',
  openGraph: {
    title: 'Uniswap',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniswap',
    creator: '@tadle_com',
  },
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Uniswap" iconSrc="/icons/uniswap.svg">
      <UniswapCreateCoin />
      <UniswapPositionsSection />
    </CommonPageLayout>
  );
}
