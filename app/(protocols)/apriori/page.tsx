import { Metadata } from 'next';

import { TitleH2 } from '@/components/common/title-h2';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AprMonStake } from './apr-mon-stake';
import { AprioriStats } from './apriori-stats';

export const metadata: Metadata = {
  title: 'apriori | tadle',
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" iconSrc="/icons/apriori.svg">
      <div className="mb-6 flex w-full flex-shrink-0 justify-between px-4 mt-0 2xl:px-12">
        <TitleH2>Overview</TitleH2>
      </div>
      <AprioriStats />
      <div className="mt-6 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-4 2xl:px-12">
        <TitleH2>Staking</TitleH2>
      </div>
      <AprMonStake />
    </CommonPageLayout>
  );
}
