import { AnimatePresence, motion } from 'framer-motion';
import { multiply } from 'safebase';

import { useEffect, useState } from 'react';

import { useTokenSelector } from '@/app/(protocols)/uniswap/common/use-token-selector';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { IToken } from '@/lib/data/tokens';
import { ErrorVO } from '@/lib/model/error-vo';

import TokenSelector from '../common/token-selector';
import { SelectTokenAndFeeTier } from './select-token-and-fee-tier';
import { SetPriceAndAmount } from './set-price-and-amount';
import { useNewPosition } from './use-new-position';

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

export enum CreatePositionStep {
  SelectTokenAndFeeTier = 1,
  SetPriceAndMount = 2,
}

export function UniswapCreatePosition() {
  const [isNewPool] = useState(true);

  const [token0, setToken0] = useState<IToken>();
  const [token1, setToken1] = useState<IToken>();
  const [feeTier, setFeeTier] = useState<string>('0.3');
  const [priceRangeMin, setPriceRangeMin] = useState<string>('');
  const [priceRangeMax, setPriceRangeMax] = useState<string>('');
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [initPrice, setInitPrice] = useState<string>('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const [step, setStep] = useState<CreatePositionStep>(CreatePositionStep.SelectTokenAndFeeTier);
  const { showTokenSelector, setShowTokenSelector, handleTokenSelect, handleBack } =
    useTokenSelector();

  const { mutate: createPosition, isPending } = useNewPosition(isNewPool);

  const initPriceRequired = !isNewPool || (isNewPool && initPrice);

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
      token_a_address: token0.address,
      token_b_address: token1.address,
      fee: multiply(feeTier, String(10_000)),
      price_current: '0',
      price_lower: multiply(priceRangeMin, String(10 ** (token0.decimals - token1.decimals))),
      price_upper: multiply(priceRangeMax, String(10 ** (token0.decimals - token1.decimals))),
      amount_a: amount0,
      amount_b: amount1,
      slippage: '10000000000000000', // 1%
      decimals_a: token0.decimals.toString(),
      decimals_b: token1.decimals.toString(),
    };

    const extraArgs = initPrice
      ? {
          price_current: multiply(initPrice, String(10 ** (token0.decimals - token1.decimals))),
        }
      : {};

    createPosition({
      ...args,
      ...extraArgs,
    });
  }

  function handleNextStep() {
    if (step === CreatePositionStep.SelectTokenAndFeeTier) {
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
                : step === CreatePositionStep.SelectTokenAndFeeTier
                  ? 'selectTokenAndFeeTier'
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
            ) : step === CreatePositionStep.SelectTokenAndFeeTier ? (
              <>
                <SelectTokenAndFeeTier
                  isNewPool={isNewPool}
                  token0={token0}
                  token1={token1}
                  setShowTokenSelector={setShowTokenSelector}
                  setFeeTier={setFeeTier}
                  feeTier={feeTier}
                />
                <ActionButton
                  disabled={!token0 || !token1 || !feeTier}
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
                  feeTier={feeTier}
                  setInitPrice={setInitPrice}
                  setPriceRangeMin={setPriceRangeMin}
                  setPriceRangeMax={setPriceRangeMax}
                  setAmount0={setAmount0}
                  setAmount1={setAmount1}
                  priceRangeMin={priceRangeMin}
                  priceRangeMax={priceRangeMax}
                  amount0={amount0}
                  amount1={amount1}
                />
                <ActionButton
                  disabled={!amount0 || !amount1 || !initPriceRequired}
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
