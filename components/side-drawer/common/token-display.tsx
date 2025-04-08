import Image from 'next/image';
import { IToken } from '@/lib/data/tokens';
import { formatNumber } from '@/lib/utils/number';
import { WithLoading } from '@/components/with-loading';

interface TokenDisplayProps {
  token: IToken | undefined;
  balance: string;
  balanceLabel: string;
  isPending?: boolean;
}

export function TokenDisplay({ token, balance, balanceLabel, isPending }: TokenDisplayProps) {
  return (
    <div className="mt-6 flex flex-shrink-0 flex-wrap items-center justify-between">
      <div className="mr-3 flex flex-col items-start">
        <div className="text-grey-pure mb-1.5 flex text-sm leading-none">
          <div className="flex">{balanceLabel}</div>
        </div>
        <div className="h-6 text-xl leading-none font-medium">
          <WithLoading isLoading={!!isPending}>{formatNumber(balance)}</WithLoading>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
        <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
          <Image
            src={token?.iconUrl || ''}
            className="h-10 w-10 flex-grow object-contain"
            alt={token?.symbol || ''}
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
}
