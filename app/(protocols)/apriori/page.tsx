import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { TitleH2 } from '@/components/common/title-h2';

import { AprMonStake } from './apr-mon-stake';
import { AprioriStats } from './apriori-stats';

export const metadata: Metadata = {
  title: 'apriori | tadle',
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" src="/icons/apriori.svg">
      <div className="mt-4 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-0 2xl:px-12">
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
