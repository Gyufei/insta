'use client';

import { useAccount } from 'wagmi';



import { useMemo } from 'react';



import { IToken } from '@/config/tokens';



import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/new/action-button';
import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';



import { useCurvanceBorrow } from '@/lib/data/use-curvance-borrow';
import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { formatBig, formatNumber, parseBig } from '@/lib/utils/number';





type LendingBorrowProps = {
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
  user_max_borrow_display_amount?: string; // optional constraint provided by page
};

export function LendingBorrow() {
  const { chainId: walletChainId } = useAccount();
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingBorrowProps;

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

  const { handleBack: _handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: borrow, isPending } = useCurvanceBorrow();
  const { trackEvent } = useEnhancedAnalytics();

  // 获取市场价格（Borrow 对应选定的借款代币）
  const marketsQuery = useCurvanceMarkets(true);
  const market = useMemo(() => {
    const list = marketsQuery.data || [];
    return list.find(
      (m) => String(m.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [marketsQuery.data, props?.market_address]);
  const tokenPrice = useMemo(() => {
    const isToken1 =
      String(token.address).toLowerCase() === String(market?.token1?.address).toLowerCase();
    const priceStr = isToken1 ? market?.token1?.price : market?.token0?.price;
    if (!priceStr) return 0;
    const p = parseFloat(priceStr);
    if (!Number.isFinite(p) || p < 0) {
      console.warn('[BORROW] Invalid token price detected', priceStr);
      return 0;
    }
    return p;
  }, [
    token.address,
    market?.token0?.address,
    market?.token1?.address,
    market?.token0?.price,
    market?.token1?.price,
  ]);

  // 基于 /curvance/markets 的所选借款代币 total_debt 估算池子可借规模（单位：token）
  const poolBorrowableTokens = useMemo(() => {
    const isToken1 =
      String(token.address).toLowerCase() === String(market?.token1?.address).toLowerCase();
    const t = isToken1 ? market?.token1 : market?.token0;
    const debtTokens = parseFloat(t?.total_debt || '0');
    if (Number.isFinite(debtTokens) && debtTokens > 0) return debtTokens;

    // Fallback: calculate from USD value
    const debtUSD = parseFloat(t?.total_debt_in_usd || '0');
    const price = parseFloat(t?.price || '0');

    if (!Number.isFinite(debtUSD) || debtUSD <= 0) return 0;
    if (!Number.isFinite(price) || price <= 0) return 0;

    const tokens = debtUSD / price;
    return Number.isFinite(tokens) && tokens > 0 ? tokens : 0;
  }, [token.address, market?.token0, market?.token1]);

  // 用户在该市场的摘要数据（/curvance/positions）
  const userInfoQuery = useCurvanceMarketUserInfo(true);
  const userItem = useMemo(() => {
    const list = userInfoQuery.data || [];
    return list.find(
      (u) => String(u.market_address).toLowerCase() === String(props?.market_address).toLowerCase()
    );
  }, [userInfoQuery.data, props?.market_address]);

  // Remaining Credit 采用 total_max_debt_in_usd（18位精度）/ price 得到代币数量
  const borrowLimit = useMemo(() => {
    const maxDebtUSD = parseFloat(
      formatBig(
        String(
          Number(userItem?.total_max_debt_in_usd || 0) - Number(userItem?.total_debt_in_usd || 0) ||
            0
        ),
        18
      )
    );
    const tokens = tokenPrice > 0 ? maxDebtUSD / tokenPrice : 0;
    if (Number.isFinite(tokens) && tokens > 0) return String(tokens);
    // 回退到 props 提供的约束
    return props?.user_max_borrow_display_amount || '0';
  }, [userItem?.total_max_debt_in_usd, tokenPrice, props?.user_max_borrow_display_amount]);

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(borrowLimit);
  const {
    isMax: _isMax,
    handleSetMax,
    handleInput,
  } = useSetMax(inputValue, borrowLimit, handleInputChange);

  const usdValue = useMemo(() => {
    const amount = parseFloat(inputValue || '0');
    const usd = amount * (tokenPrice || 0);
    if (!Number.isFinite(usd)) return '0.00';
    return usd.toFixed(4);
  }, [inputValue, tokenPrice]);

  // 首次借款且输入金额的美元等值低于 10 美元时提示
  const isFirstBorrow = useMemo(() => {
    const isToken1 =
      String(token.address).toLowerCase() === String(market?.token1?.address).toLowerCase();
    const debt = parseFloat(
      isToken1
        ? userItem?.token1?.user_debt_display_balance || '0'
        : userItem?.token0?.user_debt_display_balance || '0'
    );
    return Number.isFinite(debt) ? debt <= 0 : false;
  }, [
    token.address,
    market?.token1?.address,
    userItem?.token1?.user_debt_display_balance,
    userItem?.token0?.user_debt_display_balance,
  ]);
  const isBelowMinFirstBorrow = useMemo(() => {
    const usd = parseFloat(usdValue || '0');
    return isFirstBorrow && usd > 0 && usd < 10;
  }, [isFirstBorrow, usdValue]);

  const handleBorrow = () => {
    const ok = ensureMonadNetworkSync({
      chainId: walletChainId,
    });
    if (!ok) return;

    // ===== SECURITY: Input validation =====
    if (!inputValue || btnDisabled || isPending) return;

    // SECURITY: Validate required addresses to prevent contract call failures
    if (!token.address || token.address === '0x0') {
      console.error('[BORROW] Invalid borrowable_token address');
      return;
    }
    if (!props?.borrowable_c_token?.address) {
      console.error('[BORROW] Missing borrowable_c_token address');
      return;
    }
    if (!props?.market_address) {
      console.error('[BORROW] Missing market_address');
      return;
    }

    // SECURITY: Parse and validate amount
    const amount = parseBig(inputValue, token.decimals);
    if (!amount || amount.toString() === '0' || amount.toString() === 'NaN') {
      console.error('[BORROW] Invalid borrow amount', inputValue);
      return;
    }

    // SECURITY: Validate numeric inputs are finite
    const inputNum = parseFloat(inputValue);
    if (!Number.isFinite(inputNum) || inputNum <= 0) {
      console.error('[BORROW] Invalid numeric input', inputValue);
      return;
    }

    // SECURITY: Check pool liquidity before submitting
    const poolAvailable = poolBorrowableTokens || 0;
    if (inputNum > poolAvailable) {
      console.warn('[BORROW] Insufficient pool liquidity', {
        requested: inputNum,
        available: poolAvailable,
      });
      // Allow to proceed - backend/contract will reject, but warn user
    }

    // SECURITY: Validate first borrow minimum ($10 USD equivalent)
    if (isBelowMinFirstBorrow) {
      console.warn('[BORROW] First borrow below $10 minimum', {
        usdValue,
        isFirstBorrow,
      });
      // Allow to proceed - show warning but don't block
    }

    const payload = {
      borrowable_token: token.address,
      borrowable_c_token: props.borrowable_c_token.address,
      borrow_amount: amount.toString(),
    };

    trackEvent('LENDING_BORROW', {
      event_category: 'protocol_interaction',
      event_label: 'lending_borrow_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'borrow',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    borrow(payload, {
      onSuccess: () => {
        trackEvent('LENDING_BORROW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_borrow_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'borrow_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        // 保持抽屉打开：清空输入并刷新持仓可借额度
        handleInput('');
        try {
          userInfoQuery.refetch?.();
        } catch {}
      },
      onError: (error: Error) => {
        trackEvent('LENDING_BORROW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_borrow_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'borrow_failed',
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
            <SideDrawerBackHeader title={`Borrow ${token.symbol}`} onClick={_handleBack} />
          </div>
          {/* 主卡片：标题 + 大号数字输入 + 余额/Max + 操作按钮 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white p-5 shadow-sm dark:bg-secondary">
            <div className="text-base font-medium text-[#131E40]">{`Borrow ${token.symbol}`}</div>

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

              {/* 第二行：美元等值 + 可借额度/Max（右侧顶部对齐） */}
              <div className="flex items-start justify-between w-full">
                <div className="text-sm text-[#A5ADC6]">{`$${usdValue}`}</div>
                <div className="text-right text-sm text-[#A5ADC6] whitespace-nowrap w-full">
                  <div className="flex items-start justify-end w-full">
                    <span>
                      Available: <span className="text-[#131E40]">{formatNumber(borrowLimit)}</span>
                    </span>
                    <button
                      type="button"
                      className="ml-2 text-[#6E75F9] font-medium"
                      onClick={() => handleSetMax(true)}
                      aria-label="Set max borrow amount"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-[#EBEBEB] dark:border-[#323C52]" />

            {/* 主操作按钮 */}
            <ActionButton
              disabled={btnDisabled}
              onClick={handleBorrow}
              isPending={isPending}
              error={errorData}
              className="mt-0"
              height="sm"
            >
              {`Borrow ${token.symbol}`}
            </ActionButton>

            {isBelowMinFirstBorrow && (
              <div className="mt-2 rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2">
                <div className="text-xs font-medium text-red-700 dark:text-red-300">
                  First borrow must exceed $10
                </div>
              </div>
            )}

            {/* 池子里不足借用的提示：基于 token1.total_debt 估算的池子可借规模，与用户输入比较 */}
            {(() => {
              const inputAmt = parseFloat(inputValue || '0');
              const insufficient =
                Number.isFinite(inputAmt) && inputAmt > 0 && inputAmt > (poolBorrowableTokens || 0);
              if (!insufficient) return null;
              return (
                <div className="mt-2 rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2">
                  <div className="text-xs font-medium text-red-700 dark:text-red-300">
                    <ul className="list-disc pl-4">
                      <li>
                        {`Insufficient pool liquidity: current cap ~ ${formatNumber(String(poolBorrowableTokens || 0))} ${token.symbol}`}
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
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