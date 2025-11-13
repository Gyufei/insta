'use client';

import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { truncateIfExceeds } from '@/lib/utils/number';

interface PositionSummaryCardProps {
  market?: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
}

export function PositionSummaryCard({ market, user }: PositionSummaryCardProps) {
  if (!market) return null;

  const token0 = market.token0;
  const token1 = market.token1;
  const displaySymbol0 = token0?.symbol || token0?.name || '';
  const displaySymbol1 = token1?.symbol || token1?.name || '';

  // 按图片说明展示：存了多少/借了多少
  const suppliedToken0 = user?.token0?.user_asset_display_balance || '0';
  const borrowedToken0 = user?.token0?.user_debt_display_balance || '0';
  const suppliedToken1 = user?.token1?.user_asset_display_balance || '0';
  const borrowedToken1 = user?.token1?.user_debt_display_balance || '0';

  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
      <div className="text-sm font-medium text-[#131E40]">Position Summary</div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Collateral Value</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(suppliedToken0, 4)} {displaySymbol0}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Liquidation Point</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(borrowedToken0, 4)} {displaySymbol0}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Borrow Capacity</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(suppliedToken1, 4)} {displaySymbol1}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Available to Borrow</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(borrowedToken1, 4)} {displaySymbol1}
          </div>
        </div>
      </div>
    </div>
  );
}
