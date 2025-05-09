import { ChevronDown } from 'lucide-react';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';

import { IToken } from '@/config/tokens';
import { cn } from '@/lib/utils';

interface TokenDisplayProps {
  token: IToken | undefined;
  onClick: () => void;
}

export const PairTokenDisplay = ({ token, onClick }: TokenDisplayProps) => {
  return (
    <div
      className={cn(
        'flex flex-1 rounded-sm p-2 text-primary gap-1 cursor-pointer items-center justify-between bg-gray-200',
        token ? 'bg-primary-foreground text-primary border border-border' : 'text-primary bg-gray-300 border-gray-500'
      )}
      onClick={onClick}
    >
      {token ? (
        <div className="flex items-center gap-2">
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
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm font-medium">Select token</div>
        </div>
      )}
      <ChevronDown className="h-4 w-4" />
    </div>
  );
};
