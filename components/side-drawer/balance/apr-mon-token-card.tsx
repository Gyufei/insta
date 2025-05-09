import { APR_MONAD } from '@/config/tokens';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { formatBig } from '@/lib/utils/number';

import { BaseTokenCard } from './base-token-card';

export function AprMONTokenCard({ className }: { className?: string }) {
  const aprMonToken = APR_MONAD;
  const { data: aprioriBalance } = useAprioriBalance();
  const balance = formatBig(aprioriBalance?.balance || '0');

  return <BaseTokenCard token={aprMonToken} balance={balance} className={className} />;
}
