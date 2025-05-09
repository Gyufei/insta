import { AnimatePresence, motion } from 'framer-motion';
import { multiply } from 'safebase';

import { useEffect, useState } from 'react';

import TokenSelector from '@/app/(protocols)/uniswap/uni-common/token-selector';
import { useTokenSelector } from '@/app/(protocols)/uniswap/uni-common/use-token-selector';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { IToken } from '@/config/tokens';
import { useAmbientCreatePosition } from '@/lib/data/use-ambient-create-position';
import { ErrorVO } from '@/lib/model/error-vo';

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

  const { mutate: createPosition, isPending } = useAmbientCreatePosition();

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

    const args = {
      token_a: token0.address,
      token_b: token1.address,
      price_current: initPrice
        ? multiply(initPrice, String(10 ** (token0.decimals - token1.decimals)))
        : '0',
      price_lower: multiply(priceRangeMin, String(10 ** (token0.decimals - token1.decimals))),
      price_upper: multiply(priceRangeMax, String(10 ** (token0.decimals - token1.decimals))),
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
    if (Number(priceRangeMin) > Number(priceRangeMax)) {
      setErrorData({
        showError: true,
        errorMessage: 'Min price must be less than max price',
      });
      return;
    }

    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [priceRangeMin, priceRangeMax]);

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
              />
            ) : step === CreatePositionStep.SelectToken ? (
              <>
                <SelectToken
                  isNewPool={true}
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
                  isNewPool={true}
                  token0={token0!}
                  token1={token1!}
                  setInitPrice={setInitPrice}
                  setPriceRangeMin={setPriceRangeMin}
                  setPriceRangeMax={setPriceRangeMax}
                  setAmount0={setAmount0}
                  setAmount1={setAmount1}
                  priceRangeMin={priceRangeMin}
                  priceRangeMax={priceRangeMax}
                  amount0={amount0}
                  amount1={amount1}
                  onSetError={setErrorData}
                />
                <ActionButton
                  disabled={!amount0 || !amount1}
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
