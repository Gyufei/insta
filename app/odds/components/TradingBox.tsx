import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { Img as Image } from 'react-image';
import { useAuth } from '../contexts/AuthContext';
import { Tooltip } from '../utils/Tooltip.ts';
import { http } from '../utils/http'; 
import { show } from '../utils/message';

interface TradeState {
  direction: 'buy' | 'sell';
  outcome: string | null;
  sharesToBuy: number;
  sharesToSell: number;
  price: number | null;
}

interface Outcome {
  name: string;
  logo: string;
  index: number;
  probability: number;
  volume: string;
  players: number;
}

interface TradingBoxProps {
  selectedOutcome: Outcome | null;
  onOutcomeSelect: (outcome: Outcome | null) => void;
  tradeState: TradeState;
  onTradeStateChange: (state: TradeState) => void;
  market: any;
  outcomeCount?: number;
  outcomeNames?: string[];
}

export default function TradingBox({ 
  selectedOutcome, 
  onOutcomeSelect,
  tradeState,
  onTradeStateChange,
  market
}) {
  const [tradingMode, setTradingMode] = useState<'fast' | 'limit'>('fast');
  const { isLoggedIn, login, systemUID, positions, fetchPositions } = useAuth();
  const fastButtonRef = useRef<HTMLButtonElement>(null);
  const [showOutcomes, setShowOutcomes] = useState(false);
  const limitButtonRef = useRef<HTMLButtonElement>(null);
  const isMounted = useRef(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clickListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const [isTradeStateInitialized, setIsTradeStateInitialized] = useState(false);

  // Get user's shares for selected outcome
  const userShares = useMemo(() => {
    if (!selectedOutcome || !market?.market_id) return 0;
    
    const position = positions.find(p => 
      p.market.id === market.market_id && 
      p.outcome.index === selectedOutcome.index
    );
    
    return position ? parseInt(position.shares) : 0;
  }, [selectedOutcome, market?.market_id, positions]);

  // Sync selected outcome with trade state whenever selectedOutcome or tradeState.type changes
  useEffect(() => {
    if (selectedOutcome) {
      setIsTradeStateInitialized(true);
      onTradeStateChange(prev => ({
        ...prev,
        outcome: selectedOutcome.name,
        price: selectedOutcome.price
      }));
    }
  }, [selectedOutcome]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Create the handler function
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOutcomes(false);
      }
    };

    // Store reference to the handler for cleanup
    clickListenerRef.current = handleClickOutside;

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (clickListenerRef.current) {
        document.removeEventListener('mousedown', clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const initTooltips = () => {
      requestAnimationFrame(() => {
        if (fastButtonRef.current) {
          Tooltip.init(fastButtonRef.current);
        }
        if (limitButtonRef.current) {
          Tooltip.init(limitButtonRef.current);
        }
      });
    };

    initTooltips();
  }, []);

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
      [tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell']: shares
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
    const newAmount = increment ? 
      parseFloat((currentAmount + step).toFixed(4)) : 
      Math.max(0, parseFloat((currentAmount - step).toFixed(4)));
    
    onTradeStateChange({
      ...tradeState,
      [sharesKey]: newAmount
    });
  };

  const validateTrade = () => {
    if (!systemUID) {
      show({
        type: 'Error',
        message: 'Please log in to trade',
        delay: 3000
      });
      return false;
    }

    if (!isTradeStateInitialized || !selectedOutcome || !market?.market_id) {
      show({
        type: 'Error',
        message: 'Please select an outcome to trade',
        delay: 3000
      });
      return false;
    }

    // Get shares amount based on order type
    const sharesNum = tradeState[tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell'];

    // Validate shares amount
    if (!Number.isInteger(sharesNum) || sharesNum <= 0) {
      show({
        type: 'Error',
        message: 'Please enter a valid number of shares',
        delay: 3000
      });
      return false;
    }

    // Validate price
    if (tradingMode === 'limit' && (!tradeState.price || tradeState.price <= 0)) {
      show({
        type: 'Error',
        message: 'Please enter a valid price',
        delay: 3000
      });
      return false;
    }

    return true;
  };

  const handleTrade = async () => {
    if (!validateTrade()) {
      return;
    }

    const sharesNum = tradeState[tradeState.direction === 'buy' ? 'sharesToBuy' : 'sharesToSell'];

    try {
      setIsSubmitting(true);

      const tradeData = {
        user_id: systemUID,
        outcome_index: selectedOutcome.index.toString(),
        trading_direction: tradeState.direction,
        trading_mode: tradingMode,
        shares: sharesNum.toString(),
        signature: '0x'
      };

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if(!uuidRegex.test(systemUID) || !tradeState.price) {
        return;
      }

      if (tradingMode === 'limit') {
        tradeData.price = tradeState.price?.toString();
      }

      const response = await http.post(`/market/${market.market_id}/trade`, {
        body: JSON.stringify(tradeData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response?.order_id) {
        show({
          type: 'Success',
          message: `${tradeState.direction === 'buy' ? 'Buy' : 'Sell'} order placed successfully`,
          delay: 3000
        });

        // Refresh positions if available
        if (typeof fetchPositions === 'function') {
          try {
            await fetchPositions();
          } catch (err) {
            console.error('Error refreshing positions:', err);
          }
        }

        // Reset form
        onTradeStateChange({
          ...tradeState,
          sharesToBuy: 0,
          sharesToSell: 0,
          price: null
        });
      } else {
        throw new Error(response?.message || 'Failed to place order');
      }

    } catch (err) {
      console.error('Trade error:', err);
      show({
        type: 'Error',
        message: err instanceof Error ? err.message : 'Failed to place order',
        delay: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOutcomePickup = () => (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
        onClick={() => setShowOutcomes(!showOutcomes)}
      >
        {selectedOutcome ? (
          <div className="flex items-center gap-3">
            <Image src={selectedOutcome.logo} alt={selectedOutcome.name} className="w-8 h-8 rounded-full" />
            <span className="text-xl font-medium">{selectedOutcome.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select an outcome</span>
        )}
        <ChevronDown className={`h-5 w-5 transition-transform ${showOutcomes ? 'rotate-180' : ''}`} />
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
                  index
                });
                onTradeStateChange(prev => ({
                  ...prev,
                  outcome: outcome.name,
                  price: outcome.price
                }));
                setShowOutcomes(false);
              }}
            >
              <Image src={outcome.logo} alt={outcome.name} className="w-8 h-8 rounded-full" />
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
                    price: Math.max(0, tradeState.price - 1)
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
                  price: parseInt(value || '0')
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
                    price: tradeState.price + 1
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
                    price: Math.max(0, tradeState.price - 1)
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
                  price: parseInt(value || '0')
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
                    price: tradeState.price + 1
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
          <div className="text-sm text-gray-500">
            (Max: {userShares})
          </div>
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
            <button 
              ref={fastButtonRef}
              className={`w-6 h-6 flex items-center justify-center rounded-l-[4px] rounded-r-none transition-colors ${
                tradingMode === 'fast' 
                  ? 'bg-[#c5d1da] text-[#0a0a0a]' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setTradingMode('fast')}
              tld-tooltip="Fast"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
            </button>
            <button 
              ref={limitButtonRef}
              className={`w-6 h-6 flex items-center justify-center rounded-r-[4px] rounded-l-none transition-colors ${
                tradingMode === 'limit' 
                  ? 'bg-[#c5d1da] text-[#0a0a0a]' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setTradingMode('limit')}
              tld-tooltip="Limit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-gantt"><path d="M8 6h10"/><path d="M6 12h9"/><path d="M11 18h7"/>
              </svg>
            </button>
          </div>
        </div>

        {selectedOutcome && (
          <div>
            {tradeState.direction === 'buy' && renderBuyLayout()}
            {tradeState.direction === 'sell' && renderSellLayout()}

            <button 
              onClick={isLoggedIn ? handleTrade : login}
              disabled={
                isSubmitting || 
                (tradeState.direction === 'sell' && tradeState.sharesToSell > userShares)
              }
              className={`w-full py-4 text-white text-lg font-medium rounded-lg mb-4 ${
                tradeState.direction === 'buy'
                  ? 'bg-[var(--color-buy-button)] hover:bg-[var(--color-buy-button-hover)]'
                  : `bg-[var(--color-sell-button)] hover:bg-[var(--color-sell-button-hover)] ${
                      (tradeState.direction === 'sell' && tradeState.sharesToSell > userShares) || isSubmitting
                        ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                        : ''
                    }`
              }`}
            >
              {isSubmitting 
                ? 'Processing...' 
                : tradeState.direction === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}