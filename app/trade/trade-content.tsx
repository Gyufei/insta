'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import { CircleX, Loader } from 'lucide-react';
import { divide } from 'safebase';
import { toast } from 'sonner';
import { SignTypedDataParameters } from 'viem';
import { useAccount, useSignTypedData } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import Image from 'next/image';

import {
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  NetworkConfigs,
  UniversalRouterAddressPermit,
  replaceNativeAddressUseBackend,
} from '@/config/network-config';
import { IToken, MonUSD } from '@/config/tokens';

import { TokenDropSelector } from '@/components/common/token-drop-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import { useCheckMonadAllowance } from '@/lib/data/use-monad-allowance';
import { useUniswapDSASwap } from '@/lib/data/use-uniswap-dsa-swap';
import { useUniswapEOASwap } from '@/lib/data/use-uniswap-eoa-swap';
import { IUniswapQuote, useUniswapQuote } from '@/lib/data/use-uniswap-quote';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useAccountStore } from '@/lib/state/account';
import { eventBus } from '@/lib/state/eventBus';
import { cn, isSameAddress } from '@/lib/utils';

import { SlippageSettings } from './slippage-settings';

function CovertPermitData(
  permitData: IUniswapQuote['permitData'],
  wallet: string
): SignTypedDataParameters {
  const typeData = {
    ...permitData,
    primaryType: 'PermitSingle',
    account: wallet as `0x${string}`,
    message: permitData.values,
  };

  return typeData as SignTypedDataParameters;
}

export function TokenContent() {
  const { address: wallet } = useAccount();
  const { chainId } = useAppKitNetwork();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();
  const { signTypedDataAsync } = useSignTypedData();
  const { trackEvent, trackTrade } = useEnhancedAnalytics();
  const { data: oddsUserInfo } = useOddsUserInfo();

  const [sellToken, setSellToken] = useState<IToken | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<IToken | undefined>(undefined);
  const [sellValue, setSellValue] = useState('');
  const [buyValue, setBuyValue] = useState('');
  const [slippage, setSlippage] = useState('1');

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

  const isBuyMonUsd = isSameAddress(buyToken?.address || '', MonUSD.address);

  const quoteParams = useMemo(() => {
    return sellToken && buyToken && sellValue && Number(sellValue) > 0
      ? {
          tokenIn: replaceNativeAddressUseBackend(sellToken.address),
          tokenOut: replaceNativeAddressUseBackend(buyToken.address),
          amountIn: sellValue,
          amountInDecimals: sellToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
          ...(currentAccountType === 'EOA' && wallet ? { wallet } : {}),
        }
      : undefined;
  }, [sellToken, buyToken, sellValue, currentAccountType, wallet]);

  const {
    data: quoteDataRes,
    isLoading: isQuoteLoading,
    error: quoteErrorRes,
  } = useUniswapQuote(quoteParams);

  const quoteData = useMemo(() => {
    if (!quoteDataRes) return null;

    if ('status' in quoteDataRes && !quoteDataRes.status) {
      return null;
    }

    return quoteDataRes;
  }, [quoteDataRes]);

  const quoteError = useMemo(() => {
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
  } = useCheckMonadAllowance(sellToken?.address || '', UniversalRouterAddressPermit);

  const { mutate: eoaSwap, isPending: isEOASwapPending } = useUniswapEOASwap();
  const { mutate: dsaSwap, isPending: isDSASwapPending } = useUniswapDSASwap();
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

  useEffect(() => {
    if (quoteData?.output) {
      setBuyValue(
        divide(quoteData.output, String(10 ** (buyToken?.decimals || DEFAULT_TOKEN_DECIMALS)))
      );
    }
  }, [quoteData?.output, buyToken?.decimals]);

  useEffect(() => {
    if (quoteError) {
      if (!('message' in quoteError)) return;

      if (quoteError.message.includes(`Cannot read properties of undefined (reading 'quote')`)) {
        const errorMsg = 'Insufficient liquidity, please try again later';
        setLiquidityError({
          showError: true,
          errorMessage: errorMsg,
        });
      } else {
        if (quoteError.message.includes('token pair')) {
          toast.warning(quoteError.message);
        } else {
          toast.error(quoteError.message);
        }
      }

      // Report quote related errors to Sentry with context
      try {
        Sentry.captureMessage('Trade Quote Error', {
          level: 'warning',
          tags: {
            page: 'trade',
            error_type: 'quote',
          },
          extra: {
            message: quoteError.message,
            sell_token: sellToken?.symbol,
            sell_address: sellToken?.address,
            buy_token: buyToken?.symbol,
            buy_address: buyToken?.address,
            sell_value: sellValue,
            chain_id: chainId,
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
  }, [quoteError, sellToken, buyToken, sellValue, chainId]);

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
      Sentry.setTag('page', 'trade');
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
  }, [wallet, currentAccountType, chainId, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name]);

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
        },
      });
    } catch {}
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name]);

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

  async function handleSwap() {
    Sentry.addBreadcrumb({
      category: 'action',
      message: 'click_swap',
      level: 'info',
      data: {
        sell_token: sellToken?.symbol,
        buy_token: buyToken?.symbol,
        sell_value: sellValue,
        should_approve: shouldApprove,
      },
    });
    if (shouldApprove) {
      trackEvent('TOKEN_APPROVE', {
        event_category: 'trading',
        token_symbol: sellToken?.symbol,
        token_address: sellToken?.address,
        include_user_id: true,
      });
      Sentry.addBreadcrumb({
        category: 'action',
        message: 'click_approve',
        level: 'info',
        data: {
          token_symbol: sellToken?.symbol,
          token_address: sellToken?.address,
        },
      });
      handleFromApprove();
      return;
    }

    if (!wallet) {
      toast.error('Please connect your wallet to trade');
      Sentry.captureMessage('Swap blocked: wallet not connected', {
        level: 'info',
      });
      return;
    }

    // 检查是否为 Monad Testnet 网络
    if (chainId !== NetworkConfigs.monadTestnet.id) {
      try {
        // // 尝试切换到 Monad Testnet
        // await switchNetwork(NetworkConfigs.monadTestnet);

        // toast.success('Successfully switched to Monad Testnet');
        toast.error(
          'Please switch to the Monad network in your wallet to avoid sending funds to the wrong network.'
        );
        return; // 切换成功后返回，用户需要再次点击交易
      } catch (error) {
        // 网络切换失败
        Sentry.captureException(error, {
          tags: { page: 'trade', error_type: 'network_switch' },
          extra: { current_chain_id: chainId },
        });
        toast.error(
          'Please switch to the Monad network in your wallet to avoid sending funds to the wrong network.'
        );
        return;
      }
    }

    if (!quoteData || !sellToken || !buyToken) return;

    if (Number(sellValue) > Number(fromBalance)) {
      toast.error('Insufficient balance');
      trackEvent('ERROR_OCCURRED', {
        event_category: 'trading',
        error_message: 'Insufficient balance',
        include_user_id: true,
        custom_parameters: {
          sell_token: sellToken.symbol,
          requested_amount: sellValue,
          available_balance: fromBalance,
        },
      });
      Sentry.captureMessage('Swap blocked: insufficient balance', {
        level: 'warning',
        extra: {
          requested_amount: sellValue,
          available_balance: fromBalance,
          sell_token: sellToken.symbol,
        },
      });
      return;
    }

    // Track trade initiation
    trackTrade('initiated', sellToken.symbol || '', buyToken.symbol || '', sellValue);

    const isSellTokenEth = sellToken.address === DEFAULT_NATIVE_ADDRESS;
    const isBuyTokenEth = buyToken.address === DEFAULT_NATIVE_ADDRESS;

    // 清除之前的错误
    setLiquidityError({
      showError: false,
      errorMessage: '',
    });

    if (currentAccountType === 'EOA') {
      let signature;
      const permitData = quoteData.permitData;
      if (permitData) {
        const typeData = CovertPermitData(permitData, wallet || '');
        try {
          signature = await signTypedDataAsync(typeData);
        } catch (err) {
          Sentry.captureException(err, {
            tags: { page: 'trade', error_type: 'sign_typed_data' },
            extra: { has_permit: Boolean(permitData) },
          });
          throw err;
        }
      }

      const args = {
        token_in: replaceNativeAddressUseBackend(sellToken.address),
        token_out: replaceNativeAddressUseBackend(buyToken.address),
        amount_in: sellValue,
        amount_in_decimals: sellToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
        ...(permitData ? { permitData: permitData } : {}),
        ...(signature ? { signature } : {}),
      };
      try {
        eoaSwap(args);
      } catch (err) {
        Sentry.captureException(err, {
          tags: { page: 'trade', error_type: 'eoa_swap' },
          extra: args,
        });
        throw err;
      }
    } else {
      try {
        dsaSwap({
          token_in_is_eth: isSellTokenEth,
          token_out_is_eth: isBuyTokenEth,
          slippage: (Number(slippage) * 1e16).toString(),
          route: quoteData.route[0],
        });
      } catch (err) {
        Sentry.captureException(err, {
          tags: { page: 'trade', error_type: 'dsa_swap' },
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
    trackEvent('SWAP_TOKENS', {
      event_category: 'trading',
      event_label: 'token_pair_swap',
      include_user_id: true,
      custom_parameters: {
        from_token: sellToken?.symbol,
        to_token: buyToken?.symbol,
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
      },
    });
    if (sellToken) {
      setSellValue(fromBalance);
    }
  };
  
  const handleSlippageChange = (value: string) => {
    Sentry.addBreadcrumb({
      category: 'action',
      message: 'change_slippage',
      level: 'info',
      data: { value },
    });
    setSlippage(value);
  };

  return (
    <>
      <div className="px-4 2xl:px-12">
        <div className="flex md:flex-row flex-col justify-between flex-1 gap-0 shadow-none">
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
              label="You pay"
              showMaxButton={true}
              onMaxClick={handleMaxClick}
              justHasBalance={true}
              noMonUsd={true}
            />
          </Card>

          <div
            className={cn(
              'flex justify-center items-center md:px-2 px-0 py-2 md:py-0 md:-mx-[20px] mx-0 -my-[20px] md:my-0 z-10'
            )}
          >
            <div
              onClick={() => {
                if (isBuyMonUsd) return;
                handleSwapTokens();
              }}
              className={cn(
                'border select-none border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white md:rotate-0 rotate-90',
                isBuyMonUsd && 'bg-gray-100 cursor-not-allowed'
              )}
            >
              <Image
                className={cn(
                  'transition-transform duration-500',
                  rotateTimes === 1 ? 'rotate-360' : 'rotate-0'
                )}
                src={isBuyMonUsd ? '/icons/switch-gray.svg' : '/icons/switch.svg'}
                alt="switch"
                width={20}
                height={20}
              />
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
              label="You receive"
              disabled={true}
              justHasBalance={false}
            />
            {
              <div
                className={cn(
                  'text-sm leading-[140%] text-[#A5ADC6] transition-all duration-300',
                  quoteData?.priceImpact ? 'h-[20px]' : 'h-0 overflow-hidden'
                )}
              >
                Price impact: {quoteData?.priceImpact}
              </div>
            }
          </Card>
        </div>

        <div className="flex md:flex-row flex-col md:justify-between md:items-center mt-5 gap-2 md:gap-0">
          <SlippageSettings onSlippageChange={handleSlippageChange} />

          <div className="flex flex-col md:items-center md:flex-row gap-2 md:gap-1 justify-end">
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
              className="min-w-40 h-12 text-xl font-medium flex leading-[24px] items-center justify-center rounded-md bg-[#6E75F9] text-white hover:bg-[#6E75F990]"
              onClick={handleSwap}
            >
              {isFromAllowanceLoading && wallet ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : shouldApprove ? (
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
