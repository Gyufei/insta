import { divide, multiply } from 'safebase';

import { useMemo, useState } from 'react';

import { TwoTokenAmount } from '@/app/(protocols)/uniswap/uni-common/two-token-amount';

import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Button } from '@/components/ui/button';

import { IAmbientPosition } from '@/lib/data/use-ambient-position';
import { useAmbientRemoveLiquidity } from '@/lib/data/use-ambient-remove-liquidity';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { TokenPairAndStatus } from '../am-common/token-pair-and-status';
import { useAmbientPositionFormat } from '../use-ambient-position-format';

export function AmbientRemoveLiquidity() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { mutate: removeLiquidity, isPending } = useAmbientRemoveLiquidity();

  const { ambientPosition } =
    (currentComponent?.props as {
      ambientPosition?: IAmbientPosition;
    }) || {};

  const { token0, token1, token0Amount, token1Amount } = useAmbientPositionFormat(ambientPosition!);

  const totalAskTick = ambientPosition?.askTick.toString();
  const totalBidTick = ambientPosition?.bidTick.toString();

  const [percent, setPercent] = useState('');

  const amount0 = useMemo(() => {
    if (percent === '') {
      return '0';
    }

    if (Number(percent) === 100) {
      return token0Amount;
    }

    if (Number(percent) > 100 || Number(percent) < 1 || percent.length > 2 || percent.includes('.'))
      return '0';

    const a0 = divide(
      multiply(String(token0Amount) || '0', String(percent)),
      String(100)
    ).toString();

    return a0;
  }, [percent, token0Amount]);

  const amount1 = useMemo(() => {
    if (percent === '') {
      return '0';
    }

    if (Number(percent) === 100) {
      return token1Amount;
    }

    if (Number(percent) > 100 || Number(percent) < 1 || percent.length > 2 || percent.includes('.'))
      return '0';

    const a1 = divide(
      multiply(String(token1Amount) || '0', String(percent)),
      String(100)
    ).toString();
    return a1;
  }, [percent, token1Amount]);

  const askTick = useMemo(() => {
    if (percent === '') {
      return '0';
    }

    if (Number(percent) === 100) {
      return totalAskTick;
    }

    const a0 = Math.round(
      divide(multiply(String(totalAskTick) || '0', String(percent)), String(100))
    ).toString();

    return a0;
  }, [percent, totalAskTick]);

  const bidTick = useMemo(() => {
    if (percent === '') {
      return '0';
    }

    if (Number(percent) === 100) {
      return totalBidTick;
    }

    const a1 = Math.round(
      divide(multiply(String(totalBidTick) || '0', String(percent)), String(100))
    ).toString();

    return a1;
  }, [percent, totalBidTick]);

  function handleBack() {
    setIsOpen(false);
  }

  const handleConfirm = () => {
    if (!ambientPosition) return;

    const liquidity = divide(
      multiply(String(ambientPosition.concLiq), String(percent)),
      String(100)
    ).toString();

    removeLiquidity({
      base_token: ambientPosition.base,
      quote_token: ambientPosition.quote,
      bid_tick: bidTick,
      ask_tick: askTick,
      liquidity,
    });
  };

  function handlePercentChange(val: string) {
    setPercent(val);
  }

  if (!ambientPosition) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Remove Liquidity" onClick={handleBack} />
      <SideDrawerLayout>
        <TokenPairAndStatus token0={token0} token1={token1} className="p-0" />

        <div className="bg-white rounded-2xl shadow-none px-6 py-5 flex flex-col gap-4 items-center mt-6">
          <span className="text-gray-500 text-base font-semibold mb-2">Withdrawal amount</span>
          <div className="relative flex items-center justify-center w-36">
            <NumberInput
              className="!text-2xl font-bold text-center w-full pr-8 bg-transparent outline-none transition border-none shadow-none focus-visible:ring-0"
              placeholder="0"
              value={percent}
              onChange={(v) => handlePercentChange(v)}
            />
            <span className="absolute right-2 text-2xl font-bold text-gray-400 pointer-events-none">
              %
            </span>
          </div>
          <div className="flex flex-row gap-3 justify-center w-full mt-2">
            {[25, 50, 75, 100].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                className={`px-1 py-1.5 rounded-xl border text-xs transition
                  ${percent === v.toString() ? 'bg-muted border-border text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handlePercentChange(v.toString())}
              >
                {v === 100 ? 'Max' : `${v}%`}
              </Button>
            ))}
          </div>
        </div>

        <TwoTokenAmount
          token0={token0}
          token1={token1}
          token0Amount={String(amount0) || '0'}
          token1Amount={String(amount1) || '0'}
        />

        <ActionButton
          disabled={!percent || parseFloat(percent) <= 0 || parseFloat(percent) > 100}
          isPending={isPending}
          onClick={handleConfirm}
          error={undefined}
        >
          Confirm
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}
