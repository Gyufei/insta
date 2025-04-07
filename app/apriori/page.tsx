import { Percent } from 'lucide-react';
import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { OverviewTitle } from '@/components/page-common/overview-title';
import { BetweenCard } from '@/components/page-common/between-card';
import { DescCard } from '@/components/page-common/desc-card';
import { formatNumber } from '@/lib/utils/number';
import { TitleRow } from '@/components/page-common/title-row';
import { AprMonStake } from '@/app/apriori/apr-mon-stake';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'apriori | tadle',
};

const Stats = {
  tvl: {
    label: 'aPriori TVL',
    value: '1203495',
    icon: '/icons/hero-cog-tvl.svg',
  },
  holders: {
    label: 'Holders',
    value: '2130888',
    icon: '/icons/hero-cog-holders.svg',
  },
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" src="/icons/apriori.svg">
      <OverviewTitle title="Overview" />

      <BetweenCard>
        <DescCard
          title="Mon Savings Rate"
          value="1 MON = 1 aprMON"
          icon={<Percent className="h-12 w-12" />}
        />
        <DescCard title="Your aprMON worth" value="0.00" icon="/icons/aprmon.svg" />
      </BetweenCard>

      <BetweenCard>
        <DescCard
          title={Stats.tvl.label}
          value={formatNumber(Stats.tvl.value) + ' MON'}
          icon={Stats.tvl.icon}
        />
        <DescCard
          title={Stats.holders.label}
          value={formatNumber(Stats.holders.value)}
          icon={Stats.holders.icon}
        />
      </BetweenCard>

      <TitleRow title="Staking" />
      <AprMonStake />
    </CommonPageLayout>
  );
}
