import { useMemo } from 'react';

import { IToken } from '@/lib/data/tokens';
import { cn } from '@/lib/utils';

import { TokenPairLogo } from '../../../../components/common/token-pair-logo';

export function TokenPairAndStatus({
  token0,
  token1,
  className,
}: {
  token0: IToken;
  token1: IToken;
  className?: string;
}) {
  const statusValue = useMemo(() => {
    return 'In range';
  }, []);

  return (
    <div className={cn('p-4 flex items-start gap-4 w-full md:w-auto', className)}>
      <TokenPairLogo token0={token0} token1={token1} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {token0?.symbol} / {token1?.symbol}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                'w-2 h-2 rounded-full opacity-60',
                statusValue === 'In range' && 'bg-green-600',
                statusValue === 'Out of range' && 'bg-red-600',
                statusValue === 'Closed' && 'bg-gray-600'
              )}
            ></div>
            <span
              className={cn(
                'text-xs',
                statusValue === 'In range' && 'text-green-600',
                statusValue === 'Out of range' && 'text-red-600',
                statusValue === 'Closed' && 'text-gray-600'
              )}
            >
              {statusValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
