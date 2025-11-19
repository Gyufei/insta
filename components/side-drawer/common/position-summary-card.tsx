'use client';

import { divide, subtract } from 'safebase';
import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { formatBig, truncateIfExceeds } from '@/lib/utils/number';

interface PositionSummaryCardProps {
  market?: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
}

export function PositionSummaryCard({ market, user }: PositionSummaryCardProps) {
  if (!market) return null;

  const token1 = market.token1;
  const displaySymbol1 = token1?.symbol || token1?.name || '';

  // 显示均以 token1 计价：Collateral/Capacity/Available/当前债务
  const borrowedToken1 = user?.token1?.user_debt_display_balance || '0';
  // 借款能力与可借额度：按 USD 18 位精度解码后再按 token1 价格换算
  const priceToken1Str = token1?.price || '0';
  const isPricePositive = Number(priceToken1Str) > 0;
  const totalMaxDebtUSDDec = formatBig(user?.total_max_debt_in_usd || '0', 18);
  const totalDebtUSDDec = formatBig(user?.total_debt_in_usd || '0', 18);
  const totalCollateralUSDDec = formatBig(user?.total_collateral_in_usd || '0', 18);
  const remainingUSDDecRaw = subtract(totalMaxDebtUSDDec, totalDebtUSDDec);
  const remainingUSDDec = String(remainingUSDDecRaw).startsWith('-') ? '0' : remainingUSDDecRaw;
  const collateralValueToken1 = isPricePositive ? divide(totalCollateralUSDDec, priceToken1Str) : '0';
  const borrowCapacityToken1 = isPricePositive ? divide(totalMaxDebtUSDDec, priceToken1Str) : '0';
  const availableToBorrowToken1 = isPricePositive ? divide(remainingUSDDec, priceToken1Str) : '0';

  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
      <div className="text-base font-medium text-[#131E40]">Position Summary</div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Collateral Value</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(collateralValueToken1), 4)} {displaySymbol1}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Liquidation Point</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(borrowedToken1, 4)} {displaySymbol1}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Borrow Capacity</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(borrowCapacityToken1), 4)} {displaySymbol1}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Available to Borrow</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(availableToBorrowToken1), 4)} {displaySymbol1}
          </div>
        </div>
      </div>
    </div>
  );
}
