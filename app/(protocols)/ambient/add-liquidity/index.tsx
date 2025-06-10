import { divide, multiply, utils } from 'safebase';

import { useState } from 'react';

import { TwoTokenAmount } from '@/app/(protocols)/uniswap/uni-common/two-token-amount';
import UniswapTokenInput from '@/app/(protocols)/uniswap/uni-common/uniswap-token-input';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useAmbientAddLiquidity } from '@/lib/data/use-ambient-add-liquidity';
import { useAmbientLiquidityRatio } from '@/lib/data/use-ambient-liquidity-ratio';
import { IAmbientPosition } from '@/lib/data/use-ambient-position';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { TokenPairAndStatus } from '../am-common/token-pair-and-status';
import { useAmbientPositionFormat } from '../use-ambient-position-format';

export function AmbientAddLiquidity() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { mutate: addLiquidity, isPending } = useAmbientAddLiquidity();

  const { ambientPosition } =
    (currentComponent?.props as {
      ambientPosition?: IAmbientPosition;
    }) || {};

  const { token0, token1, token0Amount, token1Amount, price_current, price_lower, price_upper } =
    useAmbientPositionFormat(ambientPosition!);

  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const { data: liquidityRatio } = useAmbientLiquidityRatio({
    tokenA: token0?.address || '',
    tokenB: token1?.address || '',
    fee: 3000,
    price_current: price_current || 0,
    price_lower: price_lower || 0,
    price_upper: price_upper || 0,
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

  function handleBack() {
    setIsOpen(false);
  }

  const handleConfirm = () => {
    if (!ambientPosition) return;

    addLiquidity({
      token_a: token0?.address,
      token_b: token1?.address,
      price_current: price_current,
      price_lower: price_lower,
      price_upper: price_upper,
      token_a_amount: amount0,
      token_a_decimals: token0?.decimals,
      token_b_decimals: token1?.decimals,
    });
  };

  if (!ambientPosition) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Add Liquidity" onClick={handleBack} />
      <SideDrawerLayout>
        <TokenPairAndStatus token0={token0} token1={token1} className="p-0" />

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
          token0Amount={token0Amount || '-'}
          token1Amount={token1Amount || '-'}
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
