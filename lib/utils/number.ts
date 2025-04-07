import numbro from 'numbro';

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
