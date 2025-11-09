import { useMemo } from 'react';

import { IToken } from '@/config/tokens';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { NumberInput } from '@/components/common/number-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';

import { useCurvanceWithdraw } from '@/lib/data/use-curvance-withdraw';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { formatNumber, parseBig } from '@/lib/utils/number';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';

type LendingWithdrawProps = {
  market_address: string;
  base_token: {
    address: string;
    name: string;
    symbol: string;
    logo?: string;
    decimals: number;
  };
  base_c_token?: {
    address: string;
    decimals?: number;
  };
  user_share_display_balance?: string; // display shares balance
};

export function LendingWithdraw() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingWithdrawProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.base_c_token?.address || '0x0',
      name: `${props?.base_token?.symbol || 'Token'} Shares`,
      symbol: `${props?.base_token?.symbol || 'TOKEN'}-c`,
      logo: props?.base_token?.logo || '/icons/token.svg',
      decimals: props?.base_c_token?.decimals || props?.base_token?.decimals || 18,
    }),
    [props?.base_token, props?.base_c_token]
  );

  const sharesBalance = props?.user_share_display_balance || '0';
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(sharesBalance);
  const { handleSetMax, handleInput } = useSetMax(inputValue, sharesBalance, handleInputChange);

  const { handleBack } = useUrlPathDrawerChange('/lending');
  const { mutate: withdraw, isPending } = useCurvanceWithdraw();
  const { trackEvent } = useEnhancedAnalytics();

  // 获取市场价格以显示美元等值
  const marketsQuery = useCurvanceMarkets(true);
  const market = useMemo(() => {
    const list = marketsQuery.data || [];
    return list.find((m) => String(m.market_address).toLowerCase() === String(props?.market_address).toLowerCase());
  }, [marketsQuery.data, props?.market_address]);
  const tokenPrice = useMemo(() => {
    const p = parseFloat(market?.token0?.price || '0');
    return Number.isFinite(p) ? p : 0;
  }, [market?.token0?.price]);
  const usdValue = useMemo(() => {
    const amount = parseFloat(inputValue || '0');
    const usd = amount * (tokenPrice || 0);
    if (!Number.isFinite(usd)) return '0.00';
    return usd.toFixed(4);
  }, [inputValue, tokenPrice]);

  // 用户在该市场的摘要数据
  const userInfoQuery = useCurvanceMarketUserInfo(true);
  const userItem = useMemo(() => {
    const list = userInfoQuery.data || [];
    return list.find((u) => String(u.market_address).toLowerCase() === String(props?.market_address).toLowerCase());
  }, [userInfoQuery.data, props?.market_address]);

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const shares = parseBig(inputValue, token.decimals);

    const payload = {
      base_token: props?.base_token?.address || '',
      base_c_token: props?.base_c_token?.address || '',
      withdraw_shares: shares.toString(),
    };

    trackEvent('LENDING_WITHDRAW', {
      event_category: 'protocol_interaction',
      event_label: 'lending_withdraw_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'withdraw',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    withdraw(payload, {
      onSuccess: () => {
        trackEvent('LENDING_WITHDRAW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_withdraw_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'withdraw_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_WITHDRAW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_withdraw_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'curvance',
            action: 'withdraw_failed',
            token: token.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          {/* 主卡片：标题 + 大号数字输入 + 可用/Max + 操作按钮 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white p-5 shadow-sm dark:bg-secondary">
            <div className="text-sm font-medium text-[#131E40]">{`Withdraw ${props?.base_token?.symbol || 'Token'}`}</div>

            <div className="mt-3 flex flex-col gap-3">
              {/* 第一行：输入框 + Token 图标 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <NumberInput
                    className="!text-[32px] !font-semibold bg-transparent border-none p-0 shadow-none focus-visible:ring-0 w-full text-[#131E40]"
                    placeholder="0.00"
                    value={inputValue}
                    onChange={handleInput}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={props?.base_token?.logo || '/icons/token.svg'}
                    alt={`${props?.base_token?.symbol || 'Token'} logo`}
                    className="h-7 w-7 rounded-full ring-2 ring-white"
                  />
                </div>
              </div>

              {/* 第二行：美元等值 + 可用余额/Max（右侧顶部对齐） */}
              <div className="flex items-start justify-between w-full">
                <div className="text-xs text-[#A5ADC6]">{`$${usdValue}`}</div>
                <div className="text-right text-xs text-[#A5ADC6] whitespace-nowrap">
                  Available: <span className="text-[#131E40]">{formatNumber(sharesBalance)}</span>
                  <button
                    type="button"
                    className="ml-2 text-[#6E75F9] font-medium"
                    onClick={() => handleSetMax(true)}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>

            {/* 主操作按钮 */}
            <ActionButton
              disabled={btnDisabled}
              onClick={handleWithdraw}
              isPending={isPending}
              error={errorData}
              className="mt-6"
            >
              {`Withdraw ${props?.base_token?.symbol || 'Token'}`}
            </ActionButton>
          </div>

          {/* 复用的持仓摘要卡片 */}
          <div className="mt-4">
            <PositionSummaryCard market={market} user={userItem} />
          </div>
        </div>
      </SideDrawerLayout>
    </>
  );
}
