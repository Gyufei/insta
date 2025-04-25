'use client';

import { IToken } from '@/lib/data/tokens';
import { useNadFunMyTokens } from '@/lib/data/use-nadfun-my-tokens';

import { NadFunTokenList } from './nadfun-token-list';

export function NadFunMyTokens() {
  const { data: tokens, isLoading } = useNadFunMyTokens();

  const parseTokens = tokens?.map(
    (token) =>
      ({
        ...token,
        address: token.token_address,
        logo: token.logo_url,
        symbol: token.symbol,
        name: token.name,
        decimals: 18,
      }) as IToken & { balance: string }
  );

  return (
    <NadFunTokenList
      className="2xl:mt-4"
      tokens={parseTokens || undefined}
      isLoading={isLoading}
      title="My Tokens"
      emptyDesc="You don't have any tokens"
    />
  );
}
