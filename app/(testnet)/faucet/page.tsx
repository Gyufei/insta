import { Metadata } from 'next';

import { TitleH2 } from '@/components/common/title-h2';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { FaucetContainer } from './faucet-container';

export const metadata: Metadata = {
  title: 'Faucet | tadle',
};

export default function Faucet() {
  return (
    <CommonPageLayout title="Faucet" src={null}>
      <div className="flex flex-col items-start px-4 2xl:px-12">
        <TitleH2>Faucet</TitleH2>
        <FaucetContainer />
      </div>
    </CommonPageLayout>
  );
}
