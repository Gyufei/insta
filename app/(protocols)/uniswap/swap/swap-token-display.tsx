import { ChevronDown } from 'lucide-react';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';

import { IToken } from '@/lib/data/tokens';

interface TokenDisplayProps {
  token: IToken | undefined;
  onClick: () => void;
}

export const SwapTokenDisplay = ({ token, onClick }: TokenDisplayProps) => {
  return (
    <div
      className="flex rounded-full border border-border p-1 text-primary gap-1 cursor-pointer items-center"
      onClick={onClick}
    >
      {token ? (
        <>
          <LogoWithPlaceholder
            src={token.logo}
            className="w-4 h-4"
            width={16}
            height={16}
            name={token.symbol}
          />
          <div className="flex flex-col">
            <div className="text-sm font-medium">{token.symbol}</div>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm font-medium">Select token</div>
        </div>
      )}
      <ChevronDown className="h-4 w-4" />
    </div>
  );
};
