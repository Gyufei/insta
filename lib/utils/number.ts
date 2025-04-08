import { DefaultTokenDecimals } from '@/config/network-config';
import numbro from 'numbro';
import { formatUnits, parseUnits } from 'viem';
import { divide, multiply } from 'safebase';

export function formatNumber(num: string | number) {
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

export function formatBig(num: string | number, decimals = DefaultTokenDecimals) {
  try {
    const bigIntValue = BigInt(num);
    return formatUnits(bigIntValue, decimals);
  } catch (error) {
    return divide(num.toString(), Math.pow(10, decimals).toString());
  }
}

export function parseBig(num: string | number, decimals = DefaultTokenDecimals) {
  try {
    return parseUnits(num.toString(), decimals);
  } catch (error) {
    return multiply(num.toString(), Math.pow(10, decimals).toString());
  }
}
