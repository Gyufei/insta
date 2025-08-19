import { AnimatePresence, motion } from 'framer-motion';
import { divide, multiply } from 'safebase';
import { toast } from 'sonner';

import { useEffect, useMemo, useState } from 'react';

import TokenSelector from '@/app/(protocols)/uniswap/uni-common/token-selector';
import { useTokenSelector } from '@/app/(protocols)/uniswap/uni-common/use-token-selector';

import { replaceNativeAddressUseBackend } from '@/config/network-config';
import { IToken, MONAD } from '@/config/tokens';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useAmbientCreatePosition } from '@/lib/data/use-ambient-create-position';
import { useAmbientLiquidityRatio } from '@/lib/data/use-ambient-liquidity-ratio';
import { useAmbientPositionInfo } from '@/lib/data/use-ambient-position-info';
import { ErrorVO } from '@/lib/model/error-vo';
import { truncateNumber } from '@/lib/utils/number';

import { INFINITY_PRICE } from '../../uniswap/create-position/price-range-selector';
import { WMONAD_TOKEN } from '../../uniswap/use-uniswap-token';
import { SelectToken } from './select-token';
import { SetPriceAndAmount } from './set-price-and-amount';

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

export enum CreatePositionStep {
  SelectToken = 1,
  SetPriceAndMount = 2,
}

export function AmbientCreatePosition() {
  const [token0, setToken0] = useState<IToken>();
  const [token1, setToken1] = useState<IToken>();
  const [priceRangeMin, setPriceRangeMin] = useState<string>('');
  const [priceRangeMax, setPriceRangeMax] = useState<string>('');
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [initPrice, setInitPrice] = useState<string>('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const [step, setStep] = useState<CreatePositionStep>(CreatePositionStep.SelectToken);
  const { showTokenSelector, setShowTokenSelector, handleTokenSelect, handleBack } =
    useTokenSelector();

  const { data: liquidityRatio } = useAmbientLiquidityRatio({
    tokenA: replaceNativeAddressUseBackend(token0?.address || ''),
    tokenB: replaceNativeAddressUseBackend(token1?.address || ''),
    price_current: String(initPrice) || '0',
    price_lower: String(Number(priceRangeMin)) || '0',
    price_upper: String(Number(priceRangeMax)) || INFINITY_PRICE,
    decimals_a: token0?.decimals || 18,
    decimals_b: token1?.decimals || 18,
  });

  const { data: positionInfo } = useAmbientPositionInfo({
    token_a_address: replaceNativeAddressUseBackend(token0?.address || ''),
    token_b_address: replaceNativeAddressUseBackend(token1?.address || ''),
    decimals_a: token0?.decimals.toString() || '',
    decimals_b: token1?.decimals.toString() || '',
  });

  const ratio = liquidityRatio?.ratio
    ? ['Infinity', 'NaN', INFINITY_PRICE].includes(liquidityRatio?.ratio || '')
      ? initPrice
      : liquidityRatio?.ratio
    : initPrice;

  const isNewPool = useMemo(() => {
    return (
      !positionInfo ||
      positionInfo.pool_addr === '0x0000000000000000000000000000000000000000' ||
      positionInfo.price === '0'
    );
  }, [positionInfo]);

  const initPriceRequired = !isNewPool || (isNewPool && initPrice);

  const { mutate: createPosition, isPending } = useAmbientCreatePosition();

  function handleAmount0Change(value: string) {
    setAmount0(value);
    if (value && initPrice) {
      const reciprocal = truncateNumber(multiply(String(value), initPrice), token0?.decimals || 18);
      setAmount1(reciprocal);
    }
  }

  function handleAmount1Change(value: string) {
    setAmount1(value);
    if (value && initPrice) {
      const reciprocal = truncateNumber(divide(String(value), ratio), token1?.decimals || 18);
      setAmount0(reciprocal);
    }
  }

  function handleInitPriceChange(value: string) {
    setInitPrice(value);
  }

  const handleTokenSelectWrapper = (token: IToken) => {
    const result = handleTokenSelect(token);

    if (result.token0) {
      setToken0(result.token0);
      if (token1?.symbol === result.token0.symbol) {
        setToken1(undefined);
      }
    } else if (result.token1) {
      setToken1(result.token1);
      if (token0?.symbol === result.token1.symbol) {
        setToken0(undefined);
      }
    }

    setErrorData({
      showError: false,
      errorMessage: '',
    });
  };

  function handleNewPosition() {
    if (!token0 || !token1) return;

    if (!priceRangeMin || !priceRangeMax) {
      toast.error('Please set price range');
      return;
    }

    const tokenA = replaceNativeAddressUseBackend(token0.address);
    const tokenB = replaceNativeAddressUseBackend(token1.address);

    const args = {
      token_a: tokenA,
      token_b: tokenB,
      price_current: initPrice || '0',
      price_lower: priceRangeMin,
      price_upper: priceRangeMax,
      token_a_amount: amount0,
      token_a_decimals: token0.decimals.toString(),
      token_b_decimals: token1.decimals.toString(),
    };

    createPosition(args);
  }

  function handleNextStep() {
    if (step === CreatePositionStep.SelectToken) {
      setStep(CreatePositionStep.SetPriceAndMount);
    }
  }

  useEffect(() => {
    if (ratio && amount0) {
      const reciprocal = truncateNumber(multiply(String(amount0), ratio), token1?.decimals || 18);
      setAmount1(reciprocal);
    }
  }, [ratio, amount0, token1]);

  useEffect(() => {
    if (positionInfo && positionInfo.price && positionInfo.price !== '0') {
      setInitPrice(positionInfo.price);
    }
  }, [positionInfo]);

  useEffect(() => {
    if (Number(priceRangeMin) > Number(priceRangeMax)) {
      setErrorData({
        showError: true,
        errorMessage: 'Min price must be less than max price',
      });
      return;
    }

    if (
      step === CreatePositionStep.SetPriceAndMount &&
      priceRangeMin !== '0' &&
      priceRangeMax !== INFINITY_PRICE &&
      liquidityRatio &&
      ['Infinity', 'NaN', '∞'].includes(liquidityRatio?.ratio || '')
    ) {
      setErrorData({
        showError: true,
        errorMessage: 'Current price range is out of price curve, creation will fail',
      });
      return;
    }

    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [priceRangeMin, priceRangeMax, liquidityRatio, step]);

  return (
    <>
      <SideDrawerBackHeader title="New Position" onClick={handleBack} />
      <SideDrawerLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={
              showTokenSelector
                ? 'tokenSelector'
                : step === CreatePositionStep.SelectToken
                  ? 'selectToken'
                  : 'setPriceAndMount'
            }
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: 0 }}
            transition={ANIMATION_CONFIG}
          >
            {showTokenSelector ? (
              <TokenSelector
                onSelect={handleTokenSelectWrapper}
                onClose={() => setShowTokenSelector(null)}
                excludeTokens={[MONAD.address, WMONAD_TOKEN.address]}
              />
            ) : step === CreatePositionStep.SelectToken ? (
              <>
                <SelectToken
                  isNewPool={isNewPool}
                  token0={token0}
                  token1={token1}
                  setShowTokenSelector={setShowTokenSelector}
                />
                <ActionButton
                  disabled={!token0 || !token1}
                  isPending={isPending}
                  onClick={handleNextStep}
                  error={errorData}
                >
                  Continue
                </ActionButton>
              </>
            ) : (
              <>
                <SetPriceAndAmount
                  isNewPool={isNewPool}
                  token0={token0!}
                  token1={token1!}
                  setInitPrice={handleInitPriceChange}
                  setPriceRangeMin={setPriceRangeMin}
                  setPriceRangeMax={setPriceRangeMax}
                  setAmount0={handleAmount0Change}
                  setAmount1={handleAmount1Change}
                  priceRangeMin={priceRangeMin}
                  priceRangeMax={priceRangeMax}
                  amount0={amount0}
                  amount1={amount1}
                  onSetError={setErrorData}
                />
                <ActionButton
                  disabled={!amount0 || !amount1 || !initPriceRequired || errorData.showError}
                  isPending={isPending}
                  onClick={handleNewPosition}
                  error={errorData}
                >
                  Confirm
                </ActionButton>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </SideDrawerLayout>
    </>
  );
}
