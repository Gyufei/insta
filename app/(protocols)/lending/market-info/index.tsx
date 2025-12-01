'use client';

import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

import { WithLoading } from '@/components/common/with-loading';
// 图标统一使用 markets 的 logoURI，不在本组件维护映射

import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { useAccountStore } from '@/lib/state/account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { truncateIfExceeds } from '@/lib/utils/number';

function formatPct(value?: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value || 0;
  if (!isFinite(num)) return '0%';
  return `${num.toFixed(2)}%`;
}

export function LendingMarketInfo() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as {
    market?: ICurvanceMarketInfo;
    user?: ICurvanceMarketUserItem;
    actionMode?: 'supply' | 'borrow';
    supplyTokenIndex?: 0 | 1;
  };
  const { handleBack: _handleBack } = useUrlPathDrawerChange('/lending');

  const market = props.market as ICurvanceMarketInfo | undefined;
  const user = props.user as ICurvanceMarketUserItem | undefined;
  const actionMode = props.actionMode || 'supply';
  const { currentAccountType } = useAccountStore();

  // Hooks must be called unconditionally
  const { data: accountInfo } = useSelectedAccount();
  const walletAddress = accountInfo?.sandbox_account || '';
  const token0 = market?.token0;
  const token1 = market?.token1;
  const isBorrow = actionMode === 'borrow';
  const supplyTokenIndex = props.supplyTokenIndex ?? 0;
  const supplyToken = supplyTokenIndex === 0 ? token0 : token1;
  const borrowToken = supplyTokenIndex === 0 ? token1 : token0;
  const baseToken = isBorrow ? borrowToken : supplyToken;
  const tokenAddress = baseToken?.address || '';
  const tokenDecimals = baseToken?.decimals ?? DEFAULT_TOKEN_DECIMALS;
  const { balance: walletBalanceRaw, isBalancePending: isWalletBalancePending } = useAddressBalance(
    walletAddress,
    tokenAddress,
    tokenDecimals,
    !!walletAddress && !!tokenAddress && currentAccountType === 'DSA'
  );

  if (!market) return null;
  // token references after null-check
  const t0 = market.token0;
  const t1 = market.token1;
  const walletBalanceDisplay = walletBalanceRaw || '0';
  const supplyRate = (supplyTokenIndex === 0 ? t0?.supply_rate : t1?.supply_rate) || '0';
  const borrowRate = (supplyTokenIndex === 0 ? t1?.borrow_rate : t0?.borrow_rate) || '0';
  const displaySymbol = baseToken?.symbol || baseToken?.name || '';
  const tokenLogo = baseToken?.logoURI || '/icons/token.svg';

  return (
    <div className="p-4 space-y-4">
      {/* Mobile back header */}
      <div className="md:hidden">
        <SideDrawerBackHeader title={`Wallet Balance`} onClick={_handleBack} />
      </div>
      {/* Wallet balance card - show token1 in borrow mode */}
      <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
        <div className="text-[16px] font-medium text-[#131E40]">{displaySymbol} Wallet Balance</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[32px] font-medium tracking-tight text-[#131E40]">
            <WithLoading
              isLoading={currentAccountType === 'DSA' && isWalletBalancePending}
              className="h-5 w-5"
            >
              {currentAccountType === 'DSA' ? truncateIfExceeds(walletBalanceDisplay || '0', 4) : 0}
            </WithLoading>
          </div>
          <img
            src={tokenLogo}
            alt={`${baseToken?.symbol || ''} logo`}
            className="h-8 w-8 rounded-full"
          />
        </div>
        <div className="mt-4 border-t border-[#EBEBEB]" />
        <div className="mt-4 flex justify-between gap-6">
          <div>
            <div className="text-sm text-[#A5ADC6]">Net Borrow APR</div>
            <div className="mt-1 text-sm font-medium text-[#131E40] underline">
              {formatPct(borrowRate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#A5ADC6]">Net Supply APR</div>
            <div className="mt-1 text-sm font-medium text-[#131E40] underline">
              {formatPct(supplyRate)}
            </div>
          </div>
        </div>
      </div>

      {/* Position summary card */}
      <PositionSummaryCard
        market={market}
        user={user}
        borrowTokenIndex={supplyTokenIndex === 0 ? 1 : 0}
      />
    </div>
  );
}
