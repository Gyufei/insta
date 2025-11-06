import { divide, multiply } from 'safebase';

import { useState } from 'react';

import { TwoTokenAmount } from '@/app/(protocols)/uniswap/uni-common/two-token-amount';
import UniswapTokenInput from '@/app/(protocols)/uniswap/uni-common/uniswap-token-input';

import { replaceNativeAddressUseBackend } from '@/config/network-config';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useAmbientAddLiquidity } from '@/lib/data/use-ambient-add-liquidity';
import { useAmbientLiquidityRatio } from '@/lib/data/use-ambient-liquidity-ratio';
import { IAmbientPosition } from '@/lib/data/use-ambient-position';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { truncateNumber } from '@/lib/utils/number';

import { TokenPairAndStatus } from '../am-common/token-pair-and-status';
import { useAmbientPositionFormat } from '../use-ambient-position-format';

export function AmbientAddLiquidity() {
  const { currentComponent } = useSideDrawerStore();
  const { mutate: addLiquidity, isPending } = useAmbientAddLiquidity();
  const { handleBack } = useUrlPathDrawerChange(['/dex']);
  const { trackEvent } = useEnhancedAnalytics();

  const { ambientPosition } =
    (currentComponent?.props as {
      ambientPosition?: IAmbientPosition;
    }) || {};

  const { token0, token1, token0Amount, token1Amount, price, price_lower, price_upper } =
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
    price_current: String(price),
    price_lower: String(price_lower),
    price_upper: String(price_upper),
    decimals_a: token0?.decimals || 18,
    decimals_b: token1?.decimals || 18,
  });

  const handleAmount0Change = (value: string) => {
    setAmount0(value);
    if (liquidityRatio?.ratio && value) {
      const ratio = liquidityRatio.ratio;
      if (ratio) {
        const newAmount1 = truncateNumber(multiply(value, ratio), token1?.decimals || 18);
        setAmount1(newAmount1);
      }
    }
  };

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    if (liquidityRatio?.ratio && value) {
      const ratio = liquidityRatio.ratio;
      if (ratio) {
        const newAmount0 = truncateNumber(divide(value, ratio), token0?.decimals || 18);
        setAmount0(newAmount0);
      }
    }
  };

  const handleConfirm = () => {
    if (!ambientPosition) return;

    // Track add liquidity attempt
    trackEvent('UNISWAP_LIQUIDITY_ADD', {
      event_category: 'protocol_interaction',
      event_label: 'ambient_add_liquidity_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'ambient',
        action: 'add_liquidity',
        token_pair: `${token0?.symbol}_${token1?.symbol}`,
        amount_0: amount0,
        amount_1: amount1,
        price_current: price,
        price_lower: price_lower,
        price_upper: price_upper,
      },
    });

    addLiquidity(
      {
        token_a: replaceNativeAddressUseBackend(token0?.address),
        token_b: replaceNativeAddressUseBackend(token1?.address),
        price_current: price,
        price_lower: price_lower,
        price_upper: price_upper,
        token_a_amount: amount0,
        token_a_decimals: token0?.decimals,
        token_b_decimals: token1?.decimals,
      },
      {
        onSuccess: () => {
          // Track successful add liquidity
          trackEvent('UNISWAP_LIQUIDITY_ADD', {
            event_category: 'protocol_interaction',
            event_label: 'ambient_add_liquidity_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'ambient',
              action: 'add_liquidity_success',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
              amount_0: amount0,
              amount_1: amount1,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed add liquidity
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'ambient_add_liquidity_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'ambient',
              action: 'add_liquidity_failed',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
            },
          });
        },
      }
    );
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
          token0Amount={String(token0Amount) || '-'}
          token1Amount={String(token1Amount) || '-'}
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
