'use client';

import Image from 'next/image';
// import Link from 'next/link';
import { APR_MONAD, MONAD, G_MONAD, MonUSD } from '@/config/tokens';

import { TitleH2 } from '@/components/common/title-h2';
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

function tokenLogo(symbol?: string) {
  const s = (symbol || '').toUpperCase();
  if (s === 'ETH') return '/icons/eth.svg';
  if (s === MONAD.symbol.toUpperCase()) return MONAD.logo;
  if (s === APR_MONAD.symbol.toUpperCase()) return APR_MONAD.logo;
  if (s === G_MONAD.symbol.toUpperCase()) return G_MONAD.logo;
  if (s === MonUSD.symbol.toUpperCase()) return MonUSD.logo;
  return '/icons/token.svg';
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
            {marketsLoading && (
              <div className="text-sm text-gray-600">Loading markets...</div>
            )}
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
                {sortedMarkets.map((m) => {
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
                      <div className="flex items-center gap-2">
                        <Image src={tokenLogo(m.token0.symbol)} alt={m.token0.symbol} width={24} height={24} />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">{m.token0.name || m.market_name}</div>
                          <div className="text-xs text-slate-500 whitespace-nowrap">{m.token0.symbol}</div>
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