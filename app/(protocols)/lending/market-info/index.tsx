"use client";

import type { ICurvanceMarketInfo } from "@/lib/data/use-curvance-markets";
import type { ICurvanceMarketUserItem } from "@/lib/data/use-curvance-market-user-info";
import { PositionSummaryCard } from "@/components/side-drawer/common/position-summary-card";
import { useSideDrawerStore } from "@/lib/state/side-drawer";
import { MONAD, APR_MONAD, G_MONAD, MonUSD } from "@/config/tokens";

function formatPct(value?: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value || 0;
  if (!isFinite(num)) return "0%";
  return `${num.toFixed(2)}%`;
}

export function LendingMarketInfo() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as {
    market?: ICurvanceMarketInfo;
    user?: ICurvanceMarketUserItem;
  };

  const market = props.market as ICurvanceMarketInfo | undefined;
  const user = props.user as ICurvanceMarketUserItem | undefined;
  if (!market) return null;

  const token0 = market.token0;
  const token1 = market.token1;
  const walletBalanceDisplay = user?.token0?.user_asset_display_balance || "0";
  const supplyRate = token0?.supply_rate || "0";
  const borrowRate = token1?.borrow_rate || "0";
  const displaySymbol0 = token0?.wrapper_symbol || token0?.symbol || token0?.name || "";

  const tokenIcons: Record<string, string> = {
    [MONAD.symbol]: MONAD.logo,
    [APR_MONAD.symbol]: APR_MONAD.logo,
    [G_MONAD.symbol]: G_MONAD.logo,
    [MonUSD.symbol]: MonUSD.logo,
  };
  const token0Logo = tokenIcons[token0?.symbol || ""] || "/icons/unsupport.svg";

  return (
    <div className="p-4 space-y-4">
      {/* Wallet balance card */}
      <div className="rounded-lg border border-[#EBEBEB] bg-white dark:bg-secondary p-5 shadow-sm">
        <div className="text-xs text-black">{displaySymbol0} Wallet Balance</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight text-[#131E40]">
            {walletBalanceDisplay || "0.0000"}
          </div>
          <img src={token0Logo} alt={`${token0.symbol} logo`} className="h-6 w-6" />
        </div>
        <div className="mt-4 border-t border-[#EBEBEB]" />
        <div className="mt-4 flex justify-between gap-6">
          <div>
            <div className="text-xs text-[#A5ADC6]">Net Borrow APR</div>
            <div className="mt-1 text-sm font-semibold text-[#131E40] underline">{formatPct(borrowRate)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#A5ADC6]">Net Supply APR</div>
            <div className="mt-1 text-sm font-semibold text-[#131E40] underline">{formatPct(supplyRate)}</div>
          </div>
        </div>
      </div>

      {/* Position summary card */}
      <PositionSummaryCard market={market} user={user} />
    </div>
  );
}