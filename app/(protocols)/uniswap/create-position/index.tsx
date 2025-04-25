import { AnimatePresence, motion } from 'framer-motion';
import { multiply } from 'safebase';

import { useEffect, useState } from 'react';

import {
  PairTokenSelected,
  useTokenSelector,
} from '@/app/(protocols)/uniswap/common/use-token-selector';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { IToken } from '@/lib/data/tokens';
import { useNewPosition } from './use-new-position';
import { ErrorVO } from '@/lib/model/error-vo';
import { cn } from '@/lib/utils';

import TokenSelector from '../common/token-selector';
import { CreatePoolTip } from './create-pool-tip';
import FeeTierSelector from './fee-tier-selector';
import InitPriceSetter from './init-price-setter';
import { PairTokenDisplay } from './pair-token-display';
import PositionDepositInput from './position-deposit-input';
import PriceRangeSelector from './price-range-selector';

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

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
            key={showTokenSelector ? 'tokenSelector' : 'swapForm'}
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
            ) : (
              <div className="flex flex-col gap-4 px-[1px]">
                <div className="flex flex-col px-[1px]">
                  <div className="text-lg font-medium text-primary">Select pair</div>
                  <div className="text-xs text-gray-400">
                    Choose the tokens you want to provide liquidity for.{' '}
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <PairTokenDisplay
                      token={token0}
                      onClick={() => setShowTokenSelector(PairTokenSelected.Token0)}
                    />
                    <PairTokenDisplay
                      token={token1}
                      onClick={() => setShowTokenSelector(PairTokenSelected.Token1)}
                    />
                  </div>
                </div>

                <FeeTierSelector selectedTier={feeTier} onChange={(tier) => setFeeTier(tier)} />

                {isNewPool && (
                  <InitPriceSetter
                    token0={token0}
                    token1={token1}
                    onPriceChange={setInitPrice}
                    onSelectToken={(v) => setShowTokenSelector(v)}
                  />
                )}

                <PriceRangeSelector
                  token0Symbol={token0?.symbol ?? ''}
                  token1Symbol={token1?.symbol ?? ''}
                  priceRangeMin={priceRangeMin}
                  priceRangeMax={priceRangeMax}
                  onMinPriceChange={setPriceRangeMin}
                  onMaxPriceChange={setPriceRangeMax}
                />

                <PositionDepositInput
                  token0={token0}
                  token1={token1}
                  amount0={amount0}
                  amount1={amount1}
                  onAmount0Change={setAmount0}
                  onAmount1Change={setAmount1}
                  onSelectToken={(v) => setShowTokenSelector(v)}
                />

                {isNewPool && <CreatePoolTip />}

                <ActionButton
                  className={cn(isNewPool && 'mt-0')}
                  disabled={!token0 || !token1 || !amount0 || !amount1 || !initPriceRequired}
                  isPending={isPending}
                  onClick={handleNewPosition}
                  error={errorData}
                >
                  Confirm
                </ActionButton>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SideDrawerLayout>
    </>
  );
}
