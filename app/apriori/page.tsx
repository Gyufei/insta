import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { OverviewTitle } from '@/components/page-common/overview-title';
import { TitleRow } from '@/components/page-common/title-row';
import { AprMonStake } from '@/app/apriori/apr-mon-stake';
import { Metadata } from 'next';
import { AprioriStats } from '@/app/apriori/apriori-stats';

export const metadata: Metadata = {
  title: 'apriori | tadle',
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" src="/icons/apriori.svg">
      <OverviewTitle title="Overview" />
      <AprioriStats />
      <TitleRow title="Staking" />
      <AprMonStake />
    </CommonPageLayout>
  );
}
