'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';
import { CircleX, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  UniversalRouterAddressPermit,
  replaceNativeAddressUseBackend,
} from '@/config/network-config';
import { IToken, MonUSD } from '@/config/tokens';
import { WMONAD_TOKEN } from '@/config/tokens';

import { TokenDropSelector } from '@/components/new/token-drop-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useAccounts } from '@/lib/data/account-address/use-account';
import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
// removed unused isProduction import after network guard refactor
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import { useDexDSASwap } from '@/lib/data/use-dex-dsa-swap';
import { useDexEOASwap } from '@/lib/data/use-dex-eoa-swap';
import { IDexQuoteResponse, useDexQuote } from '@/lib/data/use-dex-quote';
import { useCheckMonadAllowance } from '@/lib/data/use-monad-allowance';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useAccountStore } from '@/lib/state/account';
import { eventBus } from '@/lib/state/eventBus';
import { cn, isSameAddress } from '@/lib/utils';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { formatBig, parseBig } from '@/lib/utils/number';

import { DexProjectId } from './dex-config';

// 根据项目选择映射后端路由名
function mapRouterName(project: DexProjectId) {
  switch (project) {
    case 'uniswap':
      return 'Uniswap V3';
    case 'ambient':
      return 'Ambient Finance';
    default:
      return 'Uniswap V3';
  }
}

export function TradeContent({ selectedProject }: { selectedProject: DexProjectId }) {
  const { address: wallet } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { data: accounts } = useAccounts();
  const { currentAccountType, setCurrentAccountType, setCurrentAccountAddress } = useAccountStore();
  const { chainId } = useAppKitNetwork();
  const { trackEvent: trackEnhancedEvent, trackTrade: trackEnhancedTrade } = useEnhancedAnalytics();
  const { data: oddsUserInfo } = useOddsUserInfo();

  const [sellToken, setSellToken] = useState<IToken | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<IToken | undefined>(undefined);
  const [sellValue, setSellValue] = useState('');
  const [buyValue, setBuyValue] = useState('');
  const [selectedPayAccount, setSelectedPayAccount] = useState<string | null>(null);
  const [receiveToCustom, setReceiveToCustom] = useState(false);
  const [receiveCustomAddress, setReceiveCustomAddress] = useState('');

  const [liquidityError, setLiquidityError] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const [rotateTimes, setRotateTimes] = useState(0);

  const {
    balance: fromBalance,
    isBalancePending: isFromBalancePending,
    refetch: refetchFromBalance,
  } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    sellToken?.address || ''
  );

  const {
    balance: toBalance,
    isBalancePending: isToBalancePending,
    refetch: refetchToBalance,
  } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    buyToken?.address || ''
  );

  // 分阶段余额刷新，缓解后端索引延迟导致的旧数据
  const refreshTimersRef = useRef<number[]>([]);
  const scheduleBalanceRefresh = (delays: number[] = [1500]) => {
    // 清理先前的定时器，避免累积
    refreshTimersRef.current.forEach((id) => clearTimeout(id));
    refreshTimersRef.current = [];

    delays.forEach((delay) => {
      const id = window.setTimeout(() => {
        // 数据新鲜时 UI 会自动更新

        refetchFromBalance?.();

        refetchToBalance?.();
      }, delay);
      refreshTimersRef.current.push(id);
    });
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      refreshTimersRef.current.forEach((id) => clearTimeout(id));
      refreshTimersRef.current = [];
    };
  }, []);

  const _isBuyMonUsd = isSameAddress(buyToken?.address || '', MonUSD.address);

  // 判断是否为 MON <=> WMON 代币对
  const isNativeToken = (t?: IToken) =>
    isSameAddress(t?.address || '', DEFAULT_NATIVE_ADDRESS) ||
    isSameAddress(t?.address || '', BACKEND_NATIVE_ADDRESS);
  const isWMonToken = (t?: IToken) => isSameAddress(t?.address || '', WMONAD_TOKEN.address);
  const isMonWmonPair = useMemo(
    () =>
      (isNativeToken(sellToken) && isWMonToken(buyToken)) ||
      (isNativeToken(buyToken) && isWMonToken(sellToken)),
    [sellToken, buyToken]
  );

  // Disable actions when the entered sell amount exceeds available balance
  const isInsufficientBalance = useMemo(() => {
    if (!sellValue) return false;
    return Number(sellValue) > Number(fromBalance);
  }, [sellValue, fromBalance]);

  const quoteParams = useMemo(() => {
    return sellToken && buyToken && sellValue && Number(sellValue) > 0
      ? {
          token_in: replaceNativeAddressUseBackend(sellToken.address),
          token_out: replaceNativeAddressUseBackend(buyToken.address),
          amount_in: sellValue,
          amount_in_decimals: sellToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
          amount_out_decimals: buyToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
          swap_router_name: mapRouterName(selectedProject),
        }
      : undefined;
  }, [sellToken, buyToken, sellValue, selectedProject]);

  const {
    data: quoteDataRes,
    isLoading: isQuoteLoading,
    error: quoteErrorRes,
  } = useDexQuote(quoteParams);

  const quoteData: IDexQuoteResponse | null = useMemo(() => {
    if (!quoteDataRes) return null;

    if ('status' in quoteDataRes && !quoteDataRes.status) {
      return null;
    }
    return quoteDataRes;
  }, [quoteDataRes]);

  const quoteError = useMemo((): unknown | IDexQuoteResponse | null => {
    if (!quoteDataRes) return null;

    if ('status' in quoteDataRes && !quoteDataRes.status) {
      return quoteDataRes;
    }
    return quoteErrorRes;
  }, [quoteDataRes, quoteErrorRes]);

  const {
    allowance: fromAllowance,
    isLoading: isFromAllowanceLoading,
    handleApprove: handleFromApprove,
    isApproving: isFromApproving,
  } = useCheckMonadAllowance(
    sellToken?.address || '',
    quoteData?.dexRouter || UniversalRouterAddressPermit
  );

  const { mutate: eoaSwap, isPending: isEOASwapPending } = useDexEOASwap();
  const { mutate: dsaSwap, isPending: isDSASwapPending } = useDexDSASwap();
  const isSwapPending = currentAccountType === 'EOA' ? isEOASwapPending : isDSASwapPending;

  const shouldApprove = useMemo(() => {
    if (!wallet) return false;

    if (currentAccountType === 'DSA') {
      return false;
    }

    if (!sellToken) return false;

    if (fromAllowance === Infinity || fromAllowance == null) return false;

    return Number(fromAllowance) < Number(sellValue);
  }, [fromAllowance, sellValue, sellToken, currentAccountType, wallet]);

  // Approve 后立即切换到 Swap 的覆盖状态（不等待额度刷新）
  const [overrideShouldApprove, setOverrideShouldApprove] = useState(false);
  useEffect(() => {
    // 输入或账户变化时重置覆盖
    setOverrideShouldApprove(false);
  }, [sellToken, sellValue, currentAccountType]);
  const shouldApproveUI = useMemo(
    () => shouldApprove && !overrideShouldApprove,
    [shouldApprove, overrideShouldApprove]
  );

  useEffect(() => {
    // initialize selected pay account based on current account type
    const initAccount =
      currentAccountType === 'EOA' ? wallet || null : accountInfo?.sandbox_account || null;
    setSelectedPayAccount(initAccount);
  }, [currentAccountType, wallet, accountInfo?.sandbox_account]);

  const accountsOptions = useMemo(() => {
    const options: { label: string; value: string; wallet_type?: 'EOA' | 'DSA' }[] = [];
    for (const account of accounts || []) {
      if (account.sandbox_account) {
        options.push({
          label: account.sandbox_account,
          value: account.sandbox_account,
          wallet_type: 'DSA',
        });
      }
    }
    if (wallet) {
      options.push({ label: wallet, value: wallet, wallet_type: 'EOA' });
    }
    return options;
  }, [accounts, wallet]);

  const handlePayAccountChange = (value: string) => {
    const isEOA = wallet && value === wallet;
    if (isEOA) {
      setCurrentAccountType('EOA');
      setSelectedPayAccount(wallet || null);
    } else {
      setCurrentAccountType('DSA');
      setCurrentAccountAddress(value);
      setSelectedPayAccount(value);
    }
  };

  // 从新接口响应中提取输出的 wei 和路径
  const quoteOutWei = useMemo(() => {
    return quoteData?.amountOutWei;
  }, [quoteData]);

  const quotePath = useMemo(() => {
    return quoteData?.path ?? [];
  }, [quoteData]);

  useEffect(() => {
    if (quoteOutWei && buyToken) {
      // 使用 formatBig 支持十进制与十六进制（0x）字符串
      setBuyValue(formatBig(quoteOutWei, buyToken?.decimals || DEFAULT_TOKEN_DECIMALS));
    }
  }, [quoteOutWei, buyToken?.decimals, buyToken]);

  // 当卖出数量为 0 或空时，将买入数量重置为 0，避免保留旧的报价输出
  useEffect(() => {
    if (!sellValue || Number(sellValue) === 0) {
      setBuyValue('0.00');
    }
  }, [sellValue]);

  function extractMessage(x: unknown): string | null {
    if (typeof x !== 'object' || x === null) return null;
    const m = (x as Record<string, unknown>).message;
    return typeof m === 'string' ? m : null;
  }

  useEffect(() => {
    if (quoteError) {
      setBuyValue('');
      const msg = extractMessage(quoteError);
      if (!msg) return;

      if (msg.includes(`Cannot read properties of undefined (reading 'quote')`)) {
        const errorMsg = 'Insufficient liquidity, please try again later';
        setLiquidityError({
          showError: true,
          errorMessage: errorMsg,
        });
      } else {
        if (msg.includes('token pair')) {
          // Display unsupported token pair error inline and via toast
          setLiquidityError({
            showError: true,
            errorMessage: msg,
          });
          // toast.warning(msg);
        } else {
          toast.error(msg);
        }
      }

      // Report quote related errors to Sentry with context
      try {
        Sentry.captureMessage('DEX Quote Error', {
          level: 'warning',
          tags: {
            page: 'dex',
            dex_project: selectedProject,
            error_type: 'quote',
          },
          extra: {
            message: msg,
            sell_token: sellToken?.symbol,
            sell_address: sellToken?.address,
            buy_token: buyToken?.symbol,
            buy_address: buyToken?.address,
            sell_value: sellValue,
            chain_id: chainId,
            selected_project: selectedProject,
          },
        });
      } catch {}
    }

    if (!quoteError) {
      setLiquidityError({
        showError: false,
        errorMessage: '',
      });
    }
  }, [quoteError]);

  const [init, setInit] = useState(false);
  useEffect(() => {
    if (!init) {
      const token = sessionStorage.getItem('token');
      if (token) {
        const t = JSON.parse(token);
        if (isSameAddress(t.address, MonUSD.address)) {
          setBuyToken(t);
        } else {
          setSellToken(t);
        }
        sessionStorage.removeItem('token');
      }
      setInit(true);
    }
  }, [init]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe(
      'trade-token',
      (data: { name: string; props: { token: IToken } }) => {
        if (data.name === 'TradeToken') {
          if (isSameAddress(data.props.token.address, MonUSD.address)) {
            setBuyToken(data.props.token);
          } else {
            setSellToken(data.props.token);
          }
          setInit(true);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // Initialize Sentry user/environment context on mount and when deps change
  useEffect(() => {
    try {
      // User context with custom UID/Alias bound to wallet
      const userId = oddsUserInfo?.user_id || wallet || undefined;
      const userName = oddsUserInfo?.user_name || wallet || undefined;
      if (userId || userName) {
        Sentry.setUser({ id: userId, username: userName });
      } else {
        Sentry.setUser(null);
      }
      Sentry.setTag('wallet', wallet || '');
      if (oddsUserInfo?.user_id) Sentry.setTag('user_id', oddsUserInfo.user_id);
      if (oddsUserInfo?.user_name) Sentry.setTag('user_name', oddsUserInfo.user_name);

      // Tags for quick filtering
      Sentry.setTag('page', 'dex');
      Sentry.setTag('dex_project', selectedProject);
      Sentry.setTag('account_type', currentAccountType);
      if (chainId != null) Sentry.setTag('chain_id', String(chainId));

      // Account context (EOA / DSA addresses)
      Sentry.setContext('account', {
        account_type: currentAccountType,
        eoa_address: wallet || undefined,
        dsa_address: accountInfo?.sandbox_account || undefined,
      });

      // Bind custom UID/Alias context
      Sentry.setContext('user_profile', {
        user_id: oddsUserInfo?.user_id,
        user_name: oddsUserInfo?.user_name,
      });

      // Environment context
      if (typeof window !== 'undefined') {
        Sentry.setContext('environment', {
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          platform: window.navigator.platform,
          screen: {
            width: window.screen?.width,
            height: window.screen?.height,
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer,
          url: window.location.href,
        });
      }
    } catch {}
  }, [
    wallet,
    currentAccountType,
    chainId,
    accountInfo?.sandbox_account,
    oddsUserInfo?.user_id,
    oddsUserInfo?.user_name,
    selectedProject,
  ]);

  // Breadcrumb for wallet changes (connect/disconnect or switch)
  useEffect(() => {
    try {
      Sentry.addBreadcrumb({
        category: 'wallet',
        message: wallet ? 'wallet_connected' : 'wallet_disconnected',
        level: 'info',
        data: {
          wallet: wallet || '',
          account_type: currentAccountType,
          dsa_address: accountInfo?.sandbox_account || '',
          user_id: oddsUserInfo?.user_id || '',
          user_name: oddsUserInfo?.user_name || '',
          dex_project: selectedProject,
        },
      });
    } catch {}
  }, [
    wallet,
    currentAccountType,
    accountInfo?.sandbox_account,
    oddsUserInfo?.user_id,
    oddsUserInfo?.user_name,
    selectedProject,
  ]);

  async function handleSwap() {
    Sentry.addBreadcrumb({
      category: 'action',
      message: 'click_swap',
      level: 'info',
      data: {
        sell_token: sellToken?.symbol,
        buy_token: buyToken?.symbol,
        sell_value: sellValue,
        should_approve: shouldApproveUI,
        dex_project: selectedProject,
      },
    });

    const okNetwork = ensureMonadNetworkSync({
      chainId,
      sentryTags: { page: 'dex', dex_project: selectedProject },
      sentryExtra: { current_chain_id: chainId || undefined },
    });
    if (!okNetwork) return;
    if (shouldApproveUI) {
      trackEnhancedEvent('TOKEN_APPROVE', {
        event_category: 'trading',
        token_symbol: sellToken?.symbol,
        token_address: sellToken?.address,
        include_user_id: true,
        custom_parameters: {
          dex_project: selectedProject,
        },
      });
      Sentry.addBreadcrumb({
        category: 'action',
        message: 'click_approve',
        level: 'info',
        data: {
          token_symbol: sellToken?.symbol,
          token_address: sellToken?.address,
          dex_project: selectedProject,
        },
      });
      await handleFromApprove();
      // 发送 Approve 后，直接展示 Swap 按钮
      setOverrideShouldApprove(true);
      return;
    }

    if (!wallet) {
      toast.error('Please connect your wallet to trade');
      Sentry.captureMessage('DEX Swap blocked: wallet not connected', {
        level: 'info',
        tags: { page: 'dex', dex_project: selectedProject },
      });
      return;
    }

    // SECURITY: Validate required data exists
    if (!quoteData || !sellToken || !buyToken) {
      console.error('[DEX] Swap blocked: missing required data', {
        hasQuote: !!quoteData,
        hasSellToken: !!sellToken,
        hasBuyToken: !!buyToken,
      });
      return;
    }

    // SECURITY: Validate token addresses
    if (!sellToken.address || sellToken.address === '0x0') {
      toast.error('Invalid sell token');
      return;
    }
    if (!buyToken.address || buyToken.address === '0x0') {
      toast.error('Invalid buy token');
      return;
    }

    // SECURITY: Validate sell amount
    if (!sellValue || sellValue === '0' || sellValue === '') {
      console.error('[DEX] Invalid sell amount', sellValue);
      return;
    }

    // SECURITY: Validate numeric values
    const sellNum = parseFloat(sellValue);
    if (!Number.isFinite(sellNum) || sellNum <= 0) {
      console.error('[DEX] Invalid sell value (not finite or <= 0)', sellValue);
      toast.error('Invalid sell amount');
      return;
    }

    // SECURITY: Enhanced balance validation
    const balanceNum = parseFloat(fromBalance || '0');
    if (!Number.isFinite(balanceNum) || balanceNum < 0) {
      console.error('[DEX] Invalid balance value', fromBalance);
      toast.error('Unable to verify balance, please refresh');
      return;
    }

    if (sellNum > balanceNum) {
      console.error('[DEX] Insufficient balance', {
        requested: sellNum,
        available: balanceNum,
      });
      toast.error('Insufficient balance');
      trackEnhancedEvent('ERROR_OCCURRED', {
        event_category: 'trading',
        error_message: 'Insufficient balance',
        include_user_id: true,
        custom_parameters: {
          sell_token: sellToken.symbol,
          requested_amount: sellValue,
          available_balance: fromBalance,
          dex_project: selectedProject,
        },
      });
      Sentry.captureMessage('DEX Swap blocked: insufficient balance', {
        level: 'warning',
        tags: { page: 'dex', dex_project: selectedProject },
        extra: {
          requested_amount: sellValue,
          available_balance: fromBalance,
          sell_token: sellToken.symbol,
        },
      });
      return;
    }

    // Track trade initiation
    trackEnhancedTrade('initiated', sellToken.symbol || '', buyToken.symbol || '', sellValue);

    const isSellTokenNative = sellToken.address === DEFAULT_NATIVE_ADDRESS;
    const isBuyTokenNative = buyToken.address === DEFAULT_NATIVE_ADDRESS;

    // 清除之前的错误
    setLiquidityError({
      showError: false,
      errorMessage: '',
    });

    // ===== SECURITY: Build and validate swap parameters =====

    const routerName = mapRouterName(selectedProject);

    // SECURITY: Validate and parse amount with proper decimals
    const decimals = sellToken.decimals ?? DEFAULT_TOKEN_DECIMALS;
    if (!Number.isFinite(decimals) || decimals < 0 || decimals > 77) {
      console.error('[DEX] Invalid token decimals', decimals);
      toast.error('Invalid token configuration');
      return;
    }

    const amountInWei = parseBig(sellValue, decimals).toString();
    if (!amountInWei || amountInWei === '0' || amountInWei === 'NaN') {
      console.error('[DEX] Failed to parse sell amount to wei', {
        sellValue,
        decimals,
        result: amountInWei,
      });
      toast.error('Invalid sell amount');
      return;
    }

    // SECURITY: Validate quote output amount
    const amountOutWei = (quoteOutWei as string) ?? '0';
    if (!amountOutWei || amountOutWei === '0' || amountOutWei === 'NaN') {
      console.error('[DEX] Invalid quote output amount', quoteOutWei);
      toast.error('Invalid quote data, please try again');
      return;
    }

    // SECURITY: Build and validate swap path
    const fallbackPath = [
      replaceNativeAddressUseBackend(sellToken.address),
      replaceNativeAddressUseBackend(buyToken.address),
    ];
    const path = quotePath && quotePath.length > 0 ? quotePath : fallbackPath;

    // SECURITY: Validate path has at least 2 addresses
    if (!path || path.length < 2) {
      console.error('[DEX] Invalid swap path', path);
      toast.error('Invalid swap route');
      return;
    }

    // SECURITY: Log swap parameters for debugging
    console.log('[DEX] Swap parameters:', {
      routerName,
      amountInWei,
      amountOutWei,
      pathLength: path.length,
      isSellNative: isSellTokenNative,
      isBuyNative: isBuyTokenNative,
      accountType: currentAccountType,
    });

    if (currentAccountType === 'EOA') {
      // ===== SECURITY: EOA-specific validations =====

      // SECURITY: Validate custom recipient address if enabled
      if (selectedProject === 'uniswap' && receiveToCustom && !isMonWmonPair) {
        if (!receiveCustomAddress) {
          console.error('[DEX] Custom recipient enabled but address is empty');
          toast.error('Please enter recipient address');
          return;
        }
        if (!isAddress(receiveCustomAddress as `0x${string}`)) {
          console.error('[DEX] Invalid custom recipient address', receiveCustomAddress);
          toast.error('Invalid recipient address');
          return;
        }
        // SECURITY: Warn if sending to zero address
        if (receiveCustomAddress === '0x0000000000000000000000000000000000000000') {
          console.error('[DEX] Attempted to send to zero address');
          toast.error('Cannot send to zero address');
          return;
        }
      }

      // SECURITY: Validate router name
      const finalRouterName = quoteData?.swapRouterName || routerName;
      if (!finalRouterName || finalRouterName === '') {
        console.error('[DEX] Missing swap router name');
        toast.error('Invalid swap configuration');
        return;
      }

      const args = {
        swap_router_name: finalRouterName,
        path,
        token_in_is_mon: isSellTokenNative,
        token_out_is_mon: isBuyTokenNative,
        amount_in_wei: amountInWei,
        amount_out_wei: amountOutWei,
        // 最小可接受的输出（滑点保护），暂用 "0"，后续可接入滑点设置
        min_amount_out_wei: '0',
        recipient_address: !isMonWmonPair ? receiveCustomAddress : undefined,
      };
      try {
        eoaSwap(args, {
          onSuccess: () => {
            // 交易成功后置空输入，并让报价与显示重置
            setSellValue('');
            setBuyValue('0.00');

            scheduleBalanceRefresh();
          },
        });
      } catch (err) {
        Sentry.captureException(err, {
          tags: { page: 'dex', dex_project: selectedProject, error_type: 'eoa_swap' },
          extra: args,
        });
        throw err;
      }
    } else {
      // ===== SECURITY: DSA-specific validations =====

      // SECURITY: Validate router name
      const finalRouterName = quoteData?.swapRouterName || routerName;
      if (!finalRouterName || finalRouterName === '') {
        console.error('[DEX] Missing swap router name');
        toast.error('Invalid swap configuration');
        return;
      }

      // SECURITY: Validate DSA account exists
      if (!accountInfo?.sandbox_account) {
        console.error('[DEX] DSA account not available');
        toast.error('DSA account not found, please create one');
        return;
      }

      const args = {
        swap_router_name: finalRouterName,
        path,
        token_in_is_mon: isSellTokenNative,
        token_out_is_mon: isBuyTokenNative,
        amount_in_wei: amountInWei,
        amount_out_wei: amountOutWei,
      };
      try {
        dsaSwap(args, {
          onSuccess: () => {
            // 交易成功后置空输入，并让报价与显示重置
            setSellValue('');
            setBuyValue('0.00');

            scheduleBalanceRefresh();
          },
        });
      } catch (err) {
        Sentry.captureException(err, {
          tags: { page: 'dex', dex_project: selectedProject, error_type: 'dsa_swap' },
          extra: args,
        });
        throw err;
      }
    }
  }

  const handleSwapTokens = () => {
    Sentry.addBreadcrumb({
      category: 'action',
      message: 'swap_tokens',
      level: 'info',
      data: {
        from_token: sellToken?.symbol,
        to_token: buyToken?.symbol,
        dex_project: selectedProject,
      },
    });
    setRotateTimes((rotateTimes % 2) + 1);

    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);

    const tempValue = sellValue;
    setSellValue(buyValue);
    setBuyValue(tempValue);

    // Track token swap action
    trackEnhancedEvent('SWAP_TOKENS', {
      event_category: 'trading',
      event_label: 'token_pair_swap',
      include_user_id: true,
      custom_parameters: {
        from_token: sellToken?.symbol,
        to_token: buyToken?.symbol,
        dex_project: selectedProject,
      },
    });
  };

  const handleMaxClick = () => {
    Sentry.addBreadcrumb({
      category: 'action',
      message: 'click_max',
      level: 'info',
      data: {
        token: sellToken?.symbol,
        balance: fromBalance,
        dex_project: selectedProject,
      },
    });
    if (sellToken) {
      setSellValue(fromBalance);
    }
  };

  // 当启用自定义收款地址但地址不合法时，禁用 Swap 并在按钮区提示
  const isRecipientInvalid = useMemo(() => {
    const needRecipient =
      currentAccountType === 'EOA' &&
      selectedProject === 'uniswap' &&
      !isMonWmonPair &&
      receiveToCustom;
    if (!needRecipient) return false;
    return !receiveCustomAddress || !isAddress(receiveCustomAddress as `0x${string}`);
  }, [currentAccountType, selectedProject, isMonWmonPair, receiveToCustom, receiveCustomAddress]);

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-0 md:gap-1 shadow-none">
          <Card
            className={cn(
              'flex-1 relative p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md'
            )}
          >
            <TokenDropSelector
              selectedToken={sellToken}
              onTokenChange={setSellToken}
              value={sellValue}
              onValueChange={setSellValue}
              balance={fromBalance}
              isBalancePending={isFromBalancePending}
              label="Sell"
              placeholder="0.00"
              showMaxButton={true}
              onMaxClick={handleMaxClick}
              justHasBalance={false}
              accountOptions={accountsOptions}
              selectedAccount={selectedPayAccount || ''}
              onAccountChange={handlePayAccountChange}
              accountSelectLabel="Select Account / Wallet"
            />
          </Card>

          <div
            className={cn(
              'flex justify-center items-center md:px-2 px-0 md:-mx-[20px] mx-0 -my-[12px] z-10'
            )}
          >
            <div
              className={cn(
                'border select-none border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white cursor-pointer'
              )}
              onClick={handleSwapTokens}
            >
              <Image src={'/icons/down.svg'} alt="switch" width={10} height={15} />
            </div>
          </div>

          <Card
            className={cn('flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md')}
          >
            <TokenDropSelector
              selectedToken={buyToken}
              onTokenChange={setBuyToken}
              value={buyValue}
              onValueChange={setBuyValue}
              balance={toBalance}
              isBalancePending={isToBalancePending}
              label="Buy"
              placeholder="0.00"
              fromTokenSymbol={sellToken?.symbol}
              fromTokenAmount={sellValue}
              disabled={true}
              justHasBalance={false}
              customAddressEnabled={
                currentAccountType === 'EOA' && selectedProject === 'uniswap' && !isMonWmonPair
                  ? receiveToCustom
                  : false
              }
              onCustomAddressToggle={
                currentAccountType === 'EOA' && selectedProject === 'uniswap' && !isMonWmonPair
                  ? setReceiveToCustom
                  : undefined
              }
              customAddress={
                currentAccountType === 'EOA' && selectedProject === 'uniswap' && !isMonWmonPair
                  ? receiveCustomAddress
                  : undefined
              }
              onCustomAddressChange={
                currentAccountType === 'EOA' && selectedProject === 'uniswap' && !isMonWmonPair
                  ? setReceiveCustomAddress
                  : undefined
              }
            />
          </Card>
        </div>

        <div className="flex md:flex-row flex-col md:justify-between md:items-center mt-5 gap-2 md:gap-0">
          <div className="w-full flex flex-col gap-2 justify-end">
            {liquidityError.showError && (
              <div className={cn('rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2 mt-0')}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CircleX className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="ml-2">
                    <div className="mb-1 text-xs leading-5 font-medium text-red-700 dark:text-red-300 last:mb-0">
                      <ul className="list-disc px-4">
                        <li>{liquidityError.errorMessage}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button
              className="min-w-40 w-full h-12 text-xl font-medium flex leading-[24px] items-center justify-center rounded-md bg-[#6E75F9] text-white hover:bg-[#6E75F990]"
              onClick={handleSwap}
              disabled={
                !sellValue ||
                Number(sellValue) <= 0 ||
                isQuoteLoading ||
                isSwapPending ||
                isFromApproving ||
                !!quoteError ||
                isInsufficientBalance ||
                isRecipientInvalid
              }
            >
              {isFromAllowanceLoading && wallet ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : shouldApproveUI ? (
                <span className="flex items-center">
                  {isFromApproving ? <Loader className="w-6 h-6 mr-1 animate-spin" /> : 'Approve'}
                </span>
              ) : isQuoteLoading ? (
                <span className="flex items-center gap-1">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Finalizing quote</span>
                </span>
              ) : (
                <span className="flex items-center">
                  {isSwapPending && <Loader className="w-6 h-6 mr-1 animate-spin" />}
                  <span>Swap</span>
                </span>
              )}
            </Button>
            {isInsufficientBalance && (
              <div className="rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2 mt-2">
                <div className="text-xs leading-5 font-medium text-red-700 dark:text-red-300">
                  Insufficient balance
                </div>
              </div>
            )}
            {isRecipientInvalid && (
              <div className="rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2 mt-2">
                <div className="text-xs leading-5 font-medium text-red-700 dark:text-red-300">
                  Please enter a valid custom address
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
