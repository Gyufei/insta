import { TokenData } from '@/lib/data/tokens';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { formatBig } from '@/lib/utils/number';
import { BaseTokenCard } from './base-token-card';

export function MagmaMonTokenCard({ className }: { className?: string }) {
  const magmaToken = TokenData.find((token) => token.symbol === 'gMON') || TokenData[2];
  const { data: magmaBalance } = useMagmaBalance();
  const balance = formatBig(magmaBalance?.balance || '0');

  return (
    <BaseTokenCard
      name={magmaToken.name}
      symbol={magmaToken.symbol}
      iconUrl={magmaToken.iconUrl}
      balance={balance}
      className={className}
    />
  );
}