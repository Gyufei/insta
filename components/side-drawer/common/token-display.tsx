import { IToken } from '@/lib/data/tokens';
import { formatNumber } from '@/lib/utils/number';
import { WithLoading } from '@/components/with-loading';
import { TokenDisplayCard } from '@/components/token-display-card';

interface TokenDisplayProps {
  token: IToken | undefined;
  balance: string;
  balanceLabel: string;
  isPending?: boolean;
}

export function TokenDisplay({ token, balance, balanceLabel, isPending }: TokenDisplayProps) {
  return (
    <TokenDisplayCard
      logo={token?.iconUrl || ''}
      symbol={token?.symbol}
      title={balanceLabel}
      content={
        <WithLoading isLoading={!!isPending}>
          {formatNumber(balance)}
        </WithLoading>
      }
    />
  );
}
