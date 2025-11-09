"use client";

import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';

interface PositionSummaryCardProps {
  market?: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
}

export function PositionSummaryCard({ market, user }: PositionSummaryCardProps) {
  if (!market) return null;

  const token0 = market.token0;
  const token1 = market.token1;
  const displaySymbol0 = token0?.wrapper_symbol || token0?.symbol || token0?.name || '';
  const displaySymbol1 = token1?.wrapper_symbol || token1?.symbol || token1?.name || '';

  const collateralValueTokens = (() => {
    const usd = parseFloat(user?.total_collateral_in_usd || '0');
    const price0 = parseFloat(token0?.price || '0');
    return price0 > 0 ? usd / price0 : 0;
  })();

  const borrowCapacityTokens = (() => {
    const usd = parseFloat(user?.total_max_debt_in_usd || '0');
    const price1 = parseFloat(token1?.price || '0');
    return price1 > 0 ? usd / price1 : 0;
  })();

  const availableToBorrowTokens = (() => {
    const maxDebtUSD = parseFloat(user?.total_max_debt_in_usd || '0');
    const totalDebtUSD = parseFloat(user?.total_debt_in_usd || '0');
    const price1 = parseFloat(token1?.price || '0');
    const availableUSD = Math.max((maxDebtUSD || 0) - (totalDebtUSD || 0), 0);
    return price1 > 0 ? availableUSD / price1 : 0;
  })();

  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
      <div className="text-sm font-medium text-[#131E40]">Position Summary</div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Collateral Value</div>
          <div className="text-sm font-medium text-[#131E40]">{collateralValueTokens.toFixed(3)} {displaySymbol0}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Liquidation Point</div>
          <div className="text-sm font-medium text-[#131E40]">0.000 {displaySymbol0}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Borrow Capacity</div>
          <div className="text-sm font-medium text-[#131E40]">{borrowCapacityTokens.toFixed(3)} {displaySymbol1}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Available to Borrow</div>
          <div className="text-sm font-medium text-[#131E40]">{availableToBorrowTokens.toFixed(3)} {displaySymbol1}</div>
        </div>
      </div>
    </div>
  );
}