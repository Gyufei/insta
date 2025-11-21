import { useAppKitNetwork } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';
import { useAccount } from 'wagmi';



import { useMemo } from 'react';



import { NetworkConfigs } from '@/config/network-config';
import { IToken } from '@/config/tokens';



import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/new/action-button';
import { PositionSummaryCard } from '@/components/side-drawer/common/position-summary-card';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';



import { useRPCTokenBalance } from '@/lib/data/balance/use-rpc-token-balance';
import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import { useCurvanceDeposit } from '@/lib/data/use-curvance-deposit';
import { useCurvanceMarketUserInfo } from '@/lib/data/use-curvance-market-user-info';
import { useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { formatNumber, parseBig } from '@/lib/utils/number';





type LendingSupplyProps = {
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
};

export function LendingSupply() {
  const { chainId } = useAppKitNetwork();
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingSupplyProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.base_token?.address || '0x0',
      name: props?.base_token?.name || 'Token',
      symbol: props?.base_token?.symbol || 'TOKEN',
      logo: props?.base_token?.logo || '/icons/token.svg',
      decimals: props?.base_token?.decimals || 18,
    }),
    [props?.base_token]
  );

  const { address } = useAccount();
  const { data: selectedAccount } = useSelectedAccount();
  const dsaAddress = selectedAccount?.sandbox_account || address || '';
  const { balance: dsaBalance, isBalancePending: isDSABalancePending } = useAddressBalance(
    dsaAddress,
    token.address,
    token.decimals,
    !!dsaAddress
  );
  const { balance, refetch: refetchWalletBalance } = useRPCTokenBalance(
    NetworkConfigs.monadTestnet.id,
    address || '',
    token.address,
    [token],
    true
  );

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);
  const { handleBack: _handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: deposit, isPending } = useCurvanceDeposit();
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

  const handleDeposit = () => {
    const ok = ensureMonadNetworkSync({
      chainId,
      toastMessage: 'Switch to Monad Testnet to supply.',
    });
    if (!ok) return;

    // ===== SECURITY: Input validation =====
    if (!inputValue || btnDisabled || isPending) return;

    // SECURITY: Validate required addresses
    if (!token.address || token.address === '0x0') {
      console.error('[SUPPLY] Invalid base_token address');
      return;
    }
    if (!props?.base_c_token?.address) {
      console.error('[SUPPLY] Missing base_c_token address');
      return;
    }
    if (!props?.market_address) {
      console.error('[SUPPLY] Missing market_address');
      return;
    }

    // SECURITY: Parse and validate amount
    const amount = parseBig(inputValue, token.decimals);
    if (!amount || amount.toString() === '0' || amount.toString() === 'NaN') {
      console.error('[SUPPLY] Invalid deposit amount', inputValue);
      return;
    }

    // SECURITY: Validate numeric input
    const inputNum = parseFloat(inputValue);
    if (!Number.isFinite(inputNum) || inputNum <= 0) {
      console.error('[SUPPLY] Invalid numeric input', inputValue);
      return;
    }

    // SECURITY: Validate against wallet balance
    const walletAmount = parseFloat(balance || '0');
    if (!Number.isFinite(walletAmount) || inputNum > walletAmount) {
      console.error('[SUPPLY] Insufficient wallet balance', {
        requested: inputNum,
        available: walletAmount,
      });
      return;
    }

    const payload = {
      base_token: token.address,
      base_c_token: props.base_c_token.address,
      deposit_amount: amount.toString(),
    };

    Sentry.addBreadcrumb({
      category: 'action',
      message: 'click_lending_supply',
      level: 'info',
      data: {
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    trackEvent('LENDING_SUPPLY', {
      event_category: 'protocol_interaction',
      event_label: 'lending_supply_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'supply',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    try {
      deposit(payload, {
        onSuccess: () => {
          Sentry.addBreadcrumb({
            category: 'action',
            message: 'lending_supply_success',
            level: 'info',
            data: {
              token: token.symbol,
              amount: inputValue,
              market: props?.market_address,
            },
          });

          trackEvent('LENDING_SUPPLY', {
            event_category: 'protocol_interaction',
            event_label: 'lending_supply_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'lending',
              action: 'supply_success',
              token: token.symbol,
              amount: inputValue,
            },
          });
          // 保持抽屉打开：清空输入并刷新余额/持仓
          handleInput('');
          try {
            refetchWalletBalance?.();
          } catch {}
          try {
            userInfoQuery.refetch?.();
          } catch {}
        },
        onError: (error: Error) => {
          Sentry.captureException(error, {
            tags: {
              page: 'lending',
              protocol: 'curvance',
              error_type: 'supply',
            },
            extra: {
              market: props?.market_address,
              token: token.symbol,
              amount: inputValue,
            },
          });

          trackEvent('LENDING_SUPPLY', {
            event_category: 'protocol_interaction',
            event_label: 'lending_supply_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'lending',
              action: 'supply_failed',
              token: token.symbol,
              amount: inputValue,
            },
          });
        },
      });
    } catch (err) {
      Sentry.captureException(err, {
        tags: {
          page: 'lending',
          protocol: 'curvance',
          error_type: 'supply_exception',
        },
        extra: payload,
      });
      throw err;
    }
  };

  return (
    <>
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          {/* Mobile back header */}
          <div className="md:hidden">
            <SideDrawerBackHeader title={`Supply ${token.symbol}`} onClick={_handleBack} />
          </div>
          {/* 主卡片：标题 + 大号数字输入 + 余额/Max + 操作按钮 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white p-5 shadow-sm dark:bg-secondary">
            <div className="text-base font-medium text-[#131E40]">{`Supply ${token.symbol}`}</div>

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

              {/* 第二行：美元等值 + 可用余额/Max（右侧顶部对齐） */}
              <div className="flex items-start justify-between w-full">
                <div className="text-sm text-[#A5ADC6]">{`$${usdValue}`}</div>
                <div className="text-right text-sm text-[#A5ADC6] whitespace-nowrap">
                  Available: <span className="text-[#131E40]">{isDSABalancePending ? '...' : formatNumber(dsaBalance)}</span>
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

            <div className="mt-4 border-t border-[#EBEBEB] dark:border-[#323C52]" />

            {/* 主操作按钮 */}
            <ActionButton
              disabled={btnDisabled}
              onClick={handleDeposit}
              isPending={isPending}
              error={errorData}
              className="mt-0"
            >
              {`Supply ${token.symbol}`}
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