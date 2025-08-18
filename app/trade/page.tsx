import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenContent } from './trade-content';

export const metadata: Metadata = {
  title: 'Trade',
  openGraph: {
    title: 'Trade',
  },
  twitter: {
    title: 'Trade',
  },
};

export default function TradePage() {
  return (
    <CommonPageLayout title="Trade" iconSrc={null}>
      <TokenContent />
    </CommonPageLayout>
  );
}
