import { MONAD } from '@/lib/data/tokens';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

import { BaseTokenCard } from './base-token-card';

interface TokenCardProps {
  className?: string;
}

export function BalanceTokenCard({ className }: TokenCardProps) {
  const monadToken = MONAD;
  const { balance } = useAccountBalance();

  return <BaseTokenCard token={monadToken} balance={balance} className={className} />;
}
