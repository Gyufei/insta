'use client';

import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  BadgeDollarSign,
  HandCoins,
  Loader2,
  RotateCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MonUSD } from '@/config/tokens';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useAccountTokenBalance } from '@/lib/web3/use-account-token-balance';

import { useOddsClaim } from '../../common/use-odds-claim';
import { useOddsDeposit } from '../../common/use-odds-deposit';
import { useOddsWithdraw } from '../../common/use-odds-withdraw';
import { useTradingBalance } from '../../common/use-trading-balance';
import { useUserMarkets } from '../../common/use-user-markets';
import SwapModal from '../../components/SwapModal';
import TransferConfirmModal from '../../components/TransferConfirmModal';

export default function Portfolio() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();

  const {
    balance: fundingBalance,
    isPending: isLoadingFundingBalance,
    refetch: refetchFundingBalance,
  } = useAccountTokenBalance(MonUSD.address);

  const { data: tradingBalanceData } = useTradingBalance();

  const tradingBalance = tradingBalanceData?.balance;

  const { data: marketsData, isLoading: isLoadingMarkets, error: marketsError } = useUserMarkets();
  const markets = marketsData?.market_list;

  const { mutate: deposit, isPending: isTransferringToTrading } = useOddsDeposit();
  const { mutate: withdraw, isPending: isTransferringToFunding } = useOddsWithdraw();
  const { mutate: claim, isPending: isProcessingClaim } = useOddsClaim();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapClickCount, setSwapClickCount] = useState(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'F2T' | 'T2F'>('F2T');

  const handleClaim = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!accountInfo) {
      toast.error('Please create an account first');
      return;
    }

    claim(undefined);
  };

  const handleTransferToTrading = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!accountInfo) {
      toast.error('Please create an account first');
      return;
    }

    deposit({
      amount,
    });
  };

  const handleTransferToFunding = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!accountInfo) {
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
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-gray-600 mt-2">Track your performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funding Balance Card */}
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500 uppercase mb-2">Funding Balance</div>
          <div className="flex items-center gap-2 mb-4 min-h-[48px]">
            {isLoadingFundingBalance ? (
              <div className="flex items-center gap-2">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold">${fundingBalance}</div>
                <button
                  onClick={() => refetchFundingBalance()}
                  disabled={isLoadingFundingBalance}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCw
                    className={`h-5 w-5 text-gray-500 ${isLoadingFundingBalance ? 'animate-spin' : ''}`}
                  />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleClaim}
              disabled={isProcessingClaim || isLoadingFundingBalance}
              className={`flex items-center justify-center gap-1 py-2 text-xs rounded-lg ${
                isLoadingFundingBalance
                  ? 'bg-gray-200 animate-pulse cursor-not-allowed'
                  : 'bg-[var(--color-odd-main)] text-white hover:bg-[var(--color-odd-main-hover)]'
              }`}
            >
              {isLoadingFundingBalance ? (
                <div className="h-4 w-24 bg-gray-300 rounded" />
              ) : (
                <>
                  <HandCoins className="h-4 w-4" />
                  {isProcessingClaim ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <span className='whitespace-nowrap'>Top Up (Free)</span>
                  )}
                </>
              )}
            </button>
            <button
              id="btnTransferToTrading"
              onClick={() => {
                setTransferDirection('F2T');
                setShowTransferModal(true);
              }}
              disabled={isTransferringToTrading || isLoadingFundingBalance}
              className={`flex items-center justify-center gap-1 py-2 text-xs rounded-lg ${
                isLoadingFundingBalance
                  ? 'bg-gray-200 animate-pulse cursor-not-allowed'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isLoadingFundingBalance ? (
                <div className="h-5 w-16 bg-gray-300 rounded" />
              ) : (
                <>
                  <ArrowRightFromLine className="h-5 w-5" />
                  {isTransferringToTrading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Transfer'
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trading Balance Card */}
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500 uppercase mb-2">Trading Balance</div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-4xl font-bold min-h-[48px] flex items-center">
              ${tradingBalance}
            </div>
            <button
              id="btnSwap"
              onClick={handleSwapClick}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BadgeDollarSign className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              id="btnTransferToFunding"
              onClick={() => {
                setTransferDirection('T2F');
                setShowTransferModal(true);
              }}
              disabled={isTransferringToFunding}
              className="flex items-center justify-center gap-1 py-2 text-xs bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <h2 className="text-2xl font-bold">My Markets</h2>
        <button
          onClick={() => router.push('/odds/dashboard/create-market')}
          className="px-4 py-2 bg-[var(--color-odd-main)] text-white rounded-lg hover:bg-[var(--color-odd-main-hover)]"
        >
          Create Market
        </button>
      </div>

      {/* Positions Table */}
      <div>
        <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-6">MARKET</div>
          <div className="col-span-2">STATE</div>
          <div className="col-span-2 text-right">PLAYERS</div>
          <div className="col-span-2 text-right">VOL.</div>
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
                className="py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50"
              >
                <div className="col-span-6">
                  <Link href={`/market/${market.market_id}`} className="flex items-center gap-3">
                    <Image
                      src={market.image_url}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="font-medium hover:text-[var(--color-odd-main)]">
                      {market.title}
                    </div>
                  </Link>
                </div>
                <div className="col-span-2">
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
                <div className="col-span-2 text-right">{market?.players?.toLocaleString()}</div>
                <div className="col-span-2 text-right">${market?.volume || '0'}</div>
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
        maxAmount={transferDirection === 'F2T' ? fundingBalance : tradingBalance}
        direction={transferDirection}
        needsApproval={false}
        isAwaitingConfirm={isTransferringToTrading || isTransferringToFunding}
      />
    </div>
  );
}
