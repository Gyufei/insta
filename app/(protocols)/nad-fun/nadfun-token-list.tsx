'use client';

import { IToken } from '@/config/tokens';

import { EmptyState } from '@/components/common/empty-state';
import { TitleH2 } from '@/components/common/title-h2';
import { WithLoading } from '@/components/common/with-loading';

import { cn } from '@/lib/utils';

import { NadFunTokenCard } from './nadfun-token-card';

interface NadFunTokenListProps {
  tokens: Array<IToken & { balance?: string }> | undefined;
  isLoading: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  emptyDesc?: string;
}

export function NadFunTokenList({
  tokens,
  isLoading,
  title,
  className,
  children,
  emptyDesc,
}: NadFunTokenListProps) {
  return (
    <>
      <div
        className={cn(
          'flex w-full flex-shrink-0 items-center justify-between px-4 sm:justify-between 2xl:px-12',
          className
        )}
      >
        {title && <TitleH2>{title}</TitleH2>}
        {children}
      </div>
      <div className="mt-4 flex w-full flex-shrink-0 flex-col px-4 2xl:mt-6 2xl:px-12">
        <div className="flex w-full flex-grow flex-col">
          {isLoading && (
            <div className="flex h-[200px] w-full items-center justify-center">
              <WithLoading isLoading={isLoading} />
            </div>
          )}
          {!isLoading && (!tokens || tokens.length === 0) && (
            <EmptyState
              className="mt-5"
              message="No Token"
              description={emptyDesc || 'No tokens found'}
            />
          )}
          {tokens && tokens.length > 0 && (
            <div className="grid w-full min-w-min grid-cols-1 gap-4 sm:grid-cols-2 2xl:gap-6">
              {tokens.map((token) => (
                <NadFunTokenCard
                  key={token.address}
                  token={token as unknown as IToken}
                  balance={token.balance || ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
