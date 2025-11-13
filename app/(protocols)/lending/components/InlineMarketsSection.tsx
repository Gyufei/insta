'use client';

import Image from 'next/image';
// import Link from 'next/link';

import { TitleH2 } from '@/components/common/title-h2';
import { Skeleton } from '@/components/ui/skeleton';
import { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';

type InlineMarketsSectionProps = {
  isCurvanceSelected: boolean;
  marketsLoading: boolean;
  marketsError: boolean;
  sortedMarkets: ICurvanceMarketInfo[];
  byMarket: Record<string, ICurvanceMarketUserItem | undefined>;
  onDetails?: (marketAddress: string) => void;
};

function formatAbbr(v?: string) {
  const n = parseFloat(v || '0');
  if (!isFinite(n) || n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

function formatUSD(v?: string) {
  const n = parseFloat(v || '0');
  if (!isFinite(n) || n === 0) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPct(v?: string) {
  const n = parseFloat(v || '0');
  if (!isFinite(n)) return '0%';
  return `${n.toFixed(2)}%`;
}



export default function InlineMarketsSection({
  isCurvanceSelected,
  marketsLoading,
  marketsError,
  sortedMarkets,
  byMarket,
  onDetails,
}: InlineMarketsSectionProps) {
  return (
    <>
      <div className="mt-4 mb-6 flex w-full flex-shrink-0 justify-between px-4 2xl:px-12">
        <TitleH2>Markets</TitleH2>
      </div>
      <div className="px-4 2xl:px-12">
        {!isCurvanceSelected && (
          <div className="text-sm text-gray-600">Select a project to view markets.</div>
        )}
        {isCurvanceSelected && (
          <div>
            {marketsError && (
              <div className="text-sm text-red-600">Failed to load markets.</div>
            )}
            {!marketsLoading && !marketsError && sortedMarkets.length === 0 && (
              <div className="text-sm text-gray-600">No markets available.</div>
            )}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="grid grid-cols-[280px_1fr_1fr_1fr_140px] px-6 py-3 text-xs text-slate-500">
                <div>Asset</div>
                <div>Total Supplied</div>
                <div>Supply APY</div>
                <div>MY Supplies</div>
                <div className="text-right">&nbsp;</div>
              </div>
              <div className="divide-y divide-slate-200">
                {marketsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`skeleton-row-${i}`}
                        className="grid grid-cols-[280px_1fr_1fr_1fr_140px] items-center px-6 py-4"
                      >
                        <div className="flex items-center gap-3">
                          {/* Pair token icons skeleton */}
                          <div className="flex -space-x-2">
                            <Skeleton className="inline-block h-7 w-7 rounded-full" />
                            <Skeleton className="inline-block h-7 w-7 rounded-full" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-8 w-20 rounded-md inline-block" />
                        </div>
                      </div>
                    ))
                  : sortedMarkets.map((m) => {
                  const user = byMarket[m.market_address] as ICurvanceMarketUserItem | undefined;
                  const price0 = parseFloat(m.token0.price || '0');
                  const totalUSD = formatUSD(
                    m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                  );
                  // 优先使用 token0.total_supply；若缺失则用 USD/price 反推数量，保证 UI 有值
                  let totalTokensRaw = parseFloat(m.token0.total_supply || '0');
                  if (!isFinite(totalTokensRaw) || totalTokensRaw === 0) {
                    const totalUSDNum = parseFloat(
                      m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                    );
                    totalTokensRaw = price0 > 0 ? totalUSDNum / price0 : 0;
                  }
                  const totalTokens = formatAbbr(String(totalTokensRaw));
                  const apy = formatPct(m.token0.supply_rate || m.supply_rate || '0');
                  const myTokens = formatAbbr(user?.token0?.user_asset_display_balance || '0');
                  const myUSD = formatUSD(
                    String(price0 * parseFloat(user?.token0?.user_asset_display_balance || '0'))
                  );

                  return (
                    <div key={m.market_address} className="grid grid-cols-[280px_1fr_1fr_1fr_140px] items-center px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Pair token icons stacked */}
                        <div className="flex -space-x-2">
                          <Image
                            src={m.token0.logoURI}
                            alt={m.token0.symbol}
                            width={28}
                            height={28}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                          />
                          <Image
                            src={m.token1.logoURI}
                            alt={m.token1.symbol}
                            width={28}
                            height={28}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">{`${m.token0.symbol} & ${m.token1.symbol}`}</div>
                          <div className="text-xs text-slate-500 whitespace-nowrap">{m.chain_name || 'Monad Testnet'}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{totalTokens}</div>
                        <div className="text-xs text-slate-500">{totalUSD}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{apy}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{myTokens}</div>
                        <div className="text-xs text-slate-500">{myUSD}</div>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => onDetails?.(m.market_address)}
                          className="inline-flex items-center px-4 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm text-slate-700"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}