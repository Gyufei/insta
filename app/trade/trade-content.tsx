'use client';

import { CircleX, Loader } from 'lucide-react';
import { divide } from 'safebase';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import {
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  UniversalRouterAddress,
  replaceNativeAddressUseBackend,
} from '@/config/network-config';
import { IToken, MONAD, MonUSD } from '@/config/tokens';

import { TokenDropSelector } from '@/components/common/token-drop-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balnace';
import { useCheckMonadAllowance } from '@/lib/data/use-monad-allowance';
import { useUniswapDSASwap } from '@/lib/data/use-uniswap-dsa-swap';
import { useUniswapEOASwap } from '@/lib/data/use-uniswap-eoa-swap';
import { useUniswapQuote } from '@/lib/data/use-uniswap-quote';
import { ErrorVO } from '@/lib/model/error-vo';
import { useAccountStore } from '@/lib/state/account';
import { eventBus } from '@/lib/state/eventBus';
import { cn, isSameAddress } from '@/lib/utils';

import { WMONAD_TOKEN } from '../(protocols)/uniswap/use-uniswap-token';
import { SlippageSettings } from './slippage-settings';

export function TokenContent() {
  const { address: wallet } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

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

  const {
    allowance: fromAllowance,
    isLoading: isFromAllowanceLoading,
    handleApprove: handleFromApprove,
    isApproving: isFromApproving,
  } = useCheckMonadAllowance(sellToken?.address || '', UniversalRouterAddress);

  const { balance: fromBalance, isBalancePending: isFromBalancePending } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    sellToken?.address || ''
  );

  const { balance: toBalance, isBalancePending: isToBalancePending } = useAddressBalance(
    currentAccountType === 'EOA' ? wallet || '' : accountInfo?.sandbox_account || '',
    buyToken?.address || ''
  );

  const isCanBuyPair = useMemo(() => {
    const isMonUsdSell = isSameAddress(sellToken?.address || '', MonUSD.address);
    const isMonBuy = isSameAddress(buyToken?.address || '', MONAD.address);
    const isWMonBuy = isSameAddress(buyToken?.address || '', WMONAD_TOKEN.address);
    return isMonUsdSell && (isMonBuy || isWMonBuy);
  }, [sellToken, buyToken]);

  const quoteParams =
    sellToken && buyToken && sellValue && !isCanBuyPair
      ? {
          tokenIn: replaceNativeAddressUseBackend(sellToken.address),
          tokenOut: replaceNativeAddressUseBackend(buyToken.address),
          amountIn: sellValue,
          amountInDecimals: sellToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
        }
      : undefined;

  const {
    data: quoteData,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useUniswapQuote(quoteParams);

  const { mutate: eoaSwap, isPending: isEOASwapPending } = useUniswapEOASwap();
  const { mutate: dsaSwap, isPending: isDSASwapPending } = useUniswapDSASwap();
  const isSwapPending = currentAccountType === 'EOA' ? isEOASwapPending : isDSASwapPending;

  const shouldApprove = useMemo(() => {
    if (currentAccountType === 'DSA') {
      return false;
    }

    if (!sellToken) return false;

    if (fromAllowance === Infinity || fromAllowance == null) return false;

    return Number(fromAllowance) < Number(sellValue);
  }, [fromAllowance, sellValue, sellToken, currentAccountType]);

  useEffect(() => {
    if (quoteData?.output) {
      setBuyValue(
        divide(quoteData.output, String(10 ** (buyToken?.decimals || DEFAULT_TOKEN_DECIMALS)))
      );
    }
  }, [quoteData?.output, buyToken?.decimals]);

  useEffect(() => {
    const errorMsg = 'Insufficient liquidity, please try again later';
    if (quoteError) {
      if (quoteError.message.includes(`Cannot read properties of undefined (reading 'quote')`)) {
        setLiquidityError({
          showError: true,
          errorMessage: errorMsg,
        });
      } else {
        toast.error(quoteError.message);
      }
    }

    if (isCanBuyPair) {
      setLiquidityError({
        showError: true,
        errorMessage: 'Insufficient liquidity, please try again later',
      });
    }

    if (!quoteError && !isCanBuyPair) {
      setLiquidityError({
        showError: false,
        errorMessage: '',
      });
    }
  }, [quoteError, isCanBuyPair]);

  const [init, setInit] = useState(false);
  useEffect(() => {
    if (!init) {
      const token = sessionStorage.getItem('token');
      if (token) {
        setSellToken(JSON.parse(token));
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
          setSellToken(data.props.token);
          setInit(true);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  function handleSwap() {
    if (shouldApprove) {
      handleFromApprove();
      return;
    }

    if (!quoteData || !sellToken || !buyToken) return;

    if (Number(sellValue) > Number(fromBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    const isSellTokenEth = sellToken.address === DEFAULT_NATIVE_ADDRESS;
    const isBuyTokenEth = buyToken.address === DEFAULT_NATIVE_ADDRESS;

    // 清除之前的错误
    setLiquidityError({
      showError: false,
      errorMessage: '',
    });

    if (currentAccountType === 'EOA') {
      eoaSwap({
        token_in: sellToken.address,
        token_out: buyToken.address,
        amount_in: sellValue,
        amount_in_decimals: sellToken.decimals?.toString() || DEFAULT_TOKEN_DECIMALS.toString(),
      });
    } else {
      dsaSwap({
        token_in_is_eth: isSellTokenEth,
        token_out_is_eth: isBuyTokenEth,
        slippage: (Number(slippage) * 1e16).toString(),
        route: quoteData.route[0],
      });
    }
  }

  const handleSwapTokens = () => {
    setRotateTimes((rotateTimes % 2) + 1);

    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);

    const tempValue = sellValue;
    setSellValue(buyValue);
    setBuyValue(tempValue);
  };

  const handleMaxClick = () => {
    if (sellToken) {
      setSellValue(fromBalance);
    }
  };

  return (
    <>
      <div className="px-4 2xl:px-12">
        <div className="flex md:flex-row flex-col justify-between flex-1 gap-0 shadow-none">
          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
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
            />
          </Card>

          <div
            className={cn(
              'flex justify-center items-center md:px-2 px-0 py-2 md:py-0 md:-mx-[20px] mx-0 -my-[20px] md:my-0 z-10'
            )}
            onClick={() => {
              handleSwapTokens();
            }}
          >
            <div className="border border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white md:rotate-0 rotate-90">
              <Image
                className={cn(
                  'transition-transform duration-500',
                  rotateTimes === 1 ? 'rotate-360' : 'rotate-0'
                )}
                src="/icons/switch.svg"
                alt="switch"
                width={20}
                height={20}
              />
            </div>
          </div>

          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
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
          </Card>
        </div>

        <div className="flex md:flex-row flex-col md:justify-between md:items-center mt-5 gap-2 md:gap-0">
          <SlippageSettings onSlippageChange={setSlippage} />

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
              {isFromAllowanceLoading ? (
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
