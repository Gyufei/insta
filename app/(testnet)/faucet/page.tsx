import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { FaucetContainer } from './faucet-container';

export const metadata: Metadata = {
  title: 'Faucet',
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
