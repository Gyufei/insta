'use client';

import { TokenData, TokenPriceMap } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenStakeCard } from '@/components/page-common/token-stake-card';

export function AprMonStake() {
  const { setCurrentComponent } = useSideDrawerStore();

  const token = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const aprPrice = TokenPriceMap[token?.symbol];
  const { data: aprioriBalance, isLoading } = useAprioriBalance();
  const balance = aprioriBalance?.balance || '0';

  function handleDeposit() {
    setCurrentComponent({ name: 'AprioriDeposit' });
  }

  function handleWithdraw() {
    setCurrentComponent({ name: 'AprioriWithdraw' });
  }

  return (
    <TokenStakeCard
      token={token}
      tokenPrice={aprPrice}
      balance={balance}
      isLoading={isLoading}
      onDeposit={handleDeposit}
      onWithdraw={handleWithdraw}
    />
  );
}