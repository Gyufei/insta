import { useMemo } from 'react';

import { IAmbientPosition } from '@/lib/data/use-ambient-position';

import { useUniswapToken } from '../uniswap/use-uniswap-token';

const TICK_BASE = 1.0001;

export function useAmbientPositionFormat(position: IAmbientPosition) {
  const { tokens } = useUniswapToken();

  const { bidTick, askTick } = position || {};

  const token0 = tokens.find(
    (token) => token.address.toLowerCase() === position?.base?.toLowerCase()
  );
  const token1 = tokens.find(
    (token) => token.address.toLowerCase() === position?.quote?.toLowerCase()
  );

  const minPrice = useMemo(() => {
    return Math.pow(TICK_BASE, Number(bidTick || 0));
  }, [bidTick]);

  const maxPrice = useMemo(() => {
    return Math.pow(TICK_BASE, Number(askTick || 0));
  }, [askTick]);

  return {
    token0: token0!,
    token1: token1!,
    tokens,
    price_current: null,
    price_lower: minPrice,
    price_upper: maxPrice,
    token0Amount: null,
    token1Amount: null,
  };
}
