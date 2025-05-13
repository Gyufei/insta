import { toast } from 'sonner';

import React, { useEffect, useRef } from 'react';

import { formatNumber } from '@/lib/utils/number';

import { useMarketOrderbook } from '../common/use-market-orderbook';

interface OrderbookProps {
  marketId: string;
  outcomeIndex: number;
}

export default function Orderbook({ marketId, outcomeIndex }: OrderbookProps) {
  const { data, error } = useMarketOrderbook(marketId, outcomeIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spreadBoxRef = useRef<HTMLDivElement>(null);
  const asksRef = useRef<HTMLDivElement>(null);
  const bidsRef = useRef<HTMLDivElement>(null);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load orderbook data. Please try again later.');
    }
  }, [error]);

  // Center spread box after content is loaded
  useEffect(() => {
    if (!data) return;
    const scrollContainer = scrollContainerRef.current;
    const spreadBox = spreadBoxRef.current;
    const asksSection = asksRef.current;
    const bidsSection = bidsRef.current;

    if (
      scrollContainer &&
      spreadBox &&
      asksSection &&
      bidsSection &&
      data?.sell?.length > 0 &&
      data?.buy?.length > 0
    ) {
      // Wait for next frame to ensure all measurements are accurate
      requestAnimationFrame(() => {
        const asksHeight = asksSection.offsetHeight;
        const containerHeight = scrollContainer.clientHeight;

        // Calculate scroll position to center spread box
        const targetScroll = Math.max(
          0,
          asksHeight - (containerHeight - spreadBox.offsetHeight) / 2
        );
        scrollContainer.scrollTop = targetScroll;
      });
    }
  }, [data?.sell, data?.buy]);

  if (!data) {
    return null;
  }

  const { buy: bids, sell: asks, lastPrice, spread } = data;

  return (
    <div className="bg-white relative">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="grid grid-cols-4 px-2 py-3 text-sm font-medium text-gray-500 border-b">
          <div>DEPTH</div>
          <div>PRICE</div>
          <div className="text-right">SHARES</div>
          <div className="text-right">TOTAL</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        id="AskBidItemBox"
        ref={scrollContainerRef}
        className="max-h-[400px] overflow-y-auto no-scrollbar relative"
      >
        {/* Top shadow overlay */}
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-20" />

        {/* Asks (Sell Orders) */}
        <div ref={asksRef} className="divide-y">
          {asks
            .sort((a, b) => b.price - a.price)
            .map((ask, index) => (
              <div key={index} className="grid grid-cols-4 px-2 py-2 relative">
                <div className="relative z-10">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${(ask.shares / Math.max(...asks.map((a) => a.shares))) * 100}%`,
                      background: 'var(--color-ask-bg)',
                    }}
                  />
                </div>
                <div className="font-medium relative z-10 text-red-600">
                  ${formatNumber(ask.price)}
                </div>
                <div className="text-right relative z-10">{formatNumber(ask.shares)}</div>
                <div className="text-right relative z-10">
                  ${formatNumber(ask.price * ask.shares)}
                </div>
              </div>
            ))}
        </div>

        {/* Spread and Last Price */}
        <div ref={spreadBoxRef} className="sticky z-10 px-2 py-4 bg-gray-50 border-y">
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">Last: ${formatNumber(lastPrice)}</div>
            <div className="text-gray-500">Spread: ${formatNumber(spread)}</div>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div ref={bidsRef} className="divide-y">
          {bids
            .sort((a, b) => b.price - a.price)
            .map((bid, index) => (
              <div key={index} className="grid grid-cols-4 px-2 py-2 relative">
                <div className="relative z-10">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${(bid.shares / Math.max(...bids.map((b) => b.shares))) * 100}%`,
                      background: 'var(--color-bid-bg)',
                    }}
                  />
                </div>
                <div className="font-medium relative z-10 text-green-600">
                  ${formatNumber(bid.price)}
                </div>
                <div className="text-right relative z-10">{formatNumber(bid.shares)}</div>
                <div className="text-right relative z-10">
                  ${formatNumber(bid.price * bid.shares)}
                </div>
              </div>
            ))}
        </div>

        {/* Bottom shadow overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20" />
      </div>
    </div>
  );
}
