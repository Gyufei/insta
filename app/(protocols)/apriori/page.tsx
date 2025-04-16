import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AprMonStake } from './apr-mon-stake';
import { AprioriStats } from './apriori-stats';

export const metadata: Metadata = {
  title: 'apriori | tadle',
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" src="/icons/apriori.svg">
      <div className="mt-4 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-0 2xl:px-12">
        <h2 className="text-2xl font-semibold text-primary">Overview</h2>
      </div>
      <AprioriStats />
      <div className="mt-6 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-4 2xl:px-12">
        <h2 className="text-primary text-2xl font-semibold">Staking</h2>
      </div>
      <AprMonStake />
    </CommonPageLayout>
  );
}
