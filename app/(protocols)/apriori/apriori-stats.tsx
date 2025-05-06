'use client';

import { Percent } from 'lucide-react';

import { BetweenCard } from '@/components/common/between-card';
import { DescCard } from '@/components/common/desc-card';

import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useAprioriInfo } from '@/lib/data/use-apriori-info';
import { formatBig, formatNumber } from '@/lib/utils/number';

export function AprioriStats() {
  const { data: aprioriInfo, isLoading } = useAprioriInfo();
  const { data: aprioriBalance, isLoading: isLoadingBalance } = useAprioriBalance();

  const Stats = {
    apr: {
      label: 'Mon Savings Rate',
      value: '1 MON = 1 aprMON',
      icon: <Percent className="h-10 w-10" />,
    },
    tvl: {
      label: 'TVL',
      value: formatNumber(formatBig(aprioriInfo?.tvl || '0')),
      icon: '/icons/hero-cog-tvl.svg',
    },
    holders: {
      label: 'Holders',
      value: formatNumber(aprioriInfo?.stakers || '0'),
      icon: '/icons/hero-cog-holders.svg',
    },
    aprMon: {
      label: 'Your aprMON',
      value: formatNumber(formatBig(aprioriBalance?.balance || '0')),
      icon: '/icons/aprmon.svg',
    },
  };

  return (
    <>
      <BetweenCard>
        <DescCard
          title={Stats.apr.label}
          value={Stats.apr.value}
          icon={Stats.apr.icon}
          isLoading={isLoading}
        />
        <DescCard
          title={Stats.aprMon.label}
          value={Stats.aprMon.value}
          icon={Stats.aprMon.icon}
          isLoading={isLoadingBalance}
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
