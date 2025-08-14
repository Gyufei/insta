import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenStation } from './token-station';

export const metadata: Metadata = {
  title: 'Token Station',
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Token Station" iconSrc={null}>
      <TokenStation />
    </CommonPageLayout>
  );
}
