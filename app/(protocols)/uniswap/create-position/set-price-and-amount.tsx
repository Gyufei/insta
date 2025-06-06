import { BadgeHelpTooltip } from '@/components/common/badge-help';

import { IToken } from '@/config/tokens';

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
        <InitPriceSetter token0={token0} token1={token1} onPriceChange={setInitPrice} />
      )}

      <PriceRangeSelector
        token0Symbol={token0?.symbol ?? ''}
        token1Symbol={token1?.symbol ?? ''}
        priceRangeMin={priceRangeMin}
        priceRangeMax={priceRangeMax}
        onMinPriceChange={setPriceRangeMin}
        onMaxPriceChange={setPriceRangeMax}
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
