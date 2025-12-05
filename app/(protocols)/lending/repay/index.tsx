import { useAccount } from 'wagmi';

import { useEffect, useMemo } from 'react';

import { IToken } from '@/config/tokens';

import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/new/action-button';
import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useCurvanceRepay } from '@/lib/data/use-curvance-repay';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
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
  const { chainId: walletChainId } = useAccount();
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
  const { data: selectedAccount } = useSelectedAccount();
  const dsaAddress = selectedAccount?.sandbox_account || address || '';
  const {
    balance: dsaBalance,
    isBalancePending: isDSABalancePending,
    refetch: refetchDSABalance,
  } = useAddressBalance(dsaAddress, token.address, token.decimals, !!dsaAddress);

  const userInfoQuery = useCurvanceMarketUserInfo(true);
  const userItem = useMemo(() => {
    const list = userInfoQuery.data || [];
    return list.find(
      (u) => String(u.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [userInfoQuery.data, props?.market_address]);
  // 获取市场信息以供后续价格/余额等计算
  const marketsQuery = useCurvanceMarkets(true);
  const market = useMemo(() => {
    const list = marketsQuery.data || [];
    return list.find(
      (m) => String(m.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [marketsQuery.data, props?.market_address]);
  const debtBalance = useMemo(() => {
    const isToken1 =
      String(token.address).toLowerCase() === String(market?.token1?.address).toLowerCase();
    const userDebt = isToken1
      ? userItem?.token1?.user_debt_display_balance
      : userItem?.token0?.user_debt_display_balance;
    return userDebt || props?.user_debt_display_balance || '0';
  }, [
    token.address,
    market?.token1?.address,
    userItem?.token1?.user_debt_display_balance,
    userItem?.token0?.user_debt_display_balance,
    props?.user_debt_display_balance,
  ]);

  // Use the smaller of wallet vs debt as the input constraint
  const inputConstraintBalance = useMemo(() => {
    // SECURITY: Safe balance comparison with NaN handling
    const w = parseFloat(dsaBalance || '0');
    const d = parseFloat(debtBalance || '0');
    return String(Math.min(w || 0, d || 0));
  }, [dsaBalance, debtBalance]);

  const { inputValue, btnDisabled, errorData, setErrorData, handleInputChange } =
    useTokenInput(inputConstraintBalance);
  const {
    isMax: _isMax,
    handleSetMax,
    handleInput,
  } = useSetMax(inputValue, inputConstraintBalance, handleInputChange);
  const { handleBack: _handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: repay, isPending } = useCurvanceRepay();
  const { trackEvent } = useEnhancedAnalytics();

  // 获取市场价格以显示美元等值
  const tokenPrice = useMemo(() => {
    const isToken1 =
      String(token.address).toLowerCase() === String(market?.token1?.address).toLowerCase();
    const priceStr = isToken1 ? market?.token1?.price : market?.token0?.price;
    const p = parseFloat(priceStr || '0');
    return Number.isFinite(p) ? p : 0;
  }, [
    token.address,
    market?.token0?.address,
    market?.token1?.address,
    market?.token0?.price,
    market?.token1?.price,
  ]);
  const usdValue = useMemo(() => {
    const amount = parseFloat(inputValue || '0');
    const usd = amount * (tokenPrice || 0);
    if (!Number.isFinite(usd)) return '0.00';
    return usd.toFixed(4);
  }, [inputValue, tokenPrice]);

  // 当输入金额与钱包余额几乎相等时，提示需预留该币的手续费以避免还款接口报错
  const showFeeWarning = useMemo(() => {
    const w = parseFloat(dsaBalance || '0');
    const v = parseFloat(inputValue || '0');
    if (!Number.isFinite(w) || !Number.isFinite(v)) return false;
    if (v <= 0) return false;
    // 允许极小浮动误差（1e-9 对齐不同浏览器浮点差异）
    const epsilon = Math.max(1e-9, w * 1e-12);
    return Math.abs(v - w) <= epsilon;
  }, [dsaBalance, inputValue]);

  // 将提示透传到按钮下方的 ErrorMessage，以不改变按钮可用性
  // 使用 useEffect 避免在渲染期间 setState 导致循环渲染

  useEffect(() => {
    if (showFeeWarning) {
      // 偶现一次，暂时不提示
      // setErrorData({
      //   showError: true,
      //   errorMessage: `Please leave a small amount of ${token.symbol} for gas fees. If your wallet balance equals the repayment amount, the transaction may fail.`,
      // });
    } else if (errorData.showError && errorData.errorMessage.includes('gas fees')) {
      setErrorData({ showError: false, errorMessage: '' });
    }
  }, [showFeeWarning]);

  // 用户在该市场的摘要数据（已在上方声明 userInfoQuery 与 userItem）

  const handleRepay = () => {
    const ok = ensureMonadNetworkSync({
      chainId: walletChainId,
    });
    if (!ok) return;

    // ===== SECURITY: Input validation =====
    if (!inputValue || btnDisabled || isPending) return;

    // SECURITY: Validate required addresses
    if (!token.address || token.address === '0x0') {
      console.error('[REPAY] Invalid borrowable_token address');
      return;
    }
    if (!props?.borrowable_c_token?.address) {
      console.error('[REPAY] Missing borrowable_c_token address');
      return;
    }
    if (!props?.market_address) {
      console.error('[REPAY] Missing market_address');
      return;
    }

    // SECURITY: Parse and validate amount
    const amount = parseBig(inputValue, token.decimals);
    if (!amount || amount.toString() === '0' || amount.toString() === 'NaN') {
      console.error('[REPAY] Invalid repay amount', inputValue);
      return;
    }

    // SECURITY: Validate numeric input
    const inputNum = parseFloat(inputValue);
    if (!Number.isFinite(inputNum) || inputNum <= 0) {
      console.error('[REPAY] Invalid numeric input', inputValue);
      return;
    }

    // SECURITY: Double-check against DSA balance
    const dsa = parseFloat(dsaBalance || '0');
    if (!Number.isFinite(dsa) || inputNum > dsa) {
      console.error('[REPAY] Insufficient DSA balance', {
        requested: inputNum,
        available: dsa,
      });
      return;
    }

    // SECURITY: Double-check against debt balance
    const debt = parseFloat(debtBalance || '0');
    if (!Number.isFinite(debt)) {
      console.error('[REPAY] Invalid debt balance', debtBalance);
      return;
    }
    // Note: Allow repaying slightly more than debt to account for accrued interest

    const payload = {
      borrowable_token: token.address,
      borrowable_c_token: props.borrowable_c_token.address,
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
        // 保持抽屉打开：清空输入并刷新钱包和持仓数据
        handleInput('');
        try {
          refetchDSABalance?.();
        } catch {}
        try {
          userInfoQuery.refetch?.();
        } catch {}
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
          {/* Mobile back header */}
          <div className="md:hidden">
            <SideDrawerBackHeader title={`Repay ${token.symbol}`} onClick={_handleBack} />
          </div>
          {/* 主卡片：标题 + 大号数字输入 + 可用/Max + 操作按钮 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white p-5 shadow-sm dark:bg-secondary">
            <div className="text-base font-medium text-[#131E40]">{`Repay ${token.symbol}`}</div>

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
                <div className="text-sm text-[#A5ADC6]">{`$${usdValue}`}</div>
                <div className="text-right text-sm text-[#A5ADC6] whitespace-nowrap w-full">
                  <div className="flex items-start justify-end w-full">
                    <span>
                      Available:{' '}
                      <span className="text-[#131E40]">
                        {isDSABalancePending ? '...' : formatNumber(inputConstraintBalance)}
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
            <div className="mt-4 border-t border-[#EBEBEB] dark:border-[#323C52]" />
            <ActionButton
              disabled={btnDisabled}
              onClick={handleRepay}
              isPending={isPending}
              error={errorData}
              className="mt-0"
            >
              {`Repay ${token.symbol}`}
            </ActionButton>
          </div>

          {/* 复用的持仓摘要卡片 */}
          <div className="mt-4">
            {market && (
              <PositionSummaryCard
                market={market}
                user={userItem}
                borrowTokenIndex={
                  String(token.address).toLowerCase() ===
                  String(market?.token1?.address).toLowerCase()
                    ? 1
                    : 0
                }
              />
            )}
          </div>
        </div>
      </SideDrawerLayout>
    </>
  );
}
