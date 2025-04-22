import { IToken } from '@/lib/data/tokens';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

import { BaseTokenCard } from './base-token-card';

interface TokenCardProps {
  token: IToken;
  className?: string;
}

export default function BalanceTokenCard({ token, className }: TokenCardProps) {
  const { balance } = useAccountBalance();

  return <BaseTokenCard token={token} balance={balance} className={className} />;
}
