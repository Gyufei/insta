import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { UniswapCreateCoin } from './uniswap-create-coin';
import { UniswapPositionsSection } from './uniswap-position-section';

export const metadata: Metadata = {
  title: 'Uniswap',
  openGraph: {
    title: 'Uniswap',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/thumbnail-1800_945.jpg`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniswap',
    site: '@tadle_com',
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
