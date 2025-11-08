'use client';

import Image from 'next/image';

import { TitleH2 } from '@/components/common/title-h2';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import {
  ICurvanceMarketUserItem,
  useCurvanceMarketUserInfo,
} from '@/lib/data/use-curvance-market-user-info';
import { ICurvanceMarketInfo, useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';

function MarketRow({
  market,
  user,
}: {
  market: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
}) {
  const { setCurrentComponent } = useSideDrawerStore();

  const token0Logo = market?.token0?.wrapper_address ? '/icons/curvance.svg' : '/icons/lending.svg';
  const token1Logo = market?.token1?.wrapper_address ? '/icons/curvance.svg' : '/icons/lending.svg';

  const token0Shares = user?.token0?.user_share_display_balance || '0';
  const token1Debt = user?.token1?.user_debt_display_balance || '0';

  const borrowLimitDisplay = (() => {
    const maxDebtUSD = parseFloat(user?.total_max_debt_in_usd || '0');
    const totalDebtUSD = parseFloat(user?.total_debt_in_usd || '0');
    const price1 = parseFloat(market?.token1?.price || '0');
    const availableUSD = Math.max((maxDebtUSD || 0) - (totalDebtUSD || 0), 0);
    const tokens = price1 > 0 ? availableUSD / price1 : 0;
    return String(tokens || 0);
  })();

  const handleSupplyToken0 = () => {
    setCurrentComponent({
      name: 'LendingSupply',
      props: {
        market_address: market.market_address,
        base_token: {
          address: market.token0.address,
          name: market.token0.name,
          symbol: market.token0.symbol,
          decimals: market.token0.decimals,
          logo: token0Logo,
        },
        base_c_token: {
          address: market.token0.wrapper_address || '',
          decimals: market.token0.wrapper_decimals || market.token0.decimals,
        },
      },
    });
  };

  const handleWithdrawToken0 = () => {
    setCurrentComponent({
      name: 'LendingWithdraw',
      props: {
        market_address: market.market_address,
        base_token: {
          address: market.token0.address,
          name: market.token0.name,
          symbol: market.token0.symbol,
          decimals: market.token0.decimals,
          logo: token0Logo,
        },
        base_c_token: {
          address: market.token0.wrapper_address || '',
          decimals: market.token0.wrapper_decimals || market.token0.decimals,
        },
        user_share_display_balance: token0Shares,
      },
    });
  };

  const handleRepayToken1 = () => {
    setCurrentComponent({
      name: 'LendingRepay',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: market.token1.address,
          name: market.token1.name,
          symbol: market.token1.symbol,
          decimals: market.token1.decimals,
          logo: token1Logo,
        },
        borrowable_c_token: {
          address: market.token1.wrapper_address || '',
          decimals: market.token1.wrapper_decimals || market.token1.decimals,
        },
        user_debt_display_balance: token1Debt,
      },
    });
  };

  const handleBorrowToken1 = () => {
    setCurrentComponent({
      name: 'LendingBorrow',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: market.token1.address,
          name: market.token1.name,
          symbol: market.token1.symbol,
          decimals: market.token1.decimals,
          logo: token1Logo,
        },
        borrowable_c_token: {
          address: market.token1.wrapper_address || '',
          decimals: market.token1.wrapper_decimals || market.token1.decimals,
        },
        user_max_borrow_display_amount: borrowLimitDisplay,
      },
    });
  };

  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={token0Logo} alt={market.token0.symbol} width={24} height={24} />
          <div className="font-medium">{market.market_name}</div>
        </div>
        <div className="text-sm text-gray-500">{market.chain_name}</div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
        <div className="border rounded-md p-3">
          <div className="flex items-center gap-2">
            <Image src={token0Logo} alt={market.token0.symbol} width={20} height={20} />
            <div className="font-medium">{market.token0.symbol}</div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Supply APY: {market.token0.supply_rate || '0'}%
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Utilization: {market.utilization_rate || '0'}%
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSupplyToken0}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-gray-900 text-white hover:bg-gray-800'
              )}
            >
              Supply
            </button>
            <button
              onClick={handleWithdrawToken0}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              Withdraw
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">Your Shares: {token0Shares}</div>
        </div>

        <div className="border rounded-md p-3">
          <div className="flex items-center gap-2">
            <Image src={token1Logo} alt={market.token1.symbol} width={20} height={20} />
            <div className="font-medium">{market.token1.symbol}</div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Borrow APY: {market.token1.borrow_rate || '0'}%
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Utilization: {market.utilization_rate || '0'}%
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleRepayToken1}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-gray-900 text-white hover:bg-gray-800'
              )}
            >
              Repay
            </button>
            <button
              onClick={handleBorrowToken1}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              Borrow
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">Your Debt: {token1Debt}</div>
          <div className="mt-1 text-xs text-gray-500">Borrow Limit: {borrowLimitDisplay}</div>
        </div>

        <div className="border rounded-md p-3">
          <div className="text-sm text-gray-600">TVL: ${market.total_supply_in_usd || '0'}</div>
          <div className="mt-1 text-sm text-gray-600">
            Available: ${market.available_supply_in_usd || '0'}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Borrow Rate: {market.borrow_rate || '0'}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lending() {
  const {
    data: markets,
    isLoading: marketsLoading,
    error: marketsError,
  } = useCurvanceMarkets(true);
  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = useCurvanceMarketUserInfo(true);

  const byMarket: Record<string, ICurvanceMarketUserItem | undefined> = {};
  const userArray = (userInfo ?? []) as ICurvanceMarketUserItem[];
  userArray.forEach((u) => {
    if (u?.market_address) byMarket[u.market_address] = u;
  });

  return (
    <CommonPageLayout title="Lending" iconSrc="/icons/lending.svg">
      <div className="mt-0 mb-6 flex w-full flex-shrink-0 justify-between px-4 2xl:px-12">
        <TitleH2>Curvance Markets</TitleH2>
      </div>

      <div className="px-4 2xl:px-12 space-y-4">
        {(marketsError || userError) && (
          <div className="text-sm text-red-600">Failed to load data.</div>
        )}
        {marketsLoading || userLoading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : (
          (markets ?? []).map((m) => (
            <MarketRow key={m.market_address} market={m} user={byMarket[m.market_address]} />
          ))
        )}
      </div>
    </CommonPageLayout>
  );
}
