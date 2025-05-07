import React, { useEffect, useState, useRef } from "react";
import { http } from "../utils/http";
import { show } from "../utils/message";

const REFRESH_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface OrderbookEntry {
  price: number;
  shares: number;
  total?: number;
}

interface OrderbookProps {
  marketId: string;
  outcomeIndex: number;
  isVisible: boolean;
}

export default function Orderbook({
  marketId,
  outcomeIndex,
  isVisible,
}: OrderbookProps) {
  const [asks, setAsks] = useState<OrderbookEntry[]>([]);
  const [bids, setBids] = useState<OrderbookEntry[]>([]);
  const [lastPrice, setLastPrice] = useState(0);
  const [spread, setSpread] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spreadBoxRef = useRef<HTMLDivElement>(null);
  const asksRef = useRef<HTMLDivElement>(null);
  const bidsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);

  useEffect(() => {
    const fetchOrderbook = async () => {
      // Skip fetching if orderbook is not visible
      if (!isVisible) return;

      try {
        retryCount.current = 0;
        const response = await http.get(
          `/market/${marketId}/orderbook?outcome_index=${outcomeIndex}`,
        );
        console.log("Raw orderbook response:", response);

        if (!response["__success__"]) {
          throw new Error("Bad orderbook request");
        }

        // Log buy/sell data from response
        console.log("Buy orders:", response.buy);
        console.log("Sell orders:", response.sell);

        // Transform buy orders (bids)
        const transformedBids = (response.buy || [])
          .map((bid: any) => ({
            price: parseFloat(bid.price),
            shares: parseFloat(bid.shares),
          }))
          .sort((a: OrderbookEntry, b: OrderbookEntry) => b.price - a.price); // Sort descending

        // Transform sell orders (asks)
        const transformedAsks = (response.sell || [])
          .map((ask: any) => ({
            price: parseFloat(ask.price),
            shares: parseFloat(ask.shares),
          }))
          .sort((a: OrderbookEntry, b: OrderbookEntry) => b.price - a.price); // Sort descending

        console.log("Transformed bids:", transformedBids);
        console.log("Transformed asks:", transformedAsks);

        setBids(transformedBids);
        setAsks(transformedAsks);

        // Calculate spread
        if (transformedAsks.length > 0 && transformedBids.length > 0) {
          const lowestAsk = transformedAsks[transformedAsks.length - 1].price; // Since sorted descending
          const highestBid = transformedBids[0].price;
          setSpread(lowestAsk - highestBid);
          setLastPrice(highestBid); // Use highest bid as last price
        }
      } catch (err) {
        console.error(err);
        // Implement retry logic
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current++;
          setTimeout(() => {
            fetchOrderbook();
          }, RETRY_DELAY * retryCount.current);
        } else {
          show({
            type: "Error",
            message: "Failed to load orderbook data. Please try again later.",
            delay: 3000,
          });
        }
      }
    };

    // Initial fetch
    fetchOrderbook();

    // Set up 5-second refresh interval
    intervalRef.current = setInterval(fetchOrderbook, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        retryCount.current = 0;
      }
    };
  }, [marketId, outcomeIndex, isVisible]);

  // Center spread box after content is loaded
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const spreadBox = spreadBoxRef.current;
    const asksSection = asksRef.current;
    const bidsSection = bidsRef.current;

    if (
      scrollContainer &&
      spreadBox &&
      asksSection &&
      bidsSection &&
      asks.length > 0 &&
      bids.length > 0
    ) {
      // Wait for next frame to ensure all measurements are accurate
      requestAnimationFrame(() => {
        const asksHeight = asksSection.offsetHeight;
        const containerHeight = scrollContainer.clientHeight;

        // Calculate scroll position to center spread box
        const targetScroll = Math.max(
          0,
          asksHeight - (containerHeight - spreadBox.offsetHeight) / 2,
        );
        scrollContainer.scrollTop = targetScroll;
      });
    }
  }, [asks, bids]); // Run when asks or bids change

  const formatPrice = (price: number) => `$${price}`;
  const formatShares = (shares: number) =>
    shares.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formatTotal = (price: number, shares: number) => {
    const total = price * shares;
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

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
                      background: "var(--color-ask-bg)",
                    }}
                  />
                </div>
                <div className="font-medium relative z-10 text-red-600">
                  ${ask.price.toFixed(2)}
                </div>
                <div className="text-right relative z-10">
                  {ask.shares.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right relative z-10">
                  $
                  {(ask.price * ask.shares).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Spread and Last Price */}
        <div
          ref={spreadBoxRef}
          className="sticky z-10 px-2 py-4 bg-gray-50 border-y"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">Last: ${lastPrice.toFixed(2)}</div>
            <div className="text-gray-500">Spread: ${spread.toFixed(2)}</div>
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
                      background: "var(--color-bid-bg)",
                    }}
                  />
                </div>
                <div className="font-medium relative z-10 text-green-600">
                  ${bid.price.toFixed(2)}
                </div>
                <div className="text-right relative z-10">
                  {bid.shares.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right relative z-10">
                  $
                  {(bid.price * bid.shares).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
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
