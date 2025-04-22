import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

export const metadata: Metadata = {
  title: 'Uniswap V3 | tadle',
};

export default function UniswapPage() {
  return (
    <CommonPageLayout title="Uniswap" src="/icons/uniswap.svg">
      <div></div>
    </CommonPageLayout>
  );
}
