import { useMemo } from 'react';
import Image from 'next/image';

import { IToken } from '@/config/tokens';

import { TokenPairLogo } from '@/components/common/token-pair-logo';

import { PositionStatus } from '@/lib/data/use-uniswap-position';
import { cn } from '@/lib/utils';

const PositionStatusMap = {
  [PositionStatus.POSITION_STATUS_IN_RANGE]: 'In range',
  [PositionStatus.POSITION_STATUS_OUT_OF_RANGE]: 'Out of range',
  [PositionStatus.POSITION_STATUS_CLOSED]: 'Closed',
};

export function TokenPairAndStatus({
  token0,
  token1,
  status,
  _version,
  _fee,
  className,
}: {
  token0: IToken;
  token1: IToken;
  status: PositionStatus;
  _version: string;
  _fee: string;
  className?: string;
}) {
  const statusValue = useMemo(() => {
    return PositionStatusMap[status];
  }, [status]);

  return (
    <div className={cn('p-4 flex items-start gap-4 w-full md:w-auto', className)}>
      <TokenPairLogo token0={token0} token1={token1} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {token0.symbol} / {token1.symbol}
          </span>
          {/* <VersionAndFeeDisplay version={version} fee={fee} /> */}
        <div
          className={cn(
            'inline-flex items-center h-5 px-2 rounded-[4px]',
            statusValue === 'In range' && 'bg-green-100',
            statusValue === 'Out of range' && 'bg-red-100',
            statusValue === 'Closed' && 'bg-gray-100'
          )}
        >
          <span
            className={cn(
              'text-[12px] leading-4 font-medium',
              statusValue === 'In range' && 'text-green-700',
              statusValue === 'Out of range' && 'text-red-700',
              statusValue === 'Closed' && 'text-gray-700'
            )}
          >
            {statusValue}
          </span>
        </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 h-7 px-2 text-[#A5ADC6]">
            <Image src="/icons/uniswap.svg" alt="Uniswap" width={16} height={16} />
            <span className="text-sm">Uniswap</span>
          </div>
        </div>
      </div>
    </div>
  );
}
