import { divide, multiply, utils } from 'safebase';

import { useState } from 'react';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useUniswapAddLiquidity } from '@/lib/data/use-uniswap-add-liquidity';
import { useUniswapLiquidityRatio } from '@/lib/data/use-uniswap-liquidity-ratio';
import { IUniswapPosition } from '@/lib/data/use-uniswap-position';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { TokenPairAndStatus } from '../uni-common/token-pair-and-status';
import { TwoTokenAmount } from '../uni-common/two-token-amount';
import UniswapTokenInput from '../uni-common/uniswap-token-input';
import { usePositionDataFormat } from '../uni-common/use-position-data-format';

export function UniswapAddLiquidity() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { mutate: addLiquidity, isPending } = useUniswapAddLiquidity();

  const { uniswapPosition } =
    (currentComponent?.props as {
      uniswapPosition?: IUniswapPosition;
    }) || {};

  const { version, fee, token0, token1, token0Amount, token1Amount, price, minPrice, maxPrice } =
    usePositionDataFormat(uniswapPosition!);

  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  function handleBack() {
    setIsOpen(false);
  }

  const { data: liquidityRatio } = useUniswapLiquidityRatio({
    tokenA: token0?.address || '',
    tokenB: token1?.address || '',
    fee: 3000,
    price_current: price || 0,
    price_lower: Number(minPrice) || 0,
    price_upper: Number(maxPrice) || 0,
    decimals_a: token0?.decimals || 18,
    decimals_b: token1?.decimals || 18,
  });

  const handleAmount0Change = (value: string) => {
    setAmount0(value);
    if (liquidityRatio?.ratio && value) {
      const ratio = liquidityRatio.ratio;
      if (ratio) {
        const newAmount1 = utils.roundResult(multiply(value, ratio), token1?.decimals);
        setAmount1(newAmount1);
      }
    }
  };

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    if (liquidityRatio?.ratio && value) {
      const ratio = liquidityRatio.ratio;

      if (ratio) {
        const newAmount0 = utils.roundResult(divide(value, ratio), token0?.decimals);
        setAmount0(newAmount0);
      }
    }
  };

  const handleConfirm = () => {
    if (!uniswapPosition) return;

    addLiquidity({
      token_id: uniswapPosition.v3Position.tokenId,
      token_0_amount: amount0,
      token_1_amount: amount1,
      slippage: '10000000000000000', // 1%
      token0_decimals: token0.decimals,
      token1_decimals: token1.decimals,
    });
  };

  if (!uniswapPosition) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Add Liquidity" onClick={handleBack} />
      <SideDrawerLayout>
        <TokenPairAndStatus
          token0={token0}
          token1={token1}
          status={uniswapPosition.status}
          version={version}
          fee={fee}
          className="p-0"
        />

        <div className="flex flex-col gap-2 pointer-events-auto mt-4">
          <UniswapTokenInput
            token={token0}
            value={amount0}
            placeholder="0"
            onChange={handleAmount0Change}
            label={null}
            onSetError={setErrorData}
          />
          <UniswapTokenInput
            token={token1}
            value={amount1}
            placeholder="0"
            onChange={handleAmount1Change}
            label={null}
            onSetError={setErrorData}
          />
        </div>

        <TwoTokenAmount
          token0={token0}
          token1={token1}
          token0Amount={token0Amount}
          token1Amount={token1Amount}
        />

        <ActionButton
          disabled={!amount0 || !amount1}
          isPending={isPending}
          onClick={handleConfirm}
          error={errorData}
        >
          Confirm
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}
