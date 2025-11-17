import { divide, multiply } from 'safebase';



import { useMemo, useState } from 'react';



import { TwoTokenAmount } from '@/app/(protocols)/dex/positions/uni-common/two-token-amount';



import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Button } from '@/components/ui/button';



import { IAmbientPosition } from '@/lib/data/use-ambient-position';
import { useAmbientRemoveLiquidity } from '@/lib/data/use-ambient-remove-liquidity';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';



import { TokenPairAndStatus } from '../am-common/token-pair-and-status';
import { useAmbientPositionFormat } from '../use-ambient-position-format';





export function AmbientRemoveLiquidity() {
  const { currentComponent } = useSideDrawerStore();
  const { mutate: removeLiquidity, isPending } = useAmbientRemoveLiquidity();
  const { trackEvent } = useEnhancedAnalytics();

  const { ambientPosition } =
    (currentComponent?.props as {
      ambientPosition?: IAmbientPosition;
    }) || {};

  const { token0, token1, token0Amount, token1Amount } = useAmbientPositionFormat(ambientPosition!);

  const { handleBack } = useUrlPathDrawerChange(['/dex']);

  const [percent, setPercent] = useState('100');

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
      multiply(String(token0Amount) || '0', String(Number(percent) - 1)),
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
      multiply(String(token1Amount) || '0', String(Number(percent) - 1)),
      String(100)
    ).toString();
    return a1;
  }, [percent, token1Amount]);

  const handleConfirm = () => {
    if (!ambientPosition || !percent || parseFloat(percent) <= 0 || parseFloat(percent) > 100)
      return;

    // Track remove liquidity attempt
    trackEvent('UNISWAP_LIQUIDITY_REMOVE', {
      event_category: 'protocol_interaction',
      event_label: 'ambient_remove_liquidity_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'ambient',
        action: 'remove_liquidity',
        token_pair: `${token0?.symbol}_${token1?.symbol}`,
        percent: percent,
        amount_0: amount0,
        amount_1: amount1,
        liquidity: String(ambientPosition.concLiq),
      },
    });

    removeLiquidity(
      {
        base_token: ambientPosition.base,
        quote_token: ambientPosition.quote,
        bid_tick: ambientPosition.bidTick,
        ask_tick: ambientPosition.askTick,
        liquidity: String(ambientPosition.concLiq),
      },
      {
        onSuccess: () => {
          // Track successful remove liquidity
          trackEvent('UNISWAP_LIQUIDITY_REMOVE', {
            event_category: 'protocol_interaction',
            event_label: 'ambient_remove_liquidity_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'ambient',
              action: 'remove_liquidity_success',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
              percent: percent,
              amount_0: amount0,
              amount_1: amount1,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed remove liquidity
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'ambient_remove_liquidity_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'ambient',
              action: 'remove_liquidity_failed',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
            },
          });
        },
      }
    );
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
          <span className="text-[#A5ADC6] text-base font-semibold mb-2">Withdrawal amount</span>
          <div className="relative flex items-center justify-center w-36">
            <NumberInput
              className="hidden !text-2xl font-bold text-center w-full pr-8 bg-transparent outline-none transition border-none shadow-none focus-visible:ring-0"
              placeholder="0"
              value={percent}
              onChange={(v) => handlePercentChange(v)}
            />
            <span className="text-2xl font-bold text-primary pointer-events-none">100%</span>
            <span className="hidden absolute right-2 text-2xl font-bold text-gray-400 pointer-events-none">
              %
            </span>
          </div>
          <div className="hidden flex-row gap-3 justify-center w-full mt-2">
            {[25, 50, 75, 100].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                className={`px-1 py-1.5 rounded-xl border text-xs transition
                  ${percent === v.toString() ? 'bg-muted border-[#ebebeb] text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
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