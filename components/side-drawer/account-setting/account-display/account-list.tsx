'use client';
import { AccountCard } from './account-card';
import { WithLoading } from '@/components/with-loading';
import { useAccountList } from '@/app/authority/use-account-list';

export function AccountList() {
  const {
    allAccounts,
    currAccountInfo,
    isCreatePending: isPending,
    handleCreateAccount,
    handleToggleAccount: handleAccountClick,
  } = useAccountList();

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
        className="text-primary hover:border-blue hover:text-blue focus:border-blue focus:text-blue dark:text-primary-foreground dark:hover:text-blue flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-white text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      >
        <WithLoading isLoading={!!isPending}>+ New</WithLoading>
      </button>
    </div>
  );
}
