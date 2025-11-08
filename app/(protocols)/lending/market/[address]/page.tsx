'use client';

import { TitleH2 } from '@/components/common/title-h2';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

// Client page; metadata should be set via parent layout if needed.

export default function MarketDetail({ params }: { params: { address: string } }) {
  const { data: markets } = useCurvanceMarkets(true);
  const market = (markets || []).find(
    (m) => m.market_address.toLowerCase() === params.address.toLowerCase()
  );

  const { data: userInfo } = useCurvanceMarketUserInfo(true);
  const user = (userInfo || []).find(
    (u) => u.market_address.toLowerCase() === params.address.toLowerCase()
  );

  const { setCurrentComponent } = useSideDrawerStore();

  if (!market)
    return (
      <CommonPageLayout title={params.address} iconSrc="/icons/curvance.svg">
        <div className="px-4 2xl:px-12">
          <div className="text-sm text-gray-600">Market not found.</div>
        </div>
      </CommonPageLayout>
    );

  const openSupply = () => {
    setCurrentComponent({
      name: 'LendingSupply',
      props: {
        market_address: market.market_address,
        base_token: {
          address: market.token0.address,
          name: market.token0.name,
          symbol: market.token0.symbol,
          decimals: market.token0.decimals,
          logo: '/icons/lending.svg',
        },
        base_c_token: {
          address: market.token0.wrapper_address || '',
          decimals: market.token0.wrapper_decimals || market.token0.decimals,
        },
      },
    });
  };

  const openWithdraw = () => {
    setCurrentComponent({
      name: 'LendingWithdraw',
      props: {
        market_address: market.market_address,
        base_token: {
          address: market.token0.address,
          name: market.token0.name,
          symbol: market.token0.symbol,
          decimals: market.token0.decimals,
          logo: '/icons/lending.svg',
        },
        base_c_token: {
          address: market.token0.wrapper_address || '',
          decimals: market.token0.wrapper_decimals || market.token0.decimals,
        },
        user_share_display_balance: user?.token0?.user_share_display_balance || '0',
      },
    });
  };

  const openRepay = () => {
    setCurrentComponent({
      name: 'LendingRepay',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: market.token1.address,
          name: market.token1.name,
          symbol: market.token1.symbol,
          decimals: market.token1.decimals,
          logo: '/icons/lending.svg',
        },
        borrowable_c_token: {
          address: market.token1.wrapper_address || '',
          decimals: market.token1.wrapper_decimals || market.token1.decimals,
        },
        user_debt_display_balance: user?.token1?.user_debt_display_balance || '0',
      },
    });
  };

  const openBorrow = () => {
    const maxDebtUSD = parseFloat(user?.total_max_debt_in_usd || '0');
    const totalDebtUSD = parseFloat(user?.total_debt_in_usd || '0');
    const price1 = parseFloat(market?.token1?.price || '0');
    const availableUSD = Math.max((maxDebtUSD || 0) - (totalDebtUSD || 0), 0);
    const tokens = price1 > 0 ? availableUSD / price1 : 0;

    setCurrentComponent({
      name: 'LendingBorrow',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: market.token1.address,
          name: market.token1.name,
          symbol: market.token1.symbol,
          decimals: market.token1.decimals,
          logo: '/icons/lending.svg',
        },
        borrowable_c_token: {
          address: market.token1.wrapper_address || '',
          decimals: market.token1.wrapper_decimals || market.token1.decimals,
        },
        user_max_borrow_display_amount: String(tokens || 0),
      },
    });
  };

  return (
    <CommonPageLayout title={market.market_name} iconSrc="/icons/lending.svg">
      <div className="mt-0 mb-6 flex w-full flex-shrink-0 justify-between px-4 2xl:px-12">
        <TitleH2>Overview</TitleH2>
      </div>
      <div className="px-4 2xl:px-12 space-y-4">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <div className="border rounded-md p-3">
            <div className="font-medium">Supply {market.token0.symbol}</div>
            <div className="text-sm text-gray-600 mt-2">
              APY: {market.token0.supply_rate || '0'}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Your Shares: {user?.token0?.user_share_display_balance || '0'}
            </div>
            <button
              className="mt-3 px-3 py-2 rounded-md bg-gray-900 text-white"
              onClick={openSupply}
            >
              Supply
            </button>
            <button
              className="mt-2 px-3 py-2 rounded-md bg-gray-100 text-gray-900"
              onClick={openWithdraw}
            >
              Withdraw
            </button>
          </div>
          <div className="border rounded-md p-3">
            <div className="font-medium">Repay {market.token1.symbol}</div>
            <div className="text-sm text-gray-600 mt-2">
              Borrow APY: {market.token1.borrow_rate || '0'}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Your Debt: {user?.token1?.user_debt_display_balance || '0'}
            </div>
            <button
              className="mt-3 px-3 py-2 rounded-md bg-gray-900 text-white"
              onClick={openRepay}
            >
              Repay
            </button>
            <button
              className="mt-2 px-3 py-2 rounded-md bg-gray-100 text-gray-900"
              onClick={openBorrow}
            >
              Borrow
            </button>
            <div className="mt-2 text-xs text-gray-500">
              Borrow Limit:{' '}
              {(() => {
                const maxDebtUSD = parseFloat(user?.total_max_debt_in_usd || '0');
                const totalDebtUSD = parseFloat(user?.total_debt_in_usd || '0');
                const price1 = parseFloat(market?.token1?.price || '0');
                const availableUSD = Math.max((maxDebtUSD || 0) - (totalDebtUSD || 0), 0);
                const tokens = price1 > 0 ? availableUSD / price1 : 0;
                return String(tokens || 0);
              })()}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-gray-600">TVL: ${market.total_supply_in_usd || '0'}</div>
            <div className="mt-1 text-sm text-gray-600">
              Available: ${market.available_supply_in_usd || '0'}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Utilization: {market.utilization_rate || '0'}%
            </div>
          </div>
        </div>
      </div>
    </CommonPageLayout>
  );
}
