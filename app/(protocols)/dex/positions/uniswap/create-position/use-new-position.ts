import {
  UniswapMintPositionArgs,
  useUniswapMintPosition,
} from '@/lib/data/use-uniswap-mint-position';
import { useUniswapNewPoolMintPosition } from '@/lib/data/use-uniswap-new-pool-mint-position';

export function useNewPosition(isNewPool: boolean) {
  const mintPosition = useUniswapMintPosition();
  const newPoolMintPosition = useUniswapNewPoolMintPosition();

  return isNewPool ? newPoolMintPosition : mintPosition;
}

export type { UniswapMintPositionArgs };
