import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { UniswapCreateCoin } from './uniswap-create-coin';
import { UniswapPositionsSection } from './uniswap-position-section';

export const metadata: Metadata = {
  title: 'Uniswap',
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Uniswap" iconSrc="/icons/uniswap.svg">
      <UniswapCreateCoin />
      <UniswapPositionsSection />
    </CommonPageLayout>
  );
}
