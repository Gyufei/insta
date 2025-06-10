import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { UniswapPositionsSection } from './uniswap-position-section';

export const metadata: Metadata = {
  title: 'Uniswap V3 | tadle',
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Uniswap" iconSrc="/icons/uniswap.svg">
      <UniswapPositionsSection />
    </CommonPageLayout>
  );
}
