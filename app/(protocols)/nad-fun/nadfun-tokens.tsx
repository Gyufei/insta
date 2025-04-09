'use client';
import { useNadFunTokens } from '@/lib/data/use-nadfun-tokens';
import { NadFunTokenList } from './nadfun-token-list';

export function NadFunTokens() {
  const { data: tokens, isLoading } = useNadFunTokens();

  return <NadFunTokenList tokens={tokens || undefined} isLoading={isLoading} title="Recently Active Tokens" />;
}
