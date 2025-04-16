'use client';

import { useNadFunMyTokens } from '@/lib/data/use-nadfun-my-tokens';

import { NadFunTokenList } from './nadfun-token-list';

export function NadFunMyTokens() {
  const { data: tokens, isLoading } = useNadFunMyTokens();

  return (
    <NadFunTokenList
      className="2xl:mt-4"
      tokens={tokens || undefined}
      isLoading={isLoading}
      title="My Tokens"
      emptyDesc="You don't have any tokens"
    />
  );
}
