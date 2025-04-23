import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { PositionsSection } from './position-list';

export const metadata: Metadata = {
  title: 'Uniswap V3 | tadle',
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Uniswap" src="/icons/uniswap.svg">
      <PositionsSection />
    </CommonPageLayout>
  );
}
