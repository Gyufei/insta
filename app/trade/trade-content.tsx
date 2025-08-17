'use client';

import { CircleX, Loader } from 'lucide-react';
import { divide } from 'safebase';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  replaceNativeAddressUseBackend,
} from '@/config/network-config';
import { IToken } from '@/config/tokens';

// import { TokenDropSelector } from '@/components/common/token-drop-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useUniswapQuote } from '@/lib/data/use-uniswap-quote';
import { useUniswapSwap } from '@/lib/data/use-uniswap-swap';
import { ErrorVO } from '@/lib/model/error-vo';
import { eventBus } from '@/lib/state/eventBus';
import { cn } from '@/lib/utils';
// import { useGetAccountBalance } from '@/lib/web3/use-get-account-balance';

import { SlippageSettings } from '../(protocols)/uniswap/swap/slippage-settings';

export function TokenContent() {
  const [sellToken, setSellToken] = useState<IToken | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<IToken | undefined>(undefined);
  const [sellValue, setSellValue] = useState('');
  const [buyValue, setBuyValue] = useState('');
  const [slippage, setSlippage] = useState('1');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const [rotateTimes, setRotateTimes] = useState(0);

  // const { balance: fromBalance, isBalancePending: isFromBalancePending } = useGetAccountBalance(
  //   sellToken?.address || '',
  //   true
  // );

  // const { balance: toBalance, isBalancePending: isToBalancePending } = useGetAccountBalance(
  //   buyToken?.address || '',
  //   true
  // );

  const quoteParams =
    sellToken && buyToken && sellValue
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

  const { mutate: swap, isPending: isSwapPending, error: swapError } = useUniswapSwap();

  useEffect(() => {
    if (quoteData?.output) {
      setBuyValue(
        divide(quoteData.output, String(10 ** (buyToken?.decimals || DEFAULT_TOKEN_DECIMALS)))
      );
    }
  }, [quoteData?.output, buyToken?.decimals]);

  useEffect(() => {
    if (quoteError) {
      let errorMsg = quoteError.message;
      if (quoteError.message.includes(`Cannot read properties of undefined (reading 'quote')`)) {
        errorMsg = 'Insufficient liquidity, please try again later';
      }
      setErrorData({
        showError: true,
        errorMessage: errorMsg,
      });
    }

    if (swapError) {
      setErrorData({
        showError: true,
        errorMessage: swapError.message,
      });
    }

    if (!swapError && !quoteError) {
      setErrorData({
        showError: false,
        errorMessage: '',
      });
    }
  }, [swapError, quoteError]);

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
        console.log('data', data);
        if (data.name === 'TradeToken') {
          setSellToken(data.props.token);
          setInit(true);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  function handleSwap() {
    if (!quoteData || !sellToken || !buyToken) return;

    const isSellTokenEth = sellToken.address === DEFAULT_NATIVE_ADDRESS;
    const isBuyTokenEth = buyToken.address === DEFAULT_NATIVE_ADDRESS;

    // 清除之前的错误
    setErrorData({
      showError: false,
      errorMessage: '',
    });

    swap({
      token_in_is_eth: isSellTokenEth,
      token_out_is_eth: isBuyTokenEth,
      slippage: (Number(slippage) * 1e16).toString(),
      route: quoteData.route[0],
    });
  }

  const handleSwapTokens = () => {
    setRotateTimes((rotateTimes % 2) + 1);

    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);

    const tempValue = sellValue;
    setSellValue(buyValue);
    setBuyValue(tempValue);

    // 清除错误;
    setErrorData({
      showError: false,
      errorMessage: '',
    });
  };

  // const handleMaxClick = () => {
  //   if (sellToken) {
  //     setSellValue(fromBalance);
  //   }
  // };

  return (
    <>
      <div className="px-4 2xl:px-12">
        <div className="flex md:flex-row flex-col justify-between flex-1 gap-0 shadow-none">
          {/* 左侧：From */}
          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
            {/* <TokenDropSelector
              selectedToken={sellToken}
              onTokenChange={setSellToken}
              value={sellValue}
              onValueChange={setSellValue}
              balance={fromBalance}
              isBalancePending={isFromBalancePending}
              label="You pay"
              showMaxButton={true}
              onMaxClick={handleMaxClick}
            /> */}
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
            {/* <TokenDropSelector
              selectedToken={buyToken}
              onTokenChange={setBuyToken}
              value={buyValue}
              onValueChange={setBuyValue}
              balance={toBalance}
              isBalancePending={isToBalancePending}
              label="You receive"
              disabled={true}
            /> */}
          </Card>
        </div>

        <div className="flex md:flex-row flex-col md:justify-between md:items-center mt-5 gap-2 md:gap-0">
          <SlippageSettings onSlippageChange={setSlippage} />

          <div className="flex flex-col md:items-center md:flex-row gap-2 md:gap-1 justify-end">
            {errorData.showError && (
              <div className={cn('rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2 mt-0')}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CircleX className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="ml-2">
                    <div className="mb-1 text-xs leading-5 font-medium text-red-700 dark:text-red-300 last:mb-0">
                      <ul className="list-disc px-4">
                        <li>{errorData.errorMessage}</li>
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
              {isQuoteLoading ? (
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
