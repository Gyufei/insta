import { divide, utils } from 'safebase';

import { useMemo } from 'react';

import { useAmbientCalcImpact } from '@/lib/data/use-ambient-calc-impact';
import { IAmbientPosition } from '@/lib/data/use-ambient-position';

import { useUniswapToken } from '../uniswap/use-uniswap-token';

const TICK_BASE = 1.0001;

function calculateTokenAmounts(
  lowerPrice: string,
  upperPrice: string,
  currentPrice: string,
  token0Decimals: number,
  token1Decimals: number,
  liq: string
) {
  // 输入验证
  if (
    Number(lowerPrice) >= Number(upperPrice) ||
    Number(lowerPrice) <= 0 ||
    Number(upperPrice) <= 0
  ) {
    return {
      amount0: 0,
      amount1: 0,
    };
  }

  if (Number(liq) <= 0) {
    return {
      amount0: 0,
      amount1: 0,
    };
  }

  console.log('lowerPrice', lowerPrice);
  console.log('upperPrice', upperPrice);
  console.log('currentPrice', currentPrice);
  console.log('token0Decimals', token0Decimals);
  console.log('token1Decimals', token1Decimals);
  console.log('liq', liq);

  // 将输入转换为数字（确保处理字符串输入）
  const P = Number(currentPrice);
  const Pa = Number(lowerPrice);
  const Pb = Number(upperPrice);
  const L = Number(liq);

  let amount0 = 0; // token0 数量
  let amount1 = 0; // token1 数量

  // 计算代币数量
  if (P <= Pa) {
    // 当前价格低于范围，仅持有 token1
    amount0 = 0;
    amount1 = L * (Math.sqrt(Pb) - Math.sqrt(Pa));
  } else if (P >= Pb) {
    // 当前价格高于范围，仅持有 token0
    amount0 = L * (1 / Math.sqrt(Pa) - 1 / Math.sqrt(Pb));
    amount1 = 0;
  } else {
    // 当前价格在范围内，同时持有 token0 和 token1
    amount0 = L * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pb));
    amount1 = L * (Math.sqrt(P) - Math.sqrt(Pa));
  }

  // 调整小数位
  amount0 = amount0 / Math.pow(10, token0Decimals);
  amount1 = amount1 / Math.pow(10, token1Decimals);

  // 返回结果，保留合理精度
  return {
    amount0: Number(amount0.toFixed(token0Decimals)),
    amount1: Number(amount1.toFixed(token1Decimals)),
  };
}

export function useAmbientPositionFormat(position: IAmbientPosition) {
  const { tokens } = useUniswapToken();

  const { data: impactPrice, isLoading: isLoadingImpactPrice } = useAmbientCalcImpact({
    base_token: position.base,
    quote_token: position.quote,
    pool_idx: position.poolIdx,
    sell_base: true,
    token_amount: 1000000,
    pool_tip: 0,
  });

  const { bidTick, askTick } = position || {};

  const token0 = tokens.find(
    (token) => token.address.toLowerCase() === position?.base?.toLowerCase()
  );
  const token1 = tokens.find(
    (token) => token.address.toLowerCase() === position?.quote?.toLowerCase()
  );

  const decimalsRate = useMemo(() => {
    if (!token0?.decimals || !token1?.decimals) return 0;
    return 10 ** Math.abs(token0?.decimals - token1?.decimals);
  }, [token0?.decimals, token1?.decimals]);

  const price = useMemo(() => {
    if (!impactPrice || isLoadingImpactPrice || !decimalsRate) return 0;
    const p = String(Math.abs(divide(impactPrice.quoteFlow, impactPrice.baseFlow)));
    const prc = Number(p) * Number(decimalsRate);
    return prc;
  }, [impactPrice, isLoadingImpactPrice, decimalsRate]);

  const minPrice = useMemo(() => {
    const tick0 = Math.pow(TICK_BASE, Number(askTick || 0));
    const prc = (1 / tick0) * decimalsRate;
    return utils.roundResult(String(prc), token1?.decimals);
  }, [askTick, decimalsRate, token1?.decimals]);

  const maxPrice = useMemo(() => {
    const tick1 = Math.pow(TICK_BASE, Number(bidTick || 0));
    const prc = (1 / tick1) * decimalsRate;
    return utils.roundResult(String(prc), token1?.decimals);
  }, [bidTick, decimalsRate, token1?.decimals]);

  const amountObj = useMemo(() => {
    if (!minPrice || !maxPrice || !price || !token0?.decimals || !token1?.decimals)
      return {
        amount0: 0,
        amount1: 0,
      };

    const obj = calculateTokenAmounts(
      minPrice,
      maxPrice,
      String(price),
      token0?.decimals || 18,
      token1?.decimals || 18,
      String(position.concLiq)
    );

    return obj;
  }, [minPrice, maxPrice, price, token0?.decimals, token1?.decimals, position.concLiq]);

  const totalLiquidityUsd = useMemo(() => {
    if (!token0?.decimals) return 0;
    return divide(String(position.concLiq), String(10 ** (token0?.decimals || 18)));
  }, [position.concLiq, token0?.decimals]);

  return {
    token0: token0!,
    token1: token1!,
    tokens,
    price,
    price_lower: minPrice,
    price_upper: maxPrice,
    token0Amount: amountObj.amount0,
    token1Amount: amountObj.amount1,
    totalLiquidityUsd,
  };
}
