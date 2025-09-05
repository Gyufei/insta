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

export function formatNumberUnit(num: string | number) {
  return numbro(num).format({
    thousandSeparated: true,
    average: true,
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

export function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

  if (isNaN(num)) return '$0';

  return numbro(num).format({
    average: true,
    mantissa: 1,
  });
}

export function truncateNumber(result: string, precision: number): string {
  const arr = result.split('.');
  const integerPart = arr[0];
  let fractionalPart = arr[1];

  if (!fractionalPart) {
    return result;
  }

  // Check if there are additional digits
  if (fractionalPart.length <= precision) {
    fractionalPart = fractionalPart.padEnd(precision + 1, '0');
  }

  const fractionToRound = fractionalPart.slice(0, precision);

  // No rounding needed
  result = integerPart;
  if (fractionToRound) {
    result += '.' + fractionToRound;
  }

  // Remove unnecessary trailing zeros in the fractional part
  result = result.replace(/(\.\d*?[1-9])0+$/g, '$1');
  result = result.replace(/\.0+$/, '');
  result = result.replace(/\.$/, '');

  return result;
}

// 将科学记数法转化正常计数
export function toNonExponential(num: number | string) {
  if (typeof num === 'string') {
    if (Number.isNaN(Number.parseFloat(num))) return num;
    if (!num.includes('e')) return num;
    num = Number.parseFloat(num);
  }
  if (typeof num !== 'number') return num;
  if (!String(num).includes('e')) return String(num);

  const strParam = String(num);
  const index = Number(strParam.match(/\d+$/)?.[0]);
  const basis = strParam.match(/^[\d.]+/)?.[0]?.replace(/\./, '') || '';
  if (/e-/.test(strParam)) {
    return basis.padStart(index + basis.length, '0').replace(/^0/, '0.');
  } else {
    return basis.padEnd(index + 1, '0');
  }
}
