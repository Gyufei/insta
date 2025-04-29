import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { FaucetContainer } from './faucet-container';

export const metadata: Metadata = {
  title: 'Faucet | tadle',
};

export default function Faucet() {
  return (
    <CommonPageLayout title="Faucet" src={null}>
      <FaucetContainer />
    </CommonPageLayout>
  );
}
