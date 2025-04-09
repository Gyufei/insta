'use client';
import { AccountCard } from './account-card';
import { WithLoading } from '@/components/with-loading';
import { useAccountList } from '@/app/authority/use-account-list';

export function AccountList() {
  const { allAccounts, currAccountInfo, isCreatePending: isPending, handleCreateAccount, handleToggleAccount: handleAccountClick } = useAccountList();

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {allAccounts?.map((account) => (
        <AccountCard
          key={account.id}
          accountInfo={account}
          isCurrent={currAccountInfo?.sandbox_account === account.sandbox_account}
          onClick={() => handleAccountClick(account.sandbox_account)}
        />
      ))}
      <button
        disabled={isPending}
        onClick={handleCreateAccount}
        className="dark:bg-dark-500 border-grey-light text-brand hover:border-ocean-blue-pure hover:text-ocean-blue-pure focus:border-ocean-blue-pure focus:text-ocean-blue-pure dark:text-light dark:hover:text-ocean-blue-pale flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-white text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      >
        <WithLoading isLoading={!!isPending}>+ New</WithLoading>
      </button>
    </div>
  );
}
