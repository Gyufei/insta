import { useState } from 'react';

import { TwoTokenAmount } from '@/app/(protocols)/uniswap/uni-common/two-token-amount';
import UniswapTokenInput from '@/app/(protocols)/uniswap/uni-common/uniswap-token-input';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useAmbientAddLiquidity } from '@/lib/data/use-ambient-add-liquidity';
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
            onChange={setAmount0}
            label={null}
            onSetError={setErrorData}
          />
          <UniswapTokenInput
            token={token1}
            value={amount1}
            placeholder="0"
            onChange={setAmount1}
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
