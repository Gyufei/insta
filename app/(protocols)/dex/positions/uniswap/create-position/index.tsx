import { AnimatePresence, motion } from 'framer-motion';
import { divide, multiply } from 'safebase';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';



import { useEffect, useMemo, useState } from 'react';

import { SlippageSettings } from '@/app/(protocols)/dex/positions/common/slippage-settings';
import { useTokenSelector } from '@/app/(protocols)/dex/positions/uni-common/use-token-selector';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  replaceNativeAddressUseBackend,
} from '@/config/network-config';
import { IToken, MONAD, MonUSD } from '@/config/tokens';
import { WMONAD_TOKEN } from '@/config/tokens';

import { ActionButton } from '@/components/new/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useUniswapLiquidityRatio } from '@/lib/data/use-uniswap-liquidity-ratio';
import { useUniswapPositionInfo } from '@/lib/data/use-uniswap-position-info';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { truncateNumber } from '@/lib/utils/number';

import TokenSelector from '../../uni-common/token-selector';
import { INFINITY_PRICE } from './price-range-selector';
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
  const { chainId: walletChainId } = useAccount();
  const [token0, setToken0] = useState<IToken>();
  const [token1, setToken1] = useState<IToken>();
  const [feeTier, setFeeTier] = useState<string>('0.3');
  const [priceRangeMin, setPriceRangeMin] = useState<string>('');
  const [priceRangeMax, setPriceRangeMax] = useState<string>('');
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [initPrice, setInitPrice] = useState<string>('');
  const [slippagePercent, setSlippagePercent] = useState<string>('2.5');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const [step, setStep] = useState<CreatePositionStep>(CreatePositionStep.SelectTokenAndFeeTier);
  const { showTokenSelector, setShowTokenSelector, handleTokenSelect } = useTokenSelector();
  const { trackEvent } = useEnhancedAnalytics();

  const { handleBack } = useUrlPathDrawerChange(['/dex']);

  const { data: positionInfo } = useUniswapPositionInfo({
    token_a_address: replaceNativeAddressUseBackend(token0?.address || ''),
    token_b_address: replaceNativeAddressUseBackend(token1?.address || ''),
    decimals_a: token0?.decimals.toString() || '',
    decimals_b: token1?.decimals.toString() || '',
    fee: multiply(feeTier, String(10_000)),
  });

  const { data: liquidityRatio } = useUniswapLiquidityRatio({
    tokenA: replaceNativeAddressUseBackend(token0?.address || ''),
    tokenB: replaceNativeAddressUseBackend(token1?.address || ''),
    fee: multiply(feeTier, String(10_000)),
    price_current: String(initPrice) || '0',
    price_lower: String(priceRangeMin) || '0',
    price_upper: String(priceRangeMax) || INFINITY_PRICE,
    decimals_a: token0?.decimals || 18,
    decimals_b: token1?.decimals || 18,
  });

  const ratio = liquidityRatio?.ratio
    ? ['Infinity', 'NaN', '∞'].includes(liquidityRatio?.ratio || '')
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

  useEffect(() => {
    if (positionInfo && positionInfo.price && positionInfo.price !== '0') {
      setInitPrice(positionInfo.price);
    }
  }, [positionInfo]);

  const { mutate: createPosition, isPending } = useNewPosition(isNewPool);

  const initPriceRequired = !isNewPool || (isNewPool && initPrice);

  function handleAmount0Change(value: string) {
    setAmount0(value);
    if (value && ratio) {
      const reciprocal = truncateNumber(multiply(String(value), ratio), token1?.decimals || 18);
      setAmount1(reciprocal);
    }
  }

  function handleAmount1Change(value: string) {
    setAmount1(value);
    if (value && initPrice && ratio) {
      const reciprocal = truncateNumber(divide(String(value), ratio), token0?.decimals || 18);
      setAmount0(reciprocal);
    }
  }

  function handleInitPriceChange(value: string) {
    setInitPrice(value);
  }

  function handleSlippageChange(value: string) {
    setSlippagePercent(value);
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
    const ok = ensureMonadNetworkSync({
      chainId: walletChainId,
    });
    if (!ok) return;

    if (!token0 || !token1) return;

    if (!priceRangeMin || !priceRangeMax) {
      toast.error('Please set price range');
      return;
    }

    const tokenA = replaceNativeAddressUseBackend(token0.address);
    const tokenB = replaceNativeAddressUseBackend(token1.address);

    const args = {
      token_a_address: tokenA,
      token_b_address: tokenB,
      fee: multiply(feeTier, String(10_000)),
      price_lower: priceRangeMin,
      price_upper: priceRangeMax,
      amount_a: amount0,
      amount_b: amount1,
      // 将百分比（如 "1" 表示 1%）转换为 1e18 基准（1% = 1e16）
      slippage: multiply(slippagePercent || '1', '10000000000000000'),
      decimals_a: token0.decimals.toString(),
      decimals_b: token1.decimals.toString(),
    };

    const extraArgs = initPrice
      ? {
          price_current: initPrice,
        }
      : {};

    // Track position creation attempt
    trackEvent('UNISWAP_POSITION_CREATE', {
      event_category: 'protocol_interaction',
      event_label: 'uniswap_create_position_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'uniswap',
        action: 'create_position',
        token_pair: `${token0?.symbol}_${token1?.symbol}`,
        fee_tier: feeTier,
        amount_0: amount0,
        amount_1: amount1,
        is_new_pool: isNewPool,
        price_range_min: priceRangeMin,
        price_range_max: priceRangeMax,
      },
    });

    createPosition(
      {
        ...args,
        ...extraArgs,
      },
      {
        onSuccess: () => {
          // Track successful position creation
          trackEvent('UNISWAP_POSITION_CREATE', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_create_position_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'create_position_success',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
              fee_tier: feeTier,
              amount_0: amount0,
              amount_1: amount1,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed position creation
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_create_position_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'create_position_failed',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
            },
          });
        },
      }
    );
  }

  function handleNextStep() {
    const isToken0MonUSD = token0?.address === MonUSD.address;
    const isToken1MonUSD = token1?.address === MonUSD.address;
    const isToken0Mon = [DEFAULT_NATIVE_ADDRESS, BACKEND_NATIVE_ADDRESS].includes(
      token0?.address || ''
    );
    const isToken1Mon = [DEFAULT_NATIVE_ADDRESS, BACKEND_NATIVE_ADDRESS].includes(
      token1?.address || ''
    );

    if ((isToken0MonUSD && isToken1Mon) || (isToken0Mon && isToken1MonUSD)) {
      toast.error("Can't create pool of monUSD/MON");
      return;
    }

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

    if (
      step === CreatePositionStep.SetPriceAndMount &&
      priceRangeMax !== INFINITY_PRICE &&
      liquidityRatio &&
      ['Infinity', 'NaN', '∞'].includes(liquidityRatio?.ratio)
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

  useEffect(() => {
    if (ratio && amount0) {
      const reciprocal = truncateNumber(multiply(String(amount0), ratio), token1?.decimals || 18);
      setAmount1(reciprocal);
    }
  }, [ratio, amount0, token1]);

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
                excludeTokens={[MONAD.address, WMONAD_TOKEN.address]}
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
                <SlippageSettings onSlippageChange={handleSlippageChange} />
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
                  setInitPrice={handleInitPriceChange}
                  setPriceRangeMin={setPriceRangeMin}
                  setPriceRangeMax={setPriceRangeMax}
                  setAmount0={handleAmount0Change}
                  setAmount1={handleAmount1Change}
                  priceRangeMin={priceRangeMin}
                  priceRangeMax={priceRangeMax}
                  amount0={amount0}
                  amount1={amount1}
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