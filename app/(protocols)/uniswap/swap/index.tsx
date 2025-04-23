import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import { useEffect, useState } from 'react';

import { DEFAULT_NATIVE_ADDRESS, DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { IToken } from '@/lib/data/tokens';
import { useUniswapQuote } from '@/lib/data/use-uniswap-quote';
import { useUniswapSwap } from '@/lib/data/use-uniswap-swap';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { SlippageSettings } from './slippage-settings';
import SwapTokenInput from './swap-token-input';
import TokenSelector from './token-selector';

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

export function UniswapSwap() {
  const { setIsOpen, currentComponent } = useSideDrawerStore();
  const { token } = currentComponent?.props || { token: null };

  const [sellToken, setSellToken] = useState<IToken | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<IToken | undefined>(undefined);
  const [sellValue, setSellValue] = useState('');
  const [buyValue, setBuyValue] = useState('');
  const [slippage, setSlippage] = useState('1');

  const [showTokenSelector, setShowTokenSelector] = useState<'token1' | 'token2' | null>(null);
  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const quoteParams =
    sellToken && buyToken && sellValue
      ? {
          tokenIn: sellToken.address,
          tokenOut: buyToken.address,
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
    if (token) {
      setSellToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (quoteData?.output) {
      setBuyValue(quoteData.output);
    }
  }, [quoteData]);

  useEffect(() => {
    if (quoteError) {
      setErrorData({
        showError: true,
        errorMessage: quoteError.message,
      });
    }
  }, [quoteError]);

  useEffect(() => {
    if (swapError) {
      setErrorData({
        showError: true,
        errorMessage: swapError.message,
      });
    }
  }, [swapError]);

  function handleSwap() {
    if (!quoteData || !sellToken || !buyToken) return;

    const isSellTokenEth = sellToken.address === DEFAULT_NATIVE_ADDRESS;
    const isBuyTokenEth = buyToken.address === DEFAULT_NATIVE_ADDRESS;

    // 清除之前的错误
    setErrorData({
      showError: false,
      errorMessage: '',
    });

    console.log('quoteData', quoteData);

    swap({
      token_in_is_eth: isSellTokenEth,
      token_out_is_eth: isBuyTokenEth,
      slippage: (Number(slippage) * 1e16).toString(),
      route: quoteData.route[0],
    });
  }

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);

    const tempValue = sellValue;
    setSellValue(buyValue);
    setBuyValue(tempValue);

    // 清除错误
    setErrorData({
      showError: false,
      errorMessage: '',
    });
  };

  const handleTokenSelect = (token: IToken) => {
    if (showTokenSelector === 'token1') {
      setSellToken(token);
    } else if (showTokenSelector === 'token2') {
      setBuyToken(token);
    }

    // 清除错误
    setErrorData({
      showError: false,
      errorMessage: '',
    });
  };

  function handleBack() {
    if (showTokenSelector) {
      setShowTokenSelector(null);
    } else {
      setIsOpen(false);
    }
  }

  if (!token) return null;

  return (
    <>
      <SideDrawerBackHeader title="Trade" onClick={handleBack} />
      <SideDrawerLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={showTokenSelector ? 'tokenSelector' : 'swapForm'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: 0 }}
            transition={ANIMATION_CONFIG}
          >
            {showTokenSelector ? (
              <TokenSelector
                onSelect={handleTokenSelect}
                onClose={() => setShowTokenSelector(null)}
              />
            ) : (
              <>
                <SwapTokenInput
                  label="Sell"
                  token={sellToken}
                  value={sellValue}
                  onChange={setSellValue}
                  placeholder="0"
                  onShowTokenSelector={() => setShowTokenSelector('token1')}
                  onSetError={setErrorData}
                />
                <div className="flex items-center relative h-3">
                  <div
                    onClick={handleSwapTokens}
                    className="absolute left-1/2 border-white dark:border-gray-500 border-2 -translate-x-1/2 flex items-center justify-center rounded-sm cursor-pointer bg-accent p-2"
                  >
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <SwapTokenInput
                  label="Buy"
                  token={buyToken}
                  value={buyValue}
                  onChange={setBuyValue}
                  placeholder="0"
                  onShowTokenSelector={() => setShowTokenSelector('token2')}
                  disabled={true}
                />

                <SlippageSettings onSlippageChange={setSlippage} />

                <ActionButton
                  disabled={
                    !sellToken ||
                    !buyToken ||
                    !sellValue ||
                    !buyValue ||
                    isQuoteLoading ||
                    isSwapPending
                  }
                  isPending={isQuoteLoading || isSwapPending}
                  onClick={handleSwap}
                  error={errorData}
                >
                  {isQuoteLoading ? 'Finalizing quote' : 'Swap'}
                </ActionButton>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </SideDrawerLayout>
    </>
  );
}
