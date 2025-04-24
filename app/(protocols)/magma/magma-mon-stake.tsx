'use client';

import { TokenStakeCard } from '@/components/common/token-stake-card';

import { G_MONAD, TokenPriceMap } from '@/lib/data/tokens';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function MagmaMonStake() {
  const { setCurrentComponent } = useSideDrawerStore();

  const token = G_MONAD;
  const gMonPrice = TokenPriceMap[token?.symbol];
  const { data: magmaBalance, isLoading } = useMagmaBalance();
  const balance = magmaBalance?.balance || '0';

  function handleDeposit() {
    setCurrentComponent({ name: 'MagmaDeposit' });
  }

  function handleWithdraw() {
    setCurrentComponent({ name: 'MagmaWithdraw' });
  }

  return (
    <TokenStakeCard
      token={token}
      tokenPrice={gMonPrice}
      balance={balance}
      isLoading={isLoading}
      onDeposit={handleDeposit}
      onWithdraw={handleWithdraw}
    />
  );
}
