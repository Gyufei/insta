'use client';

import { Percent } from 'lucide-react';
import { BetweenCard } from '@/components/page-common/between-card';
import { DescCard } from '@/components/page-common/desc-card';
import { formatBig, formatNumber } from '@/lib/utils/number';
import { useAprioriInfo } from '@/lib/data/use-apriori-info';
import { useMemo } from 'react';

export function AprioriStats() {
  const { data: aprioriInfo, isLoading } = useAprioriInfo();

  const tvl = useMemo(() => {
    if (!aprioriInfo || !aprioriInfo.tvl) return '0';

    const tvlValue = formatBig(aprioriInfo.tvl);
    return formatNumber(tvlValue);
  }, [aprioriInfo]);

  const Stats = {
    tvl: {
      label: 'aPriori TVL',
      value: tvl,
      icon: '/icons/hero-cog-tvl.svg',
    },
    holders: {
      label: 'Holders',
      value: aprioriInfo?.stakers?.toString() || '0',
      icon: '/icons/hero-cog-holders.svg',
    },
  };

  return (
    <>
      <BetweenCard>
        <DescCard
          title="Mon Savings Rate"
          value="1 MON = 1 aprMON"
          icon={<Percent className="h-12 w-12" />}
          isLoading={isLoading}
        />
        <DescCard
          title="Your aprMON worth"
          value="0.00"
          icon="/icons/aprmon.svg"
          isLoading={isLoading}
        />
      </BetweenCard>

      <BetweenCard>
        <DescCard
          title={Stats.tvl.label}
          value={Stats.tvl.value + ' MON'}
          icon={Stats.tvl.icon}
          isLoading={isLoading}
        />
        <DescCard
          title={Stats.holders.label}
          value={formatNumber(Stats.holders.value)}
          icon={Stats.holders.icon}
          isLoading={isLoading}
        />
      </BetweenCard>
    </>
  );
}
