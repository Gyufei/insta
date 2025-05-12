import { useAppKit } from '@reown/appkit/react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import React, { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { IMarketData } from '../common/use-market-detail';
import { useTrade } from '../common/use-trade';
import { useUserPositions } from '../common/use-user-positions';

export interface ITradeState {
  direction: 'buy' | 'sell';
  outcome: string | null;
  sharesToBuy: number;
  sharesToSell: number;
  price: number | null;
}

export interface IOutcome {
  name: string;
  logo: string;
  index: number;
  probability: number;
  volume: string;
  players: number;
  price?: number;
}

export interface ITradeData {
  user_id: string;
  outcome_index: string;
  trading_direction: string;
  trading_mode: string;
  shares: string;
  price?: string;
  signature?: string;
}

interface TradingBoxProps {
  selectedOutcome: IOutcome | null;
  onOutcomeSelect: (outcome: IOutcome | null) => void;
  tradeState: ITradeState;
  onTradeStateChange: (state: ITradeState | ((prev: ITradeState) => ITradeState)) => void;
  market: IMarketData;
}

export default function TradingBox({
  selectedOutcome,
  onOutcomeSelect,
  tradeState,
  onTradeStateChange,
  market,
}: TradingBoxProps) {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { open } = useAppKit();
  const { setCurrentComponent } = useSideDrawerStore();

  const [tradingMode, setTradingMode] = useState<'fast' | 'limit'>('fast');

  const { data: positionsData } = useUserPositions();
  const positions = useMemo(() => positionsData?.positions || [], [positionsData]);

  const [showOutcomes, setShowOutcomes] = useState(false);
  const [isTradeStateInitialized, setIsTradeStateInitialized] = useState(false);

  // Get user's shares for selected outcome
  const userShares = useMemo(() => {
    if (!selectedOutcome || !market?.market_id) return 0;

    const position = positions.find(
      (p) => p.market.id === market.market_id && p.outcome.index === selectedOutcome.index
    );

    return position ? parseInt(position.shares) : 0;
  }, [selectedOutcome, market?.market_id, positions]);

  useEffect(() => {
    if (selectedOutcome) {
      setIsTradeStateInitialized(true);
      onTradeStateChange((prev: ITradeState) => ({
        ...prev,
        outcome: selectedOutcome.name,
        price: selectedOutcome?.price || null,
      }));
    }
  }, [selectedOutcome]);

  const handleAmountChange = (value: string) => {
    // Allow decimal point and up to 4 decimal places
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Handle multiple decimal points
    const parts = cleanValue.split('.');
    let processedValue = parts[0];
    if (parts.length > 1) {
      // Take only first 4 digits after decimal point
      processedValue += '.' + parts[1].slice(0, 4);
    }

    const amount = parseFloat(processedValue || '0');
    const shares = isNaN(amount) ? 0 : amount;

    onTradeStateChange({
      ...tradeState,
      [tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell']: shares,
    });
  };

  const formatSharesDisplay = (value: number) => {
    // If value has no decimal places, show as integer
    if (Number.isInteger(value)) {
      return value.toString();
    }
    // Otherwise show up to 4 decimal places, trimming trailing zeros
    return value.toFixed(4).replace(/\.?0+$/, '');
  };

  const adjustAmount = (increment: boolean) => {
    const sharesKey = tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell';
    const currentAmount = tradeState[sharesKey] || 0;
    // Use 1 as the increment/decrement step
    const step = 1;
    const newAmount = increment
      ? parseFloat((currentAmount + step).toFixed(4))
      : Math.max(0, parseFloat((currentAmount - step).toFixed(4)));

    onTradeStateChange({
      ...tradeState,
      [sharesKey]: newAmount,
    });
  };

  const validateTrade = () => {
    if (!address) {
      toast.error('Please connect your wallet to trade');
      open();
      return false;
    }

    if (!accountInfo?.sandbox_account) {
      toast.error('Please create account to trade');
      setCurrentComponent({ name: 'AccountSetting' });
      return false;
    }

    if (!isTradeStateInitialized || !selectedOutcome || !market?.market_id) {
      toast.error('Please select an outcome to trade');
      return false;
    }

    // Get shares amount based on order type
    const sharesNum = tradeState[tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell'];

    // Validate shares amount
    if (!Number.isInteger(sharesNum) || sharesNum <= 0) {
      toast.error('Please enter a valid number of shares');
      return false;
    }

    // Validate price
    if (tradingMode === 'limit' && (!tradeState.price || tradeState.price <= 0)) {
      toast.error('Please enter a valid price');
      return false;
    }

    return true;
  };

  const { mutate: triggerTrade, isPending: isSubmitting } = useTrade(market.market_id);

  const handleTrade = async () => {
    if (!validateTrade()) {
      return;
    }

    const sharesNum = tradeState[tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell'];

    const tradeData: ITradeData = {
      user_id: accountInfo?.sandbox_account || '',
      outcome_index: selectedOutcome?.index?.toString() || '',
      trading_direction: tradeState.direction,
      trading_mode: tradingMode,
      shares: sharesNum.toString(),
      signature: '0x',
    };

    if (!tradeState.price) {
      return;
    }

    if (tradingMode === 'limit') {
      tradeData.price = tradeState.price?.toString();
    }

    await triggerTrade(tradeData);

    onTradeStateChange({
      ...tradeState,
      sharesToBuy: 0,
      sharesToSell: 0,
      price: null,
    });
  };

  const renderOutcomePickup = () => (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
        onClick={() => setShowOutcomes(!showOutcomes)}
      >
        {selectedOutcome ? (
          <div className="flex items-center gap-3">
            <Image
              src={selectedOutcome.logo}
              alt={selectedOutcome.name}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <span className="text-xl font-medium">{selectedOutcome.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select an outcome</span>
        )}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${showOutcomes ? 'rotate-180' : ''}`}
        />
      </button>

      {showOutcomes && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
          {market.outcomes.map((outcome, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50"
              onClick={() => {
                onOutcomeSelect({
                  ...market.outcomes[index],
                  index,
                });
                onTradeStateChange((prev) => ({
                  ...prev,
                  outcome: outcome.name,
                  price: outcome.price,
                }));
                setShowOutcomes(false);
              }}
            >
              <Image
                src={outcome.logo}
                alt={outcome.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-lg font-medium">{outcome.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderBuyLayout = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Outcome</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        {renderOutcomePickup()}
      </div>

      {tradingMode === 'limit' && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Limit Price</label>
          <div className="relative rounded-lg border overflow-hidden">
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
              onClick={() => {
                if (tradeState.price) {
                  onTradeStateChange({
                    ...tradeState,
                    price: Math.max(0, tradeState.price - 1),
                  });
                }
              }}
            >
              −
            </button>
            <input
              type="text"
              value={`$${tradeState.price || 0}`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                onTradeStateChange({
                  ...tradeState,
                  price: parseInt(value || '0'),
                });
              }}
              className="w-full py-3 px-12 text-center text-xl focus:outline-none"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
              onClick={() => {
                if (tradeState.price !== null) {
                  onTradeStateChange({
                    ...tradeState,
                    price: tradeState.price + 1,
                  });
                }
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-lg font-medium">Shares</label>
        </div>
        <div className="relative rounded-lg border overflow-hidden">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
            onClick={() => adjustAmount(false)}
          >
            −
          </button>
          <input
            type="text"
            value={formatSharesDisplay(tradeState.sharesToBuy)}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full py-3 px-12 text-center text-xl focus:outline-none"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
            onClick={() => adjustAmount(true)}
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        {tradingMode === 'limit' && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total</span>
            <span className="text-blue-600 font-medium">
              ${(tradeState.sharesToBuy * (tradeState.price || 0)).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </>
  );

  const renderSellLayout = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Outcome</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        {renderOutcomePickup()}
      </div>

      {tradingMode === 'limit' && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Limit Price</label>
          <div className="relative rounded-lg border overflow-hidden">
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
              onClick={() => {
                if (tradeState.price) {
                  onTradeStateChange({
                    ...tradeState,
                    price: Math.max(0, tradeState.price - 1),
                  });
                }
              }}
            >
              −
            </button>
            <input
              type="text"
              value={`$${tradeState.price || 0}`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                onTradeStateChange({
                  ...tradeState,
                  price: parseInt(value || '0'),
                });
              }}
              className="w-full py-3 px-12 text-center text-xl focus:outline-none"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
              onClick={() => {
                if (tradeState.price !== null) {
                  onTradeStateChange({
                    ...tradeState,
                    price: tradeState.price + 1,
                  });
                }
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-lg font-medium">Shares</label>
          <div className="text-sm text-gray-500">(Max: {userShares})</div>
        </div>
        <div className="relative rounded-lg border overflow-hidden">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
            onClick={() => adjustAmount(false)}
          >
            −
          </button>
          <input
            type="text"
            value={formatSharesDisplay(tradeState.sharesToSell)}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full py-3 px-12 text-center text-xl focus:outline-none"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
            onClick={() => adjustAmount(true)}
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Est. amount received</span>
          <span className="text-green-600 font-medium">$0.00</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white border rounded-lg w-full">
      <div className="py-2 px-4">
        <div className="flex items-center border-b mb-6">
          <button
            className={`px-2 py-2 font-medium transition-colors ${
              tradeState.direction === 'buy'
                ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
            }`}
            onClick={() => onTradeStateChange({ ...tradeState, direction: 'buy' })}
          >
            Buy
          </button>
          <button
            className={`ml-4 px-2 py-2 font-medium transition-colors ${
              tradeState.direction === 'sell'
                ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
            }`}
            onClick={() => onTradeStateChange({ ...tradeState, direction: 'sell' })}
          >
            Sell
          </button>
          <div className="flex-1 flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`w-6 h-6 flex items-center justify-center rounded-l-[4px] rounded-r-none transition-colors ${
                      tradingMode === 'fast'
                        ? 'bg-[#c5d1da] text-[#0a0a0a]'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setTradingMode('fast')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-zap"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-xs">Fast</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`w-6 h-6 flex items-center justify-center rounded-r-[4px] rounded-l-none transition-colors ${
                      tradingMode === 'limit'
                        ? 'bg-[#c5d1da] text-[#0a0a0a]'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setTradingMode('limit')}
                    tld-tooltip="Limit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chart-no-axes-gantt"
                    >
                      <path d="M8 6h10" />
                      <path d="M6 12h9" />
                      <path d="M11 18h7" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-xs">Limit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {selectedOutcome && (
          <div>
            {tradeState.direction === 'buy' && renderBuyLayout()}
            {tradeState.direction === 'sell' && renderSellLayout()}

            <button
              onClick={handleTrade}
              disabled={
                isSubmitting ||
                (tradeState.direction === 'sell' && tradeState.sharesToSell > userShares)
              }
              className={`w-full py-4 text-white text-lg font-medium rounded-lg mb-4 ${
                tradeState.direction === 'buy'
                  ? 'bg-[var(--color-buy-button)] hover:bg-[var(--color-buy-button-hover)]'
                  : `bg-[var(--color-sell-button)] hover:bg-[var(--color-sell-button-hover)] ${
                      (tradeState.direction === 'sell' && tradeState.sharesToSell > userShares) ||
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                        : ''
                    }`
              }`}
            >
              {isSubmitting ? 'Processing...' : tradeState.direction === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
