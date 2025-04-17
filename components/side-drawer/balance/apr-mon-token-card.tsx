import { TokenData } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { formatBig } from '@/lib/utils/number';

import { BaseTokenCard } from './base-token-card';

export function AprMONTokenCard({ className }: { className?: string }) {
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const { data: aprioriBalance } = useAprioriBalance();
  const balance = formatBig(aprioriBalance?.balance || '0');

  return (
    <BaseTokenCard
      name={aprMonToken.name}
      symbol={aprMonToken.symbol}
      iconUrl={aprMonToken.iconUrl}
      balance={balance}
      className={className}
    />
  );
}
