import { divide } from 'safebase';

import { useMemo } from 'react';

import { IToken } from '@/config/tokens';

import { IUniswapPosition, PositionStatus } from '@/lib/data/use-uniswap-position';
import { formatBig } from '@/lib/utils/number';

import { useUniswapToken } from '../use-uniswap-token';

const TICK_BASE = 1.0001;
const TICK_LOWER_MIN = -887272;
const TICK_UPPER_MAX = 887272;
const Q96 = BigInt('79228162514264337593543950336');

export function sqrtPriceX96ToPrice(sqrtPriceX96: string) {
  const sqrtPrice = Number((BigInt(sqrtPriceX96) * BigInt(1_000_000)) / Q96) / 1_000_000;
  return sqrtPrice ** 2;
}

function getToken(token: Omit<IToken, 'logo'>, tokens: IToken[]): IToken {
  const t = tokens.find((t) => t.address === token.address);
  if (!t) {
    return {
      ...token,
      logo: '',
    };
  }

  return t;
}

export function usePositionDataFormat(uniswapPosition: IUniswapPosition) {
  let pos = uniswapPosition;
  if (!pos) {
    pos = {
      protocolVersion: '',
      chainId: 0,
      status: PositionStatus.POSITION_STATUS_IN_RANGE,
      v3Position: {
        token0: {
          address: '',
          symbol: '',
          decimals: 0,
          name: '',
        },
        token1: {
          address: '',
          symbol: '',
          decimals: 0,
          name: '',
        },
        feeTier: '',
        amount0: '',
        currentLiquidity: '',
        liquidity: '',
        tokenId: '',
        tickLower: '',
        tickUpper: '',
        currentTick: '',
        currentPrice: '',
        tickSpacing: '',
        token0UncollectedFees: '',
        token1UncollectedFees: '',
        totalLiquidityUsd: '',
        amount1: '',
        poolId: '',
      },
    };
  }
  const { tokens } = useUniswapToken();
  const { protocolVersion, v3Position } = pos || {};
  const {
    token0,
    token1,
    feeTier,
    amount0,
    amount1,
    tickLower,
    tickUpper,
    currentPrice,
    currentLiquidity,
    liquidity,
    totalLiquidityUsd,
  } = v3Position;

  const version = useMemo(() => {
    if (!protocolVersion) {
      return '';
    }

    return protocolVersion.split('_').reverse()[0];
  }, [protocolVersion]);

  const fee = useMemo(() => {
    const feePercent = divide(feeTier, String(10000));
    return `${feePercent}%`;
  }, [feeTier]);

  const wrapToken0 = useMemo(() => getToken(token0, tokens), [tokens, token0]);
  const wrapToken1 = useMemo(() => getToken(token1, tokens), [tokens, token1]);

  const token0Amount = useMemo(() => {
    const amount = divide(amount0, String(10 ** wrapToken0.decimals));
    if (Number(amount) < 10e-5) {
      return '<0.00001';
    }

    return amount;
  }, [amount0, wrapToken0.decimals]);

  const token1Amount = useMemo(() => {
    const amount = divide(amount1, String(10 ** wrapToken1.decimals));
    if (Number(amount) < 10e-5) {
      return '<0.00001';
    }

    return amount;
  }, [amount1, wrapToken1.decimals]);

  const decimalsRate = useMemo(() => {
    return 10 ** (wrapToken0.decimals - wrapToken1.decimals);
  }, [wrapToken0.decimals, wrapToken1.decimals]);

  const price = useMemo(() => {
    return sqrtPriceX96ToPrice(currentPrice) * decimalsRate;
  }, [currentPrice, decimalsRate]);

  const isFullRange = useMemo(() => {
    if (tickLower === TICK_LOWER_MIN.toString() && tickUpper === TICK_UPPER_MAX.toString()) {
      return true;
    }

    return false;
  }, [tickLower, tickUpper]);

  const minPrice = useMemo(() => {
    if (isFullRange) {
      return '0';
    }

    return Math.pow(TICK_BASE, Number(tickLower)) * decimalsRate;
  }, [tickLower, isFullRange, decimalsRate]);

  const maxPrice = useMemo(() => {
    if (isFullRange) {
      return '∞';
    }

    return Math.pow(TICK_BASE, Number(tickUpper)) * decimalsRate;
  }, [tickUpper, isFullRange, decimalsRate]);

  const currentLiq = useMemo(() => {
    return formatBig(currentLiquidity);
  }, [currentLiquidity]);

  const totalLiq = useMemo(() => {
    return formatBig(liquidity);
  }, [liquidity]);

  return {
    version,
    fee,
    token0: wrapToken0,
    token1: wrapToken1,
    token0Amount,
    token1Amount,
    price,
    isFullRange,
    minPrice,
    maxPrice,
    currentLiq,
    totalLiq,
    totalLiquidityUsd,
  };
}
