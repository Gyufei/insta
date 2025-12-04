'use client';

import { divide, subtract, multiply } from 'safebase';
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
  // 移除未使用的 collateralToken 与 collateralSymbol，避免 ESLint 未使用变量报错

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

  // 最大抵押率 LTV_max = total_max_debt_in_usd / total_collateral_in_usd
  const maxCollateralRatio = totalCollateralUSDDec === '0' ? '0' : divide(totalMaxDebtUSDDec, totalCollateralUSDDec);
  // 使用资产口径计算清算点，替换原来的 shares 口径
  const userCollateralAssets = borrowTokenIndex === 0
    ? user?.token1?.user_asset_display_balance || '0'
    : user?.token0?.user_asset_display_balance || '0';
  const userDebtAmount = borrowedAmount; // 已按所选借款代币选择
  const isDebtPositive = Number(userDebtAmount) > 0;
  // 清算价格方向调整：先按你的逻辑计算“抵押币/每1个借款币” = (user_share_balance * LTV_max) / user_debt_balance，
  // 为保持当前展示单位（借款币/每1个抵押币），在展示前对上述结果取倒数。
  const denomForBorrowedPrice = multiply(userCollateralAssets, maxCollateralRatio);
  const isDenomPositive = Number(denomForBorrowedPrice) > 0;
  const collateralPerBorrowedRaw = isDebtPositive && isDenomPositive
    ? divide(denomForBorrowedPrice, userDebtAmount)
    : '0';
  const liquidationPriceBorrowedRaw = Number(collateralPerBorrowedRaw) > 0
    ? divide('1', collateralPerBorrowedRaw)
    : '0';
  const liquidationPriceBorrowed = String(liquidationPriceBorrowedRaw).startsWith('-') ? '0' : liquidationPriceBorrowedRaw;

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
            {truncateIfExceeds(String(liquidationPriceBorrowed), 4)} {displaySymbol}
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
