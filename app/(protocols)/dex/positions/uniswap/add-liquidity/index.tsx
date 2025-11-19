import { divide, multiply } from 'safebase';

import { useState } from 'react';
import { useAppKitNetwork } from '@reown/appkit/react';

import { replaceNativeAddressUseBackend } from '@/config/network-config';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useUniswapAddLiquidity } from '@/lib/data/use-uniswap-add-liquidity';
import { useUniswapLiquidityRatio } from '@/lib/data/use-uniswap-liquidity-ratio';
import { IUniswapPosition } from '@/lib/data/use-uniswap-position';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { truncateNumber } from '@/lib/utils/number';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';

import { TokenPairAndStatus } from '../../uni-common/token-pair-and-status';
import { TwoTokenAmount } from '../../uni-common/two-token-amount';
import UniswapTokenInput from '../../uni-common/uniswap-token-input';
import { usePositionDataFormat } from '../../uni-common/use-position-data-format';
import { INFINITY_PRICE } from '../create-position/price-range-selector';

export function UniswapAddLiquidity() {
  const { chainId } = useAppKitNetwork();
  const { currentComponent } = useSideDrawerStore();
  const { mutate: addLiquidity, isPending } = useUniswapAddLiquidity();
  const { handleBack } = useUrlPathDrawerChange(['/dex']);
  const { trackEvent } = useEnhancedAnalytics();

  const { uniswapPosition } =
    (currentComponent?.props as {
      uniswapPosition?: IUniswapPosition;
    }) || {};

  const {
    version,
    fee,
    feeTier,
    token0,
    token1,
    token0Amount,
    token1Amount,
    price,
    minPrice,
    maxPrice,
  } = usePositionDataFormat(uniswapPosition!);

  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  const { data: liquidityRatio } = useUniswapLiquidityRatio({
    tokenA: replaceNativeAddressUseBackend(token0?.address || ''),
    tokenB: replaceNativeAddressUseBackend(token1?.address || ''),
    fee: Number(feeTier),
    price_current: String(price) || '0',
    price_lower: String(minPrice) || '0',
    price_upper: String(maxPrice) || INFINITY_PRICE,
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
    const ok = ensureMonadNetworkSync({
      chainId,
    });
    if (!ok) return;

    if (!uniswapPosition) return;

    // Track add liquidity attempt
    trackEvent('UNISWAP_LIQUIDITY_ADD', {
      event_category: 'protocol_interaction',
      event_label: 'uniswap_add_liquidity_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'uniswap',
        action: 'add_liquidity',
        token_pair: `${token0?.symbol}_${token1?.symbol}`,
        fee_tier: feeTier,
        amount_0: amount0,
        amount_1: amount1,
        token_id: uniswapPosition.v3Position.tokenId,
      },
    });

    addLiquidity(
      {
        token_id: uniswapPosition.v3Position.tokenId,
        token_0_amount: amount0,
        token_1_amount: amount1,
        slippage: '10000000000000000', // 1%
        token0_decimals: token0.decimals,
        token1_decimals: token1.decimals,
      },
      {
        onSuccess: () => {
          // Track successful add liquidity
          trackEvent('UNISWAP_LIQUIDITY_ADD', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_add_liquidity_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
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
            event_label: 'uniswap_add_liquidity_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'add_liquidity_failed',
              token_pair: `${token0?.symbol}_${token1?.symbol}`,
            },
          });
        },
      }
    );
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
          _version={version}
          _fee={fee}
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
