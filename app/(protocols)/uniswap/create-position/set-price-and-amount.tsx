import { divide } from 'safebase';

import { useState } from 'react';

import { IToken } from '@/config/tokens';

import { BadgeHelpTooltip } from '@/components/common/badge-help';

import { truncateNumber } from '@/lib/utils/number';

import UniswapTokenInput from '../uni-common/uniswap-token-input';
import { VersionAndFeeDisplay } from '../uni-common/version-and-fee-display';
import { CreatePoolTip } from './create-pool-tip';
import InitPriceSetter from './init-price-setter';
import PriceRangeSelector from './price-range-selector';

export function SetPriceAndAmount({
  isNewPool,
  token0,
  token1,
  feeTier,
  setInitPrice,
  setPriceRangeMin,
  setPriceRangeMax,
  setAmount0,
  setAmount1,
  priceRangeMin,
  priceRangeMax,
  amount0,
  amount1,
}: {
  isNewPool: boolean;
  token0: IToken;
  token1: IToken;
  feeTier: string;
  setInitPrice: (price: string) => void;
  priceRangeMin: string;
  priceRangeMax: string;
  setPriceRangeMin: (min: string) => void;
  setPriceRangeMax: (max: string) => void;
  amount0: string;
  amount1: string;
  setAmount0: (amount: string) => void;
  setAmount1: (amount: string) => void;
}) {
  const version = 'V3';
  const fee = `${feeTier}%`;

  const [mainTokenIsToken0, setMainTokenIsToken0] = useState(true);
  const [rangeType, setRangeType] = useState<'FULL' | 'CUSTOM'>('CUSTOM');

  const [displayPriceRangeMin, setDisplayPriceRangeMin] = useState(priceRangeMin);
  const [displayPriceRangeMax, setDisplayPriceRangeMax] = useState(priceRangeMax);

  function handleMainTokenChange(isToken0: boolean) {
    setMainTokenIsToken0(isToken0);

    if (rangeType === 'FULL') {
      return;
    }

    if (!priceRangeMin && !priceRangeMax) {
      return;
    }

    if (isToken0) {
      if (priceRangeMax) {
        setDisplayPriceRangeMin(priceRangeMin);
      }
      if (priceRangeMin) {
        setDisplayPriceRangeMax(priceRangeMax);
      }
    } else {
      if (priceRangeMin) {
        setDisplayPriceRangeMin(truncateNumber(divide(String(1), priceRangeMax), 4));
      }
      if (priceRangeMax) {
        setDisplayPriceRangeMax(truncateNumber(divide(String(1), priceRangeMin), 4));
      }
    }
  }

  function handlePriceRangeMinChange(min: string) {
    setDisplayPriceRangeMin(min);
    if (mainTokenIsToken0) {
      setPriceRangeMin(min);
    } else {
      setPriceRangeMin(truncateNumber(divide(String(1), min), 4));
    }
  }

  function handlePriceRangeMaxChange(max: string) {
    setDisplayPriceRangeMax(max);
    if (mainTokenIsToken0) {
      setPriceRangeMax(max);
    } else {
      setPriceRangeMax(truncateNumber(divide(String(1), max), 4));
    }
  }

  return (
    <div className="flex flex-col gap-4 px-[1px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{token0.symbol}</span>
          <span className="text-2xl font-bold">/</span>
          <span className="text-2xl font-bold">{token1.symbol}</span>
          <VersionAndFeeDisplay version={version} fee={fee} />
        </div>
        {isNewPool && <CreatePoolTip />}
      </div>

      {isNewPool && (
        <>
          <InitPriceSetter
            token0={token0}
            token1={token1}
            onPriceChange={setInitPrice}
            onTokenMainIsToken0Change={handleMainTokenChange}
          />
        </>
      )}

      <PriceRangeSelector
        mainTokenIsToken0={mainTokenIsToken0}
        rangeType={rangeType}
        setRangeType={setRangeType}
        token0Symbol={token0?.symbol ?? ''}
        token1Symbol={token1?.symbol ?? ''}
        priceRangeMin={displayPriceRangeMin}
        priceRangeMax={displayPriceRangeMax}
        onMinPriceChange={handlePriceRangeMinChange}
        onMaxPriceChange={handlePriceRangeMaxChange}
      />
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="text-lg font-medium text-primary flex items-center gap-2">
          <span>Deposit tokens</span>
          <BadgeHelpTooltip content="Specify the token amounts for your liquidity contribution." />
        </div>

        <UniswapTokenInput
          token={token0}
          value={amount0}
          placeholder="0"
          onChange={setAmount0}
          label={null}
        />
        <UniswapTokenInput
          token={token1}
          value={amount1}
          placeholder="0"
          onChange={setAmount1}
          label={null}
        />
      </div>
    </div>
  );
}
