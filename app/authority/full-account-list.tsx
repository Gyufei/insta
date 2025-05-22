'use client';

import { useAccountList } from '@/app/authority/use-account-list';

import { AccountCard } from '@/components/side-drawer/account-setting/account-display/account-card';
import { TitleH2 } from '@/components/common/title-h2';
import { Button } from '@/components/ui/button';
import { WithLoading } from '@/components/common/with-loading';

export function FullAccountList() {
  const {
    allAccounts,
    currAccountInfo,
    handleToggleAccount,
    handleCreateAccount,
    isCreatePending,
  } = useAccountList();

  function handleCreateAccountClick() {
    if (isCreatePending) return;
    handleCreateAccount();
  }

  return (
    <>
      <div className="mt-4 flex w-full flex-shrink-0 items-center justify-between px-4 2xl:mt-0 2xl:px-12">
        <TitleH2>Accounts</TitleH2>
        <Button
          size="sm"
          disabled={isCreatePending}
          className="scale-xs flex w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-2 text-sm leading-none font-semibold whitespace-nowrap shadow-none duration-75 ease-out select-none focus:outline-none 2xl:w-36"
          style={{ minHeight: '24px' }}
          onClick={handleCreateAccountClick}
        >
          <WithLoading isLoading={isCreatePending}>Create new</WithLoading>
        </Button>
      </div>
      <div className="mt-16 grid w-full flex-shrink-0 grid-cols-4 gap-4 px-4 2xl:px-12">
        {allAccounts?.map((account) => (
          <AccountCard
            key={account.id}
            accountInfo={account}
            isCurrent={currAccountInfo?.sandbox_account === account.sandbox_account}
            onClick={() => handleToggleAccount(account.sandbox_account)}
          />
        ))}
      </div>
    </>
  );
}
