'use client';

import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  BadgeDollarSign,
  Loader2,
  RotateCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MonUSD } from '@/config/tokens';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import { useAccountStore } from '@/lib/state/account';
import { formatNumber } from '@/lib/utils/number';
import { trackEvent } from '@/lib/analytics';

import { useOddsDeposit } from '../../common/use-odds-deposit';
import { useOddsWithdraw } from '../../common/use-odds-withdraw';
import { useTradingBalance } from '../../common/use-trading-balance';
import { useUserMarkets } from '../../common/use-user-markets';
import SwapModal from '../../components/SwapModal';
import TransferConfirmModal from '../../components/TransferConfirmModal';

export default function Portfolio() {
  // Track portfolio page view
  React.useEffect(() => {
    trackEvent('PORTFOLIO_VIEW', {
      event_category: 'portfolio',
      account_type: currentAccountType,
    });
  }, [currentAccountType]);
  const router = useRouter();
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

  const {
    balance: fundingBalance,
    isBalancePending: isLoadingFundingBalance,
    refetch: refetchFundingBalance,
  } = useAddressBalance(
    currentAccountType === 'EOA' ? address || '' : accountInfo?.sandbox_account || '',
    MonUSD.address,
    MonUSD.decimals
  );

  const { data: tradingBalanceData, isPending: isLoadingTradingBalance } = useTradingBalance();

  const tradingBalance = tradingBalanceData?.balance;

  const { data: marketsData, isLoading: isLoadingMarkets, error: marketsError } = useUserMarkets();
  const markets = marketsData?.market_list;

  const { mutate: deposit, isPending: isTransferringToTrading } = useOddsDeposit();
  const { mutate: withdraw, isPending: isTransferringToFunding } = useOddsWithdraw();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapClickCount, setSwapClickCount] = useState(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'F2T' | 'T2F'>('F2T');

  const handleTransferToTrading = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (currentAccountType === 'DSA' && !accountInfo) {
      toast.error('Please create an account first');
      return;
    }

    deposit({
      amount,
    });

    setShowTransferModal(false);
  };

  const handleTransferToFunding = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (currentAccountType === 'DSA' && !accountInfo) {
      toast.error('Please create an account first');
      return;
    }

    withdraw({
      amount,
    });

    setShowTransferModal(false);
  };

  const handleSwapClick = () => {
    const newCount = swapClickCount + 1;
    setSwapClickCount(newCount);

    if (newCount >= 10) {
      setShowSwapModal(true);
      setSwapClickCount(0); // Reset counter when modal shows
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:gap-3 gap-0 md:items-center items-start leading-[140%]">
        <span className="text-xl font-medium text-[#131E40]">Portfolio</span>
        <span className="text-[#A5ADC6] font-normal text-sm mt-[6px]">Track your performance</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
        {/* Funding Balance Card */}
        <div className="bg-white rounded-[8px] border border-[#EBEBEB] p-5">
          <div className="text-sm text-[#A5ADC6] font-normal mb-[10px]">
            FUNDING BALANCE (monUSD)
          </div>
          <div className="flex items-center justify-between mb-[10px] min-h-[48px]">
            <div className="flex items-center gap-2">
              {isLoadingFundingBalance ? (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-medium">
                    ${Number(fundingBalance) === 10 ** -18 ? '0' : formatNumber(fundingBalance)}
                  </div>
                  <button
                    onClick={() => refetchFundingBalance()}
                    disabled={isLoadingFundingBalance}
                    className="p-1 hover:bg-gray-100 rounded-[8px] transition-colors"
                  >
                    <RotateCw
                      className={`h-4 w-4 text-[#A5ADC6] ${isLoadingFundingBalance ? 'animate-spin' : ''}`}
                    />
                  </button>
                </>
              )}
            </div>
            <Image src={MonUSD.logo} width={24} height={24} alt={MonUSD.symbol} />
          </div>

          <div className="grid grid-cols-1">
            <button
              id="btnTransferToTrading"
              onClick={() => {
                setTransferDirection('F2T');
                setShowTransferModal(true);
              }}
              disabled={isTransferringToTrading || isLoadingFundingBalance}
              className={`flex items-center justify-center gap-1 py-2 text-xs rounded-[8px] ${
                isLoadingFundingBalance
                  ? 'bg-gray-200 animate-pulse cursor-not-allowed'
                  : 'bg-[#F5F6F9] text-[#131E40] hover:bg-[#F5F6F980] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isLoadingFundingBalance ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowRightFromLine className="h-4 w-4" />
                  {isTransferringToTrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Transfer'
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trading Balance Card */}
        <div className="bg-white rounded-[8px] border border-[#EBEBEB] p-5">
          <div className="text-sm text-[#A5ADC6] font-normal uppercase mb-[10px]">
            Trading Balance
          </div>
          <div className="flex items-center gap-2 mb-[10px]">
            <div className="text-3xl font-medium min-h-[48px] flex items-center">
              {isLoadingTradingBalance ? (
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>${tradingBalance ? formatNumber(tradingBalance || '') : ''}</>
              )}
            </div>
            <button
              id="btnSwap"
              onClick={handleSwapClick}
              className="p-1 hover:bg-gray-100 rounded-[8px] transition-colors"
            >
              <BadgeDollarSign className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1">
            <button
              id="btnTransferToFunding"
              onClick={() => {
                setTransferDirection('T2F');
                setShowTransferModal(true);
              }}
              disabled={isTransferringToFunding}
              className={`flex items-center justify-center gap-1 py-2 text-xs rounded-[8px] ${
                isTransferringToFunding
                  ? 'bg-gray-200 animate-pulse cursor-not-allowed'
                  : 'bg-[#F5F6F9] text-[#131E40] hover:bg-[#F5F6F980] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <ArrowLeftFromLine className="h-4 w-4" />
              {isTransferringToFunding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                'Transfer'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* My Markets Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#131E40]">My Markets</h2>
        <button
          onClick={() => router.push('/odds/dashboard/create-market?chain=monad')}
          className="px-4 py-2 bg-[#6E75F910] text-[#6E75F9] rounded-[8px] hover:bg-[#6E75F920]"
        >
          Create Market
        </button>
      </div>

      {/* Positions Table */}
      <div className="border border-[#ebebeb] rounded-[8px] p-4">
        {/* 表头：仅大屏显示 */}
        <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 hidden md:grid">
          <div className="md:col-span-6 col-span-5">MARKET</div>
          <div className="col-span-2">STATE</div>
          <div className="col-span-2 text-right">PLAYERS</div>
          <div className="md:col-span-2 col-span-3 text-right">VOL.</div>
        </div>

        <div className="divide-y">
          {isLoadingMarkets ? (
            // Loading state
            <div className="py-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-gray-500">Loading markets...</div>
            </div>
          ) : marketsError ? (
            // Error state
            <div className="py-8 text-center text-red-600">{marketsError.message}</div>
          ) : markets && markets.length === 0 ? (
            // Empty state
            <div className="py-8 text-center text-gray-500">
              No markets yet. Create your first market to get started!
            </div>
          ) : (
            // Markets list
            (markets || []).map((market) => (
              <div
                key={market.market_id}
                className="py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2 border-b last:border-b-0"
              >
                {/* MARKET */}
                <div className="md:col-span-6 flex items-center justify-between gap-6">
                  {/* 小屏幕字段名 */}
                  <div className="md:hidden text-xs text-gray-400">MARKET</div>
                  <div className="flex items-center gap-1 min-w-0">
                    <Image
                      src={market.image_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-lg object-cover flex-shrink-0 md:h-10 md:w-10 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/market/${market.market_id}?chain=monad`}
                        className="font-medium mb-1 hover:text-pro-blue block truncate"
                      >
                        {market.title}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* STATE */}
                <div className="md:col-span-2 flex items-center justify-between gap-3">
                  <div className="md:hidden text-xs text-gray-400">STATE</div>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      market.state === 'online'
                        ? 'bg-green-50 text-green-700'
                        : market.state === 'offline'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {market.state}
                  </span>
                </div>

                {/* PLAYERS */}
                <div className="md:col-span-2 text-right flex md:block justify-between items-center w-full">
                  <span className="md:hidden text-xs text-gray-400">PLAYERS</span>
                  <span className="font-medium">{market?.players?.toLocaleString()}</span>
                </div>

                {/* VOL. */}
                <div className="md:col-span-2 text-right flex md:block justify-between items-center w-full">
                  <span className="md:hidden text-xs text-gray-400">VOL.</span>
                  <span className="font-medium">${market?.volume || '0'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Swap Modal */}
      <SwapModal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} />

      {/* Transfer Modal */}
      <TransferConfirmModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onConfirm={transferDirection === 'F2T' ? handleTransferToTrading : handleTransferToFunding}
        maxAmount={transferDirection === 'F2T' ? fundingBalance || '' : tradingBalance || ''}
        direction={transferDirection}
        isAwaitingConfirm={isTransferringToTrading || isTransferringToFunding}
      />
    </div>
  );
}
