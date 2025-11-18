import { IToken } from '@/config/tokens';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';

import { formatNumber } from '@/lib/utils/number';

function TokenAmount({ token, amount }: { token: IToken; amount: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm font-medium text-primary">{token.symbol} position</div>
      <div className="flex items-center gap-1">
        <LogoWithPlaceholder
          src={token.logo}
          name={token.symbol}
          width={16}
          height={16}
          className="w-4 h-4 rounded-full"
        />
        <div className="text-sm text-neutral2">
          {amount ? formatNumber(amount) : '-'} {token.symbol}
        </div>
      </div>
    </div>
  );
}

export function TwoTokenAmount({
  token0,
  token1,
  token0Amount,
  token1Amount,
}: {
  token0: IToken;
  token1: IToken;
  token0Amount: string;
  token1Amount: string;
}) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <TokenAmount token={token0} amount={token0Amount} />
      <TokenAmount token={token1} amount={token1Amount} />
    </div>
  );
}
