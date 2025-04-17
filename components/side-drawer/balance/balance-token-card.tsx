import { useAccountBalance } from '@/lib/web3/use-account-balance';

import { BaseTokenCard } from './base-token-card';

interface TokenCardProps {
  name: string;
  symbol: string;
  iconUrl: string;
  className?: string;
}

export default function BalanceTokenCard({ name, symbol, iconUrl, className }: TokenCardProps) {
  const { balance } = useAccountBalance();

  return (
    <BaseTokenCard
      name={name}
      symbol={symbol}
      iconUrl={iconUrl}
      balance={balance}
      className={className}
    />
  );
}
