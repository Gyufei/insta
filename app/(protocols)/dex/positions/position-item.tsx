// Removed unused Card import

import { IUniswapPosition } from '@/lib/data/use-uniswap-position';
import { IAmbientPosition } from '@/lib/data/use-ambient-position';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
// Removed unused number utils import; formatting is handled in PositionItemBase
import { PositionItemBase } from './common/position-item-base';

import { TokenPairAndStatus as UniTokenPairAndStatus } from './uni-common/token-pair-and-status';
import { usePositionDataFormat } from './uni-common/use-position-data-format';
import { TokenPairAndStatus as AmbientTokenPairAndStatus } from './ambient/am-common/token-pair-and-status';
import { useAmbientPositionFormat } from './ambient/use-ambient-position-format';

type PositionItemProps =
  | { protocol: 'uniswap'; position: IUniswapPosition }
  | { protocol: 'ambient'; position: IAmbientPosition };

// Removed local formatPrice; centralized in PositionItemBase

export function PositionItem(props: PositionItemProps) {
  if (props.protocol === 'uniswap') {
    return <UniswapItem position={props.position as IUniswapPosition} />;
  }
  return <AmbientItem position={props.position as IAmbientPosition} />;
}

function UniswapItem({ position }: { position: IUniswapPosition }) {
  const { setCurrentComponent } = useSideDrawerStore();

  const {
    version,
    fee,
    token0: wrapToken0,
    token1: wrapToken1,
    price,
    isFullRange,
    minPrice,
    maxPrice,
    totalLiq,
    totalLiquidityUsd,
  } = usePositionDataFormat(position);

  const token0Symbol = wrapToken0.symbol;
  const token1Symbol = wrapToken1.symbol;

  const handleAddLiquidity = () => {
    setCurrentComponent({ name: 'UniswapAddLiquidity', props: { uniswapPosition: position } });
  };

  const handleRemoveLiquidity = () => {
    setCurrentComponent({ name: 'UniswapRemoveLiquidity', props: { uniswapPosition: position } });
  };

  return (
    <PositionItemBase
      header={
        <UniTokenPairAndStatus
          token0={wrapToken0}
          token1={wrapToken1}
          status={position.status}
          _version={version}
          _fee={fee}
        />
      }
      positionAmount={totalLiq}
      displayPrice={price}
      totalLiquidityUsd={totalLiquidityUsd}
      range={{
        isFullRange,
        minPrice,
        maxPrice,
        token0Symbol,
        token1Symbol,
      }}
      onAddLiquidity={handleAddLiquidity}
      onRemoveLiquidity={handleRemoveLiquidity}
    />
  );
}

function AmbientItem({ position }: { position: IAmbientPosition }) {
  const { setCurrentComponent } = useSideDrawerStore();

  const { token0, token1, price, price_lower, price_upper, totalLiquidityUsd } =
    useAmbientPositionFormat(position);

  const token0Symbol = token0?.symbol || '';
  const token1Symbol = token1?.symbol || '';
  const positionAmount = Number(position.ambientLiq || 0) + Number(position.concLiq || 0);

  const handleAddLiquidity = () => {
    setCurrentComponent({ name: 'AmbientAddLiquidity', props: { ambientPosition: position } });
  };

  const handleRemoveLiquidity = () => {
    setCurrentComponent({ name: 'AmbientRemoveLiquidity', props: { ambientPosition: position } });
  };

  return (
    <PositionItemBase
      header={<AmbientTokenPairAndStatus token0={token0!} token1={token1!} />}
      positionAmount={positionAmount}
      displayPrice={price || '-'}
      totalLiquidityUsd={totalLiquidityUsd}
      range={{
        isFullRange: false,
        minPrice: price_lower,
        maxPrice: price_upper,
        token0Symbol,
        token1Symbol,
      }}
      onAddLiquidity={handleAddLiquidity}
      onRemoveLiquidity={handleRemoveLiquidity}
    />
  );
}
