import { G_MONAD } from '@/config/tokens';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { formatBig } from '@/lib/utils/number';

import { BaseTokenCard } from './base-token-card';

export function MagmaMonTokenCard({ className }: { className?: string }) {
  const magmaToken = G_MONAD;
  const { data: magmaBalance } = useMagmaBalance();
  const balance = formatBig(magmaBalance?.balance || '0');

  return <BaseTokenCard token={magmaToken} balance={balance} className={className} />;
}
