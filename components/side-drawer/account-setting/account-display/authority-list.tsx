'use client';

import { useSelectedAccount } from '@/lib/data/use-account';

import { AuthorityCard } from './authority-card';

export function AuthorityList() {
  const { data: accountInfo } = useSelectedAccount();

  if (!accountInfo?.managers?.length) return null;

  return (
    <>
      {accountInfo.managers.map((manager) => (
        <AuthorityCard key={manager} manager={manager} />
      ))}
    </>
  );
}
