import { divide, multiply } from 'safebase';

import { useState } from 'react';
import { useAccount } from 'wagmi';

import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Button } from '@/components/ui/button';

import { IUniswapPosition } from '@/lib/data/use-uniswap-position';
import { useUniswapRemoveLiquidity } from '@/lib/data/use-uniswap-remove-liquidity';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { truncateNumber } from '@/lib/utils/number';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';

import { TokenPairAndStatus } from '../../uni-common/token-pair-and-status';
import { TwoTokenAmount } from '../../uni-common/two-token-amount';
import { usePositionDataFormat } from '../../uni-common/use-position-data-format';

export function UniswapRemoveLiquidity() {
  const { chainId: walletChainId } = useAccount();
  const { currentComponent } = useSideDrawerStore();
  const { mutate: removeLiquidity, isPending } = useUniswapRemoveLiquidity();
  const { handleBack } = useUrlPathDrawerChange(['/dex']);
  const { trackEvent } = useEnhancedAnalytics();

  const { uniswapPosition } =
    (currentComponent?.props as {
      uniswapPosition?: IUniswapPosition;
    }) || {};

  const { version, fee, token0, token1, token0Amount, token1Amount } = usePositionDataFormat(
    uniswapPosition!
  );

  const [percent, setPercent] = useState('');
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [liquidity, setLiquidity] = useState('');

  const handleConfirm = () => {
    const ok = ensureMonadNetworkSync({
      chainId: walletChainId,
    });
    if (!ok) return;

    if (!uniswapPosition) return;

    // Track remove liquidity attempt
    trackEvent('UNISWAP_LIQUIDITY_REMOVE', {
      event_category: 'protocol_interaction',
      event_label: 'uniswap_remove_liquidity_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'uniswap',
        action: 'remove_liquidity',
        token_pair: `${token0?.symbol}_${token1?.symbol}`,
        percent: percent,
        amount_0: amount0,
        amount_1: amount1,
        liquidity: liquidity,
        token_id: uniswapPosition.v3Position.tokenId,
      },
    });

    removeLiquidity(
      {
        token_id: uniswapPosition.v3Position.tokenId,
        liquidity: liquidity,
        token0_amount_min: amount0,
        token1_amount_min: amount1,
        token0_decimals: token0.decimals,
        token1_decimals: token1.decimals,
      },
      {
        onSuccess: () => {
          // Track successful remove liquidity
          trackEvent('UNISWAP_LIQUIDITY_REMOVE', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_remove_liquidity_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
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
            event_label: 'uniswap_remove_liquidity_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'remove_liquidity_failed',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
            },
          });
        },
      }
    );
  };

  // 百分比变化时自动计算 token0 和 token1 的移除数量
  function handlePercentChange(val: string) {
    if (val === '') {
      setPercent('');
      setAmount0('');
      setAmount1('');
      setLiquidity('');
      return;
    }

    if (Number(val) === 100) {
      setPercent(val);
      setAmount0(token0Amount);
      setAmount1(token1Amount);
      setLiquidity(uniswapPosition!.v3Position.liquidity);
      return;
    }

    if (Number(val) > 100 || Number(val) < 1 || val.length > 2 || val.includes('.')) return;

    setPercent(val);

    const liq = divide(multiply(uniswapPosition!.v3Position.liquidity, val), String(100));
    const liqNum = truncateNumber(liq, 0);
    setLiquidity(liqNum.toString());
    setAmount0(divide(multiply(token0Amount, String(Number(val) - 1)), String(100)));
    setAmount1(divide(multiply(token1Amount, String(Number(val) - 1)), String(100)));
  }

  if (!uniswapPosition) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Remove Liquidity" onClick={handleBack} />
      <SideDrawerLayout>
        <TokenPairAndStatus
          token0={token0}
          token1={token1}
          status={uniswapPosition.status}
          _version={version}
          _fee={fee}
          className="p-0"
        />

        <div className="bg-white rounded-2xl shadow-none px-6 py-5 flex flex-col gap-4 items-center mt-6">
          <span className="text-[#A5ADC6] text-base font-semibold mb-2">Withdrawal amount</span>
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
          token0Amount={amount0 || '0'}
          token1Amount={amount1 || '0'}
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
