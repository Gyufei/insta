'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';
import { CircleX, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  NetworkConfigs,
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
import { isProduction } from '@/lib/data/api-path';
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
import { formatBig, parseBig } from '@/lib/utils/number';

import { DexProjectId } from './dex-config';

// 根据项目选择映射后端路由名
function mapRouterName(project: DexProjectId) {
  switch (project) {
    case 'uniswap':
      return 'Uniswap V3';
    case 'ambient':
      return 'Ambient';
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

  const { balance: fromBalance, isBalancePending: isFromBalancePending } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    sellToken?.address || ''
  );

  const { balance: toBalance, isBalancePending: isToBalancePending } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    buyToken?.address || ''
  );

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

    // 检查是否为 Monad Testnet 网络
    if (chainId !== NetworkConfigs.monadTestnet.id) {
      const targetNetworkLabel = isProduction ? 'Monad Testnet' : 'Monad Testnet';
      try {
        // // 尝试切换到 Monad Testnet
        // await switchNetwork(NetworkConfigs.monadTestnet);

        // toast.success('Successfully switched to Monad Testnet');
        toast.error(
          `Wrong network detected in your wallet! Switch to ${targetNetworkLabel} to avoid loss.`
        );
        return; // 切换成功后返回，用户需要再次点击交易
      } catch (error) {
        // 网络切换失败
        Sentry.captureException(error, {
          tags: { page: 'dex', dex_project: selectedProject, error_type: 'network_switch' },
          extra: { current_chain_id: chainId },
        });
        toast.error(
          `Wrong network detected in your wallet! Switch to ${targetNetworkLabel} to avoid loss.`
        );
        return;
      }
    }
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

    if (!quoteData || !sellToken || !buyToken) return;

    if (Number(sellValue) > Number(fromBalance)) {
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

    const routerName = mapRouterName(selectedProject);
    const amountInWei = parseBig(
      sellValue,
      sellToken.decimals ?? DEFAULT_TOKEN_DECIMALS
    ).toString();
    const amountOutWei = (quoteOutWei as string) ?? '0';
    const fallbackPath = [
      replaceNativeAddressUseBackend(sellToken.address),
      replaceNativeAddressUseBackend(buyToken.address),
    ];
    const path = quotePath && quotePath.length > 0 ? quotePath : fallbackPath;

    if (currentAccountType === 'EOA') {
      // EOA 自定义收款地址校验（保持与原逻辑一致，仅在 Uniswap 下开启；排除 MON<=>WMON）
      if (selectedProject === 'uniswap' && receiveToCustom && !isMonWmonPair) {
        if (!receiveCustomAddress || !isAddress(receiveCustomAddress as `0x${string}`)) {
          toast.error('Invalid recipient address');
          return;
        }
      }

      const args = {
        // 优先使用报价返回的路由名
        swap_router_name: quoteData?.swapRouterName || routerName,
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
      const args = {
        // 优先使用报价返回的路由名
        swap_router_name: quoteData?.swapRouterName || routerName,
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

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-0 shadow-none">
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
              label="From"
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
              label="To"
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
                isInsufficientBalance
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
          </div>
        </div>
      </div>
    </>
  );
}
