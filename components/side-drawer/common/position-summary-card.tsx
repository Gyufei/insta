'use client';

import { divide, subtract } from 'safebase';
import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { formatBig, truncateIfExceeds } from '@/lib/utils/number';

interface PositionSummaryCardProps {
  market?: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
  borrowTokenIndex?: 0 | 1; // which token to denominate in
}

export function PositionSummaryCard({ market, user, borrowTokenIndex = 1 }: PositionSummaryCardProps) {
  if (!market) return null;

  const borrowedToken = borrowTokenIndex === 0 ? market.token0 : market.token1;
  const displaySymbol = borrowedToken?.symbol || borrowedToken?.name || '';

  // 显示均以所选借款代币计价：Collateral/Capacity/Available/当前债务
  const borrowedAmount = borrowTokenIndex === 0
    ? user?.token0?.user_debt_display_balance || '0'
    : user?.token1?.user_debt_display_balance || '0';
  // 借款能力与可借额度：按 USD 18 位精度解码后再按所选借款代币价格换算
  const priceStr = borrowedToken?.price || '0';
  const isPricePositive = Number(priceStr) > 0;
  const totalMaxDebtUSDDec = formatBig(user?.total_max_debt_in_usd || '0', 18);
  const totalDebtUSDDec = formatBig(user?.total_debt_in_usd || '0', 18);
  const totalCollateralUSDDec = formatBig(user?.total_collateral_in_usd || '0', 18);
  const remainingUSDDecRaw = subtract(totalMaxDebtUSDDec, totalDebtUSDDec);
  const remainingUSDDec = String(remainingUSDDecRaw).startsWith('-') ? '0' : remainingUSDDecRaw;
  const collateralValueInToken = isPricePositive ? divide(totalCollateralUSDDec, priceStr) : '0';
  const borrowCapacityInToken = isPricePositive ? divide(totalMaxDebtUSDDec, priceStr) : '0';
  const availableToBorrowInToken = isPricePositive ? divide(remainingUSDDec, priceStr) : '0';

  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
      <div className="text-base font-medium text-[#131E40]">Position Summary</div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Collateral Value</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(collateralValueInToken), 4)} {displaySymbol}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Liquidation Point</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(borrowedAmount, 4)} {displaySymbol}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Borrow Capacity</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(borrowCapacityInToken), 4)} {displaySymbol}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A5ADC6]">Available to Borrow</div>
          <div className="text-sm font-medium text-[#131E40]">
            {truncateIfExceeds(String(availableToBorrowInToken), 4)} {displaySymbol}
          </div>
        </div>
      </div>
    </div>
  );
}
