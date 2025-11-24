'use client';

import Image from 'next/image';



// import Link from 'next/link';

import { TitleH2 } from '@/components/common/title-h2';
import { Skeleton } from '@/components/ui/skeleton';



import { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { formatBig } from '@/lib/utils/number';





type InlineMarketsSectionProps = {
  isCurvanceSelected: boolean;
  marketsLoading: boolean;
  marketsError: boolean;
  sortedMarkets: ICurvanceMarketInfo[];
  byMarket: Record<string, ICurvanceMarketUserItem | undefined>;
  onDetails?: (marketAddress: string) => void;
  actionMode?: 'supply' | 'borrow';
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
  actionMode = 'supply',
}: InlineMarketsSectionProps) {
  return (
    <>
      <div className="mt-4 md:mt-0 mb-6 flex w-full flex-shrink-0 justify-between px-4 md:px-12">
        <TitleH2>Markets</TitleH2>
      </div>
      <div className="px-4 md:px-12">
        {!isCurvanceSelected && (
          <div className="text-sm text-gray-600">Select a project to view markets.</div>
        )}
        {isCurvanceSelected && (
          <div>
            {marketsError && (
              <div className="my-10 flex w-full items-center justify-center">
                <div className="text-center text-sm text-red-600">Failed to load markets.</div>
              </div>
            )}
            {marketsLoading && !marketsError && (
              <>
                {/* Desktop skeleton: table-like */}
                <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="grid grid-cols-[280px_1fr_1fr_1fr_140px] px-6 py-3 text-xs text-slate-500">
                    <div>Asset</div>
                    {actionMode === 'borrow' ? (
                      <>
                        <div>Total Borrowed</div>
                        <div>Borrow APY</div>
                        <div>MY Debt</div>
                      </>
                    ) : (
                      <>
                        <div>Total Supplied</div>
                        <div>Supply APY</div>
                        <div>MY Supplies</div>
                      </>
                    )}
                    <div className="text-right">&nbsp;</div>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-[280px_1fr_1fr_1fr_140px] items-center px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <Skeleton className="inline-block h-7 w-7 rounded-full" />
                            <Skeleton className="inline-block h-7 w-7 rounded-full" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-7 w-20 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile skeleton: card-like */}
                <div className="md:hidden space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <Skeleton className="inline-block h-7 w-7 rounded-full" />
                          <Skeleton className="inline-block h-7 w-7 rounded-full" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="border-t border-slate-200 mt-3 pt-3" />
                      <div className="grid grid-cols-3 divide-x divide-slate-200 w-full mt-1">
                        <div className="px-4">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                        <div className="px-4">
                          <Skeleton className="h-4 w-12 mb-1" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                        <div className="px-4">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </div>
                      <div className="mt-4 w-full">
                        <Skeleton className="h-9 w-full rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!marketsLoading && !marketsError && sortedMarkets.length === 0 && (
              <div className="my-10 flex w-full items-center justify-center">
                <div className="text-center text-sm text-gray-600">No markets available.</div>
              </div>
            )}
            {!marketsLoading && !marketsError && sortedMarkets.length > 0 && (
              <>
                {/* Desktop: table style container */}
                <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden px-[20px]">
                  <div className="grid grid-cols-[220px_1fr_1fr_1fr_80px] pt-[16px] pb-[12px] text-xs font-medium text-[#A5ADC6] border-b border-slate-200">
                    <div>Asset</div>
                    {actionMode === 'borrow' ? (
                      <>
                        <div>Total Borrowed</div>
                        <div>Borrow APY</div>
                        <div>MY Debt</div>
                      </>
                    ) : (
                      <>
                        <div>Total Supplied</div>
                        <div>Supply APY</div>
                        <div>MY Supplies</div>
                      </>
                    )}
                    <div className="text-right">&nbsp;</div>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {sortedMarkets.map((m) => {
                      const user = byMarket[m.market_address] as
                        | ICurvanceMarketUserItem
                        | undefined;
                      const price0 = parseFloat(m.token0.price || '0');
                      const price1 = parseFloat(m.token1.price || '0');
                      const supplyUSD = formatUSD(
                        m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                      );
                      let supplyTokensRaw = parseFloat(m.token0.total_supply || '0');
                      if (!isFinite(supplyTokensRaw) || supplyTokensRaw === 0) {
                        const supplyUSDNum = parseFloat(
                          m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                        );
                        supplyTokensRaw = price0 > 0 ? supplyUSDNum / price0 : 0;
                      }
                      const supplyTokens = formatAbbr(String(supplyTokensRaw));

                      const borrowUSDNum = parseFloat(m.token1.total_debt_in_usd || '0');
                      const borrowUSD = formatUSD(String(borrowUSDNum));
                      let borrowTokensRaw = parseFloat(m.token1.total_debt || '0');
                      if (!isFinite(borrowTokensRaw) || borrowTokensRaw === 0) {
                        borrowTokensRaw = price1 > 0 ? borrowUSDNum / price1 : 0;
                      }
                      const borrowTokens = formatAbbr(String(borrowTokensRaw));
                      // 根据用户持有份额选择供给侧 token 的 APY（默认 token0）
                      const userShare0 = parseFloat(user?.token0?.user_share_display_balance || '0');
                      const userShare1 = parseFloat(user?.token1?.user_share_display_balance || '0');
                      const supplyIndex = Number.isFinite(userShare1) && userShare1 > 0 && (!Number.isFinite(userShare0) || userShare0 <= 0) ? 1 : 0;
                      const supplyApy = formatPct(
                        supplyIndex === 0
                          ? m.token0.supply_rate || m.supply_rate || '0'
                          : m.token1.supply_rate || m.supply_rate || '0'
                      );
                      // Borrow APY 也随当前供给侧对应的借款代币联动（供给0 -> 借1；供给1 -> 借0）
                      const borrowApy = formatPct(
                        supplyIndex === 0
                          ? m.token1.borrow_rate || m.borrow_rate || '0'
                          : m.token0.borrow_rate || m.borrow_rate || '0'
                      );
                      const maxDebtUSDNum = parseFloat(
                        formatBig(String(user?.total_debt_in_usd || '0'), 18)
                      );
                      const remainingUSD = formatUSD(String(maxDebtUSDNum));
                      const remainingTokens = formatAbbr(
                        String(price1 > 0 ? maxDebtUSDNum / price1 : 0)
                      );
                      const myTokens = formatAbbr(
                        supplyIndex === 0
                          ? user?.token0?.user_asset_display_balance || '0'
                          : user?.token1?.user_asset_display_balance || '0'
                      );
                      const myUSD = formatUSD(
                        String(
                          (supplyIndex === 0 ? price0 : price1) *
                            parseFloat(
                              supplyIndex === 0
                                ? user?.token0?.user_asset_display_balance || '0'
                                : user?.token1?.user_asset_display_balance || '0'
                            )
                        )
                      );

                      return (
                        <div
                          key={m.market_address}
                          className="grid grid-cols-[220px_1fr_1fr_1fr_80px] items-center py-4 hover:bg-slate-50 cursor-pointer dark:hover:bg-secondary/80"
                          role="button"
                          tabIndex={0}
                          onClick={() => onDetails?.(m.market_address)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onDetails?.(m.market_address);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <Image
                                src={m.token0.logoURI || '/icons/token.svg'}
                                alt={m.token0.symbol}
                                width={28}
                                height={28}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                              />
                              <Image
                                src={m.token1.logoURI || '/icons/token.svg'}
                                alt={m.token1.symbol}
                                width={28}
                                height={28}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 whitespace-nowrap">{`${m.token0.symbol} & ${m.token1.symbol}`}</div>
                              <div className="text-xs text-[#A5ADC6] whitespace-nowrap">
                                {m.chain_name || 'Monad Testnet'}
                              </div>
                            </div>
                          </div>
                          {/* Desktop metrics columns */}
                          <div>
                            {actionMode === 'borrow' ? (
                              <>
                                <div className="text-sm font-medium text-slate-900">
                                  {borrowTokens}
                                </div>
                                <div className="text-xs text-slate-500">{borrowUSD}</div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-slate-900">
                                  {supplyTokens}
                                </div>
                                <div className="text-xs text-slate-500">{supplyUSD}</div>
                              </>
                            )}
                          </div>
                          <div className="text-sm font-medium text-slate-900">
                            {actionMode === 'borrow' ? borrowApy : supplyApy}
                          </div>
                          {actionMode === 'borrow' ? (
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {remainingTokens}
                              </div>
                              <div className="text-xs text-slate-500">{remainingUSD}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm font-medium text-slate-900">{myTokens}</div>
                              <div className="text-xs text-slate-500">{myUSD}</div>
                            </div>
                          )}
                          {/* Desktop button */}
                          <div className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDetails?.(m.market_address);
                              }}
                              className="inline-flex items-center px-4 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs text-[#131E40]"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {
                  /* Mobile: separate card list */
                }
                <div className="md:hidden space-y-3">
                  {sortedMarkets.map((m) => {
                    const user = byMarket[m.market_address] as ICurvanceMarketUserItem | undefined;
                    const price0 = parseFloat(m.token0.price || '0');
                    const price1 = parseFloat(m.token1.price || '0');
                    const supplyUSD = formatUSD(
                      m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                    );
                    let supplyTokensRaw = parseFloat(m.token0.total_supply || '0');
                    if (!isFinite(supplyTokensRaw) || supplyTokensRaw === 0) {
                      const supplyUSDNum = parseFloat(
                        m.token0.total_supply_in_usd || m.total_supply_in_usd || '0'
                      );
                      supplyTokensRaw = price0 > 0 ? supplyUSDNum / price0 : 0;
                    }
                    const supplyTokens = formatAbbr(String(supplyTokensRaw));
                    const borrowUSDNum = parseFloat(m.token1.total_debt_in_usd || '0');
                    const borrowUSD = formatUSD(String(borrowUSDNum));
                    let borrowTokensRaw = parseFloat(m.token1.total_debt || '0');
                    if (!isFinite(borrowTokensRaw) || borrowTokensRaw === 0) {
                      borrowTokensRaw = price1 > 0 ? borrowUSDNum / price1 : 0;
                    }
                    const borrowTokens = formatAbbr(String(borrowTokensRaw));
                    // 根据用户持有份额选择供给侧 token 的 APY（默认 token0）
                    const userShare0 = parseFloat(user?.token0?.user_share_display_balance || '0');
                    const userShare1 = parseFloat(user?.token1?.user_share_display_balance || '0');
                    const supplyIndex = Number.isFinite(userShare1) && userShare1 > 0 && (!Number.isFinite(userShare0) || userShare0 <= 0) ? 1 : 0;
                    const supplyApy = formatPct(
                      supplyIndex === 0
                        ? m.token0.supply_rate || m.supply_rate || '0'
                        : m.token1.supply_rate || m.supply_rate || '0'
                    );
                    // Borrow APY 也随当前供给侧对应的借款代币联动（供给0 -> 借1；供给1 -> 借0）
                    const borrowApy = formatPct(
                      supplyIndex === 0
                        ? m.token1.borrow_rate || m.borrow_rate || '0'
                        : m.token0.borrow_rate || m.borrow_rate || '0'
                    );
                    const maxDebtUSDNum = parseFloat(
                      formatBig(String(user?.total_debt_in_usd || '0'), 18)
                    );
                    const remainingUSD = formatUSD(String(maxDebtUSDNum));
                    const remainingTokens = formatAbbr(
                      String(price1 > 0 ? maxDebtUSDNum / price1 : 0)
                    );
                    const myTokens = formatAbbr(
                      supplyIndex === 0
                        ? user?.token0?.user_asset_display_balance || '0'
                        : user?.token1?.user_asset_display_balance || '0'
                    );
                    const myUSD = formatUSD(
                      String(
                        (supplyIndex === 0 ? price0 : price1) *
                          parseFloat(
                            supplyIndex === 0
                              ? user?.token0?.user_asset_display_balance || '0'
                              : user?.token1?.user_asset_display_balance || '0'
                          )
                      )
                    );

                    return (
                      <div
                        key={m.market_address}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden px-6 py-4 cursor-pointer dark:bg-secondary/80"
                        role="button"
                        tabIndex={0}
                        onClick={() => onDetails?.(m.market_address)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onDetails?.(m.market_address);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <Image
                              src={m.token0.logoURI || '/icons/token.svg'}
                              alt={m.token0.symbol}
                              width={28}
                              height={28}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                            />
                            <Image
                              src={m.token1.logoURI || '/icons/token.svg'}
                              alt={m.token1.symbol}
                              width={28}
                              height={28}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 whitespace-nowrap">{`${m.token0.symbol} & ${m.token1.symbol}`}</div>
                            <div className="text-xs text-[#A5ADC6] whitespace-nowrap">
                              {m.chain_name || 'Monad Testnet'}
                            </div>
                          </div>
                        </div>
                        {/* divider between header and metrics */}
                        <div className="border-t border-slate-200 mt-3 pt-3" />

                        {/* metrics grid with vertical dividers */}
                        <div className="grid grid-cols-3 divide-x divide-slate-200 w-full mt-1">
                          <div className="px-4 text-center">
                            {actionMode === 'borrow' ? (
                              <>
                                <div className="text-xs text-slate-500">{borrowUSD}</div>
                                <div className="text-sm font-medium text-slate-900">
                                  {borrowTokens}
                                </div>
                                <div className="text-xs text-[#A5ADC6] mt-1">Total Borrowed</div>
                              </>
                            ) : (
                              <>
                                <div className="text-xs text-slate-500">{supplyUSD}</div>
                                <div className="text-sm font-medium text-slate-900">
                                  {supplyTokens}
                                </div>
                                <div className="text-xs text-[#A5ADC6] mt-1">Total Supplied</div>
                              </>
                            )}
                          </div>
                          <div className="px-4 text-center">
                            <div className="text-xs text-slate-500">-</div>
                            <div className="text-sm font-medium text-slate-900">
                              {actionMode === 'borrow' ? borrowApy : supplyApy}
                            </div>
                            <div className="text-xs text-[#A5ADC6] mt-1">
                              {actionMode === 'borrow' ? 'Borrow APY' : 'Supply APY'}
                            </div>
                          </div>
                          <div className="px-4 text-center">
                            {actionMode === 'borrow' ? (
                              <>
                                <div className="text-xs text-slate-500">{remainingUSD}</div>
                                <div className="text-sm font-medium text-slate-900">
                                  {remainingTokens}
                                </div>
                                <div className="text-xs text-[#A5ADC6] mt-1">MY Debt</div>
                              </>
                            ) : (
                              <>
                                <div className="text-xs text-slate-500">{myUSD}</div>
                                <div className="text-sm font-medium text-slate-900">{myTokens}</div>
                                <div className="text-xs text-[#A5ADC6] mt-1">MY Supplies</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Mobile full-width button */}
                        <div className="mt-4 w-full">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDetails?.(m.market_address);
                            }}
                            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm text-[#131E40]"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}