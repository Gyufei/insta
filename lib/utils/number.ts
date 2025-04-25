import numbro from 'numbro';
import { divide, multiply } from 'safebase';
import { formatUnits, parseUnits } from 'viem';

import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

export function formatNumber(num: string | number) {
  if (isNaN(Number(num))) {
    return String(num);
  }

  return numbro(num).format({
    thousandSeparated: true,
    mantissa: 4,
    trimMantissa: true,
    roundingFunction: Math.floor,
  });
}

export function formatPercentage(num: string | number) {
  return numbro(num).format({
    trimMantissa: true,
    thousandSeparated: true,
    mantissa: 2,
    output: 'percent',
    roundingFunction: Math.floor,
  });
}

export function formatBig(num: string | number, decimals = DEFAULT_TOKEN_DECIMALS) {
  try {
    const bigIntValue = BigInt(num);
    return formatUnits(bigIntValue, decimals);
  } catch (error) {
    return divide(num.toString(), Math.pow(10, decimals).toString());
  }
}

export function parseBig(num: string | number, decimals = DEFAULT_TOKEN_DECIMALS) {
  try {
    return parseUnits(num.toString(), decimals);
  } catch (error) {
    return multiply(num.toString(), Math.pow(10, decimals).toString());
  }
}
