import { useAccount } from 'wagmi';



import { useMemo } from 'react';



import { NetworkConfigs } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/new/action-button';
import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useRPCTokenBalance } from '@/lib/data/balance/use-rpc-token-balance';
import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useCurvanceRepay } from '@/lib/data/use-curvance-repay';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { formatNumber, parseBig } from '@/lib/utils/number';

type LendingRepayProps = {
  market_address: string;
  borrowable_token: {
    address: string;
    name: string;
    symbol: string;
    logo?: string;
    decimals: number;
  };
  borrowable_c_token?: {
    address: string;
    decimals?: number;
  };
  user_debt_display_balance?: string; // display debt balance (max repay)
};

export function LendingRepay() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingRepayProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.borrowable_token?.address || '0x0',
      name: props?.borrowable_token?.name || 'Token',
      symbol: props?.borrowable_token?.symbol || 'TOKEN',
      logo: props?.borrowable_token?.logo || '/icons/token.svg',
      decimals: props?.borrowable_token?.decimals || 18,
    }),
    [props?.borrowable_token]
  );

  const { address } = useAccount();
  const { balance: walletBalance, isPending: isWalletPending } = useRPCTokenBalance(
    NetworkConfigs.monadTestnet.id,
    address || '',
    token.address,
    [token],
    true
  );

  const debtBalance = props?.user_debt_display_balance || '0';

  // Use the smaller of wallet vs debt as the input constraint
  const inputConstraintBalance = useMemo(() => {
    const w = parseFloat(walletBalance || '0');
    const d = parseFloat(debtBalance || '0');
    return String(Math.min(w || 0, d || 0));
  }, [walletBalance, debtBalance]);

  const { inputValue, btnDisabled, errorData, handleInputChange } =
    useTokenInput(inputConstraintBalance);
  const {
    isMax: _isMax,
    handleSetMax,
    handleInput,
  } = useSetMax(inputValue, inputConstraintBalance, handleInputChange);
  const { handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: repay, isPending } = useCurvanceRepay();
  const { trackEvent } = useEnhancedAnalytics();

  // 获取市场价格以显示美元等值（Repay 对应 token1）
  const marketsQuery = useCurvanceMarkets(true);
  const market = useMemo(() => {
    const list = marketsQuery.data || [];
    return list.find(
      (m) => String(m.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [marketsQuery.data, props?.market_address]);
  const tokenPrice = useMemo(() => {
    const p = parseFloat(market?.token1?.price || '0');
    return Number.isFinite(p) ? p : 0;
  }, [market?.token1?.price]);
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
    return list.find(
      (u) => String(u.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [userInfoQuery.data, props?.market_address]);

  const handleRepay = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token.decimals);

    const payload = {
      borrowable_token: token.address,
      borrowable_c_token: props?.borrowable_c_token?.address || '',
      repay_amount: amount.toString(),
    };

    trackEvent('LENDING_REPAY', {
      event_category: 'protocol_interaction',
      event_label: 'lending_repay_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'repay',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    repay(payload, {
      onSuccess: () => {
        trackEvent('LENDING_REPAY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_repay_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'repay_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_REPAY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_repay_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'repay_failed',
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
            <div className="text-sm font-medium text-[#131E40]">{`Repay ${token.symbol}`}</div>

            <div className="mt-3 flex flex-col gap-3">
              {/* 第一行：输入框 + Token 图标 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <NumberInput
                    className="!text-[32px] !font-semibold bg-transparent border-none p-0 shadow-none focus-visible:ring-0 w-full text-[#131E40]"
                    placeholder="0.0000"
                    value={inputValue}
                    onChange={handleInput}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={token.logo || '/icons/token.svg'}
                    alt={`${token.symbol} logo`}
                    className="h-7 w-7 rounded-full ring-2 ring-white"
                  />
                </div>
              </div>

              {/* 第二行：美元等值 + 可用/Max（右侧顶部对齐） */}
              <div className="flex items-start justify-between w-full">
                <div className="text-xs text-[#A5ADC6]">{`$${usdValue}`}</div>
                <div className="text-right text-xs text-[#A5ADC6] whitespace-nowrap w-full">
                  <div className="flex items-start justify-end w-full">
                    <span>
                      Available:{' '}
                      <span className="text-[#131E40]">
                        {isWalletPending ? '...' : formatNumber(inputConstraintBalance)}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="ml-2 text-[#6E75F9] font-medium"
                      onClick={() => handleSetMax(true)}
                      aria-label="Set max repay amount"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 主操作按钮 */}
            <ActionButton
              disabled={btnDisabled}
              onClick={handleRepay}
              isPending={isPending}
              error={errorData}
              className="mt-6"
            >
              {`Repay ${token.symbol}`}
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