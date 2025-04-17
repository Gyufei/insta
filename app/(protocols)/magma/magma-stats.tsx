'use client';

import { ShipWheel, SquareUserRound } from 'lucide-react';

import { BetweenCard } from '@/components/page-common/between-card';
import { DescCard } from '@/components/page-common/desc-card';

import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useMagmaInfo } from '@/lib/data/use-magma-info';
import { formatBig, formatNumber } from '@/lib/utils/number';

export function MagmaStats() {
  const { data: magmaInfo, isLoading } = useMagmaInfo();
  const { data: magmaBalance, isLoading: isBalanceLoading } = useMagmaBalance();

  const Stats = {
    balance: {
      label: 'Your gMON',
      value: formatNumber(formatBig(magmaBalance?.balance || '0')),
      icon: '/icons/gmon.svg',
    },
    transactionNum: {
      label: 'Transactions',
      value: formatNumber(magmaInfo?.transactionNum || '0'),
      icon: <ShipWheel className="h-12 w-12" />,
    },
    tvl: {
      label: 'TVL',
      value: formatNumber(formatBig(magmaInfo?.tvl || '0')),
      icon: '/icons/mon.svg',
    },
    holders: {
      label: 'Holders',
      value: formatNumber(magmaInfo?.holders || '0'),
      icon: <SquareUserRound className="h-12 w-12" />,
    },
  };

  return (
    <>
      <BetweenCard>
        <DescCard
          title={Stats.transactionNum.label}
          value={Stats.transactionNum.value}
          icon={Stats.transactionNum.icon}
          isLoading={isLoading}
        />
        <DescCard
          title={Stats.balance.label}
          value={Stats.balance.value}
          icon={Stats.balance.icon}
          isLoading={isBalanceLoading}
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
